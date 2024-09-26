import { useCallback } from "react";
import { useBoolean } from "ahooks";
import { AppInformation, BulkActionsProps } from "@/types";

export const useBulkActions = ({
  data,
  downloadApp,
  uninstallApp
}: BulkActionsProps) => {
  const [
    isBulkActionsOpen,
    { setTrue: openBulkActionsMenu, setFalse: closeBulkActionsMenu }
  ] = useBoolean(false);

  const handleDownloadSelectedApps = useCallback(
    (selectedAppIds: Set<string>) => {
      closeBulkActionsMenu();
      const selectedAppsData = data.filter((appInfo: AppInformation) =>
        selectedAppIds.has(appInfo.app.id)
      );
      selectedAppsData.forEach((appInfo: AppInformation) =>
        downloadApp(appInfo)
      );
    },
    [data, downloadApp, closeBulkActionsMenu]
  );

  const handleUninstallSelectedApps = useCallback(
    (selectedAppIds: Set<string>) => {
      closeBulkActionsMenu();
      const selectedAppsData = data.filter((appInfo: AppInformation) =>
        selectedAppIds.has(appInfo.app.id)
      );
      uninstallApp(selectedAppsData);
    },
    [data, uninstallApp, closeBulkActionsMenu]
  );

  return {
    isBulkActionsOpen,
    openBulkActionsMenu,
    closeBulkActionsMenu,
    handleDownloadSelectedApps,
    handleUninstallSelectedApps
  };
};
