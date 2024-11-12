import { setUserIdToLocalStorage } from "@/utils/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  userId: string;
  username?: string;
  email?: string;
  isAuthenticated?: boolean;
  isEpicReady?: boolean;
  isGogReady?: boolean;
  isSteamReady?: boolean;
  deviceIp?: string;
}

export const AUTH_SLICE_INITIAL_STATE: AuthState = {
  userId: "",
  username: "",
  email: "",
  isAuthenticated: false,
  isEpicReady: false,
  isSteamReady: false,
  isGogReady: false,
  deviceIp: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState: AUTH_SLICE_INITIAL_STATE,
  reducers: {
    setDeviceIp: (state, action: PayloadAction<string | undefined>) => {
      state.deviceIp = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | undefined>) => {
      state.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string | undefined>) => {
      state.email = action.payload;
    },
    setAuthState: (state, action: PayloadAction<AuthState>) => {
      const { userId, isEpicReady, isSteamReady, isGogReady } = action.payload;

      if (userId) {
        // Set user id to local storage so we can use it later to get a new access token from playserve
        setUserIdToLocalStorage(userId);
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
      state.userId = userId;
      state.isEpicReady = isEpicReady;
      state.isSteamReady = isSteamReady;
      state.isGogReady = isGogReady;
    },
    resetAuthState: (state) => {
      setUserIdToLocalStorage(undefined);
      Object.assign(state, AUTH_SLICE_INITIAL_STATE);
    },
    setProviderStatus: (
      state,
      action: PayloadAction<{
        isEpicReady: boolean;
        isGogReady: boolean;
        isSteamReady: boolean;
      }>
    ) => {
      const { isEpicReady, isGogReady, isSteamReady } = action.payload;
      state.isEpicReady = isEpicReady;
      state.isGogReady = isGogReady;
      state.isSteamReady = isSteamReady;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setAuthState,
  resetAuthState,
  setDeviceIp,
  setUsername,
  setEmail
} = authSlice.actions;
export const selectAuthState = (state: { auth: AuthState }) => state.auth;
export const selectAuthDeviceIp = (state: { auth: AuthState }) =>
  state.auth.deviceIp;
export const selectAuthUsername = (state: { auth: AuthState }) =>
  state.auth.username;
export const selectAuthEmail = (state: { auth: AuthState }) => state.auth.email;
export default authSlice.reducer;
