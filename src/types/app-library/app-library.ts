import { AppInformation } from "./app_information";
import { OwnedApp } from "./owned-app";

export interface AppStatusUpdateResponse {
  owned_app: OwnedApp;
  is_launched: boolean;
  is_running: boolean;
  is_paused: boolean;
  is_downloading: boolean;
  is_installing: boolean;
  updated_at: number;
}

export type AppLibraryGetResponseBody = AppInformation[];
