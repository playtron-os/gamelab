import React from "react";
import { useAppStatus } from "@/hooks/app-library/use-app-status";
import { AppStatus, AppDownloadStage } from "@/types";
import { AppInformation, InstalledApp } from "@/types/app-library";
import { t } from "@lingui/macro";
import { CellContext } from "@tanstack/react-table";

export type StatusCellContext = CellContext<AppInformation, AppStatus[]>;

const getAppStatusLabel = (status: AppStatus) => {
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

const getProgress = (installedApp?: InstalledApp): number => {
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

export const StatusCell: React.FC<StatusCellContext> = (info) => {
  const appInformation = info.row.original;
  const status = useAppStatus(appInformation);
  const progress = Math.round(getProgress(appInformation.installed_app));

  let label: string;
  if (progress) {
    label = `${getAppStatusLabel(status)} (${progress}%)`;
  } else {
    label = getAppStatusLabel(status);
  }
  return <span className="p-3 text-nowrap text-sm">{label}</span>;
};
