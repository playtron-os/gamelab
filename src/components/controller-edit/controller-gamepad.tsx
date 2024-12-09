import React from "react";
import { GamepadControllerProps } from "@/types/input-config";
import { Trans } from "@lingui/macro";
import PS5Front from "@/assets/Devices/PS5 Front.svg";
import PS5Top from "@/assets/Devices/PS5 Top.svg";

import XboxFront from "@/assets/Devices/Xbox Front.svg";
import XboxTop from "@/assets/Devices/Xbox Top.svg";

import { InputButton } from "./input-button";

import { ControllerInputs } from "@/constants/physical-layouts";

export const Gamepad: React.FC<GamepadControllerProps> = ({
  mappedKey,
  onSelectKey,
  targetLayout
}) => {
  let frontImage, topImage;
  if (targetLayout === "ps5") {
    frontImage = PS5Front;
    topImage = PS5Top;
  } else {
    frontImage = XboxFront;
    topImage = XboxTop;
  }
  return (
    <div className="text-center">
      <div className="flex w-fit m-auto">
        <div className="w-[148px]">
          <InputButton
            input={ControllerInputs.Select}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            className="mb-4"
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.DPadUp}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.DPadDown}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.DPadLeft}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.DPadRight}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
            className="mb-8"
          />
          <InputButton
            input={ControllerInputs.LeftStickButton}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.LeftStick}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
            className="mb-8"
          />
          <InputButton
            input={ControllerInputs.LeftTrigger}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.LeftBumper}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
        </div>
        <div className="ms-24 me-24">
          <div className="py-2 font-bold">
            <Trans>Front</Trans>
          </div>
          <img src={frontImage} width="343px" />
          <div className="py-2 font-bold">
            <Trans>Top</Trans>
          </div>
          <img src={topImage} width="343px" />
        </div>

        <div className="w-[148px]">
          <InputButton
            input={ControllerInputs.Start}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            className="mb-4"
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.South}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.East}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.North}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.West}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
            className="mb-8"
          />
          <InputButton
            input={ControllerInputs.RightStickButton}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
          />
          <InputButton
            input={ControllerInputs.RightStick}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            layout={targetLayout}
            className="mb-8"
          />
          <InputButton
            input={ControllerInputs.RightTrigger}
            onSelectKey={onSelectKey}
            layout={targetLayout}
            mappedKey={mappedKey}
          />
          <InputButton
            input={ControllerInputs.RightBumper}
            onSelectKey={onSelectKey}
            layout={targetLayout}
            mappedKey={mappedKey}
          />
        </div>
      </div>
    </div>
  );
};
