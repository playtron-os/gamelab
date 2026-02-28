import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AppInformation } from "@/types/app-library";
import { getFromLocalStorage, setInLocalStorage } from "@/utils/local-storage";

const STORAGE_KEY = "autotest_state";

type AutotestState =
  | "idle"
  | "starting"
  | "running"
  | "done"
  | "aborted"
  | "error";

export interface AutotestGameResult {
  gameName: string;
  gameId: string;
  status: string;
  message: string;
  elapsedMs: number;
}

export interface AutotestManifestEntry {
  gameName: string;
  gameId: string;
  suiteFilename: string;
}

interface AutotestPollResult {
  status: string;
  total: number;
  completed: number;
  results: AutotestGameResult[];
  manifest: AutotestManifestEntry[];
}

interface PersistedAutotest {
  state: AutotestState;
  results: AutotestGameResult[];
  manifest: AutotestManifestEntry[];
}

function loadPersisted(): PersistedAutotest | null {
  const saved = getFromLocalStorage(STORAGE_KEY);
  if (
    saved &&
    typeof saved === "object" &&
    Array.isArray(saved.results) &&
    Array.isArray(saved.manifest)
  ) {
    return saved as PersistedAutotest;
  }
  return null;
}

function savePersisted(data: PersistedAutotest) {
  setInLocalStorage(STORAGE_KEY, data);
}

export function useAutotest() {
  const persisted = useRef(loadPersisted());

  const [state, setState] = useState<AutotestState>(
    () => persisted.current?.state ?? "idle"
  );
  const [results, setResults] = useState<AutotestGameResult[]>(
    () => persisted.current?.results ?? []
  );
  const [manifest, setManifest] = useState<AutotestManifestEntry[]>(
    () => persisted.current?.manifest ?? []
  );
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist whenever state/results/manifest change
  useEffect(() => {
    savePersisted({ state, results, manifest });
  }, [state, results, manifest]);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current !== null) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const getAddress = useCallback(() => {
    const address = getFromLocalStorage("last_ip");
    if (!address) {
      throw new Error("No device IP found. Please connect to a device first.");
    }
    return address;
  }, []);

  const lastPollJson = useRef("");

  const doPoll = useCallback(async () => {
    try {
      const address = getAddress();
      const result = await invoke<AutotestPollResult>("autotest_poll", {
        address
      });

      // Skip state updates if nothing changed
      const json = JSON.stringify(result);
      if (json === lastPollJson.current) return;
      lastPollJson.current = json;

      // Merge device results with retained old results from previous runs
      setResults((prev) => {
        const deviceIds = new Set(result.results.map((r) => r.gameId));
        const kept = prev.filter((r) => !deviceIds.has(r.gameId));
        return [...kept, ...result.results];
      });
      setManifest(result.manifest);

      if (result.status === "done") {
        setState("done");
        stopPolling();
      } else if (result.status === "aborted") {
        setState("aborted");
        stopPolling();
      } else if (result.status === "running") {
        setState("running");
      } else if (result.status === "none") {
        // No run detected — if we were expecting one, it may have finished
        // between start and first poll. Keep current state.
      }
    } catch (err) {
      // SSH failures during poll are non-fatal — keep polling
      console.warn("Autotest poll failed:", err);
    }
  }, [getAddress, stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();
    doPoll();
    pollRef.current = setInterval(doPoll, 5000);
  }, [doPoll, stopPolling]);

  const startAutotest = useCallback(
    async (apps: AppInformation[]) => {
      stopPolling();
      setState("starting");
      setError(null);

      try {
        const address = getAddress();

        const games = apps
          .filter((app) => app.installed_app)
          .map((app) => ({
            name: app.app.name,
            gameId: app.installed_app!.owned_app.id
          }));

        // Remove old results only for games being re-tested, keep the rest
        const retestIds = new Set(games.map((g) => g.gameId));
        setResults((prev) => prev.filter((r) => !retestIds.has(r.gameId)));
        setManifest([]);

        if (games.length === 0) {
          setState("error");
          setError("No installed games selected.");
          return;
        }

        await invoke("autotest_start", { address, games });
        setState("running");
        startPolling();
      } catch (err) {
        setState("error");
        setError(typeof err === "string" ? err : String(err));
      }
    },
    [getAddress, startPolling, stopPolling]
  );

  const checkExistingRun = useCallback(async () => {
    try {
      const address = getAddress();
      const result = await invoke<AutotestPollResult>("autotest_poll", {
        address
      });

      const mergeResults = (prev: AutotestGameResult[]) => {
        const deviceIds = new Set(result.results.map((r) => r.gameId));
        const kept = prev.filter((r) => !deviceIds.has(r.gameId));
        return [...kept, ...result.results];
      };
      if (result.status === "running") {
        setResults(mergeResults);
        setManifest(result.manifest);
        setState("running");
        startPolling();
      } else if (result.status === "done") {
        setResults(mergeResults);
        setManifest(result.manifest);
        setState("done");
      } else if (result.status === "aborted") {
        setResults(mergeResults);
        setManifest(result.manifest);
        setState("aborted");
      } else {
        // Device has no run — keep whatever we loaded from localStorage
      }
    } catch {
      // Can't reach device — keep localStorage state
    }
  }, [getAddress, startPolling]);

  const stopAutotest = useCallback(async () => {
    stopPolling();
    try {
      const address = getAddress();
      await invoke("autotest_stop", { address });
      const result = await invoke<AutotestPollResult>("autotest_poll", {
        address
      });
      setResults((prev) => {
        const deviceIds = new Set(result.results.map((r) => r.gameId));
        const kept = prev.filter((r) => !deviceIds.has(r.gameId));
        return [...kept, ...result.results];
      });
      setManifest(result.manifest);
      setState("aborted");
    } catch (err) {
      setState("error");
      setError(typeof err === "string" ? err : String(err));
    }
  }, [getAddress, stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setState("idle");
    setResults([]);
    setManifest([]);
    setError(null);
  }, [stopPolling]);

  const total = manifest.length;
  const completed = useMemo(() => {
    if (manifest.length === 0) return 0;
    const manifestIds = new Set(manifest.map((m) => m.gameId));
    return results.filter((r) => manifestIds.has(r.gameId)).length;
  }, [results, manifest]);
  const currentGameName =
    state === "running" && completed < total
      ? (manifest[completed]?.gameName ?? null)
      : null;

  return {
    state,
    results,
    manifest,
    error,
    total,
    completed,
    currentGameName,
    startAutotest,
    checkExistingRun,
    stopAutotest,
    reset,
    stopPolling
  };
}
