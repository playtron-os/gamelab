import { warn } from "@tauri-apps/plugin-log";

export const SUPPORTED_ARCHITECUTRES = {
  LINUX_32: "ELF 32-bit",
  LINUX_64: "ELF 64-bit",
  LINUX_32_OR_64: "ELF 64-bit.*Intel 80386",
  LINUX_86_32: "Mach-O.*i386\\|ELF 32-bit.*Intel 80386",
  MAC_32: "Mach-O.*i386",
  MAC_64: "Mach-O.*x86_64",
  MAC_32_OR_64: "Mach-O.*\\(i386\\|x86_64\\)"
};

type SupportedArchitecture = keyof typeof SUPPORTED_ARCHITECUTRES;
export type SupportedArchitectureGrepString =
  (typeof SUPPORTED_ARCHITECUTRES)[SupportedArchitecture];

export interface FileInformation {
  filePath: string;
  match: string;
}

export const DEFAULT_WEBSOCKET_IP = "127.0.0.1";
export const DEFAULT_WEBSOCKET_PORT = 8080;
/**
 * Allow customizing endpoint of the Playserve device.
 * Playserve needs to be started with:
 *
 * @returns string
 */
export function getWebsocketUrl(
  deviceIp?: string,
  port = DEFAULT_WEBSOCKET_PORT
): string {
  if (!deviceIp) {
    // In case deviceIp is not set, default to localhost
    console.warn(
      "No device IP provided, this may result in an invalid websocket URL"
    );
    warn("No device IP provided, this may result in an invalid websocket URL");
    deviceIp = DEFAULT_WEBSOCKET_IP;
  }
  const url = new URL(`ws://${deviceIp}/ws?app_type=labs`);
  if (!url.port) {
    url.port = port.toString();
  }
  return url.toString();
}
