import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

export interface ProviderSelectionDialogState {
  isProviderSelectionDialogOpen: boolean;
}

const INITIAL_STATE: ProviderSelectionDialogState = {
  isProviderSelectionDialogOpen: false
};

export const providerSelectionDialogSlice = createSlice({
  name: "providerSelectionDialog",
  initialState: INITIAL_STATE,
  reducers: {
    openProviderSelectionDialog: (state) => {
      console.log("openProviderSelectionDialog");
      state.isProviderSelectionDialogOpen = true;
    },
    closeProviderSelectionDialog: () => {
      return INITIAL_STATE;
    }
  }
});

export const { openProviderSelectionDialog, closeProviderSelectionDialog } =
  providerSelectionDialogSlice.actions;
export const selectProviderSelectionDialogState = (state: RootState) =>
  state.providerSelectionDialog;
export default providerSelectionDialogSlice.reducer;
