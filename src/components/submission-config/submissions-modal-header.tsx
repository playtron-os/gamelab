import React, { useState } from "react";
import { Trans, t } from "@lingui/macro";
import { TextInput } from "@playtron/styleguide";
import { getImage } from "@/utils/app-info";
import { AppInformation, Submission } from "@/types";

export interface ConfigModalHeaderProps {
  currentApp: AppInformation;
  submissions: Submission[];
  configFilter: string;
  setConfigFilter: (filter: string) => void;
}

export const ConfigModalHeader: React.FC<ConfigModalHeaderProps> = ({
  currentApp,
  submissions,
  configFilter,
  setConfigFilter
}) => {
  const [authors] = useState([1]);
  return (
    <div className="flex gap-4 mb-4 p-8 ">
      <img
        src={getImage(currentApp.app.images)}
        alt=""
        width="100"
        height="56"
        className="flex-shrink rounded-s-md"
      />
      <div className="flex-grow">
        <p className="text-xl">{currentApp.app.name}</p>
        <p>
          <strong>{submissions.length}</strong>
          <span className="pe-2">
            {" "}
            <Trans>Config</Trans>
            {submissions.length > 1 ? "s" : ""}
          </span>
          <strong>{authors.length}</strong>
          <span>
            {" "}
            <Trans>Author</Trans>
            {authors.length > 1 ? "s" : ""}
          </span>
        </p>
      </div>
      <div>
        <TextInput
          placeholder={t`Search:`}
          value={configFilter}
          onChange={setConfigFilter}
        />
      </div>
    </div>
  );
};
