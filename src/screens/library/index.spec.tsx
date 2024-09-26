import React from "react";
import { LibraryScreen } from ".";
import { renderWithAppLibraryContext } from "@/utils";

it("screen - renders correctly", () => {
  const { asFragment } = renderWithAppLibraryContext(<LibraryScreen />);

  expect(asFragment).toMatchSnapshot();
});
