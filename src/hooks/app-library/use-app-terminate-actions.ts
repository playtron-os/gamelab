import { useConfirmationPopUp } from "@/context";
import { usePlayserve } from "@/hooks";
import { MessageType, getMessage } from "@/types/playserve/message";
import { t } from "@lingui/macro";
import { flashMessage } from "redux-flash";
import { useCallback } from "react";
import { useAppDispatch } from "@/redux/store";

export const useAppTerminate = () => {
  const { sendMessage } = usePlayserve();
  const dispatch = useAppDispatch();
  const { openConfirmationPopUp, closeConfirmationPopUp } =
    useConfirmationPopUp();

  const sendTerminateAppMessage = useCallback(
    (ownedAppId: string) => {
      const message = getMessage(MessageType.AppTerminate, {
        owned_app_id: ownedAppId
      });

      sendMessage(message)().then((response) => {
        if (response.status !== 200) {
          const message = response.body.message;
          dispatch(flashMessage(t`Failed to terminate app: ${message}`));
        }
      });
    },
    [sendMessage, dispatch]
  );

  const terminateApp = useCallback(
    (ownedAppId: string) => {
      openConfirmationPopUp({
        title: t`Are you sure you want to terminate this game?`,
        onConfirm: () => {
          sendTerminateAppMessage(ownedAppId);
          closeConfirmationPopUp();
        },
        onClose: () => {
          closeConfirmationPopUp();
        }
      });
    },
    [sendTerminateAppMessage, openConfirmationPopUp, closeConfirmationPopUp]
  );

  return {
    terminateApp
  };
};
