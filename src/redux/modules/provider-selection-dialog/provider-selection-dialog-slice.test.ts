import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";
import providerSelectionDialog, {
  closeProviderSelectionDialog,
  openProviderSelectionDialog
} from "./provider-selection-dialog-slice";
import { AppInformation } from "@/types";

const MOCKED_APP_DATA: AppInformation[] = [STEAM_APP_INFORMATION_MOCKS[0]];

describe("providerSelectionDialogSlice", () => {
  it("should handle initial state", () => {
    const result = providerSelectionDialog(undefined, { type: "" });
    expect(result).toEqual({
      isProviderSelectionDialogOpen: false
    });
  });

  // Reducers Test
  it("should handle openProviderSelectionDialog", () => {
    const previousState = {
      isProviderSelectionDialogOpen: false
    };
    const result = providerSelectionDialog(
      previousState,
      openProviderSelectionDialog()
    );
    expect(result).toEqual({
      isProviderSelectionDialogOpen: true
    });
  });

  it("should handle closeProviderSelectionDialog", () => {
    const previousState = {
      isProviderSelectionDialogOpen: true
    };
    const result = providerSelectionDialog(
      previousState,
      closeProviderSelectionDialog()
    );
    expect(result).toEqual({
      isProviderSelectionDialogOpen: false
    });
  });
});
