import React, { useCallback, useMemo, useState } from "react";
import "./move-app-dialog.scss";
import {
  Button,
  Modal,
  SelectInput,
  SelectInputProps
} from "@playtron/styleguide";

import { Trans, t } from "@lingui/macro";

import { useDriveInfo } from "@/hooks/use-drive-info";
import { DriveInfo } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  MoveAppDialogState,
  closeMoveAppDialog,
  selectMoveAppDialogState
} from "@/redux/modules/move-app-dialog/move-app-dialog-slice";
import { usePlayserve } from "@/hooks";
import { useAppMove } from "./hooks/use-app-move";
import { AppInformation } from "@/types/app-library";

const getAppDrive = (appInfo: AppInformation, drives: DriveInfo[]) => {
  if (!appInfo?.installed_app || !drives.length) {
    return null;
  }
  const currentPath = appInfo.installed_app.install_config.install_root;
  let biggestPathDrive = null;

  for (const drive of drives) {
    if (
      currentPath.startsWith(drive.path) &&
      (!biggestPathDrive || drive.path.length > biggestPathDrive.path.length)
    ) {
      biggestPathDrive = drive;
    }
  }

  return biggestPathDrive;
};

export const MoveAppDialog: React.FC = () => {
  const playserve = usePlayserve();
  const { drives } = useDriveInfo(playserve);
  const { moveApps } = useAppMove(playserve);
  const { isMoveAppDialogOpen, appInfoArray, isMovingApp } =
    useAppSelector<MoveAppDialogState>(selectMoveAppDialogState);
  const dispatch = useAppDispatch();
  const onCloseMoveAppDialog = useCallback(
    () => dispatch(closeMoveAppDialog()),
    [dispatch]
  );
  const availableDriveOptions: SelectInputProps["options"] = useMemo(
    () =>
      drives.map((drive) => ({
        label: drive.path,
        value: drive.path
      })),
    [drives]
  );
  const appDrive = useMemo(
    () => getAppDrive(appInfoArray?.[0], drives),
    [appInfoArray, drives]
  );
  const [currentDrive, setCurrentDrive] = useState(appDrive);

  if (!appDrive) {
    return null;
  }

  const appDriveName = appDrive.name;
  const appName = appInfoArray?.[0].app.name;
  const modalTitle =
    appInfoArray.length === 1 ? t`Move ${appName}` : t`Move selected apps`;
  return (
    <div className="move-app-dialog-rct-component">
      <Modal
        className="move-app-dialog-rct-component__main-modal"
        title={modalTitle}
        isOpen={isMoveAppDialogOpen && !isMovingApp}
      >
        <div
          className="move-app-dialog-rct-component__main-modal__content"
          data-testid="move-app-dialog-modal-content"
        >
          {appInfoArray.length === 1 && (
            <div className="move-app-dialog-rct-component__main-modal__content__field">
              <span>{t`From: ${appDriveName}`}</span>
            </div>
          )}
          <div className="move-app-dialog-rct-component__main-modal__content__field">
            <span>
              <Trans>To: </Trans>
            </span>
            <SelectInput
              options={availableDriveOptions}
              placeholder={t`Select drive`}
              onChange={(value) => {
                setCurrentDrive(
                  drives.find((drive) => drive.path === value.value) ?? null
                );
              }}
            />
          </div>
        </div>
        <Button
          label={t`Confirm`}
          disabled={isMovingApp}
          onClick={() => currentDrive && moveApps(appInfoArray, currentDrive)}
        />
        <Button
          label={t`Close`}
          disabled={isMovingApp}
          onClick={onCloseMoveAppDialog}
        />
      </Modal>
      <Modal
        className="move-app-dialog-rct-component__move-in-progress-modal"
        isOpen={isMovingApp}
      >
        <span data-testid="move-in-progress-text">
          {" "}
          <Trans> Move In Progress... </Trans>{" "}
        </span>
      </Modal>
    </div>
  );
};
