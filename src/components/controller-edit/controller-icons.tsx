import React from "react";
import {
  ABXYALine,
  ABXYBLine,
  ABXYXLine,
  ABXYYLine,
  L1RectangleRoundedbottomLine,
  R1RectangleRoundedtopLine,
  L2RectangleRoundedtopLine,
  R2RectangleRoundedtopLine,
  DpadDownFill,
  DpadLeftFill,
  DpadRightFill,
  DpadUpFill,
  LJoystickDownLine,
  RJoystickDownLine,
  LJoystickLine,
  RJoystickLine,
  OptionLine,
  ViewLine,
  RectangleRoundedbottomLine,
  RectangleRoundedtopLine
} from "@playtron/styleguide";

interface ControllerIconProps {
  controllerKey: string;
  color?: string;
}

enum ControllerKeys {
  A = "South",
  B = "East",
  X = "West",
  Y = "North",
  L1 = "LeftBumper",
  L2 = "LeftTrigger",
  R1 = "RightBumper",
  R2 = "RightTrigger",
  L4 = "Paddle1",
  R4 = "Paddle2",
  L5 = "Paddle3",
  R5 = "Paddle4",
  DPadUp = "DPadUp",
  DPadDown = "DPadDown",
  DPadLeft = "DPadLeft",
  DPadRight = "DPadRight",
  RightStick = "RightStick",
  RightStickButton = "RightStickButton",
  RightStickUp = "RightStick-Up",
  RightStickDown = "RightStick-Down",
  RightStickLeft = "RightStick-Left",
  RightStickRight = "RightStick-Right",
  LeftStick = "LeftStick",
  LeftStickButton = "LeftStickButton",
  LeftStickUp = "LeftStick-Up",
  LeftStickDown = "LeftStick-Down",
  LeftStickLeft = "LeftStick-Left",
  LeftStickRight = "LeftStick-Right",
  Start = "Start",
  Select = "Select"
}

export const ControllerIcon: React.FC<ControllerIconProps> = ({
  controllerKey,
  color = "#FFF"
}) => {
  switch (controllerKey) {
    case ControllerKeys.A:
      return <ABXYALine fill={color} />;
    case ControllerKeys.B:
      return <ABXYBLine fill={color} />;
    case ControllerKeys.X:
      return <ABXYXLine fill={color} />;
    case ControllerKeys.Y:
      return <ABXYYLine fill={color} />;
    case ControllerKeys.L1:
      return <L1RectangleRoundedbottomLine fill={color} />;
    case ControllerKeys.R1:
      return <R1RectangleRoundedtopLine fill={color} />;
    case ControllerKeys.L2:
      return <L2RectangleRoundedtopLine fill={color} />;
    case ControllerKeys.R2:
      return <R2RectangleRoundedtopLine fill={color} />;
    case ControllerKeys.DPadUp:
      return <DpadUpFill fill={color} />;
    case ControllerKeys.DPadDown:
      return <DpadDownFill fill={color} />;
    case ControllerKeys.DPadLeft:
      return <DpadLeftFill fill={color} />;
    case ControllerKeys.DPadRight:
      return <DpadRightFill fill={color} />;
    case ControllerKeys.LeftStick:
      return <LJoystickLine fill={color} />;
    case ControllerKeys.LeftStickButton:
      return <LJoystickDownLine fill={color} />;
    case ControllerKeys.LeftStickDown:
      return <DpadDownFill fill={color} />;
    case ControllerKeys.LeftStickLeft:
      return <DpadLeftFill fill={color} />;
    case ControllerKeys.LeftStickRight:
      return <DpadRightFill fill={color} />;
    case ControllerKeys.LeftStickUp:
      return <DpadUpFill fill={color} />;
    case ControllerKeys.RightStick:
      return <RJoystickLine fill={color} />;
    case ControllerKeys.RightStickButton:
      return <RJoystickDownLine fill={color} />;
    case ControllerKeys.RightStickDown:
      return <RJoystickLine fill={color} />;
    case ControllerKeys.RightStickLeft:
      return <RJoystickLine fill={color} />;
    case ControllerKeys.RightStickRight:
      return <RJoystickLine fill={color} />;
    case ControllerKeys.RightStickUp:
      return <RJoystickLine fill={color} />;
    case ControllerKeys.Start:
      return <OptionLine fill={color} />;
    case ControllerKeys.Select:
      return <ViewLine fill={color} />;
    case ControllerKeys.L4:
    case ControllerKeys.R4:
      return <RectangleRoundedtopLine fill={color} />;
    case ControllerKeys.L5:
    case ControllerKeys.R5:
      return <RectangleRoundedbottomLine fill={color} />;
    default:
      return <div>{controllerKey}</div>;
  }
};
