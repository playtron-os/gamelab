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

function mergeResults(
  prev: AutotestGameResult[],
  incoming: AutotestGameResult[]
): AutotestGameResult[] {
  const deviceIds = new Set(incoming.map((r) => r.gameId));
  const kept = prev.filter((r) => !deviceIds.has(r.gameId));
  const next = [...kept, ...incoming];
  if (
    next.length === prev.length &&
    next.every(
      (r, i) =>
        r.gameId === prev[i].gameId &&
        r.status === prev[i].status &&
        r.message === prev[i].message
    )
  ) {
    return prev;
  }
  return next;
}

function stableManifest(
  prev: AutotestManifestEntry[],
  incoming: AutotestManifestEntry[]
): AutotestManifestEntry[] {
  if (
    incoming.length === prev.length &&
    incoming.every((m, i) => m.gameId === prev[i].gameId)
  ) {
    return prev;
  }
  return incoming;
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

  // Persist on terminal state changes immediately; debounce during active polling
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const isTerminal =
      state === "done" ||
      state === "aborted" ||
      state === "error" ||
      state === "idle";
    if (isTerminal) {
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = null;
      savePersisted({ state, results, manifest });
    } else {
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(() => {
        savePersisted({ state, results, manifest });
        persistTimer.current = null;
      }, 30000);
    }
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
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
      setResults((prev) => mergeResults(prev, result.results));
      setManifest((prev) => stableManifest(prev, result.manifest));

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
          .map((app) => {
            const gameId =
              app.installed_app?.owned_app.id ?? app.owned_apps[0]?.id;
            if (!gameId) return null;
            return { name: app.app.name, gameId };
          })
          .filter((g): g is { name: string; gameId: string } => g !== null);

        // Remove old results only for games being re-tested, keep the rest
        const retestIds = new Set(games.map((g) => g.gameId));
        setResults((prev) => prev.filter((r) => !retestIds.has(r.gameId)));
        setManifest([]);

        if (games.length === 0) {
          setState("error");
          setError("No games selected.");
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

      if (result.status === "running") {
        setResults((prev) => mergeResults(prev, result.results));
        setManifest((prev) => stableManifest(prev, result.manifest));
        setState("running");
        startPolling();
      } else if (result.status === "done") {
        setResults((prev) => mergeResults(prev, result.results));
        setManifest((prev) => stableManifest(prev, result.manifest));
        setState("done");
      } else if (result.status === "aborted") {
        setResults((prev) => mergeResults(prev, result.results));
        setManifest((prev) => stableManifest(prev, result.manifest));
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
      setResults((prev) => mergeResults(prev, result.results));
      setManifest((prev) => stableManifest(prev, result.manifest));
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
