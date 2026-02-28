import React from "react";
import { LibraryScreen } from ".";
import { SubmissionsContextProvider } from "@/context/submissions-context";
import { renderWithAppLibraryContext } from "@/utils";

jest.mock("@/context", () => ({
  ...jest.requireActual("@/context"),
  useAutotestContext: jest.fn().mockReturnValue({
    state: "idle",
    results: [],
    manifest: [],
    total: 0,
    completed: 0,
    currentGameName: null,
    error: null,
    selectMode: false,
    enterSelectMode: jest.fn(),
    exitSelectMode: jest.fn(),
    getGameStatus: jest.fn().mockReturnValue(undefined),
    getGameResult: jest.fn().mockReturnValue(undefined),
    isInManifest: jest.fn().mockReturnValue(false),
    startAutotest: jest.fn(),
    checkExistingRun: jest.fn(),
    stopAutotest: jest.fn(),
    reset: jest.fn(),
    stopPolling: jest.fn()
  })
}));

it("screen - renders correctly", () => {
  const { asFragment } = renderWithAppLibraryContext(
    <SubmissionsContextProvider>
      <LibraryScreen />
    </SubmissionsContextProvider>
  );

  expect(asFragment).toMatchSnapshot();
});
