import { InstalledApp } from "./installed-app";
import { OwnedApp } from "./owned-app";
import { PlaytronApp } from "./playtron-app/playtron-app";

export class AppInformation {
  app: PlaytronApp;
  owned_apps: OwnedApp[];
  installed_app?: InstalledApp;
  is_downloading: boolean;
  is_launched: boolean;
  is_owned: boolean;
  is_paused: boolean;
  is_running: boolean;
  is_installing: boolean;

  constructor(app: AppInformation) {
    this.app = app.app;
    this.owned_apps = app.owned_apps;
    this.installed_app = app.installed_app;
    this.is_downloading = app.is_downloading;
    this.is_launched = app.is_launched;
    this.is_owned = app.is_owned;
    this.is_paused = app.is_paused;
    this.is_running = app.is_running;
    this.is_installing = app.is_installing;
  }
}
