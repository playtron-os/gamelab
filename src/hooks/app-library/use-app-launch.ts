import { usePlayserve } from "@/hooks";
import { AppInformation, getMessage, MessageType } from "@/types";
import { LaunchParams } from "@/types/launch";
import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export const useAppLaunch = () => {
  const { sendMessage } = usePlayserve();

  const launchApp = useCallback(
    async (appInfo: AppInformation, params?: LaunchParams) => {
      if (!appInfo.installed_app || !params) {
        return;
      }
      await invoke("app_log_init", {
        appId: appInfo.installed_app.owned_app.id
      });
      await sendMessage(
        getMessage(MessageType.AppLaunch, {
          owned_app_id: appInfo.installed_app.owned_app.id,
          bypass_app_update: params.bypassAppUpdate,
          reset_wine_prefix: params.resetWinePrefix,
          launch_config_id: params.launchConfigId,
          input_config_id: params.inputConfigId,
          enhanced_debugging: params.enhancedDebugging
        })
      )();
    },
    [sendMessage]
  );

  return { launchApp };
};
