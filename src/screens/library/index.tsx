import React, { useEffect } from "react";
import classNames from "classnames";
import { usePlayserve } from "@/hooks";
import { MessageType } from "@/types/playserve/message";

import { useAppActions, useAppSelector, useAppDispatch } from "@/redux/store";
import {
  setApps,
  updateInstalledApps,
  updateAppStatus,
  updateInstallStatus,
  setQueue,
  setLoadingProgress,
  setAppDownloadProgress,
  selectCurrentAppState,
  setAvailableProviders
} from "@/redux/modules";
import { AppLibrary } from "../../components";
import { SidePanel } from "@/components/side-panel/side-panel";
import { flashMessage } from "redux-flash";
import { SubmissionsContextProvider } from "@/context/submissions-context";
import { Sidebar } from "@/components/sidebar/sidebar";

import { useAppLibraryActions } from "@/hooks/app-library/use-app-library-actions";

export const LibraryScreen = () => {
  const {
    setApps: setAppsDispatch,
    updateInstalledApps: updateInstalledAppsDispatch,
    updateAppStatus: updateAppStatusDispatch,
    setQueue: setQueueDispatch,
    setLoadingProgress: setLoadingProgressDispatch,
    setAppDownloadProgress: setAppDownloadProgressDispatch,
    updateInstallStatus: updateInstallStatusDispatch,
    setAvailableProviders: setAvailableProvidersDispatch
  } = useAppActions({
    setApps,
    updateInstalledApps,
    updateAppStatus,
    setQueue,
    setLoadingProgress,
    setAppDownloadProgress,
    updateInstallStatus,
    setAvailableProviders
  });
  const { fetchLibraryApps, fetchQueue, fetchProviders } =
    useAppLibraryActions();
  useEffect(() => {
    fetchLibraryApps(false);
    fetchQueue();
    fetchProviders();
  }, []);

  const currentApp = useAppSelector(selectCurrentAppState);
  const dispatch = useAppDispatch();

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
          dispatch(flashMessage(message.body.message));
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
      } else if (
        message.message_type === MessageType.AppPostInstallStatusUpdate
      ) {
        if (message.status === 200) {
          updateInstallStatusDispatch(message.body);
        }
      } else if (message.message_type === MessageType.AppLaunch) {
        if (message.status !== 200) {
          updateAppStatusDispatch([
            {
              owned_app: currentApp?.installed_app?.owned_app,
              is_launched: false,
              is_running: false
            }
          ]);
          dispatch(flashMessage(message.body.message));
        }
      } else if (
        message.message_type === MessageType.ProviderAuthOptionsGet ||
        message.message_type === MessageType.ProviderAuthOptionsUpdate
      ) {
        if (message.status === 200) {
          setAvailableProvidersDispatch(message.body);
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
        <SubmissionsContextProvider>
          <div
            className={classNames(
              "ml-[240px] w-full bg-[--fill-subtler]",
              !!currentApp && "mr-[465px]"
            )}
          >
            <AppLibrary />
            <div>{!!currentApp && <SidePanel key={currentApp.app.id} />}</div>
          </div>
        </SubmissionsContextProvider>
      </div>
    </>
  );
};
