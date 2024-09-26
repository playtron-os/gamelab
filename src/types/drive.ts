export interface DriveInfo {
  name: string;
  path: string;
  max_size: number;
  available_space: number;
}

export type DriveInfoResponseBody = DriveInfo[];

export interface AppMoveRequest {
  owned_app_id: string;
  drive: string;
}

export interface AppMoveResponseBody {
  app_id?: string;
  user_id?: string;
  message?: string;
}
