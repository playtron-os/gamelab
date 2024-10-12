import { useAppLibraryContext } from "@/context";
import { AppStatus, PlaytronTag } from "@/types";
import {
  getAppActionIconByStatus,
  getAppActionLabelByStatus,
  getAppStatus,
  getDate,
  getImage
} from "@/utils/app-info";
import { Trans, t } from "@lingui/macro";
import { Chip } from "@nextui-org/react";
import { Button, Divider, Toggle } from "@playtron/styleguide";
import React, { useMemo, useState } from "react";
import { InputConfigModal } from "../input-config-modal/input-config-modal";
import { LaunchConfigModal } from "../launch-config/launch-config-modal";
import { LogsModal } from "../logs-modal/logs-modal";
import { useSubmissionsContext } from "@/context/submissions-context";

import { ConfigSelect } from "@/components/side-panel/config-select";
import { TargetControllerType } from "@/types/input-config";
import { EulaModal } from "@/components/eula-modal/eula-modal";

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
  const [showTags, setShowTags] = useState<boolean>(false);
  const [isInputConfigOpen, setIsInputConfigOpen] = useState<boolean>(false);
  const [isLaunchConfigOpen, setIsLaunchConfigOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [targetLayout, setTargetLayout] =
    useState<TargetControllerType>("xbox");

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
        <span>{owned_app.provider}</span>
        <br />
        <span className="text-[--text-tertiary]">
          <Trans>Provider App ID</Trans>
        </span>
        <br />
        <span>{owned_app.provider_id}</span>
      </p>
    );
  });
  const providerTags = currentApp.app.tags.map(
    (tag: PlaytronTag, index: number) => {
      return (
        <Chip className="m-1" key={index}>
          {tag.tag}
        </Chip>
      );
    }
  );

  return (
    <>
      <div className="relative h-screen">
        <div className="pt-4 px-6">
          <h2 className="text-2xl font-bold justify-between flex pb-2">
            {currentApp.app.name}
          </h2>
          <div className="flex">
            <div className="flex-1">
              <img
                src={getImage(currentApp.app.images)}
                alt=""
                width="85"
                height="48"
              />
            </div>
            <div className="flex-1 px-4 text-nowrap">
              {currentApp.installed_app?.created_at ? (
                <>
                  <Trans>Date Added</Trans>:{" "}
                  {getDate(currentApp.installed_app?.created_at)}
                </>
              ) : (
                <Trans>Not installed</Trans>
              )}
              <br />
              {currentApp.installed_app?.launched_at ? (
                <>
                  <Trans>Tested on</Trans>:{" "}
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
            <span>{currentApp.app.id}</span>
          </p>
          <p>
            <span className="text-[--text-tertiary]">
              <Trans>Playtron Slug</Trans>
            </span>
            <br />
            <span>{currentApp.app.slug}</span>
          </p>
          <p>
            <span className="text-[--text-tertiary]">
              <Trans>Release Date</Trans>
            </span>
            <br />
            {currentApp.app.release_date && (
              <span>{getDate(currentApp.app.release_date)}</span>
            )}
          </p>
          {providerInfo}
          {currentApp.installed_app?.install_config?.install_folder && (
            <p>
              <span className="text-[--text-tertiary]">
                <Trans>Install folder</Trans>
              </span>
              <br />
              <span>
                {currentApp.installed_app.install_config.install_folder}
              </span>
            </p>
          )}
          <div>
            <span
              className="text-[--text-tertiary]"
              onClick={() => setShowTags(!showTags)}
            >
              <Trans>Tags</Trans>
            </span>
            {showTags && (
              <>
                <br />
                {providerTags}
              </>
            )}
          </div>
        </div>
        <footer className="absolute bottom-0 right-0 bg-black w-full overflow-hidden ">
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
