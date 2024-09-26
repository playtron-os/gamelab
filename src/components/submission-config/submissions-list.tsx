import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { Table } from "@playtron/styleguide";
import { columns } from "./submissions-table-config";
import { Submission, SubmissionItemType, SubmissionType } from "@/types";
import {
  setSelectedInputConfig,
  setSelectedLaunchConfig
} from "@/redux/modules";

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
  configFilter,
  selectedItemId,
  setSelectedItemId,
  onClose
}) => {
  const dispatch = useAppDispatch();

  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const onSelectedIdsChange = useCallback(
    (id: string) => {
      try {
        const subId = parseInt(id);
        const selectedSubmission = submissions[subId] as Submission;
        setSelectedItemId(selectedSubmission.item_id);
        if (submissionType === SubmissionType.LaunchConfig) {
          dispatch(
            setSelectedLaunchConfig({
              appId: selectedSubmission.app_id,
              launchConfigId: selectedSubmission.item_id
            })
          );
        } else if (submissionType === SubmissionType.InputConfig) {
          dispatch(
            setSelectedInputConfig({
              appId: selectedSubmission.app_id,
              inputConfigId: selectedSubmission.item_id
            })
          );
        }
        onClose();
      } catch (err) {
        console.error("Failed to select a submission", err);
      }
    },
    [submissions, setSelectedItemId, onClose]
  );

  useEffect(() => {
    for (let i = 0; i < submissions.length; i++) {
      if (submissions[i].item_id === selectedItemId) {
        setSelectedIndexes([i.toString()]);
        return;
      }
    }
    return setSelectedIndexes([]);
  }, [submissions, selectedItemId, setSelectedIndexes]);

  return (
    <div className="flex-grow px-8 overflow-scroll">
      <Table
        data={submissions}
        globalFilter={configFilter}
        columns={columns}
        selectedIds={selectedIndexes}
        onSelectedIdsChange={onSelectedIdsChange}
      />
    </div>
  );
};
