import { usePlayserve } from "@/hooks";
import { getMessage, MessageType } from "@/types";
import { LaunchParams } from "@/types/launch";
import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export const useAppLaunch = () => {
  const { sendMessage } = usePlayserve();

  const launchApp = useCallback(
    async (ownedAppId: string, params?: LaunchParams) => {
      if (!params) {
        console.error("No launch params provided");
        return;
      }
      await invoke("app_log_init", {
        appId: ownedAppId
      });
      await sendMessage(
        getMessage(MessageType.AppLaunch, {
          owned_app_id: ownedAppId,
          bypass_app_update: params.bypassAppUpdate,
          reset_wine_prefix: params.resetWinePrefix,
          enhanced_debugging: params.enhancedDebugging,
          launch_config_id: params.launchConfigId,
          input_config_id: params.inputConfigId
        })
      )();
    },
    [sendMessage]
  );

  return { launchApp };
};
