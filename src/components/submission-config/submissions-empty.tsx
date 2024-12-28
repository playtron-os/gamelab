import React, { useEffect, useState } from "react";
import { Button } from "@playtron/styleguide";
import { t } from "@lingui/macro";
import SteamDeckImage from "@/assets/Devices/Steam Deck Front.svg";
import {
  AppInformation,
  SubmissionItemType,
  LaunchConfig,
  InputConfig
} from "@/types";
import { usePlayserve } from "@/hooks";
import { useInputDevice } from "@/hooks/use-input-device";
import { getPhysicalLayoutFromDevice } from "@/utils/controllers";

type ControllerLayoutEmptyProps = {
  appInfo: AppInformation;
  submissionType: SubmissionItemType;
  onClose: () => void;
  setEditLayout?: (layout: InputConfig | null) => void;
  setEditLaunchConfig?: (launchConfig: LaunchConfig | null) => void;
  createSubmission: (
    appId: string,
    config_type: SubmissionItemType
  ) => Promise<InputConfig | LaunchConfig | null>;
};

export const SubmissionsEmpty: React.FC<ControllerLayoutEmptyProps> = ({
  appInfo,
  submissionType,
  onClose,
  setEditLaunchConfig,
  setEditLayout,
  createSubmission
}) => {
  const playserve = usePlayserve();
  const [image, setImage] = useState<string | undefined>(undefined);
  const { getInputDevices } = useInputDevice(playserve);
  useEffect(() => {
    getInputDevices().then((devices) => {
      if (devices && devices.length > 0) {
        const layout = getPhysicalLayoutFromDevice(devices[0]);
        setImage(layout.images.front);
      }
      return SteamDeckImage;
    });
  }, []);

  const message =
    submissionType === "InputConfig"
      ? t`There is no controller configuration created for`
      : t`There is no launch configuration created for`;

  return (
    <div className="flex flex-col items-center gap-6">
      <img width={430} src={image} />
      <p className="text-center max-w-44">
        {message}
        <br />
        <strong>{appInfo.app.name}</strong>
      </p>
      <div className="flex gap-2">
        <Button onClick={onClose} label={t`Close`} />
        <Button
          onClick={async () => {
            if (submissionType === "InputConfig" && setEditLayout) {
              const newSubmission = (await createSubmission(
                appInfo.app.id,
                submissionType
              )) as InputConfig;
              setEditLayout(newSubmission);
            } else if (
              submissionType === "LaunchConfig" &&
              setEditLaunchConfig
            ) {
              const newSubmission = (await createSubmission(
                appInfo.app.id,
                submissionType
              )) as LaunchConfig;
              setEditLaunchConfig(newSubmission);
            }
          }}
          primary
          label={t`Add New Config`}
        />
      </div>
    </div>
  );
};
