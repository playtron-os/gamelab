import React from "react";
import { ProtectedRouteElementWrapper } from ".";
import { screen } from "@testing-library/react";
import { renderWithAllContext } from "@/utils";
import { configureStore } from "@reduxjs/toolkit";
import {
  APP_LIBRARY_INITIAL_STATE,
  accountsSlice,
  appLibrarySlice,
  authSlice
} from "@/redux/modules";
import { PROVIDERS_ACCOUNTS_DISCONNECTED_STATE_MOCK } from "@/mocks/provider-account-state";

const getMockStore = ({
  isAuthenticated = false
}: {
  isAuthenticated?: boolean;
}) => {
  return configureStore({
    reducer: {
      appLibrary: appLibrarySlice.reducer,
      auth: authSlice.reducer,
      accounts: accountsSlice.reducer
    },
    preloadedState: {
      appLibrary: APP_LIBRARY_INITIAL_STATE,
      auth: {
        isAuthenticated,
        userId: ""
      },
      accounts: PROVIDERS_ACCOUNTS_DISCONNECTED_STATE_MOCK
    }
  });
};

const TestComponent = () => (
  <ProtectedRouteElementWrapper>Test component</ProtectedRouteElementWrapper>
);

describe("ProtectedRouteElementWrapper", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot", () => {
    const { asFragment } = renderWithAllContext(
      <TestComponent />,
      undefined,
      getMockStore({})
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders children when user is authenticated", () => {
    renderWithAllContext(
      <TestComponent />,
      undefined,
      getMockStore({
        isAuthenticated: true
      })
    );

    expect(screen.getByText("Test component")).toBeInTheDocument();
  });

  it("redirects to /auth when user is not authenticated", () => {
    renderWithAllContext(<TestComponent />, undefined, getMockStore({}));
  });
});
