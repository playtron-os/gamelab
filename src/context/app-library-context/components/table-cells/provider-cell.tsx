import React from "react";
import { AppInformation } from "@/types/app-library";
import { CellContext } from "@tanstack/react-table";
import { AppProvider } from "@/types";
import { getProviderName } from "@/utils/app-info";

export const ProviderCell = (
  info: CellContext<AppInformation, AppProvider[]>
) => (
  <span className="px-3 my-3 text-nowrap text-sm overflow-ellipsis">
    {info
      .getValue()
      .map((p: AppProvider) => getProviderName(p))
      .join(", ")}
  </span>
);
