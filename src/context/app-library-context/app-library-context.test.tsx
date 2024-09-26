import React from "react";
import { useAppLibraryContext } from "./use-app-library-context";
import { renderWithAppLibraryContext } from "@/utils";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import {
  APP_LIBRARY_INITIAL_STATE,
  appLibrarySlice,
  authSlice
} from "@/redux/modules";
import { DEFAULT_STATE_MOCK } from "@/mocks/default-state";

const getMockStore = () => {
  return configureStore({
    reducer: {
      appLibrary: appLibrarySlice.reducer,
      auth: authSlice.reducer
    },
    preloadedState: {
      ...DEFAULT_STATE_MOCK,
      appLibrary: APP_LIBRARY_INITIAL_STATE
    }
  });
};

describe("AppLibraryContextProvider", () => {
  it("provides context", () => {
    const TestComponent: React.FC = () => {
      const context = useAppLibraryContext();
      expect(context).toBeDefined();
      return null;
    };

    renderWithAppLibraryContext(<TestComponent />, undefined, getMockStore());
  });
});

describe("useAppLibraryContext", () => {
  const TestComponent: React.FC<{ testFn: any }> = ({ testFn }) => {
    testFn(useAppLibraryContext());
    return null;
  };

  it("throws an error when not wrapped in a provider", () => {
    expect(() => render(<TestComponent testFn={() => {}} />)).toThrow(
      "useAppLibraryContext must be used within a AppLibraryContextProvider"
    );
  });
});
