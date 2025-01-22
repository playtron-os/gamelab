import React, { SetStateAction } from "react";
import { screen, fireEvent } from "@testing-library/react";
import { BulkActionsMenu } from "./bulk-actions-menu";
import { renderWithAppLibraryContext } from "@/utils";
import { configureStore } from "@reduxjs/toolkit";
import { appLibrarySlice, authSlice, openMoveAppDialog } from "@/redux/modules";
import { APP_LIBRARY_INITIAL_STATE as APP_LIBRARY_INITIAL_STATE } from "@/redux/modules/app-library";
import { useBoolean } from "ahooks";
import { AppLibraryContextProps, useAppLibraryContext } from "@/context";
import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";
import { DEFAULT_STATE_MOCK } from "@/mocks/default-state";

const mockOnClose = jest.fn();
const mockOnUninstallSelected = jest.fn();
const mockDispatch = jest.fn();

jest.mock("@/redux/store", () => ({
  ...jest.requireActual("@/redux/store"),
  useAppDispatch: () => mockDispatch
}));

const selectedApps = new Set([
  STEAM_APP_INFORMATION_MOCKS[0].app.id,
  STEAM_APP_INFORMATION_MOCKS[1].app.id
]);
const getMockBooleanState = (open = false) =>
  [
    open,
    {
      setTrue: jest.fn(),
      setFalse: mockOnClose,
      set: jest.fn(),
      toggle: jest.fn()
    }
  ] as ReturnType<typeof useBoolean>;

const MOCK_LIBRARY_TABLE: AppLibraryContextProps = {
  handlers: {
    refetchAllApps: jest.fn(),
    downloadApp: jest.fn(),
    uninstallApp: mockOnUninstallSelected,
    pauseDownload: jest.fn(),
    cancelDownload: jest.fn(),
    handleAppDefaultAction: jest.fn(),
    openMoveAppDialog: jest.fn()
  },
  bulkActionsMenuStateManager: getMockBooleanState(true),
  selectedApps,
  setSelectedApps: function (_value: SetStateAction<Set<string>>): void {
    throw new Error("Function not implemented.");
  },
  selectedIds: [],
  onSelectedIdChange: function (_selectedId: string): void {
    throw new Error("Function not implemented.");
  },
  eula: null,
  isEulaOpen: false,
  setIsEulaOpen: jest.fn(),
  acceptEula: jest.fn(),
  rejectEula: jest.fn()
};

const apps = [STEAM_APP_INFORMATION_MOCKS[0], STEAM_APP_INFORMATION_MOCKS[1]];

const getMockStore = () => {
  return configureStore({
    reducer: {
      appLibrary: appLibrarySlice.reducer,
      auth: authSlice.reducer
    },
    preloadedState: {
      ...DEFAULT_STATE_MOCK,
      appLibrary: {
        ...APP_LIBRARY_INITIAL_STATE,
        apps
      }
    }
  });
};

jest.mock("@/context", () => ({
  ...jest.requireActual("@/context"),
  useAppLibraryContext: jest.fn(),
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

describe("BulkActionsMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderWithAppLibraryContexts correctly when isOpen is true", () => {
    (useAppLibraryContext as jest.Mock).mockReturnValue(MOCK_LIBRARY_TABLE);
    const { getByTestId } = renderWithAppLibraryContext(
      <BulkActionsMenu />,
      undefined,
      getMockStore()
    );

    expect(screen.getByText("Manage Selected")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Uninstall")).toBeInTheDocument();
    expect(getByTestId("bulk-move-action")).toBeInTheDocument();
  });

  it("does not renderWithAppLibraryContext when isOpen is false", () => {
    (useAppLibraryContext as jest.Mock).mockReturnValue(MOCK_LIBRARY_TABLE);
    const { container } = renderWithAppLibraryContext(
      <BulkActionsMenu />,
      undefined,
      getMockStore()
    );

    expect(container.firstChild).toBeNull();
  });

  it("calls onClose callback when Modal is closed", () => {
    (useAppLibraryContext as jest.Mock).mockReturnValue(MOCK_LIBRARY_TABLE);
    renderWithAppLibraryContext(<BulkActionsMenu />, undefined, getMockStore());

    fireEvent.click(screen.getByTestId("close-modal"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onUninstallSelected callback with selectedApps when Uninstall button is clicked", () => {
    (useAppLibraryContext as jest.Mock).mockReturnValue(MOCK_LIBRARY_TABLE);

    renderWithAppLibraryContext(<BulkActionsMenu />, undefined, getMockStore());

    fireEvent.click(screen.getByTestId("bulk-uninstall"));
    expect(mockOnUninstallSelected).toHaveBeenCalledTimes(1);
    expect(mockOnUninstallSelected).toHaveBeenCalledWith(apps);
  });

  it("calls dispatch with openMoveAppDialog action", () => {
    (useAppLibraryContext as jest.Mock).mockReturnValue(MOCK_LIBRARY_TABLE);

    renderWithAppLibraryContext(<BulkActionsMenu />, undefined, getMockStore());

    fireEvent.click(screen.getByTestId("bulk-move-action"));
    expect(mockDispatch).toHaveBeenCalledWith(
      openMoveAppDialog({ appInfoArray: apps })
    );
  });
});
