import React from "react";
import { Button } from "@playtron/styleguide";
import { t } from "@lingui/macro";
import SteamDeckImage from "@/assets/Devices/Steam Deck Front.svg";
import {
  AppInformation,
  SubmissionItemType,
  LaunchConfig,
  InputConfig
} from "@/types";

type ControllerLayoutEmptyProps = {
  appInfo: AppInformation;
  submissionType: SubmissionItemType;
  onClose: () => void;
  setEditLayout: (layout: InputConfig | null) => void;
  createSubmission: (
    appId: string,
    config_type: SubmissionItemType
  ) => Promise<InputConfig | LaunchConfig | null>;
};

export const SubmissionsEmpty: React.FC<ControllerLayoutEmptyProps> = ({
  appInfo,
  submissionType,
  onClose,
  setEditLayout,
  createSubmission
}) => {
  const message =
    submissionType === "InputConfig"
      ? t`There is no controller configuration created for`
      : t`There is no launch configuration created for`;

  return (
    <div className="flex flex-col justify-center items-center absolute inset-0 gap-6">
      <img width={430} src={SteamDeckImage} />
      <p className="text-center max-w-44">
        {message}
        <br />
        <strong>{appInfo.app.name}</strong>
      </p>
      <div className="flex gap-2">
        <Button onClick={onClose} label={t`Close`} />
        <Button
          onClick={async () => {
            const newSubmission = (await createSubmission(
              appInfo.app.id,
              submissionType
            )) as InputConfig;
            setEditLayout(newSubmission);
          }}
          primary
          label={t`Add New Config`}
        />
      </div>
    </div>
  );
};
