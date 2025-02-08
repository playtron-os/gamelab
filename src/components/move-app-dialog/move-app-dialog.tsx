import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal, ProgressBar } from "@playtron/styleguide";

import { Trans, t } from "@lingui/macro";

import { useDriveInfo } from "@/hooks/use-drive-info";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  MoveAppDialogState,
  closeMoveAppDialog,
  selectMoveAppDialogState
} from "@/redux/modules/move-app-dialog/move-app-dialog-slice";
import { usePlayserve } from "@/hooks";
import { useAppMove } from "./hooks/use-app-move";
import { DriveInfo, MessageType, AppInformation } from "@/types";
import { getDiskSize } from "@/utils/app-info";
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
  const [progress, setProgress] = useState(0);
  usePlayserve({
    onMessage: (message) => {
      if (
        message.message_type === MessageType.AppMoveProgress &&
        message.status === 200
      ) {
        setProgress(message.body.progress);
      }
    }
  });

  const { drives } = useDriveInfo(playserve);
  const { moveApps } = useAppMove(playserve);

  const { isMoveAppDialogOpen, appInfoArray, isMovingApp } =
    useAppSelector<MoveAppDialogState>(selectMoveAppDialogState);
  const dispatch = useAppDispatch();
  const onCloseMoveAppDialog = useCallback(
    () => dispatch(closeMoveAppDialog()),
    [dispatch]
  );

  const appDrive = useMemo(
    () => getAppDrive(appInfoArray?.[0], drives),
    [appInfoArray, drives]
  );

  if (!appDrive) {
    return null;
  }

  const appName = appInfoArray?.[0].app.name;
  const modalTitle =
    appInfoArray.length === 1 ? t`Move ${appName}` : t`Move selected apps`;

  return (
    <div>
      <Modal
        className="-z-40 p-6 max-w-[465px]"
        title={modalTitle}
        isOpen={isMoveAppDialogOpen && !isMovingApp}
      >
        <div className="py-2" data-testid="move-app-dialog-modal-content">
          {appInfoArray.length === 1 && (
            <>
              <div>
                <span className="font-bold text-sm text-gray-400">{t`From:`}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-lg">{appDrive.model}</span>
                <br />
                <span className="text-xs font-bold text-gray-400">
                  {appDrive.name}
                </span>
              </div>
            </>
          )}
          <div className="font-bold text-sm text-gray-400">
            <Trans>To: </Trans>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-4 py-4">
              {drives
                .filter(
                  (drive) =>
                    !drive.needs_formatting && drive.path !== appDrive.path
                )
                .map((drive) => (
                  <div
                    key={drive.path}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer outline-gray-700 outline-2 outline-double hover:outline-white`}
                    onClick={() => {
                      moveApps(appInfoArray, drive);
                    }}
                  >
                    <div>
                      <span className="font-bold text-lg">{drive.model}</span>
                      <span className="font-sm text-gray-400"></span>
                      <br />
                      <div className="text-xs font-bold text-gray-400">
                        {drive.name}: {getDiskSize(drive.available_space, 0)}/
                        {getDiskSize(drive.max_size, 0)}
                      </div>
                      <div className="w-[400px]">
                        <ProgressBar
                          value={(drive.available_space / drive.max_size) * 100}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
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
          <ProgressBar
            value={progress}
            label={progress ? progress + "%" : ""}
          />{" "}
          <Trans> Move In Progress... </Trans>{" "}
        </span>
      </Modal>
    </div>
  );
};
