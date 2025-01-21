import { useConfirmationPopUp } from "@/context";

import { usePlayserve } from "@/hooks";
import { useAppDispatch } from "@/redux/store";
import { Message, MessageType, getMessage } from "@/types/playserve/message";
import { t } from "@lingui/macro";
import { useCallback } from "react";
import { flashMessage } from "redux-flash";
import { EULA_NOT_ACCEPTED } from "@/constants";

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

  const { sendMessage } = usePlayserve();

  const sendAppDownloadMessage = useCallback(
    async (message: Message<MessageType.AppDownload>) => {
      return await sendMessage(message)().then((response) => {
        if (response.status !== 200) {
          const message = response.body.message;
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
      const messageAppDownload = getMessage(MessageType.AppDownload, {
        owned_app_id: ownedAppId,
        force_download: force
      });

      return await sendAppDownloadMessage(messageAppDownload);
    },
    [sendAppDownloadMessage]
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

  const sendAppDownloadPauseMessage = useCallback(
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
    pauseDownload: sendAppDownloadPauseMessage,
    cancelDownload
  };
};
