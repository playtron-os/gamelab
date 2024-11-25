import { AppInformation, InstalledApp, OwnedApp } from "./app-library";
import { AppProvider } from "./platform-auth";
// TODO - cleanup this file, split it into multiple other type files
// If adding a new one consider if it makes sense to create a new one instead of adding it here
export enum AppDownloadStage {
  NONE = "none",
  ERROR = "error",
  PRE_ALLOCATING = "pre-allocating",
  DOWNLOADING = "downloading",
  VERIFYING = "verifying",
  INSTALLING = "installing",
  UPDATE_REQUIRED = "updatepending",
  DONE = "done"
}

export enum AppStatus {
  READY,
  PRE_ALLOCATING,
  VERIFIYING,
  DOWNLOADING,
  INSTALLING,
  NOT_DOWNLOADED,
  UPDATE_REQUIRED,
  QUEUED,
  PAUSED,
  RUNNING,
  LAUNCHING
}

export enum AutotestStatus {
  LOADING = "Loading",
  RUNNING = "Running",
  DONE = "Done",
  ERROR = "Error"
}

export enum AppType {
  APP = "App",
  TOOL = "Tool"
}

export interface Script {
  appId: string;
  scriptId: string;
  name: string;
  [key: string]: string | undefined;
}

interface AppDownloadStatus {
  error: string;
  error_code: number;
  progress: number;
  requires_2fa: boolean;
  requires_auth: boolean;
  stage: AppDownloadStage;
}

// Request and Response Structures
export interface AppGetOwnedResponseBody {
  owned_apps: OwnedApp[];
  user_id: string;
  message?: string;
}

export interface AppGetInstalledResponseBody {
  installed_apps: InstalledApp[];
  message?: string;
  user_id: string;
}

export interface AppGetRunningResponseBody {
  owned_apps: OwnedApp[];
  message?: string;
  user_id: string;
}

export interface AppDownloadRequestBody {
  owned_app_id: string;
  force_download?: boolean;
}

export interface AppDownloadProgressResponse extends AppDownloadStatus {
  owned_app: OwnedApp;
}

export interface AppDownloadResponseBody {
  user_id: string;
  success: boolean;
  requires_auth: boolean;
  requires_2fa?: boolean;
}

export interface AppUninstallResponseBody {
  owned_app_ids: string[];
  message?: string;
}

export interface AppTerminateResponseBody {
  user_id: string;
  app_id: string;
  message?: string;
}

export interface QueuedDownload {
  owned_app: OwnedApp;
  created_at: string;
  user_id: string;
}
export interface QueueDownloadGetResponseBody {
  downloads: QueuedDownload[];
  user_id: string;
}

export interface BulkActionsProps {
  selectedApps: Set<string>;
  data: AppInformation[];
  downloadApp: (app: AppInformation) => void;
  uninstallApp: (apps: AppInformation[]) => void;
}

export interface ProfileAuthInformation {
  email: string;
  familyName: string;
  givenName: string;
  userName: string;
}

type AvatarProviders = {
  [provider in AppProvider]?: { url: string };
};

export interface ProfileAvatarInformation extends AvatarProviders {
  selectedProvider: AppProvider;
}

export interface ProfileInformation {
  id: number;
  userId: string;
  avatar: ProfileAvatarInformation;
  acceptedEulaVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponseBody {
  auth: ProfileAuthInformation;
  profile: ProfileInformation;
}

export interface AppGetOwnedProgressResponseBody {
  provider: AppProvider;
  progress: number;
}

export interface AppEulaResponseBody {
  id: string;
  name: string;
  version: number;
  url: string;
  body: string | null;
  owned_app_id: string;
}
