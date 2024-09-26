import { waitFor } from "@testing-library/react";
import { renderHookWithContext } from "@/utils";
import { useProviderAccounts } from "./use-provider-accounts";
import { usePlayserve } from "@/hooks";
import {
  setProviderConnectedState,
  setProviderDisconnectedState
} from "@/redux/modules";
import { AppProvider } from "@/types";

const sendMessageStatusMockOk = jest.fn().mockReturnValue(() =>
  Promise.resolve({
    status: 200,
    body: {
      authorized: true,
      account: true
    }
  })
);

const sendMessageStatusUnauthorized = jest.fn().mockReturnValue(() =>
  Promise.resolve({
    status: 401,
    body: {
      authorized: false,
      account: false
    }
  })
);

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  usePlayserve: jest.fn()
}));

const mockDispatch = jest.fn();

jest.mock("@/redux/store", () => ({
  ...jest.requireActual("@/redux/store"),
  useAppDispatch: () => mockDispatch
}));

describe("useProviderAccounts", () => {
  it("should load and set provider accounts statuses to connected", () => {
    (usePlayserve as jest.Mock).mockReturnValue({
      sendMessage: sendMessageStatusMockOk
    });
    renderHookWithContext(() => useProviderAccounts());

    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(
        setProviderConnectedState(AppProvider.Steam)
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        setProviderConnectedState(AppProvider.EpicGames)
      );
    });
  });

  it("should load and set provider accounts statuses to disconnected", () => {
    (usePlayserve as jest.Mock).mockReturnValue({
      sendMessage: sendMessageStatusUnauthorized
    });
    renderHookWithContext(() => useProviderAccounts());

    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(
        setProviderDisconnectedState(AppProvider.Steam)
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        setProviderDisconnectedState(AppProvider.EpicGames)
      );
    });
  });
});
