import React from "react";
import { t } from "@lingui/macro";
import { useAppSelector } from "@/redux/store";
import { selectAuthState, AuthState } from "@/redux/modules/auth";
import { Dropdown, DotsVertical, styles } from "@playtron/styleguide";
import { CellContext } from "@tanstack/react-table";
import { useSubmissionsContext } from "@/context/submissions-context";
import { Submission } from "@/types";

export type SubmissionCellContext = CellContext<Submission, unknown>;

export const SubmissionActionCell = (info: SubmissionCellContext) => {
  const submission = info.row.original;
  const { email } = useAppSelector(selectAuthState) as AuthState;
  const {
    askDeleteSubmission,
    copySubmission,
    submitSubmission,
    promoteSubmission
  } = useSubmissionsContext();

  const appActions = [];

  appActions.push({
    id: 1,
    label: t`Submit`,
    onClick: () => {
      submitSubmission(
        submission.item_id,
        submission.submission_item_type,
        submission.app_id
      );
    }
  });

  appActions.push({
    id: 2,
    label: t`Duplicate`,
    onClick: () =>
      copySubmission(
        submission.item_id,
        submission.submission_item_type,
        submission.app_id
      )
  });

  appActions.push({
    id: 3,
    label: t`Delete`,
    onClick: () => {
      askDeleteSubmission(
        submission.item_id,
        submission.submission_item_type,
        submission.app_id
      );
    }
  });
  if (email?.endsWith("@playtron.one")) {
    appActions.push({
      id: 4,
      label: t`Promote`,
      onClick: () => {
        promoteSubmission(
          submission.item_id,
          submission.submission_item_type,
          submission.app_id
        );
      }
    });
  }

  return (
    <Dropdown
      data={appActions}
      triggerElem={
        <DotsVertical
          data-testid={`app-action-cell-${info.row.index}`}
          fill={styles.variablesDark.fill.white}
          className="cursor-pointer"
        />
      }
    />
  );
};
