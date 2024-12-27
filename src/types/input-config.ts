export interface GamepadEvent {
  button?: string;
  trigger?: { name: string; deadzone?: number };
  axis?: { name: string; direction?: string; deadzone?: number };
}

export interface MouseEvent {
  button?: string;
  motion?: {
    speed_pps: number;
  };
}

export interface InputEvent {
  dbus?: string;
  gamepad?: GamepadEvent;
  keyboard?: string;
  mouse?: MouseEvent;
  touchpad?: TouchpadEvent;
  touchscreen?: TouchEvent;
}

export interface TouchpadEvent {
  name: "LeftPad" | "RightPad" | "CenterPad";
  touch: TouchEvent;
}

export interface TouchEvent {
  button?: "Touch" | "Press";
  motion?: {
    region?:
      | "left"
      | "right"
      | "top"
      | "bottom"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
    speed_pps?: number;
  };
}

export interface InputMapping {
  name: string;
  source_event: InputEvent;
  target_events: InputEvent[];
}

export interface InputPlumberMappings {
  mapping: InputMapping[];
}

export interface ControllerInput {
  label: string;
  device: "keyboard" | "gamepad" | "mouse" | "touchpad" | "touchscreen";
  mapping: string | GamepadEvent | MouseEvent | TouchpadEvent | TouchEvent;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  psIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export type ControllerSection =
  | "dpad"
  | "buttons"
  | "bumpers"
  | "sticks"
  | "triggers"
  | "paddles"
  | "trackpads"
  | "gyro";

export type ControlGroup = {
  id: ControllerSection;
  name: string;
  section: ControllerSection;
  inputs: ControllerInput[];
};

export type TargetControllerType = "default" | "xbox" | "ps5";

export interface ControllerComponentProps {
  mappedKey?: InputEvent;
  onSelectKey: (key: ControllerInput) => void;
}

export interface GamepadControllerProps extends ControllerComponentProps {
  targetLayout: TargetControllerType;
}

export interface ControllerInfo {
  capabilities: string[];
  id: string;
  intercept_mode: string;
  name: string;
  path: string;
  profile_name: string;
}

export interface InputDeviceInfoResponseBody {
  [key: string]: ControllerInfo;
}
