import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppProvider } from "@/types/platform-auth";
import { RootState } from "@/redux/store";
import {
  AppDownloadProgressResponse,
  AppInformation,
  AppPostInstallStatusResponse,
  AppStatusUpdateResponse,
  InstalledApp,
  QueuedDownload
} from "@/types";
import { DriveInfoResponseBody } from "@/types/drive";
import { invoke } from "@tauri-apps/api/core";

export interface AppLibraryState {
  apps: AppInformation[];
  currentApp?: AppInformation;
  drives: DriveInfoResponseBody;
  appFilters: {
    providers: { [key: string]: boolean };
    drives: Array<string>;
    status: "all" | "installed";
  };
  availableProviders: string[];
  queue: QueuedDownload[];
  queuePositionMap: { [key: string]: number };
  loading: boolean;
  loadingProgress: { [key: string]: number };
}

export const APP_LIBRARY_INITIAL_STATE: AppLibraryState = {
  apps: [],
  currentApp: undefined,
  queue: [],
  drives: [],
  appFilters: {
    providers: {
      [AppProvider.Steam]: true,
      [AppProvider.Gog]: true,
      [AppProvider.EpicGames]: true
    },
    drives: [],
    status: "installed"
  },
  availableProviders: [],
  queuePositionMap: {},
  loading: false,
  loadingProgress: {}
};

export const appLibrarySlice = createSlice({
  name: "appLibrary",
  initialState: APP_LIBRARY_INITIAL_STATE,
  reducers: {
    setApps: (state, action: PayloadAction<AppInformation[]>) => {
      state.loading = false;
      state.apps = action.payload;
      state.apps.sort((a, b) => a.app.name.localeCompare(b.app.name));
    },
    setDrives: (state, action) => {
      state.drives = action.payload;
    },
    setShowProvider: (
      state,
      action: PayloadAction<{ provider: string; show: boolean }>
    ) => {
      state.appFilters.providers[action.payload.provider] = action.payload.show;
    },
    setAvailableProviders: (state, action: PayloadAction<string[]>) => {
      state.availableProviders = action.payload;
    },
    setShowDrives: (
      state,
      action: PayloadAction<{ drive: string; enabled: boolean }>
    ) => {
      const drives = state.appFilters.drives;
      if (action.payload.enabled && !drives.includes(action.payload.drive)) {
        drives.push(action.payload.drive);
      }
      if (!action.payload.enabled && drives.includes(action.payload.drive)) {
        drives.splice(drives.indexOf(action.payload.drive), 1);
      }

      state.appFilters.drives = drives;
    },
    setStatusFilter: (state, action: PayloadAction<"all" | "installed">) => {
      state.appFilters.status = action.payload;
    },
    updateInstalledApps: (state, action: PayloadAction<InstalledApp[]>) => {
      if (!state.apps.length) {
        return;
      }

      const installedAppMap = action.payload.reduce(
        (acc, installedApp) => {
          acc[installedApp.owned_app.id] = installedApp;
          return acc;
        },
        {} as { [key: string]: InstalledApp }
      );

      state.apps = state.apps.map((appInfo) => {
        if (!appInfo.installed_app) {
          const ownedApp = appInfo.owned_apps.find(
            (ownedApp) => installedAppMap[ownedApp.id]
          );

          if (ownedApp) {
            appInfo.installed_app = installedAppMap[ownedApp.id];
          }

          return appInfo;
        }

        appInfo.installed_app =
          installedAppMap[appInfo.installed_app.owned_app.id];

        return appInfo;
      });
    },
    updateAppStatus: (
      state,
      action: PayloadAction<AppStatusUpdateResponse[]>
    ) => {
      const appStatusMap = action.payload.reduce(
        (acc, appStatus) => {
          acc[appStatus.owned_app.id] = appStatus;
          return acc;
        },
        {} as { [key: string]: AppStatusUpdateResponse }
      );

      for (let i = 0; i < state.apps.length; i++) {
        const appInfo = state.apps[i];

        if (appInfo.installed_app) {
          const appStatus = appStatusMap[appInfo.installed_app.owned_app.id];

          if (appStatus) {
            // Close game logger
            if (appInfo.is_launched && !appStatus.is_launched) {
              invoke("app_log_deinit", {
                appId: appInfo.installed_app.owned_app.id
              });
            }
            appInfo.is_downloading = appStatus.is_downloading;
            appInfo.is_installing = appStatus.is_installing;
            appInfo.is_launched = appStatus.is_launched;
            appInfo.is_paused = appStatus.is_paused;
            appInfo.is_running = appStatus.is_running;
            appInfo.installed_app.updated_at = appStatus.updated_at;
          }
        }
      }
    },
    updateInstallStatus: (
      state,
      action: PayloadAction<AppPostInstallStatusResponse>
    ) => {
      const payload = action.payload;
      for (let i = 0; i < state.apps.length; i++) {
        const appInfo = state.apps[i];
        if (
          appInfo.installed_app?.owned_app.id ===
          payload.installed_app.owned_app.id
        ) {
          const index = appInfo.installed_app.post_install.findIndex(
            (pre) => pre.name === payload.status.name
          );

          if (index === -1) {
            appInfo.installed_app.post_install.push(payload.status);
          } else {
            appInfo.installed_app.post_install[index] = payload.status;
          }
          break;
        }
      }
    },
    setAppDownloadProgress: (
      state,
      action: PayloadAction<AppDownloadProgressResponse>
    ) => {
      state.apps.find((app) => {
        if (app.installed_app?.owned_app.id === action.payload.owned_app.id) {
          app.installed_app.download_status.stage = action.payload.stage;
          app.installed_app.download_status.progress = action.payload.progress;
          app.installed_app.download_status.error = action.payload.error;
          app.installed_app.download_status.error_code =
            action.payload.error_code;
          app.installed_app.download_status.requires_auth =
            action.payload.requires_auth;
          app.installed_app.download_status.requires_2fa =
            action.payload.requires_2fa;
          return true;
        }
        return false;
      });
    },
    setQueue: (state, action: PayloadAction<QueuedDownload[]>) => {
      state.queue = action.payload;

      state.queuePositionMap = action.payload.reduce(
        (acc, curr, index) => {
          acc[curr.owned_app.id] = index;
          return acc;
        },
        {} as AppLibraryState["queuePositionMap"]
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.loadingProgress = {};
    },
    setLoadingProgress: (
      state,
      action: PayloadAction<AppLibraryState["loadingProgress"]>
    ) => {
      state.loadingProgress = { ...state.loadingProgress, ...action.payload };
    },
    setCurrentApp: (
      state,
      action: PayloadAction<AppInformation | undefined>
    ) => {
      state.currentApp = action.payload;
    },
    resetLibrary: () => APP_LIBRARY_INITIAL_STATE
  }
});

export const {
  setApps,
  setDrives,
  setShowProvider,
  setShowDrives,
  setStatusFilter,
  setAvailableProviders,
  updateInstalledApps,
  updateAppStatus,
  updateInstallStatus,
  setQueue,
  setLoading,
  setLoadingProgress,
  setAppDownloadProgress,
  setCurrentApp,
  resetLibrary
} = appLibrarySlice.actions;
export const selectAppLibraryState = (state: RootState) => state.appLibrary;
export const selectAppLibraryAppsState = (state: RootState) =>
  state.appLibrary.apps;
export const selectCurrentAppState = (state: RootState) =>
  state.appLibrary.currentApp;
export const selectAppLibraryQueueState = (state: RootState) =>
  state.appLibrary.queue;
export const selectAppLibraryQueuePositionMapState = (state: RootState) =>
  state.appLibrary.queuePositionMap;
export const selectAppLibraryLoadingProgressState = (state: RootState) =>
  state.appLibrary.loadingProgress;
export const selectDrives = (state: RootState) => state.appLibrary.drives;
export default appLibrarySlice.reducer;
