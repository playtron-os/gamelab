import React from "react";
import { LibraryScreen } from ".";
import { SubmissionsContextProvider } from "@/context/submissions-context";
import { renderWithAppLibraryContext } from "@/utils";

it("screen - renders correctly", () => {
  const { asFragment } = renderWithAppLibraryContext(
    <SubmissionsContextProvider>
      <LibraryScreen />
    </SubmissionsContextProvider>
  );

  expect(asFragment).toMatchSnapshot();
});
