import { waitFor } from "@testing-library/react";
import { renderHookWithContext } from "@/utils";
import { useDriveInfo } from "@/hooks/use-drive-info";
import { UsePlayserveReturn } from "@/hooks";
import { MessageType, PlayserveResponse } from "@/types";

const DRIVE_INFO_MOCK_RESPONSE: PlayserveResponse<MessageType.DriveInfo> = {
  body: [
    {
      name: "mockDriveName",
      path: "mockDrivePath",
      available_space: 100,
      max_size: 100
    }
  ],
  id: 1,
  message_type: MessageType.DriveInfo,
  status: 200
};

const sendMessageMockOk = jest
  .fn()
  .mockReturnValue(() => Promise.resolve(DRIVE_INFO_MOCK_RESPONSE));
const mockPlayserve: UsePlayserveReturn = {
  sendMessage: sendMessageMockOk,
  // @ts-expect-error For mock purposes we can have null here
  websocket: null
};

describe("useDriveInfo", () => {
  it("should render hook", () => {
    const { result } = renderHookWithContext(() => useDriveInfo(mockPlayserve));
    expect(result.current).toBeDefined();
  });

  it("should load drive info on mount", async () => {
    const { result } = renderHookWithContext(() => useDriveInfo(mockPlayserve));
    await waitFor(() => expect(result.current.drives).toHaveLength(1));
  });
});
