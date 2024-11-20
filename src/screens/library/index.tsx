import React, { useEffect } from "react";
import { usePlayserve } from "@/hooks";
import { MessageType } from "@/types/playserve/message";

import { useAppActions, useAppSelector } from "@/redux/store";
import {
  setApps,
  updateInstalledApps,
  updateAppStatus,
  setQueue,
  setError,
  setLoadingProgress,
  setAppDownloadProgress,
  selectAppLibraryAppsState
} from "@/redux/modules";
import { AppLibrary } from "../../components";
import { SidePanel } from "@/components/side-panel/side-panel";

import { SubmissionsContextProvider } from "@/context/submissions-context";
import { Sidebar } from "@/components/sidebar/sidebar";

import { useAppLibraryActions } from "@/hooks/app-library/use-app-library-actions";

export const LibraryScreen = () => {
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
  const { fetchLibraryApps, fetchQueue } = useAppLibraryActions();
  useEffect(() => {
    fetchLibraryApps(false);
    fetchQueue();
  }, []);

  const apps = useAppSelector(selectAppLibraryAppsState);

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

  return (
    <>
      <div className="fixed left-0">
        <Sidebar />
      </div>
      <div className="h-screen flex">
        <div className="ml-[240px] mr-[265px] w-full bg-[--fill-subtler]">
          <AppLibrary />
          <div>
            <SubmissionsContextProvider>
              {!!apps.length && <SidePanel />}
            </SubmissionsContextProvider>
          </div>
        </div>
      </div>
    </>
  );
};
