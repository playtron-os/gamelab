import React from "react";
import { CellContext, HeaderContext } from "@tanstack/table-core";
import { Checkbox } from "@playtron/styleguide";
import { PlaytronAppType, AppInformation } from "@/types/app-library";
import { useAppSelector } from "@/redux/store";
import { selectAppLibraryAppsState } from "@/redux/modules";
import { useAppLibraryContext } from "@/context";

export type NullCellContext =
  | HeaderContext<AppInformation, unknown>
  | CellContext<AppInformation, unknown>;

// TODO - Look into refactoring this, better name for appInfos at least?
export const LibraryCheckbox: React.FC<NullCellContext> = (info) => {
  let appInfo: AppInformation | undefined = undefined;
  if ("row" in info) {
    appInfo = info?.row?.original;
  }
  const appInfos = useAppSelector(selectAppLibraryAppsState);
  const { selectedApps, setSelectedApps } = useAppLibraryContext();
  const allAppsSelected = selectedApps.size === appInfos?.length;

  const handleAppChange = () => {
    if (!appInfo) {
      return;
    }
    const newSelectedApps = new Set(selectedApps);
    if (selectedApps.has(appInfo.app.id)) {
      newSelectedApps.delete(appInfo.app.id);
    } else {
      newSelectedApps.add(appInfo.app.id);
    }
    setSelectedApps(newSelectedApps);
  };

  const handleHeaderChange = () => {
    setSelectedApps(
      allAppsSelected
        ? new Set()
        : new Set(appInfos.map((appInfo) => appInfo.app.id))
    );
  };

  if (appInfo && appInfo?.app?.appType != PlaytronAppType.Tool) {
    return (
      <span className="flex items-center justify-center me-4 rounded-r-xl">
        <Checkbox
          checked={selectedApps.has(appInfo.app.id)}
          onChange={handleAppChange}
        />
      </span>
    );
  }

  if (appInfos?.length) {
    return <Checkbox checked={allAppsSelected} onChange={handleHeaderChange} />;
  }

  return null;
};
