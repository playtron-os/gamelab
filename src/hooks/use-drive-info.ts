import { useCallback, useState, useEffect } from "react";
import { setShowDrives } from "@/redux/modules";
import { UsePlayserveReturn } from "@/hooks";
import { useAppActions } from "@/redux/store";
import { MessageType, getMessage } from "@/types";
import { DriveInfoResponseBody } from "@/types/drive";

export const useDriveInfo = (playserve: UsePlayserveReturn) => {
  const { sendMessage } = playserve;

  const { setShowDrives: setShowDrivesDispatch } = useAppActions({
    setShowDrives
  });
  const [drives, setDrives] = useState<DriveInfoResponseBody>([]);

  const fetchDrives = useCallback(() => {
    const message = getMessage(MessageType.DriveInfo, {});
    sendMessage(message)()
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.body)) {
          const driveNames = drives.map((drive) => drive.name);
          setDrives(res.body);
          res.body.forEach((drive) => {
            if (!driveNames.includes(drive.name)) {
              setShowDrivesDispatch({
                drive: drive.name,
                enabled: true
              });
            }
          });
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [sendMessage, setShowDrivesDispatch]);

  useEffect(() => {
    fetchDrives();
  }, []);

  return {
    drives,
    fetchDrives
  };
};
