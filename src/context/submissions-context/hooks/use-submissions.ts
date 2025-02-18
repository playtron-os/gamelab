import { usePlayserve } from "@/hooks";
import {
  SubmissionItemType,
  Submission,
  getMessage,
  MessageType
} from "@/types";

import { useEffect, useMemo, useState } from "react";

export const useSubmissions = (
  item_type: SubmissionItemType,
  app_id?: string
) => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { sendMessage } = usePlayserve();

  useEffect(() => {
    if (!app_id) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setSubmissions([]);

    const getAllSubmissionsMessage = getMessage(MessageType.SubmissionGetAll, {
      app_id,
      item_type
    });
    sendMessage(getAllSubmissionsMessage)().then((res) => {
      if (!cancelled) {
        if (res.status === 200) {
          const data = res.body as Submission[];
          setSubmissions(data);
        } else {
          console.error("Failed to get all submissions: ", res);
          setSubmissions([]);
        }
        setLoading(false);
      }
    });

    const getSelectedSubmissionMessage = getMessage(
      MessageType.SubmissionGetDefault,
      {
        app_id,
        item_type
      }
    );
    sendMessage(getSelectedSubmissionMessage)().then((res) => {
      if (res.status == 200) {
        const data = res.body as Submission;
        setSelectedItemId(data?.item_id);
      } else {
        console.error("Failed to get selected submission: ", res);
        setSelectedItemId(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [app_id, item_type, sendMessage]);

  // An alias resolving selectedItem based on its item_id
  const selectedItem: Submission | null = useMemo(() => {
    if (!selectedItemId) {
      return null;
    }
    return (
      submissions.find((value) => value.item_id === selectedItemId) ?? null
    );
  }, [submissions, selectedItemId]);

  return {
    submissions,
    setSubmissions,
    loading,
    selectedItem,
    selectedItemId,
    setSelectedItemId
  };
};
