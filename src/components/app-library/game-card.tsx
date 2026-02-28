import React, { memo, useState, useCallback } from "react";
import classNames from "classnames";
import { t, Trans } from "@lingui/macro";
import {
  Checkbox,
  DotsVertical,
  Dropdown,
  styles,
  EpicFill,
  GogFill,
  SteamFill,
  ErrorWarningFill,
  CheckCircleFill,
  CheckboxBlankCircleFill,
  ForbidFill,
  QuestionFill
} from "@playtron/styleguide";

import { AppDownloadStage, AppStatus, PlaytronAppType } from "@/types";
import { DriveInfoResponseBody } from "@/types/drive";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setCurrentApp,
  openProviderSelectionDialog,
  selectDrives
} from "@/redux/modules";

import { useAppStatus } from "@/hooks/app-library/use-app-status";

import { AppInformation, OwnedApp } from "@/types/app-library";
import {
  PlaytronCompatibilityLevel,
  getHighestCompatibility,
  getCompatibilityLabel
} from "@/types/app-library/playtron-app/playtron-compatibility";
import { AppProvider } from "@/types/platform-auth";
import { useAppLibraryContext, type AutotestGameStatus } from "@/context";
import { useSubmissionsContext } from "@/context/submissions-context";
import {
  getImage,
  getProgress,
  getDiskSize,
  getDriveLabel,
  getAppStatusLabel,
  getAppActionLabelByStatus
} from "@/utils/app-info";

const autotestStatusEmoji = (status: string | undefined): string | null => {
  switch (status) {
    case "pass":
      return "\u2705";
    case "fail":
      return "\u274C";
    case "error":
      return "\u26A0\uFE0F";
    default:
      return null;
  }
};

export interface GameCardProps {
  game: AppInformation;
  selectedId: string | undefined;
  onSelectGame: (game: AppInformation) => void;
  autotestStatus: AutotestGameStatus;
  autotestSelectMode: boolean;
  autotestRunning: boolean;
  autotestInManifest: boolean;
}

export const getProviderIcon = (
  provider: string,
  color: string = styles.variablesDark.fill.normal,
  size: number = 20
) => {
  switch (provider) {
    case AppProvider.EpicGames:
      return <EpicFill fill={color} width={size} height={size} />;
    case AppProvider.Gog:
      return <GogFill fill={color} width={size} height={size} />;
    case AppProvider.Steam:
      return <SteamFill fill={color} width={size} height={size} />;
    default:
      return <ErrorWarningFill fill={color} width={size} height={size} />;
  }
};

const getCompatibilityIcon = (
  level: PlaytronCompatibilityLevel,
  size: number = 16
) => {
  switch (level) {
    case PlaytronCompatibilityLevel.Verified:
      return (
        <CheckCircleFill
          fill={styles.variablesDark.feedback["success-primary"]}
          width={size}
          height={size}
        />
      );
    case PlaytronCompatibilityLevel.Compatible:
      return (
        <CheckboxBlankCircleFill
          fill={styles.variablesDark.state["default"]}
          width={size}
          height={size}
        />
      );
    case PlaytronCompatibilityLevel.NotWorking:
      return (
        <ErrorWarningFill
          fill={styles.variablesDark.feedback["error-primary"]}
          width={size}
          height={size}
        />
      );
    case PlaytronCompatibilityLevel.Unsupported:
      return (
        <ForbidFill
          fill={styles.variablesDark.feedback["error-primary"]}
          width={size}
          height={size}
        />
      );
    case PlaytronCompatibilityLevel.Unknown:
      return (
        <QuestionFill
          fill={styles.variablesDark.fill.normal}
          width={size}
          height={size}
        />
      );
  }
};

const GameCardInner: React.FC<GameCardProps> = ({
  game,
  selectedId,
  onSelectGame,
  autotestStatus,
  autotestSelectMode,
  autotestRunning,
  autotestInManifest
}) => {
  const dispatch = useAppDispatch();
  const [isSelected, setIsSelected] = useState(false);
  const {
    handlers: { uninstallApp, handleAppDefaultAction, openMoveAppDialog },
    selectedApps,
    setSelectedApps
  } = useAppLibraryContext();
  const handleSelectGame = () => {
    setIsSelected(!isSelected);
    onSelectGame(game);
  };
  const { onSelectedIdChange } = useAppLibraryContext();

  const handleCheckboxToggle = () => {
    const newSelectedApps = new Set(selectedApps);
    if (selectedApps.has(game.app.id)) {
      newSelectedApps.delete(game.app.id);
    } else {
      newSelectedApps.add(game.app.id);
    }
    setSelectedApps(newSelectedApps);
  };
  const { launchParams } = useSubmissionsContext();
  const status = useAppStatus(game, game.installed_app?.owned_app.id);
  const drives: DriveInfoResponseBody = useAppSelector(selectDrives);
  const progress = Math.round(getProgress(game.installed_app));
  let statusLabel: string;
  if (progress) {
    statusLabel = `${getAppStatusLabel(status)} (${progress}%)`;
  } else {
    statusLabel = getAppStatusLabel(status);
  }

  const handleLaunchParams = useCallback(() => {
    onSelectedIdChange(game.app.id);
    setCurrentApp(game);
    let ownedAppId = game.installed_app?.owned_app.id;
    if (!ownedAppId) {
      if (game.owned_apps.length === 1) {
        ownedAppId = game.owned_apps[0].id;
      } else {
        dispatch(openProviderSelectionDialog());
        return;
      }
    }
    handleAppDefaultAction(game, ownedAppId, launchParams);
  }, [launchParams, game]);

  const appActions = [];
  // Main action button
  const buttonLabel = getAppActionLabelByStatus(status);

  if (buttonLabel && game.app.appType !== PlaytronAppType.Tool) {
    appActions.push({
      id: 1,
      label: buttonLabel,
      onClick: () => handleLaunchParams()
    });
  }

  // Move Button
  if (
    game.installed_app?.download_status.stage == AppDownloadStage.DONE &&
    drives.length > 1
  ) {
    appActions.push({
      id: 2,
      label: t`Move`,
      onClick: () => openMoveAppDialog([game])
    });
  }

  // Uninstall Button
  const supportedStatuses = [
    AppStatus.READY,
    AppStatus.DOWNLOADING,
    AppStatus.QUEUED,
    AppStatus.PAUSED,
    AppStatus.UPDATE_REQUIRED
  ];
  if (supportedStatuses.includes(status)) {
    appActions.push({
      id: 3,
      label: t`Uninstall`,
      onClick: () => uninstallApp([game])
    });
  }

  const testEmoji = autotestStatusEmoji(autotestStatus);

  return (
    <div
      className={classNames(
        "flex flex-col w-full h-[60px] rounded-lg cursor-pointer hover:outline-1 hover:outline",
        selectedId === game.app.id
          ? "outline-2 outline-double bg-[--fill-default]"
          : "bg-[--fill-subtle]",
        autotestStatus === "testing" && "autotest-active",
        autotestStatus === "queued" && "autotest-queued"
      )}
      onClick={handleSelectGame}
    >
      <div className="flex items-center">
        {(autotestSelectMode || autotestRunning) && (
          <div
            className="flex items-center justify-center w-[52px] h-[60px] shrink-0 ps-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={
                autotestRunning
                  ? autotestInManifest
                  : selectedApps.has(game.app.id)
              }
              onChange={handleCheckboxToggle}
              size="lg"
              disabled={!game.installed_app || autotestRunning}
            />
          </div>
        )}
        <div className="h-[60px] w-[120px]">
          <img
            src={getImage(game.app.images)}
            alt=""
            loading="lazy"
            className="w-full h-full max-h-[60px] max-w-[120px] object-cover rounded-s-lg"
          />
        </div>

        <div className="flex-1 overflow-clip text-nowrap h-full items-center p-2">
          <span className="text-nowrap flex-shrink max-w-32 overflow-clip">
            {testEmoji && <span className="me-1">{testEmoji}</span>}
            {game.app.name}
          </span>
          <div className="flex items-center gap-1">
            {game.owned_apps.map((ownedApp: OwnedApp) =>
              getProviderIcon(
                ownedApp.provider,
                ownedApp.provider == game.installed_app?.owned_app.provider
                  ? styles.variablesDark.fill.strong
                  : styles.variablesDark.fill.normal
              )
            )}

            <div className=" text-sm text-[--text-tertiary]">
              {game.installed_app?.install_config.install_disk && (
                <div>
                  <Trans>Installed on Drive</Trans>{" "}
                  <span className="font-bold">
                    {getDriveLabel(
                      game.installed_app?.install_config.install_disk
                    )}{" "}
                  </span>
                  <span>
                    {getDiskSize(game.installed_app?.install_config.disk_size)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="flex-shrink w-[30px] h-full items-center justify-center flex"
          title={getCompatibilityLabel(
            game.app.compatibility
              ? getHighestCompatibility(game.app.compatibility)
              : PlaytronCompatibilityLevel.Unknown
          )}
        >
          {getCompatibilityIcon(
            game.app.compatibility
              ? getHighestCompatibility(game.app.compatibility)
              : PlaytronCompatibilityLevel.Unknown
          )}
        </div>
        <div className="flex-shrink w-[160px] text-nowrap h-full items-center flex">
          <span className="p-2 text-sm text-[--text-tertiary]">
            {statusLabel}
          </span>
        </div>

        <div className="flex-shrink w-[50px] h-full items-center justify-center flex rounded-e-lg">
          <Dropdown
            data={appActions}
            triggerElem={
              <DotsVertical
                fill={styles.variablesDark.fill.white}
                className="cursor-pointer"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export const GameCard = memo(GameCardInner);
