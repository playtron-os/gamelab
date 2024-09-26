import { AccountsState, ProviderAccountState } from "@/redux/modules";
import { AppProvider } from "@/types";

export const CONNECTED_PROVIDER_ACCOUNT_STATE: ProviderAccountState = {
  isConnected: true,
  isLoading: false,
  error: null,
  requiresTwoFactorCode: false
};

export const DISCONNECTED_PROVIDER_ACCOUNT_STATE: ProviderAccountState = {
  isConnected: false,
  isLoading: false,
  error: null,
  requiresTwoFactorCode: false
};

export const LOADING_PROVIDER_ACCOUNT_STATE: ProviderAccountState = {
  isConnected: false,
  isLoading: true,
  error: null,
  requiresTwoFactorCode: false
};

export const ERROR_PROVIDER_ACCOUNT_STATE: ProviderAccountState = {
  isConnected: false,
  isLoading: false,
  error: "Error",
  requiresTwoFactorCode: false
};

export const TWO_FACTOR_PROVIDER_ACCOUNT_STATE: ProviderAccountState = {
  isConnected: false,
  isLoading: false,
  error: null,
  requiresTwoFactorCode: true
};

export const PROVIDERS_ACCOUNTS_DISCONNECTED_STATE_MOCK: AccountsState = {
  providers: {
    [AppProvider.Steam]: DISCONNECTED_PROVIDER_ACCOUNT_STATE,
    [AppProvider.Gog]: DISCONNECTED_PROVIDER_ACCOUNT_STATE,
    [AppProvider.EpicGames]: DISCONNECTED_PROVIDER_ACCOUNT_STATE
  }
};
