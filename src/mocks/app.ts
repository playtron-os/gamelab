import {
  AppDownloadStage,
  AppInformation,
  AppProvider,
  AppType,
  DownloadProgress,
  InstallConfig,
  InstalledApp,
  OwnedApp,
  PlaytronApp,
  PlaytronAppType,
  PlaytronProvider
} from "@/types";

const STEAM_OWNED_APP_MOCKS: OwnedApp[] = [
  {
    provider: AppProvider.Steam,
    name: "Apex Legends",
    id: "id1",
    provider_id: "Steam_93991",
    app_type: AppType.APP
  },
  {
    provider: AppProvider.Steam,
    name: "Counter-strike: Global Offensive",
    id: "id2",
    provider_id: "Steam_93992",
    app_type: AppType.APP
  }
];

const STEAM_DOWNLOAD_STATUS_DONE_MOCK: DownloadProgress = {
  stage: AppDownloadStage.DONE,
  progress: 100,
  error: "",
  error_code: 0,
  requires_auth: false,
  requires_2fa: false
};

const STEAM_INSTALL_CONFIG_MOCK: InstallConfig = {
  version: "1.0.0",
  install_folder: "Program Files",
  install_root: "/test/path1/root",
  install_disk: "/test/path1",
  disk_size: 100,
  download_size: 100,
  executable: "executable",
  symlink_path: "symlinkPath"
};

const STEAM_INSTALLED_APP_MOCK: InstalledApp = {
  user_id: "user_id",
  owned_app: STEAM_OWNED_APP_MOCKS[0],
  download_status: STEAM_DOWNLOAD_STATUS_DONE_MOCK,
  install_config: STEAM_INSTALL_CONFIG_MOCK,
  post_install: [],
  created_at: 0,
  updated_at: 0,
  launched_at: 0,
  interacted_at: 0
};

const STEAM_PLAYTRON_PROVIDER_MOCK: PlaytronProvider = {
  provider: AppProvider.Steam,
  providerAppId: "Steam_93991",
  lastImportedTimestamp: new Date(),
  relatedAppIds: ["id"]
};

const EPIC_PLAYTRON_PROVIDER_MOCK: PlaytronProvider = {
  provider: AppProvider.EpicGames,
  providerAppId: "EpicGames_93991",
  lastImportedTimestamp: new Date(),
  relatedAppIds: ["id"]
};

const PLAYTRON_APP_MOCKS: PlaytronApp[] = [
  {
    id: "id",
    name: "Apex Legends",
    providers: [STEAM_PLAYTRON_PROVIDER_MOCK, EPIC_PLAYTRON_PROVIDER_MOCK],
    slug: "slug",
    summary: "summary",
    description: "description",
    tags: [],
    images: [],
    publishers: [],
    developers: [],
    gameSeries: undefined,
    appType: PlaytronAppType.Game,
    releaseDate: undefined,
    comingSoon: false,
    ageRating: undefined,
    credits: undefined,
    onlyPlaytron: false,
    popularity: [],
    ratings: [],
    sales: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    cmsId: 0
  },
  {
    id: "test",
    name: "Counter-strike: Global Offensive",
    providers: [STEAM_PLAYTRON_PROVIDER_MOCK, EPIC_PLAYTRON_PROVIDER_MOCK],
    slug: "slug",
    summary: "summary",
    description: "description",
    tags: [],
    images: [],
    publishers: [],
    developers: [],
    gameSeries: undefined,
    appType: PlaytronAppType.Game,
    releaseDate: undefined,
    comingSoon: false,
    ageRating: undefined,
    credits: undefined,
    onlyPlaytron: false,
    popularity: [],
    ratings: [],
    sales: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    cmsId: 0
  }
];

const EPIC_OWNED_APP_MOCKS: OwnedApp[] = [
  {
    provider: AppProvider.EpicGames,
    name: "Fortnite",
    id: "xe23ft",
    provider_id: "EpicGames_Fortnite",
    app_type: AppType.APP
  }
];

export const STEAM_APP_INFORMATION_MOCKS: AppInformation[] = [
  {
    app: PLAYTRON_APP_MOCKS[0],
    installed_app: STEAM_INSTALLED_APP_MOCK,
    is_downloading: false,
    is_installing: false,
    is_launched: false,
    is_owned: true,
    is_paused: false,
    is_running: false,
    owned_apps: [STEAM_OWNED_APP_MOCKS[0], EPIC_OWNED_APP_MOCKS[0]]
  },
  {
    app: PLAYTRON_APP_MOCKS[1],
    installed_app: STEAM_INSTALLED_APP_MOCK,
    is_downloading: false,
    is_installing: false,
    is_launched: false,
    is_owned: true,
    is_paused: false,
    is_running: false,
    owned_apps: [STEAM_OWNED_APP_MOCKS[0], EPIC_OWNED_APP_MOCKS[0]]
  }
];
