import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { NotFoundScreen, ConnectDeviceScreen } from "./screens";
import { LibraryScreen } from "./screens/library";
import { ProtectedRouteElementWrapper } from "./components/protected-route-element-wrapper";
import { useAppLibraryManager } from "./hooks/app-library";
import { PageWrapper } from "@/components/page-wrapper";

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
    element: <PageWrapper />,
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
