import React, { useCallback, useMemo } from "react";
import { SubmissionCard } from "./submission-card";
import { Submission, SubmissionItemType } from "@/types";
import { useSubmissionsContext } from "@/context/submissions-context";

interface SubmissionsListProps {
  configFilter?: string;
  submissions: Submission[];
  submissionType: SubmissionItemType;
  selectedItemId: string | null;
  onClose: () => void;
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  submissionType,
  configFilter,
  selectedItemId,
  onClose
}) => {
  const { setDefaultSubmission } = useSubmissionsContext();

  const onItemClicked = useCallback(
    (submission: Submission) => {
      try {
        setDefaultSubmission(submission, submissionType);
        onClose();
      } catch (err) {
        console.error("Failed to select a submission", err);
      }
    },
    [submissions, onClose]
  );
  const filteredSubmissions = useMemo(() => {
    if (!configFilter) {
      return submissions;
    }
    return submissions.filter((submission) => {
      return submission.name
        .toLocaleLowerCase()
        .includes(configFilter.toLocaleLowerCase());
    });
  }, [submissions, configFilter]);

  return (
    <div className="flex-grow px-8 overflow-scroll">
      {filteredSubmissions.map((submission) => {
        return (
          <SubmissionCard
            key={submission.item_id}
            submission={submission}
            selectedItemId={selectedItemId}
            setSelectedItemId={() => onItemClicked(submission)}
          />
        );
      })}
    </div>
  );
};
