import React, { PropsWithChildren } from "react";
import bgImage from "../../assets/authbg.png";
import LogoLAB from "../../assets/labs-lg.png";
import { t } from "@lingui/macro";

export const SigninLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh"
      }}
    >
      <div className="w-1/2">
        <div className="w-[340px]">
          <img src={LogoLAB} alt={t`Playtron GameLAB`} />
          {children}
        </div>
      </div>
    </div>
  );
};
