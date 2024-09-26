/// <reference types="vite-plugin-svgr/client" />
import {
  selectAppLibraryState,
  setShowSteam,
  setShowGOG,
  setShowEpic
} from "@/redux/modules";
import { RootState, useAppActions, useAppSelector } from "@/redux/store";
import { t } from "@lingui/macro";
import { AppProvider } from "@/types/platform-auth";
import React from "react";
import { AppsFill, EpicFill, GogFill, SteamFill } from "@playtron/styleguide";

import { Provider } from "./provider";

const selector = (state: RootState) => {
  const appLibrary = selectAppLibraryState(state);
  return {
    apps: appLibrary.apps,
    error: appLibrary.error,
    loading: appLibrary.loading,
    loadingProgress: appLibrary.loadingProgress,
    appFilters: appLibrary.appFilters
  };
};

export const ProviderSection: React.FC = () => {
  const { apps, error, loading, loadingProgress, appFilters } =
    useAppSelector(selector);

  const {
    setShowSteam: setShowSteamDispatch,
    setShowGOG: setShowGOGDispatch,
    setShowEpic: setShowEpicDispatch
  } = useAppActions({
    setShowSteam,
    setShowGOG,
    setShowEpic
  });
  const showSteam = appFilters.providers[AppProvider.Steam];
  const showEpic = appFilters.providers[AppProvider.EpicGames];
  const showGOG = appFilters.providers[AppProvider.Gog];
  let totalInstalled = 0;

  const showAll =
    appFilters.providers[AppProvider.Steam] &&
    appFilters.providers[AppProvider.Gog] &&
    appFilters.providers[AppProvider.EpicGames];

  const totalProviderGames: { [key: string]: number } = {
    [AppProvider.Steam]: 0,
    [AppProvider.Gog]: 0,
    [AppProvider.EpicGames]: 0
  };
  const installedGames: { [key: string]: number } = {
    [AppProvider.Steam]: 0,
    [AppProvider.Gog]: 0,
    [AppProvider.EpicGames]: 0
  };

  if (!loading && !error && apps) {
    for (let i = 0; i < apps.length; i++) {
      const installed_app = apps[i].installed_app;
      const owned_apps = apps[i].owned_apps;
      if (installed_app) {
        installedGames[installed_app.owned_app.provider] += 1;
        totalInstalled += 1;
      }
      for (let j = 0; j < owned_apps.length; j++) {
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
          setShowEpicDispatch(!showAll);
          setShowGOGDispatch(!showAll);
          setShowSteamDispatch(!showAll);
        }}
      />
      <Provider
        provider={AppProvider.EpicGames}
        Icon={EpicFill}
        installed={installedGames.epicgames}
        total={totalProviderGames.epicgames}
        enabled={showEpic}
        loadingProgress={
          loading ? (loadingProgress[AppProvider.EpicGames] ?? 0) : 0
        }
        onClick={() => setShowEpicDispatch(!showEpic)}
      />
      <Provider
        provider={AppProvider.Steam}
        Icon={SteamFill}
        installed={installedGames.steam}
        total={totalProviderGames.steam}
        enabled={showSteam}
        loadingProgress={
          loading ? (loadingProgress[AppProvider.Steam] ?? 0) : 0
        }
        onClick={() => setShowSteamDispatch(!showSteam)}
      />

      <Provider
        provider={AppProvider.Gog}
        Icon={GogFill}
        installed={installedGames.gog}
        total={totalProviderGames.gog}
        enabled={showGOG}
        loadingProgress={loading ? (loadingProgress[AppProvider.Gog] ?? 0) : 0}
        onClick={() => setShowGOGDispatch(!showGOG)}
      />
    </section>
  );
};
