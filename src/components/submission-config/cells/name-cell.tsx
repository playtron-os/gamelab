import React from "react";
import { CellContext } from "@tanstack/react-table";
import { Submission } from "@/types/submission";
import classNames from "classnames";
import { SubmissionCategory } from "@/constants";
export const NameCell = (info: CellContext<Submission, string>) => {
  const row = info.row.original;
  return (
    <div className="my-3 px-2 overflow-ellipsis text-nowrap font-bold">
      <span>{info.getValue()}</span>
      <span
        className={classNames(
          "rounded-sm px-2 py-1 ms-2 text-xs",
          row.submission_category === SubmissionCategory.Official
            ? "bg-[--feedback-success-primary]"
            : "bg-[--feedback-success-tertiary]"
        )}
      >
        {row.submission_category}
      </span>
    </div>
  );
};
