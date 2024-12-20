import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./routes";

import "@playtron/styleguide/dist/style.css";
import "./main.scss";
import "./index.css";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  ConfirmationPopUpContextProvider,
  AppLibraryContextProvider,
  LoadingSpinnerContextProvider
} from "./context";
import { PersistGate } from "redux-persist/integration/react";
import { Notification } from "./components/notification";
import { defaultLocale, dynamicActivate } from "./i18n";
import { checkForAppUpdates } from "./updater";
import { attachConsole } from "@tauri-apps/plugin-log";

const container = document.getElementById("root")!;
const root = createRoot(container);

if (!import.meta.env.DEV) {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
}

export const Main = () => {
  useEffect(() => {
    checkForAppUpdates();
    dynamicActivate(defaultLocale);
    attachConsole();
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LoadingSpinnerContextProvider>
            <ConfirmationPopUpContextProvider>
              <AppLibraryContextProvider>
                <Routes />
                <Notification />
              </AppLibraryContextProvider>
            </ConfirmationPopUpContextProvider>
          </LoadingSpinnerContextProvider>
        </PersistGate>
      </Provider>
    </I18nProvider>
  );
};

root.render(<Main />);
