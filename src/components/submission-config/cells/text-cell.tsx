import React from "react";
import { CellContext } from "@tanstack/react-table";
import { Submission } from "@/types/submission";

export const TextCell = (info: CellContext<Submission, string>) => (
  <div className="my-3 px-2 overflow-ellipsis text-nowrap font-bold">
    {info.getValue()}
  </div>
);
