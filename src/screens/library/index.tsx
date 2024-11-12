import React from "react";
import { AppLibrary } from "../../components";
import { SidePanel } from "@/components/side-panel/side-panel";
import { selectAppLibraryAppsState } from "@/redux/modules";
import { useAppSelector } from "@/redux/store";
import { SubmissionsContextProvider } from "@/context/submissions-context";
import { Sidebar } from "@/components/sidebar/sidebar";

export const LibraryScreen = () => {
  const apps = useAppSelector(selectAppLibraryAppsState);

  return (
    <>
      <div className="fixed left-0">
        <Sidebar />
      </div>
      <div className="h-screen flex">
        <div className="ml-[275px] mr-[345px] w-full bg-[--fill-subtler]">
          <AppLibrary />
          <div>
            <SubmissionsContextProvider>
              {!!apps.length && <SidePanel />}
            </SubmissionsContextProvider>
          </div>
        </div>
      </div>
    </>
  );
};
