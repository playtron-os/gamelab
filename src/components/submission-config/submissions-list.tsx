import React, { useCallback, useEffect, useState } from "react";
import { usePlayserve } from "@/hooks";

import { Table } from "@playtron/styleguide";
import { columns } from "./submissions-table-config";
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
  configFilter,
  selectedItemId,
  setSelectedItemId,
  onClose
}) => {
  const { sendMessage } = usePlayserve();
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const onSelectedIdsChange = useCallback(
    (id: string) => {
      try {
        const subId = parseInt(id);
        const selectedSubmission = submissions[subId] as Submission;
        setSelectedItemId(selectedSubmission.item_id);

        const setSelectedSubmissionMessage = getMessage(
          MessageType.SubmissionSetDefault,
          {
            app_id: selectedSubmission.app_id,
            item_type: submissionType,
            item_id: selectedSubmission.item_id
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
