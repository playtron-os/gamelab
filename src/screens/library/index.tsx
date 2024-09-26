import React from "react";
import { AppLibrary } from "../../components";
import { SidePanel } from "@/components/side-panel/side-panel";
import { selectAppLibraryAppsState } from "@/redux/modules";
import { useAppSelector } from "@/redux/store";
import { SubmissionsContextProvider } from "@/context/submissions-context";

export const LibraryScreen = () => {
  const apps = useAppSelector(selectAppLibraryAppsState);

  return (
    <div className="flex">
      <div className="flex-1 flex-col relative">
        <AppLibrary />
      </div>
      <SubmissionsContextProvider>
        {!!apps.length && (
          <div className="flex-col w-96 h-screen bg-black  overflow-scroll border-l border-gray-800">
            <SidePanel />
          </div>
        )}
      </SubmissionsContextProvider>
    </div>
  );
};
