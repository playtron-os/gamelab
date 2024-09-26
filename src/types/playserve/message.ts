import { MessageRequestMapping } from "./request";

export enum MessageType {
  // bluetooth::bluetooth_routes
  BluetoothDeviceScanStart = "BluetoothDeviceScanStart",
  BluetoothDeviceScanStop = "BluetoothDeviceScanStop",
  BluetoothDeviceConnect = "BluetoothDeviceConnect",
  BluetoothDeviceDisconnect = "BluetoothDeviceDisconnect",
  BluetoothDeviceForget = "BluetoothDeviceForget",

  // network::access_point_routes
  AccessPointGet = "AccessPointGet",
  AccessPointConnect = "AccessPointConnect",
  AccessPointDisconnect = "AccessPointDisconnect",
  AccessPointForget = "AccessPointForget",
  AccessPointGetNetworkDetails = "AccessPointGetNetworkDetails",
  AirplaneModeEnabledGet = "AirplaneModeEnabledGet",
  AirplaneModeEnabledSet = "AirplaneModeEnabledSet",
  WifiEnabledSet = "WifiEnabledSet",
  NetworkStatesGet = "NetworkStatesGet",

  // app
  AppMove = "AppMove",
  AppUninstall = "AppUninstall",

  // directory::scan
  AppAnalyze = "AppAnalyze",

  // auth::user
  GetCurrentUser = "GetCurrentUser",
  SetCurrentUser = "SetCurrentUser",
  SetJwt = "SetJwt",
  GetJwt = "GetJwt",
  RemoveJwt = "RemoveJwt",
  SetOrySession = "SetOrySession",
  GetOrySession = "GetOrySession",
  SetUserOnboarded = "SetUserOnboarded",
  GetUsernameValid = "GetUsernameValid",

  // user
  UserProfileGet = "UserProfileGet",
  GetUserAccessRights = "GetUserAccessRights",

  // app::auth
  EpicStatus = "EpicStatus",
  EpicAuth = "EpicAuth",
  EpicLogout = "EpicLogout",
  GogStatus = "GogStatus",
  GogAuth = "GogAuth",
  GogLogout = "GogLogout",
  SteamAuth = "SteamAuth",
  SteamStatus = "SteamStatus",
  SteamLogout = "SteamLogout",

  // app::provider
  AppProviderStatusGet = "AppProviderStatusGet",
  AppProviderPreDependenciesGet = "AppProviderPreDependenciesGet",
  AppProviderPreDependenciesInstall = "AppProviderPreDependenciesInstall",
  AppProviderFtueConfirm = "AppProviderFtueConfirm",

  // auto_test
  TestScriptEditorLaunch = "TestScriptEditorLaunch",
  TestScriptEditorTerminate = "TestScriptEditorTerminate",
  TestScriptDownload = "TestScriptDownload",
  TestScriptResultSubmit = "TestScriptResultSubmit",
  TestScriptRun = "TestScriptRun",

  // app::get
  AppGetStatus = "AppGetStatus",
  AppGetOwned = "AppGetOwned",
  AppGetInstalled = "AppGetInstalled",
  AppToolsGetInstalled = "AppToolsGetInstalled",
  AppDownload = "AppDownload",
  AppDownloadPause = "AppDownloadPause",
  AppDownloadCancel = "AppDownloadCancel",
  AppGetExecutables = "AppGetExecutables",
  AppLibraryGet = "AppLibraryGet",
  AppGamescopeWindowsStatus = "AppGamescopeWindowsStatus",

  // app::control
  AppLaunch = "AppLaunch",
  AppGetRunning = "AppGetRunning",
  AppTerminate = "AppTerminate",
  AppPauseAll = "AppPauseAll",
  AppResume = "AppResume",
  AppSetClientOverlay = "AppSetClientOverlay",
  AppRemoveClientOverlay = "AppRemoveClientOverlay",
  AppFocusCustomWindow = "AppFocusCustomWindow",
  AppUnfocusCustomWindow = "AppUnfocusCustomWindow",

  // app::legal
  AppEulasGet = "AppEulasGet",
  AppEulaAccept = "AppEulaAccept",

  // app::queue
  QueueDownloadGet = "QueueDownloadGet",

  // hardware
  AudioDeviceConnectedEvent = "AudioDeviceConnectedEvent",
  AudioDeviceDisconnectedEvent = "AudioDeviceDisconnectedEvent",
  AudioDefaultDeviceChangedEvent = "AudioDefaultDeviceChangedEvent",
  AudioOutputVolumeChangedEvent = "AudioOutputVolumeChangedEvent",
  AudioOutputVolumeGet = "AudioOutputVolumeGet",
  AudioOutputVolumeSet = "AudioOutputVolumeSet",
  AudioOutputGetAll = "AudioOutputGetAll",
  AudioOutputGet = "AudioOutputGet",
  AudioOutputSet = "AudioOutputSet",
  BatteryStatusGet = "BatteryStatusGet",
  DeviceInfoGet = "DeviceInfoGet",
  DriveInfo = "DriveInfo",
  DriveUsage = "DriveUsage",
  DriveFormat = "DriveFormat",
  DrivePerformance = "DrivePerformance",
  InputDevicesGet = "InputDevicesGet",
  InputKeyboardCountGet = "InputKeyboardCountGet",
  InputEvent = "InputEvent",
  InputInterceptModeSet = "InputInterceptModeSet",
  InputSimulateKeypress = "InputSimulateKeypress",
  ScreenBrightnessGet = "ScreenBrightnessGet",
  ScreenBrightnessSet = "ScreenBrightnessSet",
  ScreenshotRequest = "ScreenshotRequest",

  // config::submission
  SubmissionGet = "SubmissionGet",
  SubmissionSave = "SubmissionSave",
  SubmissionGetAll = "SubmissionGetAll",
  SubmissionDelete = "SubmissionDelete",
  SubmissionDuplicate = "SubmissionDuplicate",
  SubmissionSubmit = "SubmissionSubmit",
  SubmissionRevert = "SubmissionRevert",

  // config
  EnvironmentSet = "EnvironmentSet",
  EnvironmentGet = "EnvironmentGet",
  FeatureFlagsGet = "FeatureFlagsGet",
  EnvironmentListGet = "EnvironmentListGet",
  DependenciesGet = "DependenciesGet",

  // software
  SoftwareUpdateCheck = "SoftwareUpdateCheck",
  SoftwareUpdate = "SoftwareUpdate",
  SoftwareUpdateProgress = "SoftwareUpdateProgress",
  FactoryReset = "FactoryReset",
  GetBuildProjects = "GetBuildProjects",
  GetBuildTags = "GetBuildTags",
  GetOSBuild = "GetOSBuild",
  SetOSBuild = "SetOSBuild",

  // playtron_api
  EulaGet = "EulaGet",
  EulaAccept = "EulaAccept",

  // Below are messages sent from the server to the client
  AccessPointGetUpdate = "AccessPointGetUpdate",
  BatteryStatusUpdate = "BatteryStatusUpdate",
  AppLibraryUpdate = "AppLibraryUpdate",
  AppStatusUpdate = "AppStatusUpdate",
  UpdateJwt = "UpdateJwt",
  AppDownloadProgress = "AppDownloadProgress",
  AppGetOwnedProgress = "AppGetOwnedProgress",
  AppMoveProgress = "AppMoveProgress",
  AppGetOwnedUpdate = "AppGetOwnedUpdate",
  AppGetInstalledUpdate = "AppGetInstalledUpdate",
  AppLaunchUpdate = "AppLaunchUpdate",
  AppDownloadPauseUpdate = "AppDownloadPauseUpdate",
  AppGetRunningUpdate = "AppGetRunningUpdate",
  AppProviderStatusUpdate = "AppProviderStatusUpdate",
  AppInstallingUpdate = "AppInstallingUpdate",
  BluetoothDeviceFound = "BluetoothDeviceFound",
  QueueDownloadGetUpdate = "QueueDownloadGetUpdate",
  UserUpdate = "UserUpdate",
  ToolUpdate = "ToolUpdate",
  AppPostInstallStatusUpdate = "AppPostInstallStatusUpdate",
  SubmissionGetAllUpdate = "SubmissionGetAllUpdate",
  LaunchConfigGetAllUpdate = "LaunchConfigGetAllUpdate",
  AppGamescopeWindowsStatusUpdate = "AppGamescopeWindowsStatusUpdate",
  DiskConnectedEvent = "DiskConnectedEvent",
  DiskDisconnectedEvent = "DiskDisconnectedEvent",
  TestScriptEditorLogUpdate = "TestScriptEditorLogUpdate",
  WifiEnabledGetUpdate = "WifiEnabledGetUpdate",
  Notification = "Notification",
  NetworkStateUpdate = "NetworkStateUpdate",
  WirelessStateUpdate = "WirelessStateUpdate",
  DiskBenchmarkStarted = "DiskBenchmarkStarted",
  InputDevicesUpdate = "InputDevicesUpdate",
  InputKeyboardsUpdated = "InputKeyboardsUpdated"
}

export type MessageMapping = {
  [key in MessageType]: unknown;
};

export type Message<
  MessageT extends MessageType & keyof MessageRequestMapping
> = {
  id: number;
  message_type: MessageT;
  body?: MessageRequestMapping[MessageT] | unknown;
};

export function getRandomId() {
  return Math.round(Math.random() * 1000000000) + 1;
}

export function getMessage<MessageT extends keyof MessageRequestMapping>(
  type: MessageT,
  body?: MessageRequestMapping[MessageT]
): Message<MessageT> {
  return {
    id: getRandomId(),
    message_type: type,
    body: body || {}
  };
}
