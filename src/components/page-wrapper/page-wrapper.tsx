import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar/sidebar";

export const PageWrapper: React.FC = () => {
  return (
    <div className="h-screen">
      <div className="fixed left-0 bg-black">
        <Sidebar />
      </div>
      <div className="flex-1 ml-[290px] bg-[--fill-subtler]">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
