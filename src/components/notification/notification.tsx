import React from "react";
import { useAppSelector } from "@/redux/store";
import { ErrorPopUp } from "@playtron/styleguide";
import { getLatestMessage } from "redux-flash";
import { t } from "@lingui/macro";

export function Notification() {
  const flash = useAppSelector((state) => getLatestMessage(state));
  return (
    <>
      {flash && (
        <ErrorPopUp
          title={flash.isError ? t`Error` : ""}
          message={flash.message}
          isOpen={flash}
          className="z-50"
          dismissText=""
        />
      )}
    </>
  );
}
