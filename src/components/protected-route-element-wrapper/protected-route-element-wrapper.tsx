import React from "react";

import { selectAuthState } from "@/redux/modules";
import { useAppSelector } from "@/redux/store";
import { Navigate } from "react-router-dom";

type ProtectedRouteElementWrapperProps = {
  children: React.ReactNode | React.ReactNode[];
};

export const ProtectedRouteElementWrapper: React.FC<
  ProtectedRouteElementWrapperProps
> = ({ children = null }) => {
  const authState = useAppSelector(selectAuthState);
  if (!authState.isAuthenticated) {
    return <Navigate to="/auth/connect" replace />;
  }

  return <>{children}</>;
};
