import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { NotFoundScreen, ConnectDeviceScreen } from "./screens";
import { LibraryScreen } from "./screens/library";
import { ProtectedRouteElementWrapper } from "./components/protected-route-element-wrapper";

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
  return <RouterProvider router={router} />;
}
