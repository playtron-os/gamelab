import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendPlayserveMessage } from "@/hooks";
import { MessageType, getMessage } from "@/types/playserve/message";
import { selectAuthState, setAuthState } from "@/redux/modules";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useLoadingSpinner } from "@/context";
import { User, UserUnmapped } from "@/types";
import { Dispatch } from "@reduxjs/toolkit";

export type useFetchTokenReturn = {
  canRequestToken: boolean;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
};

export const handleUser = async (
  dispatch: Dispatch,
  deviceIp: string,
  userUnmapped: UserUnmapped
) => {
  const user = new User(
    userUnmapped.is_current,
    userUnmapped.is_onboarding_done,
    userUnmapped.providers_state,
    userUnmapped.id
  );
  const isEpicReady = user.providersState.epicgames?.isLinked() ?? false;
  const isGogReady = user.providersState.gog?.isLinked() ?? false;
  const isSteamReady = user.providersState.steam?.isLinked() ?? false;
  const isOnboardingDone = user.isOnboardingDone;
  dispatch(
    setAuthState({
      isEpicReady,
      isGogReady,
      isSteamReady,
      userId: user.id
    })
  );

  if (!isOnboardingDone) {
    const onboardMessage = getMessage(MessageType.SetUserOnboarded, {});
    await sendPlayserveMessage(deviceIp, onboardMessage)();
  }
};

export const useAuthentication = () => {
  const navigate = useNavigate();
  const authState = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const { showLoadingSpinner, hideLoadingSpinner } = useLoadingSpinner();

  const fetchCurrentUser = useCallback(async () => {
    if (!authState?.deviceIp) {
      return;
    }

    const message = getMessage(MessageType.GetCurrentUser, {});
    const response = await sendPlayserveMessage(authState.deviceIp, message)();
    if (response.status !== 200 || !response.body) {
      // TODO: Handle error
      console.error("Error fetching current user");
      return;
    }

    await handleUser(dispatch, authState?.deviceIp || "", response.body);
  }, [authState?.deviceIp, dispatch]);

  const handleInitialAuthRequest = useCallback(async () => {
    showLoadingSpinner();
    await fetchCurrentUser();
    hideLoadingSpinner();
  }, [fetchCurrentUser, showLoadingSpinner, hideLoadingSpinner]);

  useEffect(() => {
    if (authState?.isAuthenticated) {
      return;
    }
    handleInitialAuthRequest();
  }, []);

  useEffect(() => {
    if (authState?.isAuthenticated) {
      navigate("/");
    }
  }, [authState?.isAuthenticated, navigate]);
};
