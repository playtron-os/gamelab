import {
  AppDownloadStage,
  AppInformation,
  AppStatus,
  AppProvider
} from "@/types";

import { PlaytronImage, InstalledApp } from "@/types/app-library";
import { t } from "@lingui/macro";
import { CloudFill, RunFill } from "@playtron/styleguide";

export function getProviderName(provider: string): string {
  return (
    {
      [AppProvider.Steam]: "Steam",
      [AppProvider.Gog]: "GOG",
      [AppProvider.EpicGames]: "Epic Games"
    }[provider] || provider[0].toUpperCase() + provider.substring(1)
  );
}

export function nearestPowerOfTwo(n: number) {
  const log = Math.round(Math.log(n) / Math.log(2));
  const a = Math.round(Math.pow(2, log));
  const b = Math.round(Math.pow(2, log + 1));

  return n - a < b - n ? a : b;
}

export function getDiskSize(size: number | undefined): string {
  if (!size) {
    return "";
  }
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  while (size > 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    ++unitIndex;
  }
  return `${Math.round(size * 10) / 10}${units[unitIndex]}`;
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
  const diskSize = Math.round(Math.round(size * 100) / 100);
  const nearestSize = nearestPowerOfTwo(diskSize);
  const sizeRatio = diskSize / nearestSize;
  if (sizeRatio >= 0.99 || sizeRatio <= 1.01) {
    return `${nearestSize}${units[unitIndex]}`;
  }
  return `${diskSize}${units[unitIndex]}`;
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
    case AppStatus.UPDATE_REQUIRED:
      return t`Update Required`;
    case AppStatus.PAUSED:
      return t`Paused`;
    case AppStatus.QUEUED:
      return t`Queued`;
    case AppStatus.NOT_DOWNLOADED:
      return t`Not Downloaded`;
    case AppStatus.RUNNING:
      return t`Running`;
    case AppStatus.LAUNCHING:
      return t`Launching`;
    default:
      return t`Unknown`;
  }
};

export const getProgress = (installedApp?: InstalledApp): number => {
  if (!installedApp) return 0;
  switch (installedApp.download_status.stage) {
    case AppDownloadStage.DOWNLOADING:
    case AppDownloadStage.PRE_ALLOCATING:
    case AppDownloadStage.VERIFYING:
      return installedApp.download_status.progress || 0;
    case AppDownloadStage.INSTALLING:
      return (
        (installedApp.post_install.reduce(
          (prev, val) => prev + (val.is_success ? 1 : 0),
          0
        ) /
          installedApp.post_install.length) *
        100
      );
    default:
      return 0;
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
  if (status === AppStatus.UPDATE_REQUIRED) {
    return CloudFill;
  }
};

/**
 * Return a user friendly label for a drive.
 * Uses the last part of the mount point or return "System Drive" for the root mount point.
 * @param drive
 * @returns string
 */
export const getDriveLabel = (drive: string | undefined): string => {
  if (!drive) {
    return "";
  }
  if (drive === "/") {
    return t`System Drive`;
  }

  const label = drive.split("/").pop() || drive;
  return label.replace(".ext4", "");
};
