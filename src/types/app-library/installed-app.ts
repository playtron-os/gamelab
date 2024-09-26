import { OwnedApp } from "./owned-app";
import { InstallConfig } from "./install-config";
import { DownloadProgress } from "./download-progress";
import { WineStatus } from "./wine-status";
import { AppPostInstallStatus } from "./app-post-install-status";

export interface InstalledApp {
  user_id: string;
  owned_app: OwnedApp;
  download_status: DownloadProgress;
  install_config: InstallConfig;
  wine_status?: WineStatus;
  post_install: AppPostInstallStatus[];
  created_at: number;
  updated_at: number;
  launched_at?: number;
  interacted_at?: number;
}
