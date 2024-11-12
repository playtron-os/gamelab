import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { NotFoundScreen, ConnectDeviceScreen } from "./screens";
import { LibraryScreen } from "./screens/library";
import { ProtectedRouteElementWrapper } from "./components/protected-route-element-wrapper";
import { useAppLibraryManager } from "./hooks/app-library";

const router = createBrowserRouter([
  {
    path: "/auth/connect",
    element: <ConnectDeviceScreen />
  },
  {
    path: "*",
    element: <NotFoundScreen />
  },
  {
    element: <Outlet />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRouteElementWrapper>
            <LibraryScreen />
          </ProtectedRouteElementWrapper>
        )
      }
    ]
  }
]);

export function Routes() {
  useAppLibraryManager();

  return <RouterProvider router={router} />;
}
