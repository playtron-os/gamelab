import React, { useCallback, useMemo, useState } from "react";
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
        className="-z-40 p-6"
        title={modalTitle}
        isOpen={isMoveAppDialogOpen && !isMovingApp}
      >
        <div className="py-2" data-testid="move-app-dialog-modal-content">
          {appInfoArray.length === 1 && (
            <div className="flex gap-4 items-center mb-2">
              <span className="w-12">{t`From:`}</span>
              <span>{appDriveName}</span>
            </div>
          )}
          <div className="flex gap-4 items-center">
            <span className="w-12">
              <Trans>To: </Trans>
            </span>
            <SelectInput
              options={availableDriveOptions}
              placeholder={t`Select drive`}
              className="w-64"
              onChange={(value) => {
                setCurrentDrive(
                  drives.find((drive) => drive.path === value.value) ?? null
                );
              }}
            />
          </div>
        </div>
        <div>
          <Button
            label={t`Confirm`}
            className="me-4"
            primary
            disabled={isMovingApp}
            onClick={() => currentDrive && moveApps(appInfoArray, currentDrive)}
          />
          <Button
            label={t`Close`}
            disabled={isMovingApp}
            onClick={onCloseMoveAppDialog}
          />
        </div>
      </Modal>
      <Modal className="z-50 p-6" isOpen={isMovingApp}>
        <span data-testid="move-in-progress-text">
          {" "}
          <Trans> Move In Progress... </Trans>{" "}
        </span>
      </Modal>
    </div>
  );
};
