import React from "react";
import { Outlet } from "react-router-dom";

export const PageWrapper: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
