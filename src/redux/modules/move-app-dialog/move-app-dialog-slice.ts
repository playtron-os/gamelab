import { RootState } from "@/redux/store";
import { AppInformation } from "@/types/app-library";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MoveAppDialogState {
  isMoveAppDialogOpen: boolean;
  appInfoArray: AppInformation[];
  isMovingApp: boolean;
}

const INITIAL_STATE: MoveAppDialogState = {
  isMoveAppDialogOpen: false,
  appInfoArray: [],
  isMovingApp: false
};

export const moveAppDialogSlice = createSlice({
  name: "moveAppDialog",
  initialState: INITIAL_STATE,
  reducers: {
    openMoveAppDialog: (
      state,
      action: PayloadAction<{
        appInfoArray: AppInformation[];
      }>
    ) => {
      state.appInfoArray = action.payload.appInfoArray;
      state.isMoveAppDialogOpen = true;
      state.isMovingApp = false;
    },
    closeMoveAppDialog: () => {
      return INITIAL_STATE;
    },
    setMovingApp: (state, action: PayloadAction<boolean>) => {
      state.isMovingApp = action.payload;
    }
  }
});

export const { openMoveAppDialog, closeMoveAppDialog, setMovingApp } =
  moveAppDialogSlice.actions;
export const selectMoveAppDialogState = (state: RootState) =>
  state.moveAppDialog;
export default moveAppDialogSlice.reducer;
