import { usePlayserve } from "@/hooks";
import { MessageType } from "@/types/playserve/message";
import { useEffect } from "react";
import { useAppLibraryActions } from "./use-app-library-actions";
import { useAppActions } from "@/redux/store";
import {
  setApps,
  updateInstalledApps,
  updateAppStatus,
  setQueue,
  setError,
  setLoadingProgress,
  setAppDownloadProgress
} from "@/redux/modules";

export const useAppLibraryManager = () => {
  const { fetchLibraryApps, fetchQueue } = useAppLibraryActions();
  const {
    setApps: setAppsDispatch,
    updateInstalledApps: updateInstalledAppsDispatch,
    updateAppStatus: updateAppStatusDispatch,
    setQueue: setQueueDispatch,
    setError: setErrorDispatch,
    setLoadingProgress: setLoadingProgressDispatch,
    setAppDownloadProgress: setAppDownloadProgressDispatch
  } = useAppActions({
    setApps,
    updateInstalledApps,
    updateAppStatus,
    setQueue,
    setError,
    setLoadingProgress,
    setAppDownloadProgress
  });

  useEffect(() => {
    fetchLibraryApps(false);
    fetchQueue();
  }, [fetchLibraryApps, fetchQueue]);

  usePlayserve({
    onMessage: (message) => {
      if (
        [MessageType.AppLibraryGet, MessageType.AppLibraryUpdate].includes(
          message.message_type
        )
      ) {
        if (message.status === 200) {
          setAppsDispatch(message.body);
        } else {
          setErrorDispatch(message.body.message);
        }
      } else if (
        message.message_type === MessageType.AppGetInstalled ||
        message.message_type === MessageType.AppGetInstalledUpdate
      ) {
        if (message.status === 200) {
          updateInstalledAppsDispatch(message.body.installed_apps);
        }
      } else if (
        message.message_type === MessageType.QueueDownloadGet ||
        message.message_type === MessageType.QueueDownloadGetUpdate
      ) {
        if (message.status === 200) {
          setQueueDispatch(message.body.downloads);
        }
      } else if (message.message_type === MessageType.AppDownloadProgress) {
        if (message.status === 200) {
          setAppDownloadProgressDispatch(message.body);
        }
      } else if (message.message_type === MessageType.AppGetOwnedProgress) {
        if (message.status === 200) {
          setLoadingProgressDispatch({
            [message.body.provider]: message.body.progress
          });
        }
      } else if (message.message_type === MessageType.AppStatusUpdate) {
        if (message.status === 200) {
          updateAppStatusDispatch(message.body);
        }
      }
    }
  });
};
