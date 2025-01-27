import {
  openMoveAppDialog as openMoveAppDialogAction,
  selectAppLibraryState,
  setCurrentApp
} from "@/redux/modules";
import { AppStatus } from "@/types";
import { useBoolean } from "ahooks";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState
} from "react";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useAppTerminate as useAppTerminateActions } from "../../hooks/app-library/use-app-terminate-actions";
import { AppInformation } from "@/types/app-library";

import { useAppLibraryActions } from "../../hooks/app-library/use-app-library-actions";
import {
  useAppDownloadActions,
  useAppLaunch,
  useAppUninstallActions,
  useAppEula
} from "@/hooks/app-library";
import { getAppStatusWithQueue } from "@/utils/app-info";

import { LaunchParams } from "@/types/launch";
import { AppEulaResponseBody } from "@/types/app";
import { EULA_NOT_ACCEPTED } from "@/constants";
export interface AppLibraryContextProps {
  selectedIds: string[];
  onSelectedIdChange: (selectedId: string) => void;
  handlers: {
    downloadApp: (ownedAppId: string, force: boolean) => void;
    uninstallApp: (appData: AppInformation[]) => void;
    refetchAllApps: (forceRefresh: boolean) => void;
    pauseDownload: (ownedAppId: string) => void;
    cancelDownload: (ownedAppId: string, appName: string) => void;
    handleAppDefaultAction: (
      appInfo: AppInformation,
      ownedAppId: string | undefined,
      params?: LaunchParams
    ) => void;
    openMoveAppDialog: (appInfos: AppInformation[]) => void;
  };
  selectedApps: Set<string>;
  setSelectedApps: React.Dispatch<React.SetStateAction<Set<string>>>;
  bulkActionsMenuStateManager: ReturnType<typeof useBoolean>;
  eula: AppEulaResponseBody | null;
  isEulaOpen: boolean;
  setIsEulaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  acceptEula: (eula: AppEulaResponseBody) => void;
  rejectEula: (appInfo: AppInformation) => void;
}

export const AppLibraryContext = createContext<AppLibraryContextProps | null>(
  null
);

export type AppLibraryContextProviderProps = {
  children: ReactNode;
};

// TODO: Refactor this context into redux state to be more performant and efficient
export const AppLibraryContextProvider: React.FC<
  AppLibraryContextProviderProps
> = ({ children }) => {
  const bulkActionsMenuStateManager = useBoolean(false);
  const dispatch = useAppDispatch();
  const [eula, setEula] = useState<AppEulaResponseBody | null>(null);
  const [isEulaOpen, setIsEulaOpen] = useState(false);
  const { apps, queuePositionMap } = useAppSelector(selectAppLibraryState);

  const openMoveAppDialog = useCallback(
    (appInfoArray: AppInformation[]) =>
      dispatch(openMoveAppDialogAction({ appInfoArray })),
    [dispatch]
  );

  const { downloadApp, cancelDownload, pauseDownload } =
    useAppDownloadActions();
  const { launchApp } = useAppLaunch();
  const { uninstallApp } = useAppUninstallActions();
  const { terminateApp } = useAppTerminateActions();
  const { fetchLibraryApps } = useAppLibraryActions();
  const { getAppEulas, acceptEula, rejectEula } = useAppEula();

  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAppDefaultAction = useCallback(
    async (
      appInfo: AppInformation,
      ownedAppId: string | undefined,
      params?: LaunchParams
    ) => {
      let result: string | undefined = undefined;
      switch (getAppStatusWithQueue(appInfo, ownedAppId, queuePositionMap)) {
        case AppStatus.RUNNING:
          if (ownedAppId) terminateApp(ownedAppId);
          break;
        case AppStatus.VERIFIYING:
        case AppStatus.PRE_ALLOCATING:
        case AppStatus.DOWNLOADING:
          if (ownedAppId) pauseDownload(ownedAppId);
          break;
        case AppStatus.PAUSED:
        case AppStatus.UPDATE_REQUIRED:
        case AppStatus.NOT_DOWNLOADED:
          if (ownedAppId) result = await downloadApp(ownedAppId);
          break;
        case AppStatus.QUEUED:
          if (ownedAppId) result = await downloadApp(ownedAppId, true);
          break;
        case AppStatus.READY:
          if (ownedAppId) launchApp(ownedAppId, params);
          break;
        default:
          break;
      }

      if (result === EULA_NOT_ACCEPTED) {
        if (!ownedAppId) return;
        const response = await getAppEulas(ownedAppId);
        if (response && Array.isArray(response)) {
          setEula(response[0]);
          setIsEulaOpen(true);
        } else {
          console.error("Unexpected response format from getAppEula");
        }
      }
    },
    [terminateApp, pauseDownload, downloadApp, launchApp, queuePositionMap]
  );

  const onSelectedIdChange = useCallback(
    (id: string) => {
      const isSelected = selectedIds.includes(id);

      try {
        dispatch(setCurrentApp(apps.filter((app) => app.app.id == id)[0]));
      } catch (error) {
        console.error("Error parsing row id: ", error);
      }

      if (!isSelected) {
        setSelectedIds([id]);
      }
    },
    [apps, selectedIds]
  );

  const handlers = useMemo(
    () => ({
      downloadApp,
      uninstallApp,
      refetchAllApps: fetchLibraryApps,
      pauseDownload,
      cancelDownload,
      handleAppDefaultAction,
      openMoveAppDialog
    }),
    [
      downloadApp,
      uninstallApp,
      fetchLibraryApps,
      pauseDownload,
      cancelDownload,
      handleAppDefaultAction,
      openMoveAppDialog
    ]
  );

  const value = useMemo(
    () => ({
      selectedIds,
      onSelectedIdChange,
      handlers,
      selectedApps,
      setSelectedApps,
      bulkActionsMenuStateManager,
      eula,
      isEulaOpen,
      setIsEulaOpen,
      acceptEula,
      rejectEula
    }),
    [
      selectedIds,
      onSelectedIdChange,
      handlers,
      selectedApps,
      setSelectedApps,
      bulkActionsMenuStateManager,
      eula,
      isEulaOpen,
      setIsEulaOpen,
      acceptEula,
      rejectEula
    ]
  );

  return (
    <AppLibraryContext.Provider value={value}>
      {children}
    </AppLibraryContext.Provider>
  );
};
