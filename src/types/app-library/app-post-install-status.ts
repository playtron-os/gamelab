import { InstalledApp } from ".";

export interface AppPostInstallStatus {
  name: string;
  is_success: boolean;
}

export interface AppPostInstallStatusResponse {
  installed_app: InstalledApp;
  status: AppPostInstallStatus;
  is_done: boolean;
}
