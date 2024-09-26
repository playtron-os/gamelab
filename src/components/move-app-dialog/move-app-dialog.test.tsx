import React from "react";
import { authSlice, moveAppDialogSlice } from "@/redux/modules";
import { renderWithProviders } from "@/utils";
import { MoveAppDialog } from "./move-app-dialog";
import { useDriveInfo } from "../../hooks/use-drive-info";
import { DriveInfo } from "@/types";
import { configureStore } from "@reduxjs/toolkit";
import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";
import { DEFAULT_STATE_MOCK } from "@/mocks/default-state";

const MOCK_DRIVES = [
  {
    name: "/test/drive1",
    path: "/test/path1",
    available_space: 1000,
    max_size: 1000
  },
  {
    name: "/test/drive2",
    path: "/test/path2",
    available_space: 1000,
    max_size: 1000
  }
] as DriveInfo[];

// Mock hooks and redux functionalities
jest.mock("@/hooks/use-drive-info", () => ({
  useDriveInfo: jest.fn().mockReturnValue({ drives: [] })
}));

const MOVE_APP_MOCK_FN = jest.fn();
jest.mock("./hooks/use-app-move", () => ({
  useAppMove: jest.fn(() => ({ moveApp: MOVE_APP_MOCK_FN }))
}));

const getMockStore = (open = false, moving = false) => {
  return configureStore({
    reducer: {
      moveAppDialog: moveAppDialogSlice.reducer,
      auth: authSlice.reducer
    },
    preloadedState: {
      ...DEFAULT_STATE_MOCK,
      moveAppDialog: {
        isMoveAppDialogOpen: open,
        appInfoArray: [STEAM_APP_INFORMATION_MOCKS[0]],
        isMovingApp: moving
      }
    }
  });
};

describe("MoveAppDialog Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders MoveAppDialog component and matches null snapshot", () => {
    const { container, asFragment } = renderWithProviders(
      <MoveAppDialog />,
      undefined,
      getMockStore()
    );

    expect(container).toBeEmptyDOMElement();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders MoveAppDialog component and matches snapshot", () => {
    (useDriveInfo as jest.Mock).mockReturnValue({
      drives: MOCK_DRIVES
    });
    const { container, asFragment } = renderWithProviders(
      <MoveAppDialog />,
      undefined,
      getMockStore(true, false)
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders MoveAppDialog modal content", () => {
    (useDriveInfo as jest.Mock).mockReturnValue({
      drives: MOCK_DRIVES
    });
    const { getByTestId } = renderWithProviders(
      <MoveAppDialog />,
      undefined,
      getMockStore(true, false)
    );

    expect(getByTestId("move-app-dialog-modal-content")).toBeInTheDocument();
  });

  it("shows move progress indicator", () => {
    (useDriveInfo as jest.Mock).mockReturnValue({
      drives: MOCK_DRIVES
    });
    const { getByTestId } = renderWithProviders(
      <MoveAppDialog />,
      undefined,
      getMockStore(true, true)
    );
    expect(getByTestId("move-in-progress-text")).toBeInTheDocument();
  });
});
