import React from "react";
import { t } from "@lingui/macro";
import { useSubmissionsType } from "@/context/submissions-context";
import {
  Button,
  EditBoxLine,
  ArrowDropRightFill,
  Plus,
  styles,
  ProgressSpinner
} from "@playtron/styleguide";
import { Submission } from "@/types";
import classNames from "classnames";

interface ConfigSelectProps {
  submissions: useSubmissionsType;
  setIsConfigOpen: (value: boolean) => void;
  setEditItem: (value: Submission | null) => void;
}

export const ConfigSelect: React.FC<ConfigSelectProps> = ({
  submissions,
  setIsConfigOpen,
  setEditItem
}) => {
  return (
    <div
      className={classNames("flex items-center cursor-pointer", {
        "opacity-70": submissions.loading,
        "cursor-wait": submissions.loading
      })}
    >
      <div
        tabIndex={0}
        onClick={() => !submissions.loading && setIsConfigOpen(true)}
        className="outline-hover border border-[--stroke-subtle] rounded-md flex flex-grow my-2 "
      >
        {submissions.loading ? (
          <span className="p-2">
            <ProgressSpinner size={24} />
          </span>
        ) : (
          <>
            <span className="flex-none p-2 max-w-80 overflow-clip whitespace-nowrap">
              {submissions.selectedItem
                ? submissions.selectedItem.name
                : submissions.submissions.length === 0
                  ? t`Add Config`
                  : t`Select Config`}
            </span>
            <span className="flex-grow"></span>
            <span className="flex-none p-2 text-[--fill-normal]">
              {submissions.submissions.length > 0 ? (
                <ArrowDropRightFill fill={styles.variablesDark.fill.white} />
              ) : (
                <Plus fill={styles.variablesDark.fill.white} />
              )}
            </span>
          </>
        )}
      </div>
      {submissions.selectedItem && (
        <div className="flex-shrink ps-2">
          <Button
            Icon={EditBoxLine}
            onClick={() => {
              setEditItem(submissions.selectedItem);
              setIsConfigOpen(true);
            }}
          />
        </div>
      )}
    </div>
  );
};
