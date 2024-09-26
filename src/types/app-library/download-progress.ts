import { AppDownloadStage } from "../app";

export enum DownloadStage {
  None,
  Error,
  Preallocating,
  Downloading,
  Verifying,
  Done,
  Updatepending
}

export interface DownloadProgress {
  stage: AppDownloadStage;
  progress: number;
  error: string;
  error_code: number;
  requires_auth: boolean;
  requires_2fa: boolean;
}
