import React, { useState, useRef } from "react";
import { Trans, t } from "@lingui/macro";
import "./app-library.scss";
import { Tabs, Tab } from "@nextui-org/react";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
  ConfirmationPopUp,
  TextInput,
  ProgressSpinner
} from "@playtron/styleguide";
import { useConfirmationPopUp, useAppLibraryContext } from "@/context";
import { MoveAppDialog } from "../move-app-dialog";
import { BulkActionsMenu } from "../bulk-actions-menu/bulk-actions-menu";
import { selectAppLibraryState } from "@/redux/modules";
import { useAppSelector } from "@/redux/store";
import { AppInformation, AppProvider, AppStatus } from "@/types";
import { GameCard } from "./game-card";
import { getAppStatus } from "@/utils/app-info";

export const AppLibrary: React.FC = () => {
  const { apps, error, loading, appFilters } = useAppSelector(
    selectAppLibraryState
  );
  const parentRef = useRef<HTMLDivElement>(null);
  const { onSelectedIdsChange } = useAppLibraryContext();
  const [nameFilter, setNameFilter] = useState("");
  const [tabKey, setTabKey] = useState("installed");
  const { props: confirmationPopUpProps } = useConfirmationPopUp();

  const [selectedGame, setSelectedGame] = useState<AppInformation | null>(null);

  if (error) {
    return <span data-testid={"error-text"}>{error}</span>;
  }

  let totalInstalled = 0;

  if (!loading && !error && apps) {
    for (let i = 0; i < apps.length; i++) {
      if (apps[i].installed_app) {
        totalInstalled += 1;
      }
    }
  }
  const totalGames = apps ? apps.length : 0;
  let filteredGames = apps;

  const shownProviders = (
    Object.keys(appFilters.providers) as AppProvider[]
  ).filter((key) => appFilters.providers[key]);
  if (shownProviders.length < Object.keys(appFilters.providers).length) {
    filteredGames = filteredGames.filter((app) => {
      return shownProviders.some((provider) =>
        app.owned_apps.map((ownedApp) => ownedApp.provider).includes(provider)
      );
    });
  }

  if (tabKey === "installed") {
    if (appFilters.drives.length) {
      filteredGames = filteredGames.filter((app) => {
        return appFilters.drives.some(
          (drive) => app.installed_app?.install_config.install_disk === drive
        );
      });
    }
    filteredGames = filteredGames.filter(
      (app) => getAppStatus(app) !== AppStatus.NOT_DOWNLOADED
    );
  }

  if (nameFilter) {
    filteredGames = filteredGames.filter((app) =>
      app.app.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }
  const virtualizer = useVirtualizer({
    count: filteredGames.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    gap: 6,
    overscan: 10
  });

  return (
    <div className="w-full px-4 select-none cursor-default text-base">
      <div>
        <div className="flex">
          <div className="flex w-full flex-col">
            <Tabs
              aria-label="installedFilter"
              color="primary"
              variant="underlined"
              selectedKey={tabKey}
              onSelectionChange={(key: React.Key) => setTabKey(key.toString())}
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

          <div className="flex-col w-[380px] pt-2 pe-2">
            <TextInput
              placeholder={t`Search`}
              value={nameFilter}
              onChange={setNameFilter}
              isClearable={true}
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl my-3 px-2">
            {tabKey == "all"
              ? t`All Games (${totalGames})`
              : t`Installed Games (${totalInstalled})`}
          </h2>
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
                  const row = filteredGames[virtualRow.index];
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
                          onSelectedIdsChange(game.app.id);
                        }}
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
