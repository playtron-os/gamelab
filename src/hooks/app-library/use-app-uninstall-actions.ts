import { useConfirmationPopUp } from "@/context";
import { usePlayserve } from "@/hooks";
import { useAppDispatch } from "@/redux/store";
import { AppInformation } from "@/types/app-library";
import { MessageType, getMessage } from "@/types/playserve/message";
import { t } from "@lingui/macro";
import { flashMessage } from "redux-flash";
import { useCallback } from "react";

export const useAppUninstallActions = () => {
  const dispatch = useAppDispatch();
  const { sendMessage } = usePlayserve();
  const { openConfirmationPopUp, closeConfirmationPopUp } =
    useConfirmationPopUp();

  const sendUninstallAppMessage = useCallback(
    (appsToUninstall: AppInformation[]) => {
      const message = getMessage(MessageType.AppUninstall, {
        owned_app_ids: appsToUninstall
          .filter((gappInfo) => !!gappInfo.installed_app)
          .map((gappInfo) => gappInfo.installed_app!.owned_app.id)
      });

      sendMessage(message)().then((response) => {
        if (response.status !== 200) {
          const message = response.body.message;
          dispatch(flashMessage(t`Failed to uninstall app: ${message}`));
        }
      });
    },
    [sendMessage, dispatch]
  );

  const uninstallApp = useCallback(
    (appsToUninstallInfo: AppInformation[]) => {
      let title = "";

      if (appsToUninstallInfo.length > 1) {
        title = t`Are you sure you want to uninstall the selected apps?`;
      } else {
        const appName = appsToUninstallInfo[0].app.name;
        title = t`Are you sure you want to uninstall ${appName}?`;
      }

      openConfirmationPopUp({
        title,
        onConfirm: () => {
          sendUninstallAppMessage(appsToUninstallInfo);
          closeConfirmationPopUp();
        },
        onClose: () => {
          closeConfirmationPopUp();
        }
      });
    },
    [sendUninstallAppMessage, openConfirmationPopUp, closeConfirmationPopUp]
  );

  return {
    uninstallApp,
    sendUninstallAppMessage
  };
};
