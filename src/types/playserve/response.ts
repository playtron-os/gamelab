import * as app from "../app";
import { AppInformation } from "../app-library";
import * as ProviderStatus from "../provider-status";
import { UserUnmapped } from "../user";
import * as apiErrors from "./api_errors";
import * as inputConfig from "../input-config";
import { MessageMapping, MessageType } from "./message";

export interface MessageResponseMapping extends MessageMapping {
  [MessageType.AppLibraryGet]: AppInformation[];
  [MessageType.UserProfileGet]: app.ProfileResponseBody;
  [MessageType.GetCurrentUser]: UserUnmapped | undefined;
  [MessageType.GetJwt]: { user_id: string; jwt: string };
  [MessageType.GogStatus]: ProviderStatus.GogStatus;
  [MessageType.EpicStatus]: ProviderStatus.EpicStatus;
  [MessageType.SteamStatus]: ProviderStatus.SteamStatus;
  [MessageType.SteamAuth]: {
    user_id: string;
    success: boolean;
    requires_2fa: boolean;
    requires_auth: boolean;
  };
  [MessageType.GogAuth]: { user_id: string };
  [MessageType.EpicAuth]: { user_id: string };
  [MessageType.AppGetInstalled]: app.AppGetInstalledResponseBody;
  [MessageType.AppGetInstalledUpdate]: app.AppGetInstalledResponseBody;
  [MessageType.QueueDownloadGet]: app.QueueDownloadGetResponseBody;
  [MessageType.QueueDownloadGetUpdate]: app.QueueDownloadGetResponseBody;
  [MessageType.AppGetOwnedProgress]: app.AppGetOwnedProgressResponseBody;
  [MessageType.InputDevicesGet]: inputConfig.InputDeviceInfoResponseBody;
  [MessageType.InputDevicesUpdate]: inputConfig.InputDeviceInfoResponseBody;
  [MessageType.AppLogUpdate]: {
    owned_app_id: string;
    content: string;
  };
  [MessageType.AppEulasGet]: app.AppEulaResponseBody[];
}

export type PlayserveResponseSuccess<MessageT extends MessageType> = {
  id: number;
  message_type: MessageT;
  status: 200; // Modify this in case we add more success types
  body: MessageResponseMapping[MessageT];
};

export type PlayserveResponseError<MessageT extends MessageType> = {
  id: number;
  message_type: MessageT;
  status: HttpErrorCode;
  body: { error_code: apiErrors.ApiError; message: string; data: unknown };
};

// This allows us to if (res.message_type === MessageType.SomeType) and get
// appropriate body type
export type PlayserveResponse<MessageT extends MessageType> = {
  [message in MessageType]:
    | PlayserveResponseSuccess<message>
    | PlayserveResponseError<message>;
}[MessageT];

// I know how this looks like, but this is one of the only ways we can
// generate range of numbers as error status in range 400 - 599
type StringAsNumber<T extends string> = T extends `${infer N extends number}`
  ? N
  : never;
type ZeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type HttpErrorCodeMaj = 4 | 5;
type HttpErrorCode =
  StringAsNumber<`${HttpErrorCodeMaj}${ZeroToNine}${ZeroToNine}`>;
