import { InputMapping } from "./input-config";
import { AppLaunchConfig, Override } from "./launch";

export enum SubmissionType {
  TestScript = "TestScript",
  LaunchConfig = "LaunchConfig",
  InputConfig = "InputConfig"
}

export type SubmissionItemType =
  | SubmissionType.TestScript
  | SubmissionType.LaunchConfig
  | SubmissionType.InputConfig;

export interface SubmissionSaveModel {
  item_id?: string;
  data: string;
  name: string;
  description: string;
}

export interface BaseSubmission {
  app_id: string;
  author_id: string;
  author_name: string;
  createdDate: string;
  config_type: string;
  name: string;
  data: string; // json data
  description: string;
  item_id: string;
  parent_id: string;
  parent_submission_category: string;
  promoter_id: string;
  promoter_name: string;
  promotion_date: string;
  submission_category: string;
  submission_item_type: SubmissionItemType;
  updated_date: string;
}

export interface LaunchConfig extends BaseSubmission {
  submission_item_type: SubmissionType.LaunchConfig;
  configuration?: AppLaunchConfig;
  overrides?: Override[];
}

export interface InputConfig extends BaseSubmission {
  submission_item_type: SubmissionType.InputConfig;
  mapping: InputMapping[];
}

export type Submission = LaunchConfig | InputConfig;
