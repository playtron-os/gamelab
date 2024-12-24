import React from "react";
import classNames from "classnames";
import { SubmissionCategory } from "@/constants";
import { Submission } from "@/types";
import { SubmissionActionMenu } from "./submission-action-menu";

export const SubmissionCard: React.FC<{
  submission: Submission;
  selectedItemId: string | null;
  setSelectedItemId: (itemId: string) => void;
}> = ({ submission, selectedItemId, setSelectedItemId }) => {
  return (
    <div
      key={submission.item_id}
      className={classNames(
        "flex flex-col w-full h-[60px] rounded-lg cursor-pointer my-2",
        selectedItemId === submission.item_id
          ? " outline-2 outline-double bg-[--fill-default]"
          : "bg-[--fill-subtle]"
      )}
      onClick={() => setSelectedItemId(submission.item_id)}
    >
      <div className="flex items-center">
        <div className="flex-grow my-2 px-2 overflow-ellipsis text-nowrap font-bold">
          <span>{submission.name}</span>
          <span
            className={classNames(
              "rounded-sm px-2 py-1 ms-2 text-xs",
              submission.submission_category === SubmissionCategory.Official
                ? "bg-[--feedback-success-primary]"
                : "bg-[--feedback-success-tertiary]"
            )}
          >
            {submission.submission_category}
          </span>
          <br />
          <span className="text-xs">{submission.description}</span>
        </div>

        <div className="flex-shrink">
          <span className="text-sm">{submission.author_name}</span> <br />
          <span className="text-xs">{submission.updated_date}</span>
        </div>
        <div className="flex-shrink-0">
          <span className="px-5 py-0">
            <SubmissionActionMenu submission={submission} />
          </span>
        </div>
      </div>
    </div>
  );
};
