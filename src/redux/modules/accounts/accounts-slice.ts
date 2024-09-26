import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { AppProvider } from "@/types";

export interface ProviderAccountState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  requiresTwoFactorCode?: boolean;
}

export interface AccountsState {
  providers: {
    [value in AppProvider]: ProviderAccountState;
  };
}

const INITIAL_STATE: AccountsState = {
  providers: {
    [AppProvider.Steam]: {
      isConnected: false,
      isLoading: false,
      error: null,
      requiresTwoFactorCode: false
    },
    [AppProvider.Gog]: {
      isConnected: false,
      isLoading: false,
      error: null,
      requiresTwoFactorCode: false
    },
    [AppProvider.EpicGames]: {
      isConnected: false,
      isLoading: false,
      error: null,
      requiresTwoFactorCode: false
    }
  }
};

export const accountsSlice = createSlice({
  name: "accounts",
  initialState: INITIAL_STATE,
  reducers: {
    setProviderConnectedState: (state, action: PayloadAction<AppProvider>) => {
      const provider = action.payload;
      state.providers[provider].isConnected = true;
      state.providers[provider].isLoading = false;
      state.providers[provider].error = null;
      state.providers[provider].requiresTwoFactorCode = false;
    },
    setProviderDisconnectedState: (
      state,
      action: PayloadAction<AppProvider>
    ) => {
      const provider = action.payload;
      state.providers[provider].isConnected = false;
      state.providers[provider].isLoading = false;
      state.providers[provider].error = null;
      state.providers[provider].requiresTwoFactorCode = false;
    },
    setProviderLoadingState: (state, action: PayloadAction<AppProvider>) => {
      const provider = action.payload;
      state.providers[provider].isLoading = true;
    },
    setProviderLoadedState: (state, action: PayloadAction<AppProvider>) => {
      const provider = action.payload;
      state.providers[provider].isLoading = false;
    },
    setProviderErrorState: (
      state,
      action: PayloadAction<{ provider: AppProvider; error: string }>
    ) => {
      const { provider, error } = action.payload;
      state.providers[provider].error = error;
      state.providers[provider].isLoading = false;
      state.providers[provider].isConnected = false;
    },
    setProviderRequiresTwoFactorCodeState: (
      state,
      action: PayloadAction<AppProvider>
    ) => {
      const provider = action.payload;
      state.providers[provider].isConnected = false;
      state.providers[provider].isLoading = false;
      state.providers[provider].requiresTwoFactorCode = true;
      state.providers[provider].error = null;
    }
  }
});

export const {
  setProviderConnectedState,
  setProviderDisconnectedState,
  setProviderLoadingState,
  setProviderLoadedState,
  setProviderErrorState,
  setProviderRequiresTwoFactorCodeState
} = accountsSlice.actions;
export const selectAccountsState = (state: RootState) => state.accounts;
export default accountsSlice.reducer;
