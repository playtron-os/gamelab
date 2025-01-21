import { usePlayserve } from "@/hooks";
import { MessageType, getMessage } from "@/types/playserve/message";
import { useCallback } from "react";
import { useAppDispatch } from "@/redux/store";
import { useAppDownloadActions } from "./use-app-download-actions";
import { AppInformation } from "@/types";
import { flashMessage } from "redux-flash";
import { AppEulaResponseBody } from "@/types/app";

export interface UseAppEulaReturn {
  acceptEula: (eula: AppEulaResponseBody, appInfo: AppInformation) => void;
  rejectEula: (appInfo: AppInformation) => void;
  getAppEulas: (
    ownedAppId: string
  ) => Promise<AppEulaResponseBody[] | undefined>;
}

export const useAppEula = (): UseAppEulaReturn => {
  const { sendMessage } = usePlayserve();
  const dispatch = useAppDispatch();
  const { downloadApp } = useAppDownloadActions();

  const getAppEulas = useCallback(
    async (ownedAppId: string) => {
      const message = getMessage(MessageType.AppEulasGet, {
        owned_app_id: ownedAppId
      });

      return await sendMessage(message)().then((response) => {
        if (response.status !== 200) {
          dispatch(flashMessage("Error getting EULA"));
        } else {
          return response.body;
        }
      });
    },
    [sendMessage, dispatch]
  );

  const acceptEula = useCallback(
    (eula: AppEulaResponseBody) => {
      const message = getMessage(MessageType.AppEulaAccept, {
        owned_app_id: eula.owned_app_id,
        entry: {
          id: eula.id,
          version: eula.version
        }
      });
      sendMessage(message)().then((response) => {
        if (response.status !== 200) {
          dispatch(flashMessage("Error accepting EULA"));
          return;
        } else {
          downloadApp(eula.owned_app_id);
        }
      });
    },
    [sendMessage, dispatch]
  );

  const rejectEula = useCallback(
    (appInfo: AppInformation) => {
      const message = getMessage(MessageType.AppDownloadCancel, {
        owned_app_id: appInfo.owned_apps[0].id
      });
      sendMessage(message)().then((response) => {
        if (response.status !== 200) {
          dispatch(flashMessage("Error rejecting EULA"));
          return;
        }
      });
    },
    [sendMessage, dispatch]
  );

  return {
    acceptEula,
    rejectEula,
    getAppEulas
  };
};
