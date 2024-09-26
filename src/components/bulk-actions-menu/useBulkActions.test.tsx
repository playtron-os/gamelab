import { act } from "@testing-library/react";
import { useBulkActions } from "./useBulkActions";
import { renderHookWithAppLibraryContext } from "../../utils/test-utils";
import { BulkActionsProps, AppInformation } from "@/types";
import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";

const mockData: BulkActionsProps = {
  selectedApps: new Set<string>(),
  data: [STEAM_APP_INFORMATION_MOCKS[0], STEAM_APP_INFORMATION_MOCKS[1]],
  downloadApp: jest.fn(),
  uninstallApp: function (_apps: AppInformation[]): void {
    throw new Error("Function not implemented.");
  }
};

describe("useBulkActions", () => {
  it("starts with isBulkActionsOpen as false", () => {
    const { result } = renderHookWithAppLibraryContext(() =>
      useBulkActions(mockData)
    );
    expect(result.current.isBulkActionsOpen).toBe(false);
  });

  it("sets isBulkActionsOpen to true when openBulkActionsMenu is called", () => {
    const { result } = renderHookWithAppLibraryContext(() =>
      useBulkActions(mockData)
    );
    act(() => {
      result.current.openBulkActionsMenu();
    });
    expect(result.current.isBulkActionsOpen).toBe(true);
  });

  it("sets isBulkActionsOpen to false when closeBulkActionsMenu is called", () => {
    const { result } = renderHookWithAppLibraryContext(() =>
      useBulkActions(mockData)
    );
    act(() => {
      result.current.openBulkActionsMenu();
    });
    act(() => {
      result.current.closeBulkActionsMenu();
    });
    expect(result.current.isBulkActionsOpen).toBe(false);
  });

  it("calls onDownloadSelected and closes the menu when handleDownloadSelectedApps is called", () => {
    const onDownloadSelectedMock = jest.fn();
    const selectedIds = new Set([
      STEAM_APP_INFORMATION_MOCKS[0].app.id,
      STEAM_APP_INFORMATION_MOCKS[1].app.id
    ]);
    const { result } = renderHookWithAppLibraryContext(() =>
      useBulkActions({ ...mockData, downloadApp: onDownloadSelectedMock })
    );

    act(() => {
      result.current.openBulkActionsMenu();
    });
    act(() => {
      result.current.handleDownloadSelectedApps(selectedIds);
    });

    expect(onDownloadSelectedMock).toHaveBeenCalledTimes(selectedIds.size);
    expect(result.current.isBulkActionsOpen).toBe(false);
  });
});
