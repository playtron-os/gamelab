import { useCallback, useEffect } from "react";
import { setShowDrives, setDrives, selectDrives } from "@/redux/modules";
import { UsePlayserveReturn } from "@/hooks";
import { useAppActions, useAppSelector, useAppDispatch } from "@/redux/store";

import { DriveInfoResponseBody, MessageType, getMessage } from "@/types";

export const useDriveInfo = (playserve: UsePlayserveReturn) => {
  const { sendMessage } = playserve;
  const dispatch = useAppDispatch();

  const { setShowDrives: setShowDrivesDispatch, setDrives: setDrivesDispatch } =
    useAppActions({
      setShowDrives,
      setDrives
    });
  const drives: DriveInfoResponseBody = useAppSelector(selectDrives);

  const fetchDrives = useCallback(() => {
    const message = getMessage(MessageType.DriveInfo, {});
    sendMessage(message)()
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.body)) {
          const driveNames = drives.map((drive) => drive.name);
          dispatch(setDrivesDispatch(res.body));
          res.body.forEach((drive) => {
            if (!driveNames.includes(drive.name)) {
              dispatch(
                setShowDrivesDispatch({
                  drive: drive.name,
                  enabled: true
                })
              );
            }
          });
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [sendMessage, setShowDrivesDispatch, setDrivesDispatch, dispatch, drives]);

  useEffect(() => {
    fetchDrives();
  }, []);

  return {
    drives,
    fetchDrives
  };
};
