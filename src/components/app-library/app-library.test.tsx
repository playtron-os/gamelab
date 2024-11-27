import React from "react";
import * as context from "@/context/app-library-context";
import { useAppLibraryContext } from "@/context";
import { AppLibrary } from ".";
import { columnConfig } from "../../context/app-library-context/table-config";

import { renderWithAppLibraryContext } from "@/utils";
import { configureStore } from "@reduxjs/toolkit";
import {
  APP_LIBRARY_INITIAL_STATE,
  appLibrarySlice,
  authSlice,
  moveAppDialogSlice
} from "@/redux/modules";
import { useBoolean } from "ahooks";
import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";
import { DEFAULT_STATE_MOCK } from "@/mocks/default-state";

const MOCK_BOOLEAN_STATE_MANAGER = [
  false,
  {
    setTrue: jest.fn(),
    setFalse: jest.fn(),
    set: jest.fn(),
    toggle: jest.fn()
  }
] as ReturnType<typeof useBoolean>;

const TABLE_MOCK_DATA = [
  STEAM_APP_INFORMATION_MOCKS[0],
  STEAM_APP_INFORMATION_MOCKS[1]
];

const MOCK_LIBRARY_TABLE_DATA: context.AppLibraryContextProps = {
  columns: columnConfig,
  handlers: {
    refetchAllApps: jest.fn(),
    downloadApp: jest.fn(),
    uninstallApp: jest.fn(),
    pauseDownload: jest.fn(),
    cancelDownload: jest.fn(),
    handleAppDefaultAction: jest.fn(),
    openMoveAppDialog: jest.fn(),
    openBulkActionsMenu: jest.fn()
  },
  bulkActionsMenuStateManager: MOCK_BOOLEAN_STATE_MANAGER,
  selectedApps: new Set([]),
  setSelectedApps: jest.fn(),
  selectedIds: [],
  onSelectedIdsChange: jest.fn(),
  isEulaOpen: false,
  setIsEulaOpen: jest.fn(),
  eula: null,
  acceptEula: jest.fn()
};

const getMockStore = ({
  loading,
  loadingProgress,
  error
}: {
  loading?: boolean;
  loadingProgress?: any;
  error?: string;
} = {}) => {
  return configureStore({
    reducer: {
      appLibrary: appLibrarySlice.reducer,
      auth: authSlice.reducer,
      moveAppDialog: moveAppDialogSlice.reducer
    },
    preloadedState: {
      ...DEFAULT_STATE_MOCK,
      appLibrary: {
        ...APP_LIBRARY_INITIAL_STATE,
        apps: TABLE_MOCK_DATA,
        loading: loading ?? false,
        loadingProgress: loadingProgress ?? {},
        error: error || ""
      },
      moveAppDialog: {
        isMoveAppDialogOpen: false,
        appInfoArray: [],
        isMovingApp: false
      }
    }
  });
};

describe("<AppLibrary />", () => {
  const getBoundingClientRect = window.Element.prototype.getBoundingClientRect;

  jest.mock("@/context", () => ({
    ...jest.requireActual("@/context"),
    useAppLibraryContext: jest.fn().mockReturnValue(MOCK_LIBRARY_TABLE_DATA),
    AppLibraryContextProvider: ({ children }: any) => children,
    LoadingSpinnerContextProvider: ({ children }: any) => children,
    useLoadingSpinner: jest.fn(() => {
      return {
        isLoadingSpinnerActive: false,
        showLoadingSpinner: jest.fn(),
        hideLoadingSpinner: jest.fn()
      };
    })
  }));

  beforeEach(() => {
    window.Element.prototype.getBoundingClientRect = jest
      .fn()
      .mockReturnValue({ height: 1000, width: 1000 });
  });

  afterEach(() => {
    window.Element.prototype.getBoundingClientRect = getBoundingClientRect;
  });

  it("loading state snapshot", () => {
    const { asFragment, findByTestId } = renderWithAppLibraryContext(
      <AppLibrary />,
      undefined,
      getMockStore({ loading: true, loadingProgress: { steam: 30, gog: 56 } })
    );
    const loadingText = findByTestId("loading-text");
    expect(loadingText).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it("error state snapshot", () => {
    const { asFragment, findByTestId } = renderWithAppLibraryContext(
      <AppLibrary />,
      undefined,
      getMockStore({ error: "Something went wrong" })
    );
    const errorText = findByTestId("error-text");
    expect(errorText).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  // TODO - fix tests
  it("loaded state snapshot", () => {
    const { asFragment } = renderWithAppLibraryContext(
      <AppLibrary />,
      undefined,
      getMockStore()
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders app data correctly", () => {
    const { getByText } = renderWithAppLibraryContext(
      <AppLibrary />,
      undefined,
      getMockStore()
    );

    expect(getByText(TABLE_MOCK_DATA[0].app.name)).toBeTruthy();
    expect(getByText(TABLE_MOCK_DATA[1].app.name)).toBeTruthy();
  });
});
