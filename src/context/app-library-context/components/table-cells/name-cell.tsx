import React from "react";
import { AppInformation } from "@/types/app-library";
import { CellContext } from "@tanstack/react-table";

export const NameCell = (info: CellContext<AppInformation, string>) => (
  <div className="my-3 px-2 overflow-ellipsis text-nowrap font-bold">
    {info.getValue()}
  </div>
);
