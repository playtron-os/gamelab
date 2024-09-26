import React from "react";
import { AppInformation } from "@/types/app-library";
import { CellContext } from "@tanstack/react-table";
import { getDiskSize } from "@/utils/app-info";

export const SizeCell = (info: CellContext<AppInformation, number>) => (
  <div className="px-3 py-3 text-nowrap">{getDiskSize(info.getValue())}</div>
);
