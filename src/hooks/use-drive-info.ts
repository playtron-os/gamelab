import { useCallback, useState, useEffect } from "react";

import { UsePlayserveReturn } from "@/hooks";
import { MessageType, getMessage } from "@/types";
import { DriveInfoResponseBody } from "@/types/drive";

export const useDriveInfo = (playserve: UsePlayserveReturn) => {
  const { sendMessage } = playserve;
  const [drives, setDrives] = useState<DriveInfoResponseBody>([]);

  const sendDriveInfoMessage = useCallback(() => {
    const message = getMessage(MessageType.DriveInfo, {});
    sendMessage(message)()
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.body)) {
          setDrives(res.body);
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [sendMessage]);

  useEffect(() => {
    sendDriveInfoMessage();
  }, []);

  return {
    drives,
    fetchDrives: sendDriveInfoMessage
  };
};
