import React, { useState, useCallback, useEffect } from "react";
import { Trans, t } from "@lingui/macro";

import {
  Button,
  Divider,
  Toggle,
  CloseFill,
  CheckCircleFill,
  CheckboxBlankCircleFill,
  ErrorWarningFill,
  ForbidFill,
  QuestionFill,
  styles
} from "@playtron/styleguide";

import { AppStatus, getMessage, MessageType } from "@/types";
import {
  getAppActionIconByStatus,
  getAppActionLabelByStatus,
  getAppStatus,
  getDate,
  getImage
} from "@/utils/app-info";
import { InputConfigModal } from "@/components/input-config-modal/input-config-modal";
import { LaunchConfigModal } from "@/components/launch-config/launch-config-modal";
import { LogsModal } from "@/components/logs-modal/logs-modal";
import { ConfigSelect } from "@/components/side-panel/config-select";
import { EulaModal } from "@/components/eula-modal/eula-modal";

import { useAppLibraryContext } from "@/context";
import {
  useSubmissionsContext,
  useSubmissionsType
} from "@/context/submissions-context";
import { useAppDispatch } from "@/redux/store";

import { TargetControllerType } from "@/types/input-config";

import { usePlayserveSendMessage } from "@/hooks";
import { setCurrentApp, openProviderSelectionDialog } from "@/redux/modules";
import { useAppDownloadActions } from "@/hooks/app-library";
import {
  PlaytronCompatibilityLevel,
  getHighestCompatibility,
  getCompatibilityLabel
} from "@/types/app-library/playtron-app/playtron-compatibility";

const compatibilityConfig: Record<
  PlaytronCompatibilityLevel,
  { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }
> = {
  [PlaytronCompatibilityLevel.Verified]: {
    icon: CheckCircleFill,
    color: styles.variablesDark.feedback["success-primary"]
  },
  [PlaytronCompatibilityLevel.Compatible]: {
    icon: CheckboxBlankCircleFill,
    color: styles.variablesDark.state["default"]
  },
  [PlaytronCompatibilityLevel.NotWorking]: {
    icon: ErrorWarningFill,
    color: styles.variablesDark.feedback["error-primary"]
  },
  [PlaytronCompatibilityLevel.Unsupported]: {
    icon: ForbidFill,
    color: styles.variablesDark.feedback["error-primary"]
  },
  [PlaytronCompatibilityLevel.Unknown]: {
    icon: QuestionFill,
    color: styles.variablesDark.fill.normal
  }
};

export const SidePanel: React.FC = () => {
  const {
    eula,
    isEulaOpen,
    acceptEula,
    rejectEula,
    setIsEulaOpen,
    handlers: { handleAppDefaultAction }
  } = useAppLibraryContext();

  const {
    clickedApp: currentApp,
    inputSubmissions,
    launchSubmissions,
    setEditLayout,
    setEditLaunchConfig,
    launchParams,
    toggleBypassAppUpdate,
    toggleEnhancedDebugging,
    toggleResetWinePrefix
  } = useSubmissionsContext();
  const { downloadApp } = useAppDownloadActions();

  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [isInputConfigOpen, setIsInputConfigOpen] = useState<boolean>(false);
  const [isLaunchConfigOpen, setIsLaunchConfigOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [targetLayout, setTargetLayout] =
    useState<TargetControllerType>("xbox");

  if (!currentApp) {
    return null;
  }

  useEffect(() => {
    setIsLaunching(false);
  }, [currentApp]);

  const appStatus = getAppStatus(currentApp);
  const dispatch = useAppDispatch();
  const sendMessage = usePlayserveSendMessage();

  const deleteDefaultConfig = useCallback(
    (submissions: useSubmissionsType) => {
      const item = submissions.selectedItem;
      if (!item) return;
      const setSelectedSubmissionMessage = getMessage(
        MessageType.SubmissionDeleteDefault,
        {
          app_id: item.app_id,
          item_type: item.submission_item_type,
          item_id: item.item_id
        }
      );
      sendMessage(setSelectedSubmissionMessage)().then((res) => {
        if (res.status != 200) {
          console.log("Error deleting default submission: ", res);
        }
      });
    },
    [sendMessage]
  );

  const providerInfo = currentApp.owned_apps.map((owned_app, index) => {
    return (
      <p key={index}>
        <span className="text-[--text-tertiary]">
          <Trans>Provider</Trans>
        </span>
        <br />
        <span className="select-all text-sm">{owned_app.provider}</span>
        <br />
        <span className="text-[--text-tertiary]">
          <Trans>Provider App ID</Trans>
        </span>
        <br />
        <span className="select-all text-sm">{owned_app.provider_id}</span>
      </p>
    );
  });

  return (
    <>
      <div className="fixed bg-black right-0 top-0 h-screen w-[480px] px-2 py-2 border-gray-800 border-l-2 overflow-scroll select-none cursor-default z-10">
        <div className="pt-4 px-2 mb-28">
          <div className="flex">
            <h2 className="flex-grow text-xl font-bold justify-between flex pb-2 select-all">
              {currentApp.app.name}
            </h2>
            <div>
              <Button
                onClick={() => {
                  dispatch(setCurrentApp(undefined));
                }}
                Icon={CloseFill}
                size="medium"
                className="px-2"
              />
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink">
              <img
                src={getImage(currentApp.app.images)}
                alt=""
                width="85"
                height="48"
              />
            </div>
            <div className="flex-grow px-1 text-nowrap text-xs">
              {currentApp.installed_app?.created_at ? (
                <>
                  <strong>
                    <Trans>Added</Trans>:
                  </strong>{" "}
                  {getDate(currentApp.installed_app?.created_at)}
                </>
              ) : (
                <Trans>Not installed</Trans>
              )}
              <br />
              {currentApp.installed_app?.launched_at ? (
                <>
                  <strong>
                    <Trans>Tested on</Trans>:
                  </strong>{" "}
                  {getDate(currentApp.installed_app?.launched_at)}
                </>
              ) : (
                <Trans>Never tested</Trans>
              )}
            </div>
          </div>
          <Divider type="subtle" className="my-4" />
          <div className="flex py-2">
            <label htmlFor="resetWineToggle" className="flex-grow">
              <Trans>Reset Wine Prefix</Trans>
            </label>
            <Toggle
              name="resetWineToggle"
              checked={launchParams.resetWinePrefix}
              onChange={() => toggleResetWinePrefix()}
            />
          </div>
          <div className="flex py-2">
            <label htmlFor="bypassAppUpdateToggle" className="flex-grow">
              <Trans>Bypass App Update</Trans>
            </label>
            <Toggle
              name="bypassAppUpdateToggle"
              checked={launchParams.bypassAppUpdate}
              onChange={() => toggleBypassAppUpdate()}
            />
          </div>
          <div className="flex py-2">
            <label htmlFor="enhancedDebuggingToggle" className="flex-grow">
              <Trans>Enhanced Debugging</Trans>
            </label>
            <Toggle
              name="enhancedDebuggingToggle"
              checked={launchParams.enhancedDebugging}
              onChange={() => toggleEnhancedDebugging()}
            />
          </div>

          <Divider type="subtle" className="my-4" />
          <div className="flex">
            <span className="text-[--text-tertiary] flex-grow">
              <Trans>Launch Config</Trans>
            </span>
            {launchSubmissions.selectedItem && (
              <span className="me-14 font-bold text-[--state-default]">
                <a
                  href="#"
                  onClick={() => {
                    launchSubmissions.setSelectedItemId(null);
                    deleteDefaultConfig(launchSubmissions);
                  }}
                >
                  <Trans>Reset</Trans>
                </a>
              </span>
            )}
          </div>

          <ConfigSelect
            submissions={launchSubmissions}
            setIsConfigOpen={setIsLaunchConfigOpen}
            // @ts-expect-error FIXME: Ignore it until we make it more generic
            setEditItem={setEditLaunchConfig}
          />
          <div className="my-4">
            <div className="flex">
              <span className="text-[--text-tertiary] flex-grow">
                <Trans>Input Config</Trans>
              </span>
              {inputSubmissions.selectedItem && (
                <span className="me-14 font-bold text-[--state-default]">
                  <a
                    href="#"
                    onClick={() => {
                      inputSubmissions.setSelectedItemId(null);
                      deleteDefaultConfig(inputSubmissions);
                    }}
                  >
                    <Trans>Reset</Trans>
                  </a>
                </span>
              )}
            </div>

            <ConfigSelect
              submissions={inputSubmissions}
              setIsConfigOpen={setIsInputConfigOpen}
              // @ts-expect-error FIXME: Ignore it until we make it more generic
              setEditItem={setEditLayout}
            />
          </div>
          <Divider type="subtle" className="my-4" />
          <p>
            <span className="text-[--text-tertiary]">
              <Trans>Playtron App ID</Trans>
            </span>
            <br />
            <span className="select-all text-xs">{currentApp.app.id}</span>
          </p>
          {(() => {
            const level = currentApp.app.compatibility
              ? getHighestCompatibility(currentApp.app.compatibility)
              : PlaytronCompatibilityLevel.Unknown;
            const config = compatibilityConfig[level];
            const Icon = config.icon;
            return (
              <p>
                <span className="text-[--text-tertiary]">
                  <Trans>Compatibility</Trans>
                </span>
                <br />
                <span className="flex items-center gap-2">
                  <Icon fill={config.color} width={16} height={16} />
                  <span
                    style={{ color: config.color }}
                    className="text-sm font-semibold"
                  >
                    {getCompatibilityLabel(level)}
                  </span>
                </span>
              </p>
            );
          })()}
          <p>
            <span className="text-[--text-tertiary]">
              <Trans>Playtron Slug</Trans>
            </span>
            <br />
            <span className="select-all text-sm">{currentApp.app.slug}</span>
          </p>
          <p>
            <span className="text-[--text-tertiary]">
              <Trans>Release Date</Trans>
            </span>
            <br />
            {currentApp.app.release_date && (
              <span className="select-all text-sm">
                {getDate(currentApp.app.release_date)}
              </span>
            )}
          </p>
          {providerInfo}
          {currentApp.installed_app?.install_config?.install_folder && (
            <p>
              <span className="text-[--text-tertiary]">
                <Trans>Install folder</Trans>
              </span>
              <br />
              <span className="select-all text-xs break-words">
                {currentApp.installed_app.install_config.install_folder}
              </span>
            </p>
          )}
        </div>
        <footer className="fixed bottom-0 right-0 w-[480px] overflow-hidden bg-black border-gray-800 border-l-2">
          <p className="py-2 px-4">
            <Button
              spinner={isLaunching || appStatus === AppStatus.LAUNCHING}
              label={getAppActionLabelByStatus(appStatus)}
              Icon={getAppActionIconByStatus(appStatus)}
              className="w-full"
              onClick={() => {
                if (isLaunching) return;
                let ownedAppId = currentApp.installed_app?.owned_app.id;
                if (!ownedAppId) {
                  if (currentApp.owned_apps.length === 1) {
                    ownedAppId = currentApp.owned_apps[0].id;
                  } else {
                    dispatch(openProviderSelectionDialog());
                    return;
                  }
                }

                handleAppDefaultAction(currentApp, ownedAppId, launchParams);

                if (appStatus === AppStatus.READY) {
                  setIsLaunching(true);
                  setIsLogsOpen(isLogsOpen || launchParams.enhancedDebugging);
                }
              }}
              primary={true}
            />
          </p>
          <p className="py-2 px-4">
            <Button
              className="w-full"
              label={isLogsOpen ? t`Close Log Window` : t`Open Log Window`}
              onClick={() => setIsLogsOpen(!isLogsOpen)}
            />
          </p>
          <p className="py-1"></p>
        </footer>
      </div>
      <InputConfigModal
        targetLayout={targetLayout}
        setTargetLayout={setTargetLayout}
        isOpen={isInputConfigOpen}
        onClose={() => {
          setEditLayout(null);
          setIsInputConfigOpen(false);
        }}
      />
      <LaunchConfigModal
        isOpen={isLaunchConfigOpen}
        onClose={() => {
          setEditLaunchConfig(null);
          setIsLaunchConfigOpen(false);
        }}
      />
      <LogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        appInfo={currentApp}
        isEnhancedDebuggingEnabled={launchParams.enhancedDebugging}
      />

      <EulaModal
        appInfo={currentApp}
        isOpen={isEulaOpen}
        eula={eula}
        onAccept={() => {
          if (!eula) {
            return;
          }
          acceptEula(eula);
          setIsEulaOpen(false);
          downloadApp(currentApp.owned_apps[0].id);
        }}
        onReject={() => {
          if (!eula) {
            return;
          }
          rejectEula(currentApp);
          setIsEulaOpen(false);
        }}
      />
    </>
  );
};
