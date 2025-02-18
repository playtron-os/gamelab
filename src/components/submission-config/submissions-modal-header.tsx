import React, { useMemo } from "react";
import { t, plural } from "@lingui/macro";
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
  const authors = useMemo(() => {
    if (!submissions) return 0;
    const authorSet = new Set();
    submissions.forEach((submission) => {
      authorSet.add(submission.author_id);
    });
    return authorSet.size;
  }, [submissions, currentApp]);
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
            {plural(submissions.length, { one: "Config", other: "Configs" })}
          </span>
          <strong>{authors}</strong>
          <span> {plural(authors, { one: "Author", other: "Authors" })}</span>
        </p>
      </div>
      <div>
        <TextInput
          placeholder={t`Search:`}
          value={configFilter}
          onChange={setConfigFilter}
          isClearable={true}
        />
      </div>
    </div>
  );
};
