import React from "react";
import { AppInformation } from "@/types/app-library";
import { CellContext } from "@tanstack/react-table";

export const DriveCell = (info: CellContext<AppInformation, string>) => (
  <div className="p-3 text-nowrap">{info.getValue()}</div>
);
