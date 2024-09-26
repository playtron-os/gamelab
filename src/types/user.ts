import { AppProvider } from "./platform-auth";

export class UserProviderState {
  username: string;
  requires2fa: boolean;
  authorized: boolean;
  lastRequested2fa: number;
  hasFetchedApps: boolean;
  lastSignedIn: number;

  constructor(
    username: string,
    requires2fa: boolean,
    authorized: boolean,
    lastRequested2fa: number,
    hasFetchedApps: boolean,
    lastSignedIn: number
  ) {
    this.username = username;
    this.requires2fa = requires2fa;
    this.authorized = authorized;
    this.lastRequested2fa = lastRequested2fa;
    this.hasFetchedApps = hasFetchedApps;
    this.lastSignedIn = lastSignedIn;
  }

  isLinked() {
    return this.authorized && !this.requires2fa;
  }
}

type UserProvidersState = {
  [key in AppProvider]: UserProviderState;
};

export type UserUnmapped = {
  is_current: boolean;
  is_onboarding_done: boolean;
  providers_state: UserProvidersState;
  id: string;
};

export class User {
  isCurrent: boolean;
  isOnboardingDone: boolean;
  providersState: UserProvidersState;
  id: string;

  constructor(
    isCurrent: boolean,
    isOnboardingDone: boolean,
    providersState: UserProvidersState,
    id: string
  ) {
    this.isCurrent = isCurrent;
    this.isOnboardingDone = isOnboardingDone;
    this.providersState = Object.entries(providersState).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key as AppProvider]: new UserProviderState(
          value.username,
          value.requires2fa,
          value.authorized,
          value.lastRequested2fa,
          value.hasFetchedApps,
          value.lastSignedIn
        )
      }),
      {} as UserProvidersState
    );
    this.id = id;
  }

  getProviderIsLinked(provider: AppProvider) {
    return this.providersState[provider].isLinked();
  }
}
