import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";
import moveAppDialog, {
  closeMoveAppDialog,
  openMoveAppDialog,
  setMovingApp
} from "./move-app-dialog-slice";
import { AppInformation } from "@/types";

const MOCKED_APP_DATA: AppInformation[] = [STEAM_APP_INFORMATION_MOCKS[0]];

describe("moveAppDialogSlice", () => {
  it("should handle initial state", () => {
    const result = moveAppDialog(undefined, { type: "" });
    expect(result).toEqual({
      isMoveAppDialogOpen: false,
      appInfoArray: [],
      isMovingApp: false
    });
  });

  // Reducers Test
  it("should handle openMoveAppDialog", () => {
    const previousState = {
      isMoveAppDialogOpen: false,
      appInfoArray: [] as AppInformation[],
      isMovingApp: false
    };
    const result = moveAppDialog(
      previousState,
      openMoveAppDialog({ appInfoArray: MOCKED_APP_DATA })
    );
    expect(result).toEqual({
      isMoveAppDialogOpen: true,
      appInfoArray: MOCKED_APP_DATA,
      isMovingApp: false
    });
  });

  it("should handle closeMoveAppDialog", () => {
    const previousState = {
      isMoveAppDialogOpen: true,
      appInfoArray: MOCKED_APP_DATA,
      isMovingApp: true
    };
    const result = moveAppDialog(previousState, closeMoveAppDialog());
    expect(result).toEqual({
      isMoveAppDialogOpen: false,
      appInfoArray: [],
      isMovingApp: false
    });
  });

  it("should handle setMovingApp", () => {
    const previousState = {
      isMoveAppDialogOpen: true,
      appInfoArray: MOCKED_APP_DATA,
      isMovingApp: true
    };
    const result = moveAppDialog(previousState, setMovingApp(true));
    expect(result).toEqual({
      isMoveAppDialogOpen: true,
      appInfoArray: MOCKED_APP_DATA,
      isMovingApp: true
    });
  });
});
