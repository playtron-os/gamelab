jest.mock("@lingui/macro", () => {
  const originalMacroExports = jest.requireActual("@lingui/macro");
  return {
    ...originalMacroExports,
    t: (strings: TemplateStringsArray): string => strings[0],
    Trans: ({ children }: { children: string }) => children
  };
});

jest.mock("@tauri-apps/api", () => ({
  ...jest.requireActual("@tauri-apps/api"),
  invoke: jest.fn()
}));

jest.mock("@tauri-apps/plugin-log", () => ({
  ...jest.requireActual("@tauri-apps/plugin-log"),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));
