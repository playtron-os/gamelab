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
  RectangleRoundedtopLine,
  MouseLeftClick,
  MouseRightClick,
  MouseMiddleClick,
  MouseMove,
  MouseSideBtnBack,
  MouseSideBtnFront,
  MouseMiddleScrollDown,
  MouseMiddleScrollUp,
  QuestionMark
} from "@playtron/styleguide";

import steamDeckImageFrontDpad from "@/assets/Devices/Steam Deck Front-dpad.svg";
import steamDeckImageFrontButtons from "@/assets/Devices/Steam Deck Front-faceb.svg";
import steamDeckImageFrontSticks from "@/assets/Devices/Steam Deck Front-stick.svg";
import steamDeckImageTopTrigger from "@/assets/Devices/Steam Deck Top-trigger.svg";
import steamDeckImageTopBumpers from "@/assets/Devices/Steam Deck Top-bumpper.svg";
import steamDeckImageFrontTrackpads from "@/assets/Devices/Steam Deck Front-touch.svg";
import steamDeckImageBackPaddles from "@/assets/Devices/Steam Deck Back-paddle.svg";
import steamDeckImageGyro from "@/assets/Devices/Steam Deck Gyro.svg";

import LegionGoImageFrontDpad from "@/assets/Devices/Legion Go Front-dpad.svg";
import LegionGoImageFrontButtons from "@/assets/Devices/Legion Go Front-facebt.svg";
import LegionGoImageFrontSticks from "@/assets/Devices/Legion Go Front-stick.svg";
import LegionGoImageTopTrigger from "@/assets/Devices/Legion Go Top-triggers.svg";
import LegionGoImageTopBumpers from "@/assets/Devices/Legion Go Top-bumppers.svg";
import LegionGoImageFrontTrackpads from "@/assets/Devices/Legion Go Front-touchp.svg";
import LegionGoImageBackPaddles from "@/assets/Devices/Legion Go Back-paddles.svg";
import LegionGoImageGyro from "@/assets/Devices/Legion Go Gyro.svg";

import xboxImageFrontButtons from "@/assets/Devices/Xbox Front-facebtn.svg";
import xboxImageFrontDpad from "@/assets/Devices/Xbox Front-dpad.svg";
import xboxImageFrontSticks from "@/assets/Devices/Xbox Front-stick.svg";
import xboxImageTopTriggers from "@/assets/Devices/Xbox Top-triggers.svg";
import xboxImageTopBumpers from "@/assets/Devices/Xbox Top-bumppers.svg";

import GenericImageFrontButtons from "@/assets/Devices/Generic Front-facebtn.svg";
import GenericImageFrontDpad from "@/assets/Devices/Generic Front-dpad.svg";
import GenericImageFrontSticks from "@/assets/Devices/Generic Front-stick.svg";
import GenericImageTopTriggers from "@/assets/Devices/Generic Top-triggers.svg";
import GenericImageTopBumpers from "@/assets/Devices/Generic Top-bumppers.svg";

import PS4ImageFrontDpad from "@/assets/Devices/PS4 Front-dpad.svg";
import PS4ImageFrontButtons from "@/assets/Devices/PS4 Front-facebtn.svg";
import PS4ImageFrontSticks from "@/assets/Devices/PS4 Front-stick.svg";
import PS4ImageTopTrigger from "@/assets/Devices/PS4 Top-triggers.svg";
import PS4ImageTopBumpers from "@/assets/Devices/PS4 Top-bumppers.svg";
import PS4ImageBackPaddles from "@/assets/Devices/PS4 Back-paddles.svg";
import PS4ImageTrackpad from "@/assets/Devices/PS4 Front-touchpad.svg";
import PS4ImageGyro from "@/assets/Devices/PS4 Gyro.svg";

import PS5ImageFrontDpad from "@/assets/Devices/PS5 Front-dpad.svg";
import PS5ImageFrontButtons from "@/assets/Devices/PS5 Front-facebtn.svg";
import PS5ImageFrontSticks from "@/assets/Devices/PS5 Front-stick.svg";
import PS5ImageTopTrigger from "@/assets/Devices/PS5 Top-triggers.svg";
import PS5ImageTopBumpers from "@/assets/Devices/PS5 Top-bumppers.svg";
import PS5ImageBackPaddles from "@/assets/Devices/PS5 Back-paddles.svg";
import PS5ImageTrackpad from "@/assets/Devices/PS5 Front-touchpad.svg";
import PS5ImageGyro from "@/assets/Devices/PS5 Gyro.svg";

import { ControlGroup, ControllerInput } from "@/types/input-config";

import { MouseButton } from "./input-config";

export interface PhysicalLayoutType {
  id: string;
  label: string;
  layout: ControlGroup[];
  images: {
    dpad: string;
    buttons: string;
    sticks: string;
    triggers: string;
    bumpers: string;
    paddles?: string;
    gyro?: string;
    touchpad?: string;
    trackpads?: string;
  };
}

interface ControllerInputMap {
  [key: string]: ControllerInput;
}

export const ControllerInputs: ControllerInputMap = {
  DPadUp: {
    label: "DPad Up",
    icon: DpadUpFill,
    device: "gamepad",
    mapping: { button: "DPadUp" }
  },
  DPadDown: {
    label: "DPad Down",
    icon: DpadDownFill,
    device: "gamepad",
    mapping: { button: "DPadDown" }
  },
  DPadLeft: {
    label: "DPad Left",
    icon: DpadLeftFill,
    device: "gamepad",
    mapping: { button: "DPadLeft" }
  },
  DPadRight: {
    label: "DPad Right",
    icon: DpadRightFill,
    device: "gamepad",
    mapping: { button: "DPadRight" }
  },
  South: {
    label: "South",
    icon: ABXYALine,
    device: "gamepad",
    mapping: { button: "South" }
  },
  East: {
    label: "East",
    icon: ABXYBLine,
    device: "gamepad",
    mapping: { button: "East" }
  },
  West: {
    label: "West",
    icon: ABXYXLine,
    device: "gamepad",
    mapping: { button: "West" }
  },
  North: {
    label: "North",
    icon: ABXYYLine,
    device: "gamepad",
    mapping: { button: "North" }
  },
  LeftTrigger: {
    label: "Left Trigger",
    icon: L2RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { trigger: { name: "LeftTrigger", deadzone: 0.2 } }
  },
  RightTrigger: {
    label: "Right Trigger",
    icon: R2RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { trigger: { name: "RightTrigger", deadzone: 0.2 } }
  },
  LeftBumper: {
    label: "Left Bumper",
    icon: L1RectangleRoundedbottomLine,
    device: "gamepad",
    mapping: { button: "LeftBumper" }
  },
  RightBumper: {
    label: "Right Bumper",
    icon: R1RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { button: "RightBumper" }
  },
  Start: {
    label: "Start",
    icon: ViewLine,
    device: "gamepad",
    mapping: { button: "Start" }
  },
  Select: {
    label: "Select",
    icon: OptionLine,
    device: "gamepad",
    mapping: { button: "Select" }
  },
  LeftStickButton: {
    label: "L3 Button",
    icon: LJoystickDownLine,
    device: "gamepad",
    mapping: { button: "LeftStick" }
  },
  RightStickButton: {
    label: "R3 Button",
    icon: RJoystickDownLine,
    device: "gamepad",
    mapping: { button: "RightStick" }
  },
  LeftStick: {
    label: "Left Stick",
    icon: LJoystickLine,
    device: "gamepad",
    mapping: { axis: { name: "LeftStick" } }
  },
  RightStick: {
    label: "Right Stick",
    icon: RJoystickLine,
    device: "gamepad",
    mapping: { axis: { name: "RightStick" } }
  },
  LeftPaddle1: {
    label: "Paddle 1",
    icon: RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { button: "LeftPaddle1" }
  },
  LeftPaddle2: {
    label: "Paddle 2",
    icon: RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { button: "LeftPaddle2" }
  },
  RightPaddle1: {
    label: "Paddle 3",
    icon: RectangleRoundedbottomLine,
    device: "gamepad",
    mapping: { button: "RightPaddle1" }
  },
  RightPaddle2: {
    label: "Paddle 4",
    icon: RectangleRoundedbottomLine,
    device: "gamepad",
    mapping: { button: "RightPaddle2" }
  },
  LeftTrackpad: {
    label: "Left Trackpad",
    icon: QuestionMark,
    device: "gamepad",
    mapping: { button: "LTrackpad" }
  },
  RightTrackpad: {
    label: "Right Trackpad",
    icon: QuestionMark,
    device: "gamepad",
    mapping: { button: "RTrackpad" }
  },
  // Gyro: {
  //   label: "Gyro",
  //   icon: QuestionMark,
  //   device: "gamepad",
  //   mapping: { axis: { name: "Gyro" } }
  // },
  MouseClickLeft: {
    label: "Left Click",
    icon: MouseLeftClick,
    device: "mouse",
    mapping: { button: MouseButton.Left }
  },
  MouseClickRight: {
    label: "Right Click",
    icon: MouseRightClick,
    device: "mouse",
    mapping: { button: MouseButton.Right }
  },
  MouseClickMiddle: {
    label: "Middle Click",
    icon: MouseMiddleClick,
    device: "mouse",
    mapping: { button: MouseButton.Middle }
  },
  MouseClickExtra1: {
    label: "Button 4",
    icon: MouseSideBtnFront,
    device: "mouse",
    mapping: { button: MouseButton.Extra1 }
  },
  MouseClickExtra2: {
    label: "Button 5",
    icon: MouseSideBtnBack,
    device: "mouse",
    mapping: { button: MouseButton.Extra2 }
  },
  MouseMove: {
    label: "Mouse Move",
    icon: MouseMove,
    device: "mouse",
    mapping: { axis: { name: "MouseMove" } }
  },
  MouseWheelUp: {
    label: "Scroll Up",
    icon: MouseMiddleScrollUp,
    device: "mouse",
    mapping: { button: MouseButton.WheelUp }
  },
  MouseWheelDown: {
    label: "Scroll Down",
    icon: MouseMiddleScrollDown,
    device: "mouse",
    mapping: { button: MouseButton.WheelDown }
  }
};

export const steamDeckLayout: ControlGroup[] = [
  {
    id: "dpad",
    name: "D-pad",
    section: "dpad",
    inputs: [
      ControllerInputs.DPadUp,
      ControllerInputs.DPadLeft,
      ControllerInputs.DPadDown,
      ControllerInputs.DPadRight
    ]
  },
  {
    id: "buttons",
    name: "Face buttons",
    section: "buttons",
    inputs: [
      ControllerInputs.South,
      ControllerInputs.East,
      ControllerInputs.West,
      ControllerInputs.North,
      ControllerInputs.Start,
      ControllerInputs.Select
    ]
  },
  {
    id: "sticks",
    name: "Analog sticks",
    section: "sticks",
    inputs: [
      ControllerInputs.LeftStick,
      ControllerInputs.RightStick,
      ControllerInputs.LeftStickButton,
      ControllerInputs.RightStickButton
    ]
  },
  {
    id: "triggers",
    name: "Triggers",
    section: "triggers",
    inputs: [ControllerInputs.LeftTrigger, ControllerInputs.RightTrigger]
  },
  {
    id: "bumpers",
    name: "Bumpers",
    section: "bumpers",
    inputs: [ControllerInputs.LeftBumper, ControllerInputs.RightBumper]
  },
  {
    id: "paddles",
    name: "Paddles",
    section: "paddles",
    inputs: [
      ControllerInputs.LeftPaddle1,
      ControllerInputs.LeftPaddle2,
      ControllerInputs.RightPaddle1,
      ControllerInputs.RightPaddle2
    ]
  },
  {
    id: "trackpads",
    name: "Trackpads",
    section: "trackpads",
    inputs: [ControllerInputs.LeftTrackpad, ControllerInputs.RightTrackpad]
  }
  // {
  //   id: "gyro",
  //   name: "Gyro",
  //   section: "gyro",
  //   inputs: [ControllerInputs.Gyro]
  // }
];

export const ps4Layout: ControlGroup[] = [
  {
    id: "dpad",
    name: "D-pad",
    section: "dpad",
    inputs: [
      ControllerInputs.DPadUp,
      ControllerInputs.DPadLeft,
      ControllerInputs.DPadDown,
      ControllerInputs.DPadRight
    ]
  },
  {
    id: "buttons",
    name: "Face buttons",
    section: "buttons",
    inputs: [
      ControllerInputs.South,
      ControllerInputs.East,
      ControllerInputs.West,
      ControllerInputs.North,
      ControllerInputs.Start,
      ControllerInputs.Select
    ]
  },
  {
    id: "sticks",
    name: "Analog sticks",
    section: "sticks",
    inputs: [
      ControllerInputs.LeftStick,
      ControllerInputs.RightStick,
      ControllerInputs.LeftStickButton,
      ControllerInputs.RightStickButton
    ]
  },
  {
    id: "triggers",
    name: "Triggers",
    section: "triggers",
    inputs: [ControllerInputs.LeftTrigger, ControllerInputs.RightTrigger]
  },
  {
    id: "bumpers",
    name: "Bumpers",
    section: "bumpers",
    inputs: [ControllerInputs.LeftBumper, ControllerInputs.RightBumper]
  },
  {
    id: "trackpads",
    name: "Trackpads",
    section: "trackpads",
    inputs: [ControllerInputs.LeftTrackpad]
  },
  {
    id: "gyro",
    name: "Gyro",
    section: "gyro",
    inputs: [ControllerInputs.Gyro]
  }
];

export const ps5Layout: ControlGroup[] = [
  {
    id: "dpad",
    name: "D-pad",
    section: "dpad",
    inputs: [
      ControllerInputs.DPadUp,
      ControllerInputs.DPadLeft,
      ControllerInputs.DPadDown,
      ControllerInputs.DPadRight
    ]
  },
  {
    id: "buttons",
    name: "Face buttons",
    section: "buttons",
    inputs: [
      ControllerInputs.South,
      ControllerInputs.East,
      ControllerInputs.West,
      ControllerInputs.North,
      ControllerInputs.Start,
      ControllerInputs.Select
    ]
  },
  {
    id: "sticks",
    name: "Analog sticks",
    section: "sticks",
    inputs: [
      ControllerInputs.LeftStick,
      ControllerInputs.RightStick,
      ControllerInputs.LeftStickButton,
      ControllerInputs.RightStickButton
    ]
  },
  {
    id: "triggers",
    name: "Triggers",
    section: "triggers",
    inputs: [ControllerInputs.LeftTrigger, ControllerInputs.RightTrigger]
  },
  {
    id: "bumpers",
    name: "Bumpers",
    section: "bumpers",
    inputs: [ControllerInputs.LeftBumper, ControllerInputs.RightBumper]
  },
  {
    id: "trackpads",
    name: "Trackpads",
    section: "trackpads",
    inputs: [ControllerInputs.Trackpad]
  }
  // {
  //   id: "gyro",
  //   name: "Gyro",
  //   section: "gyro",
  //   inputs: [ControllerInputs.Gyro]
  // }
];

export const xboxLayout: ControlGroup[] = [
  {
    id: "dpad",
    name: "D-pad",
    section: "dpad",
    inputs: [
      ControllerInputs.DPadUp,
      ControllerInputs.DPadLeft,
      ControllerInputs.DPadDown,
      ControllerInputs.DPadRight
    ]
  },
  {
    id: "buttons",
    name: "Face buttons",
    section: "buttons",
    inputs: [
      ControllerInputs.South,
      ControllerInputs.East,
      ControllerInputs.West,
      ControllerInputs.North,
      ControllerInputs.Select,
      ControllerInputs.Start
    ]
  },
  {
    id: "sticks",
    name: "Analog sticks",
    section: "sticks",
    inputs: [
      ControllerInputs.LeftStick,
      ControllerInputs.RightStick,
      ControllerInputs.LeftStickButton,
      ControllerInputs.RightStickButton
    ]
  },
  {
    id: "bumpers",
    name: "Bumpers",
    section: "bumpers",
    inputs: [ControllerInputs.LeftBumper, ControllerInputs.RightBumper]
  },
  {
    id: "triggers",
    name: "Triggers",
    section: "triggers",
    inputs: [ControllerInputs.LeftTrigger, ControllerInputs.RightTrigger]
  }
];

export const physicalLayouts: { [key: string]: PhysicalLayoutType } = {
  SteamDeck: {
    id: "steam-deck",
    label: "Steam Deck",
    layout: steamDeckLayout,
    images: {
      dpad: steamDeckImageFrontDpad,
      buttons: steamDeckImageFrontButtons,
      triggers: steamDeckImageTopTrigger,
      sticks: steamDeckImageFrontSticks,
      bumpers: steamDeckImageTopBumpers,
      paddles: steamDeckImageBackPaddles,
      trackpads: steamDeckImageFrontTrackpads,
      gyro: steamDeckImageGyro
    }
  },
  LegionGo: {
    id: "legion-go",
    label: "Legion Go",
    layout: steamDeckLayout,
    images: {
      dpad: LegionGoImageFrontDpad,
      buttons: LegionGoImageFrontButtons,
      triggers: LegionGoImageTopTrigger,
      sticks: LegionGoImageFrontSticks,
      bumpers: LegionGoImageTopBumpers,
      paddles: LegionGoImageBackPaddles,
      trackpads: LegionGoImageFrontTrackpads,
      gyro: LegionGoImageGyro
    }
  },
  Generic: {
    id: "generic-controller",
    label: "Generic Controller",
    layout: xboxLayout, // No need for a specific layout, it's the same as the Xbox layout
    images: {
      dpad: GenericImageFrontDpad,
      buttons: GenericImageFrontButtons,
      sticks: GenericImageFrontSticks,
      triggers: GenericImageTopTriggers,
      bumpers: GenericImageTopBumpers
    }
  },
  Xbox: {
    id: "xbox-controller",
    label: "Xbox Controller",
    layout: xboxLayout,
    images: {
      dpad: xboxImageFrontDpad,
      buttons: xboxImageFrontButtons,
      sticks: xboxImageFrontSticks,
      triggers: xboxImageTopTriggers,
      bumpers: xboxImageTopBumpers
    }
  },
  PS4: {
    id: "ps4",
    label: "Playstation 4",
    layout: ps4Layout,
    images: {
      dpad: PS4ImageFrontDpad,
      buttons: PS4ImageFrontButtons,
      sticks: PS4ImageFrontSticks,
      triggers: PS4ImageTopTrigger,
      bumpers: PS4ImageTopBumpers,
      paddles: PS4ImageBackPaddles,
      trackpads: PS4ImageTrackpad,
      gyro: PS4ImageGyro
    }
  },
  PS5: {
    id: "ps5",
    label: "Playstation 5",
    layout: ps5Layout,
    images: {
      dpad: PS5ImageFrontDpad,
      buttons: PS5ImageFrontButtons,
      sticks: PS5ImageFrontSticks,
      triggers: PS5ImageTopTrigger,
      bumpers: PS5ImageTopBumpers,
      paddles: PS5ImageBackPaddles,
      trackpads: PS5ImageTrackpad,
      gyro: PS5ImageGyro
    }
  }
};
