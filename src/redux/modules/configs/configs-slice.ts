import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConfigsState {
  selectedLaunchConfigs: { [appId: string]: string };
  selectedInputConfigs: { [appId: string]: string };
}

export const CONFIGS_INITIAL_STATE: ConfigsState = {
  selectedLaunchConfigs: {},
  selectedInputConfigs: {}
};

export const configsSlice = createSlice({
  name: "configs",
  initialState: CONFIGS_INITIAL_STATE,
  reducers: {
    setSelectedLaunchConfig(
      state,
      action: PayloadAction<{ appId: string; launchConfigId: string }>
    ) {
      state.selectedLaunchConfigs[action.payload.appId] =
        action.payload.launchConfigId;
    },
    setSelectedInputConfig(
      state,
      action: PayloadAction<{ appId: string; inputConfigId: string }>
    ) {
      state.selectedInputConfigs[action.payload.appId] =
        action.payload.inputConfigId;
    },
    unsetSelectedLaunchConfig(state, action: PayloadAction<{ appId: string }>) {
      delete state.selectedLaunchConfigs[action.payload.appId];
    },
    unsetSelectedInputConfig(state, action: PayloadAction<{ appId: string }>) {
      delete state.selectedInputConfigs[action.payload.appId];
    }
  }
});

export const { setSelectedLaunchConfig, setSelectedInputConfig } =
  configsSlice.actions;
export const selectConfigsState = (state: { configs: ConfigsState }) =>
  state.configs;

export default configsSlice.reducer;
