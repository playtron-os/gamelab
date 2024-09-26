export interface ProviderStatus {
  canDownload: boolean;
  canLaunch: boolean;
  isUpdating: boolean;
}

export interface AppProviderStatusGetResponse {
  dependenciesInstalled: boolean;
  epic: ProviderStatus;
  gog: ProviderStatus;
  steam: ProviderStatus;
}

export interface SteamStatus {
  user_id: string;
  username?: string;
  authorized: boolean;
  requires_2fa: boolean;
}

export interface EpicStatus {
  account: string;
  games_available: number;
  games_installed: number;
  egl_sync_enabled: boolean;
  config_directory: string;
}

export interface GogStatus {
  user_id: string;
  username?: string;
  authorized: boolean;
}
