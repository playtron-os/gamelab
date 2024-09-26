import { act, waitFor } from "@testing-library/react";
import { renderHookWithAppLibraryContext } from "@/utils";
import { useAppMove } from "./use-app-move";
import { UsePlayservReturn } from "@/hooks";
import { AppInformation, MessageType, PlayserveResponse } from "@/types";
import { DriveInfo } from "@/types/drive";
import { closeMoveAppDialog, setMovingApp } from "@/redux/modules";
import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";

const APP_MOVE_MOCK_RESPONSE_OK: PlayserveResponse<MessageType.AppMove> = {
  body: {
    app_id: "mockAppId",
    user_id: "mockUserId"
  },
  id: 1,
  message_type: MessageType.AppMove,
  status: 200
};

const APP_MOVE_MOCK_RESPONSE_FAIL: PlayserveResponse<MessageType.AppMove> = {
  body: {
    error_code: 1,
    message: "Failed to move",
    data: null
  },
  id: 2,
  message_type: MessageType.AppMove,
  status: 400
};

const sendMessageMockOk = jest
  .fn()
  .mockReturnValue(() => Promise.resolve(APP_MOVE_MOCK_RESPONSE_OK));
const sendMessageMockFail = jest
  .fn()
  .mockReturnValue(() => Promise.resolve(APP_MOVE_MOCK_RESPONSE_FAIL));
const mockDispatch = jest.fn();

const mockPlayserveOk: UsePlayservReturn = {
  sendMessage: sendMessageMockOk,
  // @ts-expect-error We don't use websocket in those tests
  websocket: null
};

const mockPlayserveFail: UsePlayservReturn = {
  sendMessage: sendMessageMockFail,
  // @ts-expect-error We don't use websocket in those tests
  websocket: null
};

jest.mock("@/redux/store", () => ({
  ...jest.requireActual("@/redux/store"),
  useAppDispatch: () => mockDispatch
}));

const MOCK_APP_DATA: AppInformation = STEAM_APP_INFORMATION_MOCKS[0];

const MOCK_DRIVE_INFO: DriveInfo = {
  name: "/test/drive/",
  path: "run/test/drive/",
  available_space: 100,
  max_size: 100
};

jest.mock("@/context", () => ({
  ...jest.requireActual("@/context"),
  useAppLibraryContext: jest.fn(),
  AppLibraryContextProvider: ({ children }: any) => children
}));

describe("useAppMove", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send a move app message and handle success", async () => {
    const { result } = renderHookWithAppLibraryContext(() =>
      useAppMove(mockPlayserveOk)
    );

    act(() => {
      result.current.moveApps([MOCK_APP_DATA], MOCK_DRIVE_INFO);
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setMovingApp(true));
      expect(mockDispatch).toHaveBeenCalledWith(closeMoveAppDialog());
    });
  });

  it("should send a move app message and handle failure", async () => {
    const { result } = renderHookWithAppLibraryContext(() =>
      useAppMove(mockPlayserveFail)
    );

    act(() => {
      result.current.moveApps([MOCK_APP_DATA], MOCK_DRIVE_INFO);
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setMovingApp(true));
      expect(mockDispatch).toHaveBeenCalledWith(closeMoveAppDialog());
    });
  });
});
