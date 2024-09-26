import React from "react";
import { ConfigOverrideChip } from ".";
import { render } from "@testing-library/react";

it("ConfigOverrideChip - renders correctly", () => {
  const { container, asFragment } = render(
    <ConfigOverrideChip label="Test" selected={false} />
  );

  expect(container).not.toBeEmptyDOMElement();
  expect(asFragment()).toMatchSnapshot();
});
