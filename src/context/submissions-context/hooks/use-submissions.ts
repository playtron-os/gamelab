import { usePlayserve } from "@/hooks";
import {
  SubmissionItemType,
  Submission,
  getMessage,
  MessageType
} from "@/types";
import { selectConfigsState } from "@/redux/modules";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/store";

export const useSubmissions = (
  item_type: SubmissionItemType,
  app_id?: string
) => {
  const { selectedLaunchConfigs, selectedInputConfigs } =
    useAppSelector(selectConfigsState);
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
    if (item_type === "LaunchConfig") {
      setSelectedItemId(selectedLaunchConfigs[app_id]);
    } else if (item_type === "InputConfig") {
      setSelectedItemId(selectedInputConfigs[app_id]);
    }
    const message = getMessage(MessageType.SubmissionGetAll, {
      app_id,
      item_type
    });
    sendMessage(message)().then((res) => {
      if (!cancelled) {
        if (res.status === 200) {
          const data = res.body as Submission[];
          setSubmissions(data);
          console.log(data);
        } else {
          console.error(res);
          setSubmissions([]);
        }
        setLoading(false);
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
