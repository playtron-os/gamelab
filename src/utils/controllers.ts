import { InputEvent } from "@/types/input-config";
import { t } from "@lingui/macro";

export const KEYBOARD_QWERTY_LAYOUT = [
  [
    "KeyEsc",
    "KeyF1",
    "KeyF2",
    "KeyF3",
    "KeyF4",
    "KeyF5",
    "KeyF6",
    "KeyF7",
    "KeyF8",
    "KeyF9",
    "KeyF10",
    "KeyF11",
    "KeyF12"
  ],
  [
    "KeyGrave",
    "Key1",
    "Key2",
    "Key3",
    "Key4",
    "Key5",
    "Key6",
    "Key7",
    "Key8",
    "Key9",
    "Key0",
    "KeyMinus",
    "KeyEqual",
    "KeyBackspace"
  ],
  [
    "KeyTab",
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "KeyLeftBrace",
    "KeyRightBrace",
    "KeyBackslash"
  ],
  [
    "KeyCapslock",
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeySemicolon",
    "KeyApostrophe",
    "KeyEnter"
  ],
  [
    "KeyLeftShift",
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "KeyComma",
    "KeyDot",
    "KeySlash",
    "KeyRightShift"
  ],
  [
    "KeyLeftCtrl",
    "KeyLeftMeta",
    "KeyLeftAlt",
    "KeySpace",
    "KeyRightAlt",
    "KeyCompose",
    "KeyRightMeta",
    "KeyRightCtrl"
  ]
];

export const KEYBOARD_NUMPAD_LAYOUT = [
  [
    "KeyInsert",
    "KeyHome",
    "KeyPageUp",
    "KeyPlay",
    "KeyStop",
    "KeyNext",
    "KeyPause"
  ],
  [
    "KeyDelete",
    "KeyEnd",
    "KeyPageDown",
    "KeyEqual",
    "KeySlash",
    "KeyAsterisk",
    "KeyMinus"
  ],
  [null, null, null, "KeyKp7", "KeyKp8", "KeyKp9", "KeyPlus"],
  [null, null, null, "KeyKp4", "KeyKp5", "KeyKp6"],
  [null, "KeyUp", null, "KeyKp1", "KeyKp2", "KeyKp3", "KeyEnter"],
  ["KeyLeft", "KeyDown", "KeyRight", "KeyKp0", "KeyDot"]
];

export const getKeyWidth = (key: string) => {
  switch (key) {
    case "KeyGrave":
      return "w-[68px]";
    case "KeyBackspace":
      return "w-[76px]";
    case "KeyTab":
      return "w-[96px]";
    case "KeyEsc":
    case "KeyF1":
    case "KeyF2":
    case "KeyF3":
    case "KeyF4":
    case "KeyF5":
    case "KeyF6":
    case "KeyF7":
    case "KeyF8":
    case "KeyF9":
    case "KeyF10":
    case "KeyF11":
    case "KeyF12":
      return "w-[55.71px]";
    case "KeyCapslock":
      return "w-[111px]";
    case "KeyRightShift":
    case "KeyLeftShift":
      return "w-[124px]";
    case "KeyEnter":
      return "w-[85px]";
    case "KeyRightCtrl":
    case "KeyLeftCtrl":
    case "KeyRightMeta":
    case "KeyLeftMeta":
    case "KeyCompose":
    case "KeyRightAlt":
    case "KeyLeftAlt":
      return "w-[65px]";
    case "KeySpace":
      return "w-[289px]";
    default:
      return "w-12";
  }
};

export const getKeyLabel = (key: string | null) => {
  if (!key) {
    return t`Unset`;
  }
  switch (key) {
    case "KeyGrave":
      return "`";
    case "KeySpace":
      return "Space";
    case "KeyBackspace":
      return "⇐";
    case "KeyEnter":
      return "⏎";
    case "KeyLeftShift":
    case "KeyRightShift":
      return "Shift";
    case "KeyLeftMeta":
    case "KeyRightMeta":
      return "Win";
    case "KeyLeftCtrl":
    case "KeyRightCtrl":
      return "Ctrl";
    case "KeyRightAlt":
    case "KeyLeftAlt":
      return "Alt";
    case "KeyLeftBrace":
      return "[";
    case "KeyRightBrace":
      return "]";
    case "KeyEqual":
      return "=";
    case "KeyComma":
      return ",";
    case "KeyDot":
      return ".";
    case "KeySlash":
      return "/";
    case "KeyBackslash":
      return "\\";
    case "KeyCompose":
      return "Fn";
    case "KeyApostrophe":
      return "'";
    case "KeySemicolon":
      return ";";
    case "KeyMinus":
      return "-";
    case "KeyInsert":
      return "Ins";
    case "KeyDelete":
      return "Del";
    case "KeyPageUp":
      return "PgUp";
    case "KeyPageDown":
      return "PgDn";
    case "KeyPlus":
      return "+";
    case "KeyAsterisk":
      return "*";
    case "KeyUp":
      return "↑";
    case "KeyDown":
      return "↓";
    case "KeyLeft":
      return "←";
    case "KeyRight":
      return "→";
    default:
      return key.replace("KeyKp", "").replace("Key", "");
  }
};

export const getInputLabel = (input: InputEvent) => {
  if (!input) {
    return t`Unset`;
  }

  if (input.keyboard) {
    return getKeyLabel(input.keyboard);
  }
  if (input.mouse) {
    if (input.mouse.motion) {
      return t`Mouse Move`;
    }
    return input.mouse.button;
  }
  if (input.gamepad) {
    if (input.gamepad.axis) {
      return input.gamepad.axis.name;
    }
    if (input.gamepad.trigger) {
      return input.gamepad.trigger.name;
    }
    return input.gamepad.button;
  }
  return "-";
};

export const getInputButtonLabel = (label: string, layout?: string) => {
  if (layout === "ps5") {
    switch (label) {
      case "North":
        return "Square";
      case "West":
        return "Triangle";
      case "East":
        return "Circle";
      case "South":
        return "Cross";
      default:
        return label;
    }
  }
  if (layout === "xbox") {
    switch (label) {
      case "North":
        return "X";
      case "West":
        return "Y";
      case "East":
        return "B";
      case "South":
        return "A";
      default:
        return label;
    }
  }
  return label;
};

export const mappingCmp = (mapping1?: InputEvent, mapping2?: InputEvent) => {
  if (!mapping1 || !mapping2) {
    return false;
  }

  if (mapping1.keyboard && mapping2.keyboard) {
    return mapping1.keyboard === mapping2.keyboard;
  }
  if (mapping1.mouse && mapping2.mouse) {
    if ("button" in mapping1.mouse && "button" in mapping2.mouse) {
      return mapping1.mouse.button === mapping2.mouse.button;
    }
    if ("motion" in mapping1.mouse && "motion" in mapping2.mouse) {
      return true;
    }
  }
  if (mapping1.gamepad && mapping2.gamepad) {
    if ("button" in mapping1.gamepad && "button" in mapping2.gamepad) {
      return mapping1.gamepad.button === mapping2.gamepad.button;
    }
    if (mapping1.gamepad.trigger && mapping2.gamepad.trigger) {
      return mapping1.gamepad.trigger.name === mapping2.gamepad.trigger.name;
    }
    if (mapping1.gamepad.axis && mapping2.gamepad.axis) {
      if (mapping1.gamepad.axis.direction !== mapping2.gamepad.axis.direction) {
        return false;
      }
      return mapping1.gamepad.axis.name === mapping2.gamepad.axis.name;
    }
  }
  return false;
};
