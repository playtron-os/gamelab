import React from "react";
import { ControllerComponentProps } from "@/types/input-config";
import MouseImage from "@/assets/Devices/mouse Top.png";
import { InputButton } from "./input-button";
import { ControllerInputs } from "@/constants/physical-layouts";

export const Mouse: React.FC<ControllerComponentProps> = ({
  mappedKey,
  onSelectKey
}) => {
  return (
    <div className="text-center">
      <div className="flex w-fit m-auto">
        <div className="w-[148px] mt-3">
          <InputButton
            input={ControllerInputs.MouseClickLeft}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            className="mb-6"
          />
          <InputButton
            input={ControllerInputs.MouseClickExtra1}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
          />
          <InputButton
            input={ControllerInputs.MouseClickExtra2}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            className="mb-20"
          />
          <InputButton
            input={ControllerInputs.MouseMove}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
          />
        </div>
        <div className="ms-24 me-24">
          <img src={MouseImage} />
        </div>

        <div className="w-[148px] mt-3">
          <InputButton
            input={ControllerInputs.MouseClickRight}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
            className="mb-20"
          />
          <InputButton
            input={ControllerInputs.MouseClickMiddle}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
          />
          <InputButton
            input={ControllerInputs.MouseWheelUp}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
          />
          <InputButton
            input={ControllerInputs.MouseWheelDown}
            onSelectKey={onSelectKey}
            mappedKey={mappedKey}
          />
        </div>
      </div>
    </div>
  );
};
