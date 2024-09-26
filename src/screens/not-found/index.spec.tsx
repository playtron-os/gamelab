import React from "react";
import { NotFoundScreen } from ".";
import { renderWithProviders } from "@/utils";
import { useRouteError } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteError: jest.fn(() => ({
    statusText: "Not Found"
  }))
}));

it("logout screen - renders status correctly", () => {
  const tree = renderWithProviders(<NotFoundScreen />);
  expect(tree).toMatchSnapshot();
});

it("logout screen - renders message correctly", () => {
  (useRouteError as jest.Mock).mockReturnValueOnce({
    message: "Not Found"
  });
  const tree = renderWithProviders(<NotFoundScreen />);
  expect(tree).toMatchSnapshot();
});
