/// <reference types="vite/client" />
import { Divider, NoInternet, styles } from "@playtron/styleguide";

import React, { useEffect, useState } from "react";

import { version } from "../../../package.json";
import LogoLabs from "../../assets/labs-sm.png";
import { useAppDispatch } from "@/redux/store";
import { DriveSection } from "./drive-section";
import { ProviderSection } from "./provider-section";
import { ProfileMenu } from "./profile-menu";
import { t, Trans } from "@lingui/macro";
import { flashMessage } from "redux-flash";
import { getFromLocalStorage } from "@/utils/local-storage";

export const Sidebar: React.FC = () => {
  const [showNoInternetIcon, setShowNoInternetIcon] = useState(false);
  const [address, setAddress] = useState("-");
  const dispatch = useAppDispatch();
  useEffect(() => {
    window.addEventListener("offline", () => {
      dispatch(flashMessage(t`Disconnected from the internet`));
      setShowNoInternetIcon(true);
    });

    window.addEventListener("online", () => {
      setShowNoInternetIcon(false);
    });
    setAddress(getFromLocalStorage("last_ip"));
  }, []);
  return (
    <>
      <div className="relative w-[250px] px-4 py-2 border-r-2 border-gray-800 bg-black h-screen overflow-scroll select-none cursor-default">
        <img src={LogoLabs} alt={t`Playtron Labs`} className="p-2" />

        <Divider type="subtle" />
        <h4 className="font-bold text-lg mt-0 py-2">
          <Trans>Drives</Trans>
        </h4>
        <DriveSection />
        <Divider type="subtle" />
        <h4 className="font-bold text-lg py-2">
          <Trans>Providers</Trans>
        </h4>
        <ProviderSection />
        <Divider type="subtle" />
        <div>
          <h4 className="font-bold text-lg py-2">
            <Trans>Info</Trans>
          </h4>
          <span className="p-3 text-gray-400 text-small">{t`Connected to: ${address}`}</span>
          <br />
          <span className="p-3 text-gray-400 text-small">{t`Version: ${version}`}</span>
          <br />
          {showNoInternetIcon && (
            <>
              <span className="p-3 text-red-500 text-small flex items-center gap-2">
                <NoInternet
                  fill={styles.variablesDark.state["default-danger"]}
                />
                {t`No internet`}
              </span>
            </>
          )}
        </div>
        <footer className="fixed bottom-0 left-0 mr-4 p-1 w-[250px] overflow-hidden bg-black border-gray-800 border-r-2">
          <Divider type="subtle" />
          <ProfileMenu />
        </footer>
      </div>
    </>
  );
};
