import React from "react";
import { useAppStatus } from "@/hooks/app-library/use-app-status";
import { AppStatus, AppDownloadStage } from "@/types";
import { AppInformation } from "@/types/app-library";
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
    default:
      return t`Unknown`;
  }
};

export const StatusCell: React.FC<StatusCellContext> = (info) => {
  const appInformation = info.row.original;
  const status = useAppStatus(appInformation);
  const progress = Math.round(
    appInformation.installed_app?.download_status.progress || 0
  );
  const showProgress =
    appInformation.installed_app &&
    [
      AppDownloadStage.DOWNLOADING,
      AppDownloadStage.PRE_ALLOCATING,
      AppDownloadStage.VERIFYING
    ].includes(appInformation.installed_app.download_status.stage);

  let label: string;
  if (progress && showProgress) {
    label = `${getAppStatusLabel(status)} (${progress}%)`;
  } else {
    label = getAppStatusLabel(status);
  }
  return <span className="p-3 text-nowrap">{label}</span>;
};
