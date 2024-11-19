import { UsePlayserveReturn } from "@/hooks";
import { closeMoveAppDialog, setMovingApp } from "@/redux/modules";
import { useAppDispatch } from "@/redux/store";
import { AppInformation } from "@/types/app-library";
import { DriveInfo } from "@/types/drive";
import { MessageType, getMessage } from "@/types/playserve/message";
import { t } from "@lingui/macro";
import { useCallback } from "react";
import { flashMessage } from "redux-flash";
export const useAppMove = (playserve: UsePlayserveReturn) => {
  const { sendMessage } = playserve;
  const dispatch = useAppDispatch();

  const sendAppMoveMessage = useCallback(
    (appsToMoveInfoArray: AppInformation[], drive: DriveInfo) => {
      dispatch(setMovingApp(true));

      appsToMoveInfoArray.forEach((appToMove, index) => {
        if (!appToMove.installed_app) {
          console.error("Unable to move, installed_app is nullish");
          closeMoveAppDialog();
          return;
        }
        const message = getMessage(MessageType.AppMove, {
          owned_app_id: appToMove.installed_app.owned_app.id,
          drive: drive.name
        });
        sendMessage(message)().then((response) => {
          const isLastUpdate = index === appsToMoveInfoArray.length - 1;
          if (response.status !== 200) {
            const message = response.body.message;
            dispatch(flashMessage(t`Failed to move app: ${message}`));
          }
          if (isLastUpdate) {
            dispatch(closeMoveAppDialog());
          }
        });
      });
    },
    [sendMessage, dispatch]
  );

  return {
    moveApps: sendAppMoveMessage
  };
};
