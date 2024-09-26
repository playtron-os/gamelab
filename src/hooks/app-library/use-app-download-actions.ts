import { useConfirmationPopUp } from "@/context";
import { usePlayserve } from "@/hooks";
import { useAppDispatch } from "@/redux/store";
import { AppInformation } from "@/types/app-library";
import { Message, MessageType, getMessage } from "@/types/playserve/message";
import { t } from "@lingui/macro";
import { useCallback } from "react";
import { flashMessage } from "redux-flash";

export interface UseAppDownloadReturn {
  downloadApp: (app: AppInformation, force?: boolean) => void;
  pauseDownload: (app: AppInformation) => void;
  cancelDownload: (app: AppInformation) => void;
}

// Hook that handles app download (s)
export const useAppDownloadActions = (): UseAppDownloadReturn => {
  const dispatch = useAppDispatch();
  const { openConfirmationPopUp, closeConfirmationPopUp } =
    useConfirmationPopUp();
  const { sendMessage } = usePlayserve();

  const sendAppDownloadMessage = useCallback(
    async (message: Message<MessageType.AppDownload>) => {
      await sendMessage(message)().then((response) => {
        if (response.status !== 200) {
          const message = response.body.message;
          dispatch(flashMessage(t`Error starting app download: ${message}`));
        }
      });
    },
    [sendMessage, dispatch]
  );

  const downloadApp = useCallback(
    (appInfo: AppInformation, force = false) => {
      const messageAppDownload = getMessage(MessageType.AppDownload, {
        owned_app_id: appInfo.owned_apps[0].id,
        force_download: force
      });

      sendAppDownloadMessage(messageAppDownload);
    },
    [sendAppDownloadMessage]
  );

  const sendAppDownloadCancelMessage = useCallback(
    async (appInfo: AppInformation) => {
      if (!appInfo.installed_app) {
        console.error("Unable to cancel download, installed_app doesn't exist");
        return;
      }
      const messageAppDownloadCancel = getMessage(
        MessageType.AppDownloadCancel,
        {
          owned_app_id: appInfo.installed_app.owned_app.id
        }
      );
      await sendMessage(messageAppDownloadCancel)();
    },
    [sendMessage]
  );

  const sendAppDownloadPauseMessage = useCallback(
    async (appInfo: AppInformation) => {
      if (!appInfo.installed_app?.owned_app.id) {
        console.error(
          "No installed owned app found for app when trying to pause download",
          appInfo
        );
        return;
      }
      const messageAppDownloadPause = getMessage(MessageType.AppDownloadPause, {
        owned_app_id: appInfo.installed_app?.owned_app.id
      });
      await sendMessage(messageAppDownloadPause)();
    },
    [sendMessage]
  );

  const cancelDownload = useCallback(
    (appInfo: AppInformation) => {
      const appName = appInfo.app.name;
      openConfirmationPopUp({
        title: t`Are you sure you want to stop downloading ${appName}?`,
        onConfirm: () => {
          sendAppDownloadCancelMessage(appInfo);
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
    pauseDownload: sendAppDownloadPauseMessage,
    cancelDownload
  };
};
