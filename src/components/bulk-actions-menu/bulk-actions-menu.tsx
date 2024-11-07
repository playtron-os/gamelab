import React, { useCallback } from "react";
import "./bulk-actions-menu.scss";
import { Modal, Button } from "@playtron/styleguide";
import { t } from "@lingui/macro";
import { useAppLibraryContext } from "@/context";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  openMoveAppDialog as openMoveAppDialogAction,
  selectAppLibraryAppsState
} from "@/redux/modules";
import { AppInformation } from "@/types";

const BUTTON_WIDTH = "125px";

export const BulkActionsMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const openMoveAppDialog = useCallback(
    (appInfoArray: AppInformation[]) =>
      dispatch(openMoveAppDialogAction({ appInfoArray })),
    [dispatch]
  );
  const { selectedApps, handlers, bulkActionsMenuStateManager } =
    useAppLibraryContext();
  const apps = useAppSelector(selectAppLibraryAppsState);
  const [isOpen, { setFalse: closeBulkActionsMenu }] =
    bulkActionsMenuStateManager;

  const handleDownloadSelectedApps = useCallback(
    (selectedAppIds: Set<string>) => {
      closeBulkActionsMenu();
      const selectedAppsData = apps.filter((appInfo: AppInformation) =>
        selectedAppIds.has(appInfo.app.id)
      );
      selectedAppsData.forEach((appInfo: AppInformation) =>
        handlers.downloadApp(appInfo)
      );
    },
    [closeBulkActionsMenu, apps, handlers]
  );

  if (!isOpen) {
    return null;
  }

  const selectedAppsData = apps.filter((appInfo) =>
    selectedApps?.has(appInfo.app.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeBulkActionsMenu}
      title={t`Manage Selected`}
      className="-z-0 w-52 p-4"
    >
      <div className="flex flex-col items-center gap-3">
        <Button
          data-testid="bulk-download"
          onClick={() => {
            closeBulkActionsMenu();
            handleDownloadSelectedApps(selectedApps);
          }}
          label={t`Download`}
          size="small"
          width={BUTTON_WIDTH}
        />
        <Button
          data-testid="bulk-uninstall"
          onClick={() => {
            closeBulkActionsMenu();
            handlers.uninstallApp(selectedAppsData);
          }}
          label={t`Uninstall`}
          size="small"
          width={BUTTON_WIDTH}
        />
        <Button
          data-testid="bulk-move-action"
          onClick={() => {
            closeBulkActionsMenu();
            openMoveAppDialog(selectedAppsData);
          }}
          label={t`Move`}
          size="small"
          width={BUTTON_WIDTH}
        />
        <Button
          data-testid="close-modal"
          onClick={() => closeBulkActionsMenu()}
          label={t`Close`}
          size="small"
          width={BUTTON_WIDTH}
        />
      </div>
    </Modal>
  );
};
