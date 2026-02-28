import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  useAutotest,
  AutotestGameResult,
  AutotestManifestEntry
} from "@/hooks/use-autotest";
import { AppInformation } from "@/types/app-library";

export type AutotestGameStatus =
  | "testing"
  | "queued"
  | "pass"
  | "fail"
  | "error"
  | undefined;

interface AutotestContextValue {
  state: ReturnType<typeof useAutotest>["state"];
  results: AutotestGameResult[];
  manifest: AutotestManifestEntry[];
  total: number;
  completed: number;
  currentGameName: string | null;
  error: string | null;
  selectMode: boolean;
  enterSelectMode: () => void;
  exitSelectMode: () => void;
  getGameStatus: (app: AppInformation) => AutotestGameStatus;
  getGameResult: (app: AppInformation) => AutotestGameResult | undefined;
  isInManifest: (app: AppInformation) => boolean;
  startAutotest: (apps: AppInformation[]) => Promise<void>;
  checkExistingRun: () => Promise<void>;
  stopAutotest: () => Promise<void>;
  reset: () => void;
  stopPolling: () => void;
}

const AutotestContext = createContext<AutotestContextValue | null>(null);

export const AutotestProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const autotest = useAutotest();
  const [selectMode, setSelectMode] = useState(false);

  const enterSelectMode = useCallback(() => setSelectMode(true), []);
  const exitSelectMode = useCallback(() => setSelectMode(false), []);

  // On mount, check if there's already a run on the device
  useEffect(() => {
    autotest.checkExistingRun();
  }, []);

  // Activate select mode when a live run is detected on the device
  const prevStateRef = useRef(autotest.state);
  useEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = autotest.state;
    // Only activate if transitioning into running/starting from a non-active state
    if (
      (autotest.state === "running" || autotest.state === "starting") &&
      prev !== "running" &&
      prev !== "starting"
    ) {
      setSelectMode(true);
    }
  }, [autotest.state]);

  const resultsByGameId = useMemo(() => {
    const map = new Map<string, AutotestGameResult>();
    for (const r of autotest.results) {
      map.set(r.gameId, r);
    }
    return map;
  }, [autotest.results]);

  const manifestGameIds = useMemo(() => {
    return new Set(autotest.manifest.map((m) => m.gameId));
  }, [autotest.manifest]);

  const getGameStatus = useMemo(() => {
    return (app: AppInformation): AutotestGameStatus => {
      // Try all candidate IDs: app.id + all owned_apps[].id
      const ids = [app.app.id, ...app.owned_apps.map((o) => o.id)];

      // Check results first
      for (const id of ids) {
        const result = resultsByGameId.get(id);
        if (result) {
          if (result.status === "PASS") return "pass";
          if (result.status === "FAIL") return "fail";
          return "error";
        }
      }

      const matchedId = ids.find((id) => manifestGameIds.has(id));
      if (!matchedId) return undefined;

      // Game is in manifest but no result yet
      if (autotest.state !== "running" && autotest.state !== "starting") {
        return undefined;
      }

      // It's the currently-testing game if its index matches completed count
      const idx = autotest.manifest.findIndex((m) => m.gameId === matchedId);
      if (idx === autotest.completed) return "testing";
      if (idx > autotest.completed) return "queued";
      return undefined;
    };
  }, [
    resultsByGameId,
    manifestGameIds,
    autotest.state,
    autotest.manifest,
    autotest.completed
  ]);

  const getGameResult = useMemo(() => {
    return (app: AppInformation) => {
      const ids = [app.app.id, ...app.owned_apps.map((o) => o.id)];
      for (const id of ids) {
        const result = resultsByGameId.get(id);
        if (result) return result;
      }
      return undefined;
    };
  }, [resultsByGameId]);

  const isInManifest = useMemo(() => {
    return (app: AppInformation) => {
      const ids = [app.app.id, ...app.owned_apps.map((o) => o.id)];
      return ids.some((id) => manifestGameIds.has(id));
    };
  }, [manifestGameIds]);

  const value: AutotestContextValue = useMemo(
    () => ({
      state: autotest.state,
      results: autotest.results,
      manifest: autotest.manifest,
      total: autotest.total,
      completed: autotest.completed,
      currentGameName: autotest.currentGameName,
      error: autotest.error,
      selectMode,
      enterSelectMode,
      exitSelectMode,
      getGameStatus,
      getGameResult,
      isInManifest,
      startAutotest: autotest.startAutotest,
      checkExistingRun: autotest.checkExistingRun,
      stopAutotest: autotest.stopAutotest,
      reset: autotest.reset,
      stopPolling: autotest.stopPolling
    }),
    [
      autotest.state,
      autotest.results,
      autotest.manifest,
      autotest.total,
      autotest.completed,
      autotest.currentGameName,
      autotest.error,
      selectMode,
      enterSelectMode,
      exitSelectMode,
      getGameStatus,
      getGameResult,
      isInManifest,
      autotest.startAutotest,
      autotest.checkExistingRun,
      autotest.stopAutotest,
      autotest.reset,
      autotest.stopPolling
    ]
  );

  return (
    <AutotestContext.Provider value={value}>
      {children}
    </AutotestContext.Provider>
  );
};

export const useAutotestContext = (): AutotestContextValue => {
  const context = useContext(AutotestContext);
  if (!context) {
    throw new Error(
      "useAutotestContext must be used within an AutotestProvider"
    );
  }
  return context;
};
