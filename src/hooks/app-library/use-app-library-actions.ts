import { usePlayserve } from "@/hooks";
import { setLoading } from "@/redux/modules/app-library";
import { useAppActions } from "@/redux/store";
import { MessageType, getMessage } from "@/types/playserve/message";
import { useCallback } from "react";

export interface UseAppLibraryReturn {
  fetchLibraryApps: (forceRefresh: boolean) => void;
  fetchQueue: () => void;
  fetchProviders: () => void;
}

export const useAppLibraryActions = (): UseAppLibraryReturn => {
  const { sendMessage } = usePlayserve();
  const { setLoading: setLoadingDispatch } = useAppActions({
    setLoading
  });

  const fetchLibraryApps = useCallback(
    (forceRefresh = false) => {
      if (!sendMessage) {
        return;
      }
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
    if (!sendMessage) {
      return;
    }
    sendMessage(getMessage(MessageType.QueueDownloadGet));
  }, [sendMessage]);

  const fetchProviders = useCallback(() => {
    if (!sendMessage) {
      return;
    }
    sendMessage(getMessage(MessageType.ProviderAuthOptionsGet));
  }, [sendMessage]);

  return {
    fetchLibraryApps,
    fetchQueue,
    fetchProviders
  };
};
