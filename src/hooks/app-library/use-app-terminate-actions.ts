import { useConfirmationPopUp } from "@/context";
import { usePlayserve } from "@/hooks";
import { AppInformation } from "@/types/app-library";
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
    (appInfo: AppInformation) => {
      const message = getMessage(MessageType.AppTerminate, {
        owned_app_id: appInfo.installed_app!.owned_app.id
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
    (appInfo: AppInformation) => {
      const appName = appInfo.app.name;
      openConfirmationPopUp({
        title: t`Are you sure you want to terminate ${appName}?`,
        onConfirm: () => {
          sendTerminateAppMessage(appInfo);
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
