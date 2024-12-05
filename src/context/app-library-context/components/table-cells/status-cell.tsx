import React from "react";
import { useAppStatus } from "@/hooks/app-library/use-app-status";
import { AppStatus } from "@/types";
import { AppInformation } from "@/types/app-library";
import { CellContext } from "@tanstack/react-table";
import { getAppStatusLabel, getProgress } from "@/utils/app-info";
export type StatusCellContext = CellContext<AppInformation, AppStatus[]>;

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
