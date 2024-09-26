// test-utils.js
import React, { ReactNode } from "react";
import {
  RenderHookOptions,
  render as rtlRender,
  renderHook,
  RenderHookResult
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store as defaultStore } from "@/redux/store";
import { Store } from "@reduxjs/toolkit";
import {
  ConfirmationPopUpContextProvider,
  AppLibraryContextProvider,
  LoadingSpinnerContextProvider
} from "@/context";

const createWrapper = (mockStore?: Store) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={mockStore || defaultStore}>
      <LoadingSpinnerContextProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </LoadingSpinnerContextProvider>
    </Provider>
  );
  return Wrapper;
};

function renderWithProviders(
  ui: React.ReactElement,
  { _locale = "en", ...renderOptions } = {},
  mockStore?: Store
) {
  return rtlRender(ui, {
    wrapper: createWrapper(mockStore),
    ...renderOptions
  });
}

function renderHookWithContext(
  callback: (...args: any) => any,
  _options?: RenderHookOptions<any>,
  mockStore: Store = defaultStore
): RenderHookResult<any, any> {
  return renderHook(callback, { wrapper: createWrapper(mockStore) });
}

const createAppLibraryContextWrapper = (mockStore?: Store) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={mockStore || defaultStore}>
      <LoadingSpinnerContextProvider>
        <ConfirmationPopUpContextProvider>
          <AppLibraryContextProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </AppLibraryContextProvider>
        </ConfirmationPopUpContextProvider>
      </LoadingSpinnerContextProvider>
    </Provider>
  );
  return Wrapper;
};

const createAllContextWrapper = (mockStore?: Store) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={mockStore || defaultStore}>
      <LoadingSpinnerContextProvider>
        <ConfirmationPopUpContextProvider>
          <AppLibraryContextProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </AppLibraryContextProvider>
        </ConfirmationPopUpContextProvider>
      </LoadingSpinnerContextProvider>
    </Provider>
  );
  return Wrapper;
};

const renderWithAppLibraryContext = (
  ui: React.ReactElement,
  { _locale = "en", ...renderOptions } = {},
  mockStore?: Store
) => {
  return rtlRender(ui, {
    wrapper: createAppLibraryContextWrapper(mockStore),
    ...renderOptions
  });
};

const renderHookWithAppLibraryContext = (
  callback: (...args: any) => any,
  _options?: RenderHookOptions<any>,
  mockStore?: Store
): RenderHookResult<any, any> => {
  return renderHook(callback, {
    wrapper: createAppLibraryContextWrapper(mockStore)
  });
};

const renderWithAllContext = (
  ui: React.ReactElement,
  { _locale = "en", ...renderOptions } = {},
  mockStore?: Store
) => {
  return rtlRender(ui, {
    wrapper: createAllContextWrapper(mockStore),
    ...renderOptions
  });
};

// re-export everything
// export * from "@testing-library/react";

export {
  renderWithProviders,
  renderHookWithContext,
  renderWithAppLibraryContext,
  renderHookWithAppLibraryContext,
  renderWithAllContext
};
