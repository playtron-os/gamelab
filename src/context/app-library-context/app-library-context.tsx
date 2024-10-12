import {
  openMoveAppDialog as openMoveAppDialogAction,
  selectAppLibraryState
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
import { TableProps } from "@playtron/styleguide";
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
import { columnConfig } from "./table-config";
import { LaunchParams } from "@/types/launch";
import { AppEulaResponseBody } from "@/types/app";
import { EULA_NOT_ACCEPTED } from "@/constants";
export interface AppLibraryContextProps {
  columns: TableProps["columns"];
  selectedIds: string[];
  onSelectedIdsChange: (selectedId: string) => void;
  handlers: {
    downloadApp: (appData: AppInformation) => void;
    uninstallApp: (appData: AppInformation[]) => void;
    refetchAllApps: (forceRefresh: boolean) => void;
    pauseDownload: (appData: AppInformation) => void;
    cancelDownload: (appData: AppInformation) => void;
    handleAppDefaultAction: (
      appInfo: AppInformation,
      params?: LaunchParams
    ) => void;
    openMoveAppDialog: (appInfos: AppInformation[]) => void;
    openBulkActionsMenu: () => void;
  };
  selectedApps: Set<string>;
  setSelectedApps: React.Dispatch<React.SetStateAction<Set<string>>>;
  clickedApp?: AppInformation;
  bulkActionsMenuStateManager: ReturnType<typeof useBoolean>;
  eula: AppEulaResponseBody | null;
  isEulaOpen: boolean;
  setIsEulaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  acceptEula: (eula: AppEulaResponseBody, appInfo: AppInformation) => void;
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
  const { getAppEulas, acceptEula } = useAppEula();

  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [clickedApp, setClickedApp] = useState<AppInformation>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAppDefaultAction = useCallback(
    async (appInfo: AppInformation, params?: LaunchParams) => {
      let result: string | undefined = undefined;
      switch (getAppStatusWithQueue(appInfo, queuePositionMap)) {
        case AppStatus.RUNNING:
          terminateApp(appInfo);
          break;
        case AppStatus.VERIFIYING:
        case AppStatus.PRE_ALLOCATING:
        case AppStatus.DOWNLOADING:
          pauseDownload(appInfo);
          break;
        case AppStatus.PAUSED:
        case AppStatus.UPDATE_REQUIRED:
        case AppStatus.NOT_DOWNLOADED:
          result = await downloadApp(appInfo);
          break;
        case AppStatus.QUEUED:
          result = await downloadApp(appInfo, true);
          break;
        case AppStatus.READY:
          launchApp(appInfo, params);
          break;
        default:
          break;
      }

      if (result === EULA_NOT_ACCEPTED) {
        const response = await getAppEulas(appInfo);
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

  const onSelectedIdsChange = useCallback(
    (id: string) => {
      const isSelected = selectedIds.includes(id);

      try {
        const idToNum = parseInt(id, 10);
        setClickedApp(apps[idToNum]);
      } catch (error) {
        console.error("Error parsing row id: ", error);
      }

      if (!isSelected) {
        setSelectedIds([id]);
      }
    },
    [apps, selectedIds]
  );

  const openBulkActionsMenu = bulkActionsMenuStateManager[1].setTrue;

  const handlers = useMemo(
    () => ({
      downloadApp,
      uninstallApp,
      refetchAllApps: fetchLibraryApps,
      pauseDownload,
      cancelDownload,
      handleAppDefaultAction,
      openMoveAppDialog,
      openBulkActionsMenu
    }),
    [
      downloadApp,
      uninstallApp,
      fetchLibraryApps,
      pauseDownload,
      cancelDownload,
      handleAppDefaultAction,
      openMoveAppDialog,
      openBulkActionsMenu
    ]
  );

  const value = useMemo(
    () => ({
      columns: columnConfig,
      selectedIds,
      onSelectedIdsChange,
      handlers,
      selectedApps,
      setSelectedApps,
      clickedApp,
      bulkActionsMenuStateManager,
      eula,
      isEulaOpen,
      setIsEulaOpen,
      acceptEula
    }),
    [
      selectedIds,
      onSelectedIdsChange,
      handlers,
      selectedApps,
      setSelectedApps,
      clickedApp,
      bulkActionsMenuStateManager,
      eula,
      isEulaOpen,
      setIsEulaOpen,
      acceptEula
    ]
  );

  return (
    <AppLibraryContext.Provider value={value}>
      {children}
    </AppLibraryContext.Provider>
  );
};
