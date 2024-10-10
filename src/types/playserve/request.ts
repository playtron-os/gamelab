import * as app from "../app";
import * as drive from "../drive";
import * as submission from "../submission";
import { MessageMapping, MessageType } from "./message";

interface OwnedAppIdRequest {
  owned_app_id: string;
}

interface SubmissionIdRequest {
  item_id: string;
  app_id: string;
  item_type: submission.SubmissionItemType;
}

type EmptyBody = Record<string, never> | undefined;

export interface MessageRequestMapping extends MessageMapping {
  [MessageType.SetUserOnboarded]: EmptyBody;
  [MessageType.GetJwt]: EmptyBody;
  [MessageType.SetJwt]: {
    user_id: string;
    jwt: string;
    refresh_token: string;
  };
  [MessageType.RemoveJwt]: {
    user_id: string;
  };
  [MessageType.QueueDownloadGet]: EmptyBody;
  [MessageType.AppDownload]: app.AppDownloadRequestBody;
  [MessageType.AppDownloadCancel]: OwnedAppIdRequest;
  [MessageType.AppDownloadPause]: OwnedAppIdRequest;
  [MessageType.AppUninstall]: {
    owned_app_ids: string[];
  };
  [MessageType.AppGetInstalled]: EmptyBody;
  [MessageType.AppLibraryGet]: {
    force_refresh?: boolean;
  };
  [MessageType.AppGetOwned]: {
    force_refresh?: boolean;
  };
  [MessageType.AppLaunch]: {
    owned_app_id: string;
    bypass_app_update?: boolean;
    using_gamescope?: boolean;
    reset_wine_prefix?: boolean;
    skip_cloud_sync?: boolean;
    enhanced_debugging?: boolean;
    launch_config_id?: string;
    input_config_id?: string;
  };
  [MessageType.AppMove]: drive.AppMoveRequest;
  [MessageType.AppTerminate]: OwnedAppIdRequest;
  [MessageType.DriveInfo]: EmptyBody;
  [MessageType.GetCurrentUser]: EmptyBody;
  [MessageType.UserProfileGet]: EmptyBody;
  [MessageType.EpicAuth]: { authorization_code?: string };
  [MessageType.EpicStatus]: EmptyBody;
  [MessageType.EpicLogout]: EmptyBody;
  [MessageType.GogAuth]: { authorization_code: string };
  [MessageType.GogStatus]: EmptyBody;
  [MessageType.GogLogout]: EmptyBody;
  [MessageType.SteamAuth]: {
    username: string;
    password: string;
    code_2fa?: string;
  };
  [MessageType.SteamStatus]: EmptyBody;
  [MessageType.SteamLogout]: EmptyBody;
  [MessageType.SubmissionSave]: {
    app_id: string;
    item_type: submission.SubmissionItemType;
    item: submission.SubmissionSaveModel;
  };
  [MessageType.SubmissionGetAll]: {
    app_id: string;
    item_type: submission.SubmissionItemType;
  };
  [MessageType.SubmissionDelete]: SubmissionIdRequest;
  [MessageType.SubmissionGet]: SubmissionIdRequest;
  [MessageType.SubmissionDuplicate]: SubmissionIdRequest;
  [MessageType.SubmissionSubmit]: SubmissionIdRequest;
  [MessageType.SubmissionRevert]: SubmissionIdRequest;
  [MessageType.EnvironmentGet]: EmptyBody;
  [MessageType.AppProviderStatusGet]: EmptyBody;
}
