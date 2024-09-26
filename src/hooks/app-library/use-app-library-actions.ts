import { usePlayserve } from "@/hooks";
import { setLoading } from "@/redux/modules/app-library";
import { useAppActions } from "@/redux/store";
import { MessageType, getMessage } from "@/types/playserve/message";
import { useCallback } from "react";

export interface UseAppLibraryReturn {
  fetchLibraryApps: (forceRefresh: boolean) => void;
  fetchQueue: () => void;
}

export const useAppLibraryActions = (): UseAppLibraryReturn => {
  const { sendMessage } = usePlayserve();
  const { setLoading: setLoadingDispatch } = useAppActions({
    setLoading
  });

  const fetchLibraryApps = useCallback(
    (forceRefresh = false) => {
      setLoadingDispatch(true);
      sendMessage(
        getMessage(MessageType.AppLibraryGet, {
          force_refresh: forceRefresh
        })
      );
    },
    [sendMessage, setLoadingDispatch]
  );

  const fetchQueue = useCallback(() => {
    sendMessage(getMessage(MessageType.QueueDownloadGet));
  }, [sendMessage]);

  return {
    fetchLibraryApps,
    fetchQueue
  };
};
