export interface AppDownloadPauseRequestBody {
  user_id: string;
  app_id: string;
}

export interface AppDownloadCancelRequestBody {
  user_id: string;
  app_id: string;
}

export interface AppDownloadPauseResponseBody {
  user_id: string;
  app_id: string;
}

export interface AppDownloadCancelResponseBody {
  user_id: string;
  app_id: string;
}
