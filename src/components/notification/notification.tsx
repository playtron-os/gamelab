import React from "react";
import { useAppSelector } from "@/redux/store";
import { ErrorPopUp } from "@playtron/styleguide";
import { getLatestMessage } from "redux-flash";

export function Notification() {
  const flash = useAppSelector((state) => getLatestMessage(state));
  return (
    <>
      {flash && (
        <ErrorPopUp
          title="Error"
          message={flash.message}
          isOpen={flash}
          className="z-50"
          dismissText=""
        />
      )}
    </>
  );
}
