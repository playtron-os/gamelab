import React, { useState, useRef, useMemo, useEffect } from "react";
import { Trans, t } from "@lingui/macro";
import "./app-library.scss";
import { Tabs, Tab } from "@nextui-org/react";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
  Button,
  ConfirmationPopUp,
  TextInput,
  Dropdown,
  ProgressSpinner
} from "@playtron/styleguide";
import {
  useConfirmationPopUp,
  useAppLibraryContext,
  useAutotestContext
} from "@/context";
import { MoveAppDialog } from "../move-app-dialog";
import { BulkActionsMenu } from "../bulk-actions-menu/bulk-actions-menu";
import {
  selectAppLibraryState,
  selectAppLibraryQueuePositionMapState,
  setStatusFilter
} from "@/redux/modules";
import { useAppActions, useAppSelector } from "@/redux/store";
import { AppInformation } from "@/types";
import { GameCard } from "./game-card";
import { FilterButton } from "./filter-button";
import { getAppStatusWithQueue } from "@/utils/app-info";
import {
  getHighestCompatibility,
  PlaytronCompatibilityLevel
} from "@/types/app-library/playtron-app/playtron-compatibility";

export const AppLibrary: React.FC = () => {
  const { apps, loading, appFilters } = useAppSelector(selectAppLibraryState);
  const { setStatusFilter: setStatusFilterDispatch } = useAppActions({
    setStatusFilter
  });
  const queuePositionMapState = useAppSelector(
    selectAppLibraryQueuePositionMapState
  );
  const parentRef = useRef<HTMLDivElement>(null);
  const { onSelectedIdChange, selectedApps, setSelectedApps } =
    useAppLibraryContext();
  const [nameFilter, setNameFilter] = useState("");
  const [sortKey, setSortKey] = useState("last_played");
  const autotest = useAutotestContext();
  const autotestRunning =
    autotest.state === "running" || autotest.state === "starting";
  const { props: confirmationPopUpProps } = useConfirmationPopUp();

  // Clear checkbox selections when a test run finishes
  const prevRunning = useRef(autotestRunning);
  useEffect(() => {
    if (prevRunning.current && !autotestRunning) {
      setSelectedApps(new Set());
    }
    prevRunning.current = autotestRunning;
  }, [autotestRunning, setSelectedApps]);

  const [selectedGame, setSelectedGame] = useState<AppInformation | null>(null);

  const filteredGames = useMemo(() => {
    let result = apps.filter((app) => app.is_owned);

    const shownProviders = (
      Object.keys(appFilters.providers) as string[]
    ).filter((key) => appFilters.providers[key]);
    if (shownProviders.length < Object.keys(appFilters.providers).length) {
      result = result.filter((app) => {
        return shownProviders.some((provider) =>
          app.owned_apps.map((ownedApp) => ownedApp.provider).includes(provider)
        );
      });
    }

    if (appFilters.status === "installed") {
      if (appFilters.drives.length) {
        result = result.filter((app) => {
          return appFilters.drives.some(
            (drive) => app.installed_app?.install_config.install_disk === drive
          );
        });
      }
      result = result.filter((app) => !!app.installed_app);
    }

    if (nameFilter) {
      const lower = nameFilter.toLowerCase();
      result = result.filter((app) =>
        app.app.name.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [
    apps,
    appFilters.providers,
    appFilters.status,
    appFilters.drives,
    nameFilter
  ]);
  const virtualizer = useVirtualizer({
    count: filteredGames.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    gap: 6,
    overscan: 10
  });

  const sortOptions = useMemo(
    () => [
      { id: 1, label: t`Name (A-Z)`, onClick: () => setSortKey("name") },
      { id: 2, label: t`Name (Z-A)`, onClick: () => setSortKey("-name") },
      { id: 3, label: t`Game Size`, onClick: () => setSortKey("size") },
      { id: 4, label: t`Game Status`, onClick: () => setSortKey("status") },
      {
        id: 6,
        label: t`Install Date`,
        onClick: () => setSortKey("install_date")
      },
      {
        id: 8,
        label: t`Last Updated`,
        onClick: () => setSortKey("last_updated")
      },
      {
        id: 9,
        label: t`Last Played`,
        onClick: () => setSortKey("last_played")
      },
      {
        id: 10,
        label: t`Compatibility`,
        onClick: () => setSortKey("compatibility")
      }
    ],
    []
  );
  const sortLabel = useMemo(() => {
    switch (sortKey) {
      case "name":
        return t`Sort by: Name (A-Z)`;
      case "-name":
        return t`Sort by: Name (Z-A)`;
      case "size":
        return t`Sort by: Game Size`;
      case "status":
        return t`Sort by: Game Status`;
      case "install_date":
        return t`Sort by: Install Date`;
      case "last_updated":
        return t`Sort by: Last Updated`;
      case "last_played":
        return t`Sort by: Last Played`;
      case "compatibility":
        return t`Sort by: Compatibility`;
      default:
        return t`???`;
    }
  }, [sortKey]);

  const sortedGames = useMemo(() => {
    const sorted = [...filteredGames];
    sorted.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.app.name.localeCompare(b.app.name);
        case "-name":
          return b.app.name.localeCompare(a.app.name);
        case "size":
          if (!a.installed_app?.install_config?.disk_size) {
            return 1;
          }
          if (!b.installed_app?.install_config?.disk_size) {
            return -1;
          }
          return (
            b.installed_app?.install_config?.disk_size -
            a.installed_app?.install_config?.disk_size
          );
        case "status":
          if (!a.installed_app) return -1;
          if (!b.installed_app) return 1;
          return (
            getAppStatusWithQueue(
              b,
              b.installed_app?.owned_app.id,
              queuePositionMapState
            ) -
            getAppStatusWithQueue(
              a,
              a.installed_app?.owned_app.id,
              queuePositionMapState
            )
          );
        case "install_date":
          if (!a.installed_app?.created_at) return 1;
          if (!b.installed_app?.created_at) return -1;
          return (
            new Date(b.installed_app?.created_at || "").getTime() -
            new Date(a.installed_app?.created_at || "").getTime()
          );
        case "last_updated":
          if (!a.installed_app?.updated_at) return 1;
          if (!b.installed_app?.updated_at) return -1;
          return (
            new Date(b.installed_app?.updated_at || "").getTime() -
            new Date(a.installed_app?.updated_at || "").getTime()
          );
        case "last_played":
          if (!a.installed_app?.launched_at) return 1;
          if (!b.installed_app?.launched_at) return -1;
          return (
            new Date(b.installed_app?.launched_at || "").getTime() -
            new Date(a.installed_app?.launched_at || "").getTime()
          );
        case "compatibility": {
          const rankMap: Record<PlaytronCompatibilityLevel, number> = {
            [PlaytronCompatibilityLevel.Verified]: 0,
            [PlaytronCompatibilityLevel.Compatible]: 1,
            [PlaytronCompatibilityLevel.NotWorking]: 2,
            [PlaytronCompatibilityLevel.Unsupported]: 3,
            [PlaytronCompatibilityLevel.Unknown]: 4
          };
          const aLevel = a.app.compatibility
            ? getHighestCompatibility(a.app.compatibility)
            : PlaytronCompatibilityLevel.Unknown;
          const bLevel = b.app.compatibility
            ? getHighestCompatibility(b.app.compatibility)
            : PlaytronCompatibilityLevel.Unknown;
          return rankMap[aLevel] - rankMap[bLevel];
        }
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredGames, sortKey]);

  const filteredGamesCount = useMemo(() => {
    return filteredGames.length;
  }, [filteredGames]);

  return (
    <div className="w-full px-4 select-none cursor-default text-base">
      <div>
        <div className="flex">
          <div className="flex flex-grow flex-col">
            <Tabs
              aria-label="installedFilter"
              color="primary"
              variant="underlined"
              selectedKey={appFilters.status}
              onSelectionChange={(key: React.Key) => {
                setStatusFilterDispatch(key.toString());
              }}
              classNames={{
                tabList:
                  // eslint-disable-next-line lingui/no-unlocalized-strings
                  "gap-6 w-full relative rounded-none p-0 border-divider",
                // eslint-disable-next-line lingui/no-unlocalized-strings
                cursor: "w-full bg-[--state-default]",
                // eslint-disable-next-line lingui/no-unlocalized-strings
                tab: "max-w-fit px-3 h-12 text-lg",
                tabContent: "group-data-[selected=true]:text-white"
              }}
            >
              <Tab
                key="all"
                title={
                  <div className="flex items-center space-x-2">
                    <span>
                      <Trans>All Games</Trans>
                    </span>
                  </div>
                }
              />
              <Tab
                key="installed"
                title={
                  <div className="flex items-center space-x-2">
                    <span>
                      <Trans>Installed</Trans>
                    </span>
                  </div>
                }
              />
            </Tabs>
          </div>

          <div className="flex-col pt-2 pe-2 w-[250px]">
            <TextInput
              className="w-[240px]"
              placeholder={t`Search`}
              value={nameFilter}
              onChange={setNameFilter}
              isClearable={true}
            />
          </div>
        </div>
        <div className="flex">
          <h2 className="text-2xl my-3 px-2 flex-grow">
            {appFilters.status == "all"
              ? t`All Games (${filteredGamesCount})`
              : t`Installed Games (${filteredGamesCount})`}
          </h2>
          <div className="flex items-center gap-2 pe-2">
            {autotestRunning ? (
              <>
                <span className="text-sm text-[--text-tertiary]">
                  {(() => {
                    if (autotest.state === "starting")
                      return t`Uploading tests...`;
                    const completed = autotest.completed;
                    const total = autotest.total;
                    return t`Testing ${completed}/${total}...`;
                  })()}
                </span>
                <Button
                  label={t`Stop Autotest`}
                  size="small"
                  onClick={() => autotest.stopAutotest()}
                />
              </>
            ) : autotest.selectMode ? (
              <>
                {selectedApps.size > 0 && (
                  <Button
                    label={(() => {
                      const count = selectedApps.size;
                      return t`Run Autotest (${count})`;
                    })()}
                    size="small"
                    onClick={() => {
                      const appById = new Map(
                        apps.map((app) => [app.app.id, app])
                      );
                      const selected = [...selectedApps]
                        .map((id) => appById.get(id))
                        .filter((app): app is AppInformation => !!app);
                      autotest.startAutotest(selected);
                      autotest.exitSelectMode();
                    }}
                  />
                )}
                <Button
                  label={t`Cancel`}
                  size="small"
                  onClick={() => {
                    autotest.exitSelectMode();
                    setSelectedApps(new Set());
                  }}
                />
              </>
            ) : (
              <Button
                label={t`Autotest`}
                size="small"
                onClick={() => autotest.enterSelectMode()}
              />
            )}
          </div>
          <div className="flex items-center pe-2 w-[250px]">
            <Dropdown
              triggerElem={<FilterButton label={sortLabel} />}
              data={sortOptions}
            />
          </div>
        </div>

        {loading ? (
          <div className="absolute top-0 bottom-0 right-0 left-0 h-screen w-screen bg-black/40 z-20">
            <div className="flex width-full h-screen w-screen justify-center items-center">
              <ProgressSpinner size={48} />
            </div>
          </div>
        ) : (
          <>
            <div
              data-testid="app-library-table"
              ref={parentRef}
              className="h-[calc(100vh-125px)] w-full overflow-auto p-2"
            >
              <div
                className="w-full relative"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const row = sortedGames[virtualRow.index];
                  if (!row) return null;
                  return (
                    <div
                      key={virtualRow.key}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`
                      }}
                    >
                      <GameCard
                        game={row}
                        selectedId={selectedGame?.app.id}
                        onSelectGame={(game) => {
                          setSelectedGame(game);
                          onSelectedIdChange(game.app.id);
                        }}
                        autotestStatus={autotest.getGameStatus(row)}
                        autotestSelectMode={autotest.selectMode}
                        autotestRunning={autotestRunning}
                        autotestInManifest={autotest.isInManifest(row)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {apps.length > 0 && <BulkActionsMenu />}
            <ConfirmationPopUp className="z-50" {...confirmationPopUpProps} />
            <MoveAppDialog />
          </>
        )}
      </div>
    </div>
  );
};
