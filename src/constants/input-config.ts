// TODO: Implement default endpoint for controller layout
import controllerFormatTemplate from "@/constants/controller-format-template.json";
import { InputPlumberMappings } from "@/types/input-config";

export const INITIAL_INPUT_LAYOUT: InputPlumberMappings =
  controllerFormatTemplate;

export const DEFAULT_INPUT_CONFIG = {
  data: JSON.stringify(INITIAL_INPUT_LAYOUT),
  name: "Default profile",
  description: "Gamepad mapping to Mouse + WASD keyboard controls"
};

export enum KeyboardButtons {
  Key0 = "Key0",
  Key1 = "Key1",
  Key102nd = "Key102nd",
  Key2 = "Key2",
  Key3 = "Key3",
  Key4 = "Key4",
  Key5 = "Key5",
  Key6 = "Key6",
  Key7 = "Key7",
  Key8 = "Key8",
  Key9 = "Key9",
  KeyA = "KeyA",
  KeyAgain = "KeyAgain",
  KeyApostrophe = "KeyApostrophe",
  KeyB = "KeyB",
  KeyBack = "KeyBack",
  KeyBackslash = "KeyBackslash",
  KeyBackspace = "KeyBackspace",
  KeyC = "KeyC",
  KeyCalc = "KeyCalc",
  KeyCapslock = "KeyCapslock",
  KeyComma = "KeyComma",
  KeyCompose = "KeyCompose",
  KeyCopy = "KeyCopy",
  KeyCut = "KeyCut",
  KeyD = "KeyD",
  KeyDelete = "KeyDelete",
  KeyDot = "KeyDot",
  KeyDown = "KeyDown",
  KeyE = "KeyE",
  KeyEdit = "KeyEdit",
  KeyEjectCD = "KeyEjectCD",
  KeyEnd = "KeyEnd",
  KeyEnter = "KeyEnter",
  KeyEqual = "KeyEqual",
  KeyEsc = "KeyEsc",
  KeyF = "KeyF",
  KeyF1 = "KeyF1",
  KeyF10 = "KeyF10",
  KeyF11 = "KeyF11",
  KeyF12 = "KeyF12",
  KeyF13 = "KeyF13",
  KeyF14 = "KeyF14",
  KeyF15 = "KeyF15",
  KeyF16 = "KeyF16",
  KeyF17 = "KeyF17",
  KeyF18 = "KeyF18",
  KeyF19 = "KeyF19",
  KeyF2 = "KeyF2",
  KeyF20 = "KeyF20",
  KeyF21 = "KeyF21",
  KeyF22 = "KeyF22",
  KeyF23 = "KeyF23",
  KeyF24 = "KeyF24",
  KeyF3 = "KeyF3",
  KeyF4 = "KeyF4",
  KeyF5 = "KeyF5",
  KeyF6 = "KeyF6",
  KeyF7 = "KeyF7",
  KeyF8 = "KeyF8",
  KeyF9 = "KeyF9",
  KeyFind = "KeyFind",
  KeyForward = "KeyForward",
  KeyFront = "KeyFront",
  KeyG = "KeyG",
  KeyGrave = "KeyGrave",
  KeyH = "KeyH",
  KeyHanja = "KeyHanja",
  KeyHelp = "KeyHelp",
  KeyHenkan = "KeyHenkan",
  KeyHiragana = "KeyHiragana",
  KeyHome = "KeyHome",
  KeyI = "KeyI",
  KeyInsert = "KeyInsert",
  KeyJ = "KeyJ",
  KeyK = "KeyK",
  KeyKatakana = "KeyKatakana",
  KeyKatakanaHiragana = "KeyKatakanaHiragana",
  KeyKp0 = "KeyKp0",
  KeyKp1 = "KeyKp1",
  KeyKp2 = "KeyKp2",
  KeyKp3 = "KeyKp3",
  KeyKp4 = "KeyKp4",
  KeyKp5 = "KeyKp5",
  KeyKp6 = "KeyKp6",
  KeyKp7 = "KeyKp7",
  KeyKp8 = "KeyKp8",
  KeyKp9 = "KeyKp9",
  KeyKpAsterisk = "KeyKpAsterisk",
  KeyKpComma = "KeyKpComma",
  KeyKpDot = "KeyKpDot",
  KeyKpEnter = "KeyKpEnter",
  KeyKpEqual = "KeyKpEqual",
  KeyKpJpComma = "KeyKpJpComma",
  KeyKpLeftParen = "KeyKpLeftParen",
  KeyKpMinus = "KeyKpMinus",
  KeyKpPlus = "KeyKpPlus",
  KeyKpRightParen = "KeyKpRightParen",
  KeyKpSlash = "KeyKpSlash",
  KeyL = "KeyL",
  KeyLeft = "KeyLeft",
  KeyLeftAlt = "KeyLeftAlt",
  KeyLeftBrace = "KeyLeftBrace",
  KeyLeftCtrl = "KeyLeftCtrl",
  KeyLeftMeta = "KeyLeftMeta",
  KeyLeftShift = "KeyLeftShift",
  KeyM = "KeyM",
  KeyMinus = "KeyMinus",
  KeyMuhenkan = "KeyMuhenkan",
  KeyMute = "KeyMute",
  KeyN = "KeyN",
  KeyNextSong = "KeyNextSong",
  KeyNumlock = "KeyNumlock",
  KeyO = "KeyO",
  KeyOpen = "KeyOpen",
  KeyP = "KeyP",
  KeyPageDown = "KeyPageDown",
  KeyPageUp = "KeyPageUp",
  KeyPaste = "KeyPaste",
  KeyPause = "KeyPause",
  KeyPlayPause = "KeyPlayPause",
  KeyPower = "KeyPower",
  KeyPreviousSong = "KeyPreviousSong",
  KeyProg1 = "KeyProg1",
  KeyProps = "KeyProps",
  KeyQ = "KeyQ",
  KeyR = "KeyR",
  KeyRecord = "KeyRecord",
  KeyRefresh = "KeyRefresh",
  KeyRight = "KeyRight",
  KeyRightAlt = "KeyRightAlt",
  KeyRightBrace = "KeyRightBrace",
  KeyRightCtrl = "KeyRightCtrl",
  KeyRightMeta = "KeyRightMeta",
  KeyRightShift = "KeyRightShift",
  KeyRo = "KeyRo",
  KeyS = "KeyS",
  KeyScrollDown = "KeyScrollDown",
  KeyScrollLock = "KeyScrollLock",
  KeyScrollUp = "KeyScrollUp",
  KeySemicolon = "KeySemicolon",
  KeySlash = "KeySlash",
  KeySleep = "KeySleep",
  KeySpace = "KeySpace",
  KeyStop = "KeyStop",
  KeyStopCD = "KeyStopCD",
  KeySysrq = "KeySysrq",
  KeyT = "KeyT",
  KeyTab = "KeyTab",
  KeyU = "KeyU",
  KeyUndo = "KeyUndo",
  KeyUp = "KeyUp",
  KeyV = "KeyV",
  KeyVolumeDown = "KeyVolumeDown",
  KeyVolumeUp = "KeyVolumeUp",
  KeyW = "KeyW",
  KeyWww = "KeyWww",
  KeyX = "KeyX",
  KeyY = "KeyY",
  KeyYen = "KeyYen",
  KeyZ = "KeyZ",
  KeyZenkakuhankaku = "KeyZenkakuhankaku"
}

export enum MouseButton {
  Left = "Left",
  Right = "Right",
  Middle = "Middle",
  WheelUp = "WheelUp",
  WheelDown = "WheelDown",
  WheelLeft = "WheelLeft",
  WheelRight = "WheelRight",
  Extra1 = "Extra1",
  Extra2 = "Extra2"
}

export enum GamepadButton {
  /// South action, Sony Cross x, Xbox A, Nintendo B
  South = "South",
  /// East action, Sony Circle ◯, Xbox B, Nintendo A
  East = "East",
  /// North action, Sony Square □, Xbox X, Nintendo Y
  North = "North",
  /// West action, Sony Triangle ∆, Xbox Y, Nintendo X
  West = "West",
  /// Start, Xbox Menu, Nintendo +, Steam Deck Hamburger Menu (☰)
  Start = "Start",
  /// Select, Sony Select, Xbox Back, Nintendo -
  Select = "Select",
  /// Guide button, Sony PS, Xbox Home, Steam Deck ⧉
  Guide = "Guide",
  /// Base button, usually on the bottom right, Steam Quick Access Button (...)
  QuickAccess = "QuickAccess",
  /// Base button, usually on the bottom of the device
  QuickAccess2 = "QuickAccess2",
  /// Dedicated button for opening an on-screen keyboard
  Keyboard = "Keyboard",
  /// Dedicated screenshot button
  Screenshot = "Screenshot",
  /// Dedicated mute button
  Mute = "Mute",
  /// Directional Pad up
  DPadUp = "DPadUp",
  /// Directional Pad down
  DPadDown = "DPadDown",
  /// Directional Pad left
  DPadLeft = "DPadLeft",
  /// Directional Pad right
  DPadRight = "DPadRight",
  /// Left shoulder button, Sony L1, Xbox LB
  LeftBumper = "LeftBumper",
  /// Left top button on AyaNeo devices, inboard of left bumper
  LeftTop = "LeftTop",
  /// Left trigger button, Deck binary sensor for left trigger
  LeftTrigger = "LeftTrigger",
  /// Left back paddle button, Xbox P3, Steam Deck L4
  LeftPaddle1 = "LeftPaddle1",
  /// Left back paddle button, Xbox P4, Steam Deck L5
  LeftPaddle2 = "LeftPaddle2",
  /// Left back paddle button, No examples
  LeftPaddle3 = "LeftPaddle3",
  /// Z-axis button on the left stick, Sony L3, Xbox LS
  LeftStick = "LeftStick",
  /// Touch sensor for left stick
  LeftStickTouch = "LeftStickTouch",
  /// Right shoulder button, Sony R1, Xbox RB
  RightBumper = "RightBumper",
  /// Right top button on AyaNeo devices, inboard of right bumper
  RightTop = "RightTop",
  /// Right trigger button, Deck binary sensor for right trigger
  RightTrigger = "RightTrigger",
  /// Right back paddle button, Xbox P1, Steam Deck R4
  RightPaddle1 = "RightPaddle1",
  /// Right back paddle button, Xbox P2, Steam Deck R5
  RightPaddle2 = "RightPaddle2",
  /// Right "side" paddle button, Legion Go M2
  RightPaddle3 = "RightPaddle3",
  /// Z-axis button on the right stick, Sony R3, Xbox RS
  RightStick = "RightStick",
  /// Touch binary sensor for right stick
  RightStickTouch = "RightStickTouch"
}

export enum GamepadAxis {
  LeftStick = "LeftStick",
  RightStick = "RightStick",
  Hat0 = "Hat0",
  Hat1 = "Hat1",
  Hat2 = "Hat2",
  Hat3 = "Hat3"
}

export enum GamepadTrigger {
  LeftTrigger = "LeftTrigger",
  LeftTouchpadForce = "LeftTouchpadForce",
  LeftStickForce = "LeftStickForce",
  RightTrigger = "RightTrigger",
  RightTouchpadForce = "RightTouchpadForce",
  RightStickForce = "RightStickForce"
}

export enum inputTypes {
  gamepad = "gamepad",
  mouse = "mouse",
  keyboard = "keyboard",
  numpad = "numpad"
}
