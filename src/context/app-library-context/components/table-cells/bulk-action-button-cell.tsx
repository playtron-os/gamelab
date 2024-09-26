import React from "react";
import { useAppLibraryContext } from "@/context";
import { selectAppLibraryAppsState } from "@/redux/modules";
import { t } from "@lingui/macro";
import { Button } from "@playtron/styleguide";
import { useAppSelector } from "@/redux/store";

export const BulkActionButtonCell = () => {
  const apps = useAppSelector(selectAppLibraryAppsState);
  const {
    handlers: { openBulkActionsMenu }
  } = useAppLibraryContext();

  if (!apps.length) {
    return null;
  }

  return (
    <Button
      size="small"
      label={t`Bulk Actions`}
      onClick={openBulkActionsMenu}
    />
  );
};
