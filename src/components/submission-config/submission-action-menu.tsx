import React from "react";
import { t } from "@lingui/macro";
import { useAppSelector } from "@/redux/store";
import { selectAuthState, AuthState } from "@/redux/modules/auth";
import { Dropdown, DotsVertical, styles } from "@playtron/styleguide";

import { useSubmissionsContext } from "@/context/submissions-context";
import { Submission } from "@/types";

interface SubmissionMenuProps {
  submission: Submission;
}

export const SubmissionActionMenu: React.FC<SubmissionMenuProps> = ({
  submission
}) => {
  const { email } = useAppSelector(selectAuthState) as AuthState;

  const {
    askDeleteSubmission,
    copySubmission,
    submitSubmission,
    promoteSubmission,
    setEditLaunchConfig,
    setEditLayout
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
    label: t`Edit`,
    onClick: () => {
      if (submission.submission_item_type === "LaunchConfig") {
        setEditLaunchConfig(submission);
      } else {
        setEditLayout(submission);
      }
    }
  });

  appActions.push({
    id: 3,
    label: t`Duplicate`,
    onClick: () =>
      copySubmission(
        submission.item_id,
        submission.submission_item_type,
        submission.app_id
      )
  });

  appActions.push({
    id: 4,
    label: t`Delete`,
    onClick: () => {
      askDeleteSubmission(
        submission.item_id,
        submission.submission_item_type,
        submission.app_id
      );
    }
  });

  if (
    email?.endsWith("@playtron.one") &&
    submission.submission_category !== "Official"
  ) {
    appActions.push({
      id: 5,
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
          data-testid={`app-action-cell-${submission.item_id}`}
          fill={styles.variablesDark.fill.white}
          className="cursor-pointer"
        />
      }
    />
  );
};
