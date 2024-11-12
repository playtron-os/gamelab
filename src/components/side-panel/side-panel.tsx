import { useAppLibraryContext } from "@/context";
import { AppStatus, getMessage, MessageType } from "@/types";

import {
  getAppActionIconByStatus,
  getAppActionLabelByStatus,
  getAppStatus,
  getDate,
  getImage
} from "@/utils/app-info";
import { Trans, t } from "@lingui/macro";
import { Button, Divider, Toggle } from "@playtron/styleguide";
import React, { useMemo, useState, useCallback } from "react";
import { InputConfigModal } from "../input-config-modal/input-config-modal";
import { LaunchConfigModal } from "../launch-config/launch-config-modal";
import { LogsModal } from "../logs-modal/logs-modal";
import {
  useSubmissionsContext,
  useSubmissionsType
} from "@/context/submissions-context";

import { ConfigSelect } from "@/components/side-panel/config-select";
import { TargetControllerType } from "@/types/input-config";
import { EulaModal } from "@/components/eula-modal/eula-modal";
import { usePlayserveSendMessage } from "@/hooks";

export const SidePanel: React.FC = () => {
  const {
    eula,
    isEulaOpen,
    acceptEula,
    setIsEulaOpen,
    handlers: { handleAppDefaultAction }
  } = useAppLibraryContext();
  const {
    currentApp,
    inputSubmissions,
    launchSubmissions,
    setEditLayout,
    setEditLaunchConfig
  } = useSubmissionsContext();

  if (!currentApp) {
    return null;
  }

  const [resetWinePrefix, setResetWinePrefix] = useState<boolean>(false);
  const [bypassAppUpdate, setBypassAppUpdate] = useState<boolean>(false);
  const [enhancedDebugging, setEnhancedDebugging] = useState<boolean>(false);
  const [isInputConfigOpen, setIsInputConfigOpen] = useState<boolean>(false);
  const [isLaunchConfigOpen, setIsLaunchConfigOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [targetLayout, setTargetLayout] =
    useState<TargetControllerType>("xbox");

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

  const launchParams = useMemo(
    () => ({
      resetWinePrefix,
      bypassAppUpdate,
      launchConfigId: launchSubmissions.selectedItem?.item_id,
      inputConfigId: inputSubmissions.selectedItem?.item_id,
      enhancedDebugging
    }),
    [
      resetWinePrefix,
      bypassAppUpdate,
      inputSubmissions.selectedItem,
      launchSubmissions.selectedItem,
      enhancedDebugging
    ]
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
      <div className="fixed bg-black right-0 top-0 h-screen w-[280px] px-2 py-2 border-gray-800 border-l-2 overflow-scroll select-none cursor-default">
        <div className="pt-4 px-2 mb-28">
          <h2 className="text-xl font-bold justify-between flex pb-2 select-all">
            {currentApp.app.name}
          </h2>
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
              checked={resetWinePrefix}
              onChange={() => setResetWinePrefix(!resetWinePrefix)}
            />
          </div>
          <div className="flex py-2">
            <label htmlFor="bypassAppUpdateToggle" className="flex-grow">
              <Trans>Bypass App Update</Trans>
            </label>
            <Toggle
              name="bypassAppUpdateToggle"
              checked={bypassAppUpdate}
              onChange={() => setBypassAppUpdate(!bypassAppUpdate)}
            />
          </div>
          <div className="flex py-2">
            <label htmlFor="enhancedDebuggingToggle" className="flex-grow">
              <Trans>Enhanced Debugging</Trans>
            </label>
            <Toggle
              name="enhancedDebuggingToggle"
              checked={enhancedDebugging}
              onChange={() => setEnhancedDebugging(!enhancedDebugging)}
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
        <footer className="fixed bottom-0 right-0 w-[280px] overflow-hidden bg-black border-gray-800 border-l-2">
          <p className="py-2 px-4">
            <Button
              label={getAppActionLabelByStatus(getAppStatus(currentApp))}
              Icon={getAppActionIconByStatus(getAppStatus(currentApp))}
              className="w-full"
              onClick={() => {
                handleAppDefaultAction(currentApp, launchParams);
                setIsLogsOpen(isLogsOpen || launchParams.enhancedDebugging);
              }}
              primary={getAppStatus(currentApp) === AppStatus.READY}
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
        onClose={() => setIsInputConfigOpen(false)}
      />
      <LaunchConfigModal
        isOpen={isLaunchConfigOpen}
        onClose={() => setIsLaunchConfigOpen(false)}
      />
      <LogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        appInfo={currentApp}
      />
      <EulaModal
        appInfo={currentApp}
        isOpen={isEulaOpen}
        eula={eula}
        onAccept={() => {
          if (!eula) {
            return;
          }
          acceptEula(eula, currentApp);
          setIsEulaOpen(false);
        }}
        onClose={() => setIsEulaOpen(false)}
      />
    </>
  );
};
