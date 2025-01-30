/// <reference types="vite-plugin-svgr/client" />
import { selectAppLibraryState, setShowProvider } from "@/redux/modules";
import { RootState, useAppActions, useAppSelector } from "@/redux/store";
import { t } from "@lingui/macro";
import { AppProvider } from "@/types/platform-auth";
import React from "react";
import {
  AppsFill,
  EpicFill,
  ErrorWarningFill,
  GogFill,
  SteamFill
} from "@playtron/styleguide";

import { Provider } from "./provider";

const selector = (state: RootState) => {
  const appLibrary = selectAppLibraryState(state);
  return {
    apps: appLibrary.apps,
    availableProviders: appLibrary.availableProviders,
    loading: appLibrary.loading,
    loadingProgress: appLibrary.loadingProgress,
    appFilters: appLibrary.appFilters
  };
};

export const ProviderSection: React.FC = () => {
  const { apps, loading, loadingProgress, appFilters, availableProviders } =
    useAppSelector(selector);

  const { setShowProvider: setShowProviderDispatch } = useAppActions({
    setShowProvider
  });
  let totalInstalled = 0;

  const showAll = availableProviders.every(
    (provider) => appFilters.providers[provider]
  );

  const totalProviderGames: { [key: string]: number } = {};
  const installedGames: { [key: string]: number } = {};

  if (!loading && apps) {
    for (let i = 0; i < apps.length; i++) {
      const installed_app = apps[i].installed_app;
      const owned_apps = apps[i].owned_apps;
      if (installed_app) {
        if (!installedGames[installed_app.owned_app.provider])
          installedGames[installed_app.owned_app.provider] = 0;
        installedGames[installed_app.owned_app.provider] += 1;
        totalInstalled += 1;
      }
      for (let j = 0; j < owned_apps.length; j++) {
        if (!totalProviderGames[owned_apps[j].provider])
          totalProviderGames[owned_apps[j].provider] = 0;
        totalProviderGames[owned_apps[j].provider] += 1;
      }
    }
  }
  const totalGames = apps ? apps.length : 0;

  return (
    <section className="my-4">
      <Provider
        name={t`All`}
        Icon={AppsFill}
        installed={totalInstalled}
        total={totalGames}
        enabled={showAll}
        loadingProgress={0}
        onClick={() => {
          availableProviders.forEach((provider) =>
            setShowProvider({ provider, show: !showAll })
          );
        }}
      />
      {availableProviders.map((provider) => {
        let icon;
        switch (provider) {
          case AppProvider.Steam:
            icon = SteamFill;
            break;
          case AppProvider.EpicGames:
            icon = EpicFill;
            break;
          case AppProvider.Gog:
            icon = GogFill;
            break;
          default:
            icon = ErrorWarningFill;
            break;
        }
        return (
          <Provider
            key={provider}
            provider={provider}
            Icon={icon}
            installed={installedGames[provider] || 0}
            total={totalProviderGames[provider] || 0}
            enabled={appFilters.providers[provider]}
            loadingProgress={loading ? (loadingProgress[provider] ?? 0) : 0}
            onClick={() =>
              setShowProviderDispatch({
                provider,
                show: !appFilters.providers[provider]
              })
            }
          />
        );
      })}
    </section>
  );
};
