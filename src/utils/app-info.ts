import {
  AppDownloadStage,
  AppInformation,
  AppStatus,
  AppProvider
} from "@/types";
import { PlaytronImage } from "@/types/app-library";
import { t } from "@lingui/macro";
import { RunFill } from "@playtron/styleguide";

export function getProviderName(provider: AppProvider): string {
  return {
    [AppProvider.Steam]: "Steam",
    [AppProvider.Gog]: "GOG",
    [AppProvider.EpicGames]: "Epic Games"
  }[provider];
}

export function getDiskSize(size: number): string {
  if (size === 0) {
    return "";
  }
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  while (size > 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    ++unitIndex;
  }
  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}

/**
 * Variant of getDiskSize to return size printed
 * on the disk's label such as 2TB or 256GB.
 */
export function getDiskSizeLabel(size: number): string {
  if (size === 0) {
    return "";
  }
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  while (size > 990 && unitIndex < units.length - 1) {
    size /= 1000;
    ++unitIndex;
  }
  return `${Math.round(Math.round(size * 100) / 100)}${units[unitIndex]}`;
}

export const getAppStatusLabel = (status: AppStatus) => {
  switch (status) {
    case AppStatus.READY:
      return t`Ready`;
    case AppStatus.PRE_ALLOCATING:
      return t`Pre-Allocating`;
    case AppStatus.VERIFIYING:
      return t`Verifying`;
    case AppStatus.DOWNLOADING:
      return t`Downloading`;
    case AppStatus.INSTALLING:
      return t`Installing`;
    case AppStatus.NOT_DOWNLOADED:
      return t`Not Downloaded`;
    case AppStatus.UPDATE_REQUIRED:
      return t`Update Required`;
    case AppStatus.PAUSED:
      return t`Paused`;
    case AppStatus.QUEUED:
      return t`Queued`;
    case AppStatus.RUNNING:
      return t`Running`;
    case AppStatus.LAUNCHING:
      return t`Launching`;
    default:
      return t`Unknown`;
  }
};

export function getImage(images: PlaytronImage[]): string {
  if (!images) {
    return "";
  }
  let gogCandidate = "";
  let steamCandidate = "";
  let epicGamesCandidate = "";
  for (const image of images) {
    if (image.source === "steam" && image.image_type === "header") {
      steamCandidate = image.url;
    }

    if (
      image.source === "gog" &&
      image.url != "https" &&
      image.image_type === "logo"
    ) {
      gogCandidate = image.url.replace("https//", "https://");
    }
    if (image.source === "epicgames" && image.image_type === "OfferImageWide") {
      epicGamesCandidate = image.url;
    }
  }
  if (gogCandidate) {
    return gogCandidate;
  }
  if (epicGamesCandidate) {
    return epicGamesCandidate;
  }
  if (steamCandidate) {
    return steamCandidate;
  }

  return images.length.toString();
}

export function getDate(date: Date | number): string {
  return new Date(date).toDateString();
}

export const getAppActionLabelByStatus = (status: AppStatus) => {
  switch (status) {
    case AppStatus.READY:
      return t`Launch`;
    case AppStatus.PRE_ALLOCATING:
    case AppStatus.VERIFIYING:
    case AppStatus.DOWNLOADING:
      return t`Pause`;
    case AppStatus.NOT_DOWNLOADED:
      return t`Download`;
    case AppStatus.UPDATE_REQUIRED:
      return t`Update`;
    case AppStatus.PAUSED:
      return t`Resume`;
    case AppStatus.QUEUED:
      return t`Prioritize`;
    case AppStatus.RUNNING:
      return t`Stop`;
    case AppStatus.LAUNCHING:
      return t`Launching...`;
    default:
      return "...";
  }
};

/**
 * Get the App status without the QUEUED status which is not accessible from the AppInformation object
 * To get the AppStatus including the QUEUED status use getAppStatusWithQueue.
 *
 * @param appInfo
 * @returns AppStatus
 */
export const getAppStatus = (appInfo: AppInformation): AppStatus => {
  if (appInfo.is_running) {
    return AppStatus.RUNNING;
  } else if (appInfo.is_launched) {
    return AppStatus.LAUNCHING;
  }

  if (appInfo.is_installing) {
    return AppStatus.INSTALLING;
  }

  if (appInfo.is_downloading) {
    switch (appInfo.installed_app?.download_status.stage) {
      case AppDownloadStage.PRE_ALLOCATING:
        return AppStatus.PRE_ALLOCATING;
      case AppDownloadStage.VERIFYING:
        return AppStatus.VERIFIYING;
      default:
        return AppStatus.DOWNLOADING;
    }
  }

  switch (appInfo.installed_app?.download_status.stage) {
    case AppDownloadStage.PRE_ALLOCATING:
    case AppDownloadStage.VERIFYING:
    case AppDownloadStage.DOWNLOADING:
      return AppStatus.PAUSED;
    case AppDownloadStage.UPDATE_REQUIRED:
      return AppStatus.UPDATE_REQUIRED;
    case AppDownloadStage.DONE:
      return AppStatus.READY;
    default:
      return AppStatus.NOT_DOWNLOADED;
  }
};

/**
 * Return AppStatus, including QUEUED. Make sure to provide the necessary React context.
 * @param appInfo
 * @param queuePositionMapState
 * @returns AppStatus
 */
export const getAppStatusWithQueue = (
  appInfo: AppInformation,
  queuePositionMapState: { [key: string]: number }
): AppStatus => {
  const status = getAppStatus(appInfo);
  if (
    [
      AppStatus.RUNNING,
      AppStatus.INSTALLING,
      AppStatus.DOWNLOADING,
      AppStatus.PRE_ALLOCATING,
      AppStatus.VERIFIYING
    ].includes(status)
  ) {
    return status;
  }
  if (
    appInfo.installed_app &&
    typeof queuePositionMapState[appInfo.installed_app.owned_app.id] ===
      "number"
  ) {
    return AppStatus.QUEUED;
  }
  return status;
};

export const getAppActionIconByStatus = (status: AppStatus) => {
  if (status === AppStatus.READY) {
    return RunFill;
  }
};

/**
 * Return a user friendly label for a drive.
 * Uses the last part of the mount point or return "System Drive" for the root mount point.
 * @param drive
 * @returns string
 */
export const getDriveLabel = (drive: string): string => {
  if (drive === "/") {
    return t`System Drive`;
  }

  return drive.split("/").pop() || drive;
};
