import { useCallback } from "react";
import { t } from "@lingui/macro";
import { flashMessage } from "redux-flash";

import { selectAppLibraryState, selectDrives } from "@/redux/modules";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useConfirmationPopUp } from "@/context";
import { EULA_NOT_ACCEPTED } from "@/constants";
import { usePlayserve } from "@/hooks";
import {
  DriveInfoResponseBody,
  Message,
  MessageType,
  getMessage
} from "@/types";

export interface UseAppDownloadReturn {
  downloadApp: (
    ownedAppId: string,
    force?: boolean
  ) => Promise<string | undefined>;
  pauseDownload: (ownedAppId: string) => void;
  cancelDownload: (ownedAppId: string, appName: string) => void;
}

// Hook that handles app download (s)
export const useAppDownloadActions = (): UseAppDownloadReturn => {
  const dispatch = useAppDispatch();
  const { openConfirmationPopUp, closeConfirmationPopUp } =
    useConfirmationPopUp();

  const playserve = usePlayserve();
  const { sendMessage } = playserve;
  const { appFilters } = useAppSelector(selectAppLibraryState);
  const drives: DriveInfoResponseBody = useAppSelector(selectDrives);

  const sendAppDownloadMessage = useCallback(
    async (message: Message<MessageType.AppDownload>) => {
      return await sendMessage(message)().then((response) => {
        const message = response.body.message;
        console.log(message);
        if (response.status !== 200) {
          if (message.includes("EULA not accepted")) {
            return EULA_NOT_ACCEPTED;
          } else {
            dispatch(flashMessage(t`Error starting app download: ${message}`));
          }
        }
      });
    },
    [sendMessage, dispatch]
  );

  const downloadApp = useCallback(
    async (ownedAppId: string, force = false) => {
      let installDisk = null;
      if (drives.length === 0) {
        dispatch(flashMessage(t`No drives found.`));
        return;
      }
      if (drives.length === 1) {
        installDisk = drives[0].name;
      } else {
        const selectedDrives = drives
          .filter((drive) => {
            return appFilters.drives.includes(drive.name);
          })
          .sort((a, b) => {
            if (a.available_space > b.available_space) return -1;
            else return 1;
          });
        if (!selectedDrives.length) {
          dispatch(flashMessage(t`Select at least one drive in the side bar.`));
          return;
        }
        installDisk = selectedDrives[0].name;
      }

      const messageAppDownload = getMessage(MessageType.AppDownload, {
        owned_app_id: ownedAppId,
        install_disk: installDisk,
        force_download: force
      });

      return await sendAppDownloadMessage(messageAppDownload);
    },
    [sendAppDownloadMessage, dispatch, drives, appFilters]
  );

  const sendAppDownloadCancelMessage = useCallback(
    async (ownedAppId: string) => {
      const messageAppDownloadCancel = getMessage(
        MessageType.AppDownloadCancel,
        {
          owned_app_id: ownedAppId
        }
      );
      await sendMessage(messageAppDownloadCancel)();
    },
    [sendMessage]
  );

  const pauseDownload = useCallback(
    async (ownedAppId: string) => {
      const messageAppDownloadPause = getMessage(MessageType.AppDownloadPause, {
        owned_app_id: ownedAppId
      });
      await sendMessage(messageAppDownloadPause)();
    },
    [sendMessage]
  );

  const cancelDownload = useCallback(
    (ownedAppId: string, appName: string) => {
      openConfirmationPopUp({
        title: t`Are you sure you want to stop downloading ${appName}?`,
        onConfirm: () => {
          sendAppDownloadCancelMessage(ownedAppId);
          closeConfirmationPopUp();
        },
        onClose: () => {
          closeConfirmationPopUp();
        }
      });
    },
    [
      sendAppDownloadCancelMessage,
      openConfirmationPopUp,
      closeConfirmationPopUp
    ]
  );

  return {
    downloadApp,
    pauseDownload,
    cancelDownload
  };
};
