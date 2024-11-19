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

export const EULA_NOT_ACCEPTED = "EULA_NOT_ACCEPTED";
export const DEFAULT_WEBSOCKET_PORT = 8080;
