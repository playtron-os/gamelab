import React, { useCallback } from "react";
import { usePlayserve } from "@/hooks";
import { SubmissionCard } from "./submission-card";
import {
  Submission,
  SubmissionItemType,
  getMessage,
  MessageType
} from "@/types";

interface SubmissionsListProps {
  configFilter?: string;
  submissions: Submission[];
  submissionType: SubmissionItemType;
  selectedItemId: string | null;
  setSelectedItemId: (itemId: string) => void;
  onClose: () => void;
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  submissionType,
  // configFilter,
  selectedItemId,
  setSelectedItemId,
  onClose
}) => {
  const { sendMessage } = usePlayserve();

  const setDefaultSubmission = useCallback(
    (submission: Submission) => {
      try {
        setSelectedItemId(submission.item_id);
        const setSelectedSubmissionMessage = getMessage(
          MessageType.SubmissionSetDefault,
          {
            app_id: submission.app_id,
            item_type: submissionType,
            item_id: submission.item_id
          }
        );
        sendMessage(setSelectedSubmissionMessage)().then((res) => {
          if (res.status != 200) {
            console.log("Error setting default submission: ", res);
          }
        });
        onClose();
      } catch (err) {
        console.error("Failed to select a submission", err);
      }
    },
    [submissions, setSelectedItemId, onClose]
  );

  return (
    <div className="flex-grow px-8 overflow-scroll">
      {submissions.map((submission) => {
        return (
          <SubmissionCard
            key={submission.item_id}
            submission={submission}
            selectedItemId={selectedItemId}
            setSelectedItemId={() => setDefaultSubmission(submission)}
          />
        );
      })}
    </div>
  );

  // globalFilter={configFilter}
  // selectedIds={selectedIndexes}
  // onSelectedIdsChange={onSelectedIdsChange}
};
