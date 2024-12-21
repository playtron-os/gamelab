import React from "react";
import { setShowDrives, selectAppLibraryState } from "@/redux/modules";
import { Drive } from "./drive";
import { RootState, useAppActions, useAppSelector } from "@/redux/store";
import { usePlayserve } from "@/hooks";
import { useDriveInfo } from "@/hooks/use-drive-info";
import { HardDrive2Line, styles } from "@playtron/styleguide";
import { getDriveLabel } from "@/utils/app-info";
import { MessageType } from "@/types";

const selector = (state: RootState) => {
  const appLibrary = selectAppLibraryState(state);
  return {
    apps: appLibrary.apps,
    loading: appLibrary.loading,
    appFilters: appLibrary.appFilters
  };
};

export const DriveSection: React.FC = () => {
  const { appFilters } = useAppSelector(selector);
  const { setShowDrives: setShowDrivesDispatch } = useAppActions({
    setShowDrives
  });

  const playserve = usePlayserve();
  const { drives, fetchDrives } = useDriveInfo(playserve);

  usePlayserve({
    onMessage: (message) => {
      if (
        message.message_type !== MessageType.DiskConnectedEvent &&
        message.message_type !== MessageType.DiskDisconnectedEvent &&
        message.message_type !== MessageType.AppUninstall &&
        message.message_type !== MessageType.AppInstallingUpdate &&
        message.message_type !== MessageType.AppPostInstallStatusUpdate
      ) {
        return;
      }
      fetchDrives();
    }
  });

  const driveList = drives.map((drive) => (
    <Drive
      key={drive.name}
      icon={<HardDrive2Line fill={styles.variablesDark.fill.white} />}
      label={getDriveLabel(drive.path)}
      capacity={Math.round(
        ((drive.max_size - drive.available_space) / drive.max_size) * 100
      )}
      size={drive.max_size}
      singleDrive={drives.length === 1}
      enabled={appFilters.drives.includes(drive.name)}
      onClick={() =>
        setShowDrivesDispatch({
          drive: drive.name,
          enabled: !appFilters.drives.includes(drive.name)
        })
      }
    />
  ));
  return <section className="mb-4">{driveList}</section>;
};
