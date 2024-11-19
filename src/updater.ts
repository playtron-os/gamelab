import { invoke } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";

export async function checkForAppUpdates() {
  let update = null;
  try {
    update = await check();
  } catch (e) {
    console.error(e);
  }

  if (update === null) {
    console.log("No updates available");
  } else if (update?.available) {
    const yes = await ask(`Update to ${update.version} is available!`, {
      title: "Update Available",
      kind: "info",
      okLabel: "Update",
      cancelLabel: "Cancel"
    });
    if (yes) {
      await update.downloadAndInstall();
      await invoke("graceful_restart");
    }
  }
}
