import React from "react";
import { useAppLibraryContext } from "@/context";
import { useAppStatus } from "@/hooks/app-library/use-app-status";
import { AppDownloadStage, AppStatus, PlaytronAppType } from "@/types";
import { AppInformation, PlaytronApp } from "@/types/app-library";
import { getAppActionLabelByStatus } from "@/utils/app-info";
import { t } from "@lingui/macro";
import { DotsVertical, Dropdown, styles } from "@playtron/styleguide";
import { CellContext } from "@tanstack/react-table";

export type StatusCellContext = CellContext<AppInformation, PlaytronApp>;

export const AppActionCell = (info: StatusCellContext) => {
  const appInfo = info.row.original;
  const {
    handlers: { openMoveAppDialog, uninstallApp, handleAppDefaultAction }
  } = useAppLibraryContext();

  const status = useAppStatus(appInfo);
  const appActions = [];

  // Main action button
  const buttonLabel = getAppActionLabelByStatus(status);

  if (buttonLabel && appInfo.app.appType !== PlaytronAppType.Tool) {
    appActions.push({
      id: 1,
      label: buttonLabel,
      onClick: () => handleAppDefaultAction(appInfo)
    });
  }

  // Move Button
  if (appInfo.installed_app?.download_status.stage == AppDownloadStage.DONE) {
    appActions.push({
      id: 2,
      label: t`Move`,
      onClick: () => openMoveAppDialog([appInfo])
    });
  }

  // Uninstall Button
  const supportedStatuses = [
    AppStatus.READY,
    AppStatus.DOWNLOADING,
    AppStatus.QUEUED,
    AppStatus.PAUSED,
    AppStatus.UPDATE_REQUIRED
  ];
  if (supportedStatuses.includes(status)) {
    appActions.push({
      id: 3,
      label: t`Uninstall`,
      onClick: () => uninstallApp([appInfo])
    });
  }

  if (!appActions) {
    return null;
  }

  return (
    <Dropdown
      data={appActions}
      triggerElem={
        <DotsVertical
          data-testid={`app-action-cell-${info.row.index}`}
          fill={styles.variablesDark.fill.white}
          className="cursor-pointer"
        />
      }
    />
  );
};
