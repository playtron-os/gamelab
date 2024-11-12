import React from "react";
import { AppInformation } from "@/types/app-library";
import { getDriveLabel } from "@/utils/app-info";
import { CellContext } from "@tanstack/react-table";

export const DriveCell = (info: CellContext<AppInformation, string>) => (
  <div className="p-3 text-nowrap text-sm">
    {getDriveLabel(info.getValue())}
  </div>
);
