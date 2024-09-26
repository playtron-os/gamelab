import React from "react";
import { LibraryCheckbox } from "@/components";
import { useAppLibraryContext } from "@/context/app-library-context";
import { STEAM_APP_INFORMATION_MOCKS } from "@/mocks/app";
import { CONNECTED_PROVIDER_ACCOUNT_STATE } from "@/mocks/provider-account-state";
import {
  APP_LIBRARY_INITIAL_STATE,
  accountsSlice,
  appLibrarySlice,
  authSlice
} from "@/redux/modules";
import { AppProvider } from "@/types";
import { renderWithAllContext } from "@/utils";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent } from "@testing-library/react";
import { DEFAULT_STATE_MOCK } from "@/mocks/default-state";
const mockAppInfo = STEAM_APP_INFORMATION_MOCKS[0];

jest.mock("@/context/app-library-context", () => ({
  ...jest.requireActual("@/context/app-library-context"),
  useAppLibraryContext: jest.fn()
}));

const getMockStore = () => {
  return configureStore({
    reducer: {
      appLibrary: appLibrarySlice.reducer,
      auth: authSlice.reducer,
      accounts: accountsSlice.reducer
    },
    preloadedState: {
      ...DEFAULT_STATE_MOCK,
      appLibrary: {
        ...APP_LIBRARY_INITIAL_STATE,
        apps: [mockAppInfo]
      },
      accounts: {
        providers: {
          [AppProvider.Steam]: CONNECTED_PROVIDER_ACCOUNT_STATE,
          [AppProvider.Gog]: CONNECTED_PROVIDER_ACCOUNT_STATE,
          [AppProvider.EpicGames]: CONNECTED_PROVIDER_ACCOUNT_STATE
        }
      }
    }
  });
};

const RenderLibraryCheckbox = ({ isHeader }: { isHeader: boolean }) => {
  // FIXME: This is really bad, let's find a better way to do this test
  return (
    <LibraryCheckbox
      row={{ original: isHeader ? null : mockAppInfo } as any}
      // @ts-expect-error Ignore undefined complaints
      table={undefined}
      // @ts-expect-error Ignore undefined complaints
      column={undefined}
      // @ts-expect-error Ignore undefined complaints
      cell={undefined}
      // @ts-expect-error Ignore undefined complaints
      getValue={null}
      // @ts-expect-error Ignore undefined complaints
      renderValue={null}
    />
  );
};

describe("<LibraryCheckbox />", () => {
  it("should check the checkbox if app is selected", () => {
    const selectedApps = new Set([mockAppInfo.app.id]);
    (useAppLibraryContext as jest.Mock).mockReturnValue({
      selectedApps,
      setSelectedApps: jest.fn()
    });
    const { getByRole } = renderWithAllContext(
      <RenderLibraryCheckbox isHeader={false} />,
      undefined,
      getMockStore()
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should toggle app selection when clicked", () => {
    const setSelectedApps = jest.fn();
    (useAppLibraryContext as jest.Mock).mockReturnValue({
      selectedApps: new Set([]),
      setSelectedApps
    });
    const { getByRole } = renderWithAllContext(
      <RenderLibraryCheckbox isHeader={false} />,
      undefined,
      getMockStore()
    );
    const checkbox = getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(setSelectedApps).toHaveBeenCalled();
  });

  it("should check the header checkbox if all apps are selected is true", () => {
    const selectedApps = new Set([mockAppInfo.app.id]);
    (useAppLibraryContext as jest.Mock).mockReturnValue({
      selectedApps,
      setSelectedApps: jest.fn()
    });
    const { getByRole } = renderWithAllContext(
      <RenderLibraryCheckbox isHeader />,
      undefined,
      getMockStore()
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should invoke handleHeaderChange when header checkbox is clicked", () => {
    const setSelectedApps = jest.fn();
    (useAppLibraryContext as jest.Mock).mockReturnValue({
      selectedApps: new Set([]),
      setSelectedApps
    });
    const { getByRole } = renderWithAllContext(
      <RenderLibraryCheckbox isHeader />,
      undefined,
      getMockStore()
    );
    const checkbox = getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(setSelectedApps).toHaveBeenCalled();
  });
});
