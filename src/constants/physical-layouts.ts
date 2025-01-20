import {
  ABXYALine,
  ABXYBLine,
  ABXYXLine,
  ABXYYLine,
  TriangleCircleLine,
  CircleCircleLine,
  SquareCircleLine,
  XmarkCircleLine,
  L1RectangleRoundedbottomLine,
  R1RectangleRoundedtopLine,
  L2RectangleRoundedtopLine,
  R2RectangleRoundedtopLine,
  L4RectangleRoundedtopLine,
  R4RectangleRoundedtopLine,
  L5RectangleRoundedtopLine,
  R5RectangleRoundedtopLine,
  DpadDownFill,
  DpadLeftFill,
  DpadRightFill,
  DpadUpFill,
  LJoystickDownFill,
  RJoystickDownFill,
  LJoystickLine,
  RJoystickLine,
  JoystickLLeftLine,
  JoystickLRightLine,
  JoystickLUpLine,
  JoystickLDownLine,
  JoystickRLeftLine,
  JoystickRRightLine,
  JoystickRUpLine,
  JoystickRDownLine,
  OptionLine,
  OptionsOnly,
  ViewLine,
  CreateOnly,
  MouseLeftClick,
  MouseRightClick,
  MouseMiddleClick,
  MouseMove,
  MouseSideBtnBack,
  MouseSideBtnFront,
  MouseMiddleScrollDown,
  MouseMiddleScrollUp,
  TrackpadLeft,
  TrackpadLeftClick,
  TrackpadRight,
  TrackpadRightClick,
  Trackpad,
  TrackpadClick,
  Gyro
} from "@playtron/styleguide";

import steamDeckImageFront from "@/assets/Devices/Steam Deck Front.svg";
import steamDeckImageFrontDpad from "@/assets/Devices/Steam Deck Front-dpad.svg";
import steamDeckImageFrontButtons from "@/assets/Devices/Steam Deck Front-faceb.svg";
import steamDeckImageFrontSticks from "@/assets/Devices/Steam Deck Front-stick.svg";
import steamDeckImageTopTrigger from "@/assets/Devices/Steam Deck Top-trigger.svg";
import steamDeckImageTopBumpers from "@/assets/Devices/Steam Deck Top-bumpper.svg";
import steamDeckImageFrontTrackpads from "@/assets/Devices/Steam Deck Front-touch.svg";
import steamDeckImageBackPaddles from "@/assets/Devices/Steam Deck Back-paddle.svg";
import steamDeckImageGyro from "@/assets/Devices/Steam Deck Gyro.svg";

import LegionGoImageFront from "@/assets/Devices/Legion Go Front.svg";
import LegionGoImageFrontDpad from "@/assets/Devices/Legion Go Front-dpad.svg";
import LegionGoImageFrontButtons from "@/assets/Devices/Legion Go Front-facebt.svg";
import LegionGoImageFrontSticks from "@/assets/Devices/Legion Go Front-stick.svg";
import LegionGoImageTopTrigger from "@/assets/Devices/Legion Go Top-triggers.svg";
import LegionGoImageTopBumpers from "@/assets/Devices/Legion Go Top-bumppers.svg";
import LegionGoImageFrontTrackpads from "@/assets/Devices/Legion Go Front-touchp.svg";
import LegionGoImageBackPaddles from "@/assets/Devices/Legion Go Back-paddles.svg";
import LegionGoImageGyro from "@/assets/Devices/Legion Go Gyro.svg";

import ROGAllyImageFront from "@/assets/Devices/ROG Ally Front.svg";
import ROGAllyImageFrontDpad from "@/assets/Devices/ROG Ally Front-dpad.svg";
import ROGAllyImageFrontButtons from "@/assets/Devices/ROG Ally Front-facebtn.svg";
import ROGAllyImageFrontSticks from "@/assets/Devices/ROG Ally Front-stick.svg";
import ROGAllyImageTopTrigger from "@/assets/Devices/ROG Ally Top-triggers.svg";
import ROGAllyImageTopBumpers from "@/assets/Devices/ROG Ally Top-bumpers.svg";
import ROGAllyImageBackPaddles from "@/assets/Devices/ROG Ally Back-paddles.svg";
import ROGAllyImageGyro from "@/assets/Devices/ROG Ally Gyro.svg";

import xboxImageFront from "@/assets/Devices/Xbox Front.svg";
import xboxImageFrontButtons from "@/assets/Devices/Xbox Front-facebtn.svg";
import xboxImageFrontDpad from "@/assets/Devices/Xbox Front-dpad.svg";
import xboxImageFrontSticks from "@/assets/Devices/Xbox Front-stick.svg";
import xboxImageTopTriggers from "@/assets/Devices/Xbox Top-triggers.svg";
import xboxImageTopBumpers from "@/assets/Devices/Xbox Top-bumppers.svg";

import GenericImageFront from "@/assets/Devices/Generic Front.svg";
import GenericImageFrontButtons from "@/assets/Devices/Generic Front-facebtn.svg";
import GenericImageFrontDpad from "@/assets/Devices/Generic Front-dpad.svg";
import GenericImageFrontSticks from "@/assets/Devices/Generic Front-stick.svg";
import GenericImageTopTriggers from "@/assets/Devices/Generic Top-triggers.svg";
import GenericImageTopBumpers from "@/assets/Devices/Generic Top-bumppers.svg";

import PS4ImageFront from "@/assets/Devices/PS4 Front.svg";
import PS4ImageFrontDpad from "@/assets/Devices/PS4 Front-dpad.svg";
import PS4ImageFrontButtons from "@/assets/Devices/PS4 Front-facebtn.svg";
import PS4ImageFrontSticks from "@/assets/Devices/PS4 Front-stick.svg";
import PS4ImageTopTrigger from "@/assets/Devices/PS4 Top-triggers.svg";
import PS4ImageTopBumpers from "@/assets/Devices/PS4 Top-bumppers.svg";
import PS4ImageBackPaddles from "@/assets/Devices/PS4 Back-paddles.svg";
import PS4ImageTrackpad from "@/assets/Devices/PS4 Front-touchpad.svg";
import PS4ImageGyro from "@/assets/Devices/PS4 Gyro.svg";

import PS5ImageFront from "@/assets/Devices/PS5 Front.svg";
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
    front: string;
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
    psIcon: XmarkCircleLine,
    device: "gamepad",
    mapping: { button: "South" }
  },
  East: {
    label: "East",
    icon: ABXYBLine,
    psIcon: CircleCircleLine,
    device: "gamepad",
    mapping: { button: "East" }
  },
  West: {
    label: "West",
    icon: ABXYYLine, // Mapping inverted in the kernel
    psIcon: TriangleCircleLine, // Mapping inverted in the kernel
    device: "gamepad",
    mapping: { button: "West" }
  },
  North: {
    label: "North",
    icon: ABXYXLine, // Mapping inverted in the kernel
    psIcon: SquareCircleLine, // Mapping inverted in the kernel
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
    icon: OptionLine,
    psIcon: OptionsOnly,
    device: "gamepad",
    mapping: { button: "Start" }
  },
  Select: {
    label: "Select",
    icon: ViewLine,
    psIcon: CreateOnly,
    device: "gamepad",
    mapping: { button: "Select" }
  },

  LeftStick: {
    label: "Left Stick",
    icon: LJoystickLine,
    device: "gamepad",
    mapping: { axis: { name: "LeftStick" } }
  },
  LeftStickLeft: {
    label: "Left Stick Left",
    icon: JoystickLLeftLine,
    device: "gamepad",
    mapping: { axis: { name: "LeftStick", direction: "left", deadzone: 0.3 } }
  },

  LeftStickButton: {
    label: "L3 Button",
    icon: LJoystickDownFill,
    device: "gamepad",
    mapping: { button: "LeftStick" }
  },

  LeftStickRight: {
    label: "Left Stick Right",
    icon: JoystickLRightLine,
    device: "gamepad",
    mapping: { axis: { name: "LeftStick", direction: "right", deadzone: 0.3 } }
  },
  LeftStickUp: {
    label: "Left Stick Up",
    icon: JoystickLUpLine,
    device: "gamepad",
    mapping: {
      axis: { name: "LeftStick", direction: "up", deadzone: 0.3 }
    }
  },
  LeftStickDown: {
    label: "Left Stick Down",
    icon: JoystickLDownLine,
    device: "gamepad",
    mapping: {
      axis: { name: "LeftStick", direction: "down", deadzone: 0.3 }
    }
  },
  RightStick: {
    label: "Right Stick",
    icon: RJoystickLine,
    device: "gamepad",
    mapping: { axis: { name: "RightStick" } }
  },

  RightStickButton: {
    label: "R3 Button",
    icon: RJoystickDownFill,
    device: "gamepad",
    mapping: { button: "RightStick" }
  },

  RightStickLeft: {
    label: "Right Stick Left",
    icon: JoystickRLeftLine,
    device: "gamepad",
    mapping: { axis: { name: "RightStick", direction: "left", deadzone: 0.3 } }
  },
  RightStickRight: {
    label: "Right Stick Right",
    icon: JoystickRRightLine,
    device: "gamepad",
    mapping: { axis: { name: "RightStick", direction: "right", deadzone: 0.3 } }
  },
  RightStickUp: {
    label: "Right Stick Up",
    icon: JoystickRUpLine,
    device: "gamepad",
    mapping: { axis: { name: "RightStick", direction: "up", deadzone: 0.3 } }
  },
  RightStickDown: {
    label: "Right Stick Down",
    icon: JoystickRDownLine,
    device: "gamepad",
    mapping: { axis: { name: "RightStick", direction: "down", deadzone: 0.3 } }
  },
  LeftPaddle1: {
    label: "Left Paddle 1",
    icon: L4RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { button: "LeftPaddle1" }
  },
  LeftPaddle2: {
    label: "Left Paddle 2",
    icon: L5RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { button: "LeftPaddle2" }
  },
  RightPaddle1: {
    label: "Right Paddle 1",
    icon: R4RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { button: "RightPaddle1" }
  },
  RightPaddle2: {
    label: "Right Paddle 2",
    icon: R5RectangleRoundedtopLine,
    device: "gamepad",
    mapping: { button: "RightPaddle2" }
  },
  Trackpad: {
    label: "CenterPad",
    icon: Trackpad,
    device: "touchpad",
    mapping: { name: "CenterPad", touch: { motion: { speed_pps: 800 } } }
  },
  TrackpadTouch: {
    label: "CenterPadTouch",
    icon: TrackpadClick,
    device: "touchpad",
    mapping: { name: "CenterPad", touch: { button: "Touch" } }
  },
  LeftTrackpad: {
    label: "LeftPad",
    icon: TrackpadLeft,
    device: "touchpad",
    mapping: { name: "LeftPad", touch: { motion: { speed_pps: 800 } } }
  },
  LeftTrackpadTouch: {
    label: "LeftPadTouch",
    icon: TrackpadLeftClick,
    device: "touchpad",
    mapping: { name: "LeftPad", touch: { button: "Touch" } }
  },
  RightTrackpad: {
    label: "RightPad",
    icon: TrackpadRight,
    device: "touchpad",
    mapping: { name: "RightPad", touch: { motion: { speed_pps: 800 } } }
  },
  RightTrackpadTouch: {
    label: "RightPadTouch",
    icon: TrackpadRightClick,
    device: "touchpad",
    mapping: { name: "RightPad", touch: { button: "Touch" } }
  },
  Gyro: {
    label: "Gyro",
    icon: Gyro,
    device: "mouse",
    mapping: { axis: { name: "Gyro" } }
  },
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
    mapping: { motion: { speed_pps: 800 } }
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

export const baseLayout: ControlGroup[] = [
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
      ControllerInputs.North,
      ControllerInputs.West,
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
      ControllerInputs.RightStickButton,

      ControllerInputs.LeftStickUp,
      ControllerInputs.RightStickUp,

      ControllerInputs.LeftStickDown,
      ControllerInputs.RightStickDown,

      ControllerInputs.LeftStickLeft,
      ControllerInputs.RightStickLeft,

      ControllerInputs.LeftStickRight,
      ControllerInputs.RightStickRight
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
  }
];

export const steamDeckLayout: ControlGroup[] = baseLayout.concat([
  {
    id: "paddles",
    name: "Paddles",
    section: "paddles",
    inputs: [
      ControllerInputs.LeftPaddle1,
      ControllerInputs.RightPaddle1,
      ControllerInputs.LeftPaddle2,
      ControllerInputs.RightPaddle2
    ]
  }
  // {
  //   id: "trackpads",
  //   name: "Trackpads",
  //   section: "trackpads",
  //   inputs: [
  //     ControllerInputs.LeftTrackpad,
  //     ControllerInputs.RightTrackpad,
  //     ControllerInputs.LeftTrackpadTouch,
  //     ControllerInputs.RightTrackpadTouch
  //   ]
  // }
]);

export const legionGoLayout: ControlGroup[] = baseLayout.concat([
  {
    id: "paddles",
    name: "Paddles",
    section: "paddles",
    inputs: [
      ControllerInputs.LeftPaddle1,
      ControllerInputs.RightPaddle1,
      ControllerInputs.LeftPaddle2,
      ControllerInputs.RightPaddle2
    ]
  }
  // {
  //   id: "trackpads",
  //   name: "Trackpads",
  //   section: "trackpads",
  //   inputs: [ControllerInputs.Trackpad, ControllerInputs.TrackpadTouch]
  // }
]);

export const rogAllyLayout: ControlGroup[] = baseLayout.concat([
  {
    id: "paddles",
    name: "Paddles",
    section: "paddles",
    inputs: [ControllerInputs.LeftPaddle1, ControllerInputs.RightPaddle1]
  }
]);

export const ps4Layout: ControlGroup[] = baseLayout.concat([
  // {
  //   id: "trackpads",
  //   name: "Trackpads",
  //   section: "trackpads",
  //   inputs: [ControllerInputs.Trackpad]
  // },
  {
    id: "gyro",
    name: "Gyro",
    section: "gyro",
    inputs: [ControllerInputs.Gyro]
  }
]);

export const ps5Layout: ControlGroup[] = baseLayout.concat([
  // {
  //   id: "trackpads",
  //   name: "Trackpads",
  //   section: "trackpads",
  //   inputs: [ControllerInputs.TrackpadTouch, ControllerInputs.Trackpad]
  // },
  {
    id: "gyro",
    name: "Gyro",
    section: "gyro",
    inputs: [ControllerInputs.Gyro]
  }
]);

export const xboxLayout: ControlGroup[] = baseLayout;

export const physicalLayouts: { [key: string]: PhysicalLayoutType } = {
  Dummy: {
    id: "dummy",
    label: "Dummy",
    layout: [],
    images: {
      front: GenericImageFront,
      dpad: GenericImageFrontDpad,
      buttons: GenericImageFrontButtons,
      sticks: GenericImageFrontSticks,
      triggers: GenericImageTopTriggers,
      bumpers: GenericImageTopBumpers
    }
  },
  SteamDeck: {
    id: "steam-deck",
    label: "Steam Deck",
    layout: steamDeckLayout,
    images: {
      front: steamDeckImageFront,
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
    layout: legionGoLayout,
    images: {
      front: LegionGoImageFront,
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
  ROGAlly: {
    id: "rog-ally",
    label: "ROG Ally",
    layout: rogAllyLayout,
    images: {
      front: ROGAllyImageFront,
      dpad: ROGAllyImageFrontDpad,
      buttons: ROGAllyImageFrontButtons,
      triggers: ROGAllyImageTopTrigger,
      sticks: ROGAllyImageFrontSticks,
      bumpers: ROGAllyImageTopBumpers,
      paddles: ROGAllyImageBackPaddles,
      gyro: ROGAllyImageGyro
    }
  },
  Generic: {
    id: "generic-controller",
    label: "Generic Controller",
    layout: baseLayout,
    images: {
      front: GenericImageFront,
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
      front: xboxImageFront,
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
      front: PS4ImageFront,
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
      front: PS5ImageFront,
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
