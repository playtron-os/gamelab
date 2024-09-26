import { UsePlayservReturn } from "@/hooks";
import { MessageType, getMessage } from "@/types";
import { useCallback, useState } from "react";
import { ControllerInfo } from "@/types/input-config";

export const useInputDevice = (playserve: UsePlayservReturn) => {
  const { sendMessage } = playserve;
  const [inputDevices, setInputDevices] = useState<ControllerInfo[]>([]);

  const getInputDevices = useCallback(() => {
    const message = getMessage(MessageType.InputDevicesGet, {});
    sendMessage(message)()
      .then((res) => {
        if (res.status === 200) {
          setInputDevices(Object.values(res.body));
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
