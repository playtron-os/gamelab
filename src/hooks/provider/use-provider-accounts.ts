import { usePlayserve } from "@/hooks";
import {
  selectAuthState,
  setProviderConnectedState,
  setProviderDisconnectedState,
  setProviderLoadedState,
  setProviderLoadingState,
  setProviderRequiresTwoFactorCodeState
} from "@/redux/modules";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { AppProvider, MessageType, getMessage } from "@/types";
import { useCallback, useEffect } from "react";

const messageTypeToProvider = {
  [MessageType.EpicStatus]: AppProvider.EpicGames,
  [MessageType.SteamStatus]: AppProvider.Steam,
  [MessageType.GogStatus]: AppProvider.Gog
};

// This hook is used to check if the user is logged in to Steam or Epic Games
// It will set the provider auth status in the redux store
export const useProviderAccounts = () => {
  const { sendMessage } = usePlayserve();
  const { userId } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const checkPlatformAuthStatus = useCallback(
    (messageType: keyof typeof messageTypeToProvider) => {
      const provider = messageTypeToProvider[messageType]!;
      dispatch(setProviderLoadingState(provider));

      const message = getMessage(messageType);

      return sendMessage(message)()
        .then((response) => {
          if (provider && response.status === 200) {
            // TODO - update playserve with a more consistent response and update this logic
            const isUnauthorized =
              response.message_type === MessageType.EpicStatus
                ? !response.body.account
                : !response.body.authorized;
            const isTwoFactorRequired =
              response.message_type === MessageType.SteamStatus &&
              response.body.requires_2fa;

            if (isUnauthorized) {
              dispatch(setProviderDisconnectedState(provider));
            } else {
              dispatch(setProviderConnectedState(provider));
            }

            if (isTwoFactorRequired) {
              dispatch(setProviderRequiresTwoFactorCodeState(provider));
            }
          }
        })
        .finally(() => {
          dispatch(setProviderLoadedState(provider));
        });
    },
    [sendMessage, dispatch]
  );

  useEffect(() => {
    if (userId) {
      checkPlatformAuthStatus(MessageType.SteamStatus);
      checkPlatformAuthStatus(MessageType.EpicStatus);
      checkPlatformAuthStatus(MessageType.GogStatus);
    }
  }, [checkPlatformAuthStatus, userId]);
};
