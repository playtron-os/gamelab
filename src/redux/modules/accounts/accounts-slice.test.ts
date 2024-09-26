import { configureStore } from "@reduxjs/toolkit";
import accountsReducer, {
  setProviderConnectedState,
  setProviderDisconnectedState,
  setProviderLoadingState,
  setProviderLoadedState,
  setProviderErrorState,
  setProviderRequiresTwoFactorCodeState,
  AccountsState
} from "./accounts-slice";
import { AppProvider } from "@/types";
import { PROVIDERS_ACCOUNTS_DISCONNECTED_STATE_MOCK } from "@/mocks/provider-account-state";

const initialState: AccountsState = PROVIDERS_ACCOUNTS_DISCONNECTED_STATE_MOCK;

describe("accountsSlice", () => {
  it("should handle initial state", () => {
    expect(accountsReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("should handle setProviderConnectedState", () => {
    const actual = accountsReducer(
      initialState,
      setProviderConnectedState(AppProvider.Steam)
    );
    expect(actual.providers.steam.isConnected).toEqual(true);
    expect(actual.providers.steam.isLoading).toEqual(false);
  });

  it("should handle setProviderDisconnectedState", () => {
    const actual = accountsReducer(
      initialState,
      setProviderDisconnectedState(AppProvider.Steam)
    );
    expect(actual.providers.steam.isConnected).toEqual(false);
    expect(actual.providers.steam.isLoading).toEqual(false);
  });

  it("should handle setProviderLoadingState", () => {
    const actual = accountsReducer(
      initialState,
      setProviderLoadingState(AppProvider.Steam)
    );
    expect(actual.providers.steam.isLoading).toEqual(true);
  });

  it("should handle setProviderLoadedState", () => {
    const actual = accountsReducer(
      initialState,
      setProviderLoadedState(AppProvider.Steam)
    );
    expect(actual.providers.steam.isLoading).toEqual(false);
  });

  it("should handle setProviderErrorState", () => {
    const actual = accountsReducer(
      initialState,
      setProviderErrorState({
        provider: AppProvider.Steam,
        error: "Some error"
      })
    );
    expect(actual.providers.steam.error).toEqual("Some error");
    expect(actual.providers.steam.isLoading).toEqual(false);
    expect(actual.providers.steam.isConnected).toEqual(false);
  });

  it("should handle setProviderRequiresTwoFactorCodeState", () => {
    const actual = accountsReducer(
      initialState,
      setProviderRequiresTwoFactorCodeState(AppProvider.Steam)
    );
    expect(actual.providers.steam.requiresTwoFactorCode).toEqual(true);
    expect(actual.providers.steam.isLoading).toEqual(false);
  });
});

describe("accounts actions", () => {
  it("handles account states using dispatched actions", () => {
    const store = configureStore({
      reducer: { accounts: accountsReducer }
    });

    store.dispatch(setProviderConnectedState(AppProvider.Steam));
    let actual = store.getState().accounts;
    expect(actual.providers.steam.isConnected).toEqual(true);

    store.dispatch(setProviderDisconnectedState(AppProvider.Steam));
    actual = store.getState().accounts;
    expect(actual.providers.steam.isConnected).toEqual(false);
  });
});
