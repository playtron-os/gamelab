import { UsePlayserveReturn } from "@/hooks";
import { MessageType, getMessage } from "@/types";
import { useCallback, useState } from "react";
import { ControllerInfo } from "@/types/input-config";

export const useInputDevice = (playserve: UsePlayserveReturn) => {
  const { sendMessage } = playserve;
  const [inputDevices, setInputDevices] = useState<ControllerInfo[]>([]);

  const getInputDevices = useCallback(async () => {
    const message = getMessage(MessageType.InputDevicesGet, {});
    return await sendMessage(message)()
      .then((res) => {
        if (res.status === 200) {
          const devices = Object.values(res.body);
          setInputDevices(devices);
          return devices;
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [sendMessage]);

  return {
    inputDevices,
    setInputDevices,
    getInputDevices
  };
};
