import { getKeyLabel, getInputLabel, mappingCmp } from "./controllers";

describe("Test controller utilities", () => {
  test("Get key label", () => {
    expect(getKeyLabel("KeySpace")).toBe("Space");
    expect(getKeyLabel("KeyKp0")).toBe("0");
    expect(getKeyLabel("")).toBe("Unset");
    expect(getKeyLabel(null)).toBe("Unset");
  });
  test("Get input device label", () => {
    expect(getInputLabel({ mouse: { button: "Left" } })).toBe("Left");
    expect(getInputLabel({ keyboard: "KeyA" })).toBe("A");
  });
  test("Compare mappings", () => {
    expect(
      mappingCmp({ mouse: { button: "Left" } }, { keyboard: "KeyA" })
    ).toBe(false);
    expect(
      mappingCmp(
        { gamepad: { button: "West" } },
        { gamepad: { button: "West" } }
      )
    ).toBe(true);
    expect(
      mappingCmp(
        { gamepad: { axis: { name: "RightStick" } } },
        { gamepad: { axis: { name: "RightStick" } } }
      )
    ).toBe(true);
    expect(
      mappingCmp(
        { gamepad: { axis: { name: "RightStick", direction: "Down" } } },
        { gamepad: { axis: { name: "RightStick" } } }
      )
    ).toBe(false);
    expect(
      mappingCmp(
        { gamepad: { axis: { name: "RightStick", direction: "Down" } } },
        { gamepad: { axis: { name: "RightStick", direction: "Up" } } }
      )
    ).toBe(false);
    expect(
      mappingCmp(
        { gamepad: { axis: { name: "RightStick", direction: "Up" } } },
        { gamepad: { axis: { name: "RightStick", direction: "Up" } } }
      )
    ).toBe(true);
    expect(
      mappingCmp(
        { gamepad: { axis: { name: "LeftStick", direction: "Up" } } },
        { gamepad: { axis: { name: "RightStick", direction: "Up" } } }
      )
    ).toBe(false);
  });
});
