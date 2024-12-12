import React, { useEffect } from "react";
import classNames from "classnames";
import {
  Button,
  SelectInput,
  Divider,
  TextInput,
  GamepadLine,
  ArrowRightLine,
  XCircle,
  styles
} from "@playtron/styleguide";
import { Trans, t } from "@lingui/macro";
import { AppInformation, MessageType } from "@/types";
import {
  ControlGroup,
  ControllerInput,
  InputMapping,
  ControllerInfo,
  TargetControllerType
} from "@/types/input-config";
import { useSubmissionsContext } from "@/context/submissions-context";
import { usePlayserve } from "@/hooks";
import { useInputDevice } from "@/hooks/use-input-device";
import { getInputLabel, mappingCmp } from "@/utils/controllers";
import {
  physicalLayouts,
  PhysicalLayoutType
} from "../../constants/physical-layouts";
import { SubmissionEditHeader } from "@/components/submission-config/submission-edit-header";
import { ConfigOverrideChip } from "../config-override-chip";

interface ControllerEditProps {
  appInfo: AppInformation;
  selectedKey: ControllerInput | null;
  activeTab: ControlGroup;
  currentPhysicalLayout: PhysicalLayoutType;
  setSelectedKey: (key: ControllerInput | null) => void;
  setInputMapping: (inputMapping: InputMapping) => void;
  onClose: () => void;
  handleSave: () => void;
  setActiveTab: (tab: ControlGroup) => void;
  setCurrentPhysicalLayout: (layout: PhysicalLayoutType) => void;
  targetLayout: TargetControllerType;
  setTargetLayout: (targetLayout: TargetControllerType) => void;
}

export const getControllerLayoutLabel = (layout: TargetControllerType) => {
  switch (layout) {
    case "xbox":
      return t`Xbox controller`;
    case "ps5":
      return t`PS5 controller`;
    case "default":
      return t`Current controller`;
    default:
      return t`Invalid layout`;
  }
};

export const getPhysicalLayoutFromDevice = (device: ControllerInfo) => {
  // Xbox360
  if (device.capabilities.length === 20) {
    return physicalLayouts.Xbox;
  }
  if (device.capabilities.length === 21) {
    return physicalLayouts.Xbox;
  }
  // Xbox One
  if (device.capabilities.length === 25) {
    return physicalLayouts.Xbox;
  }
  if (device.capabilities.length === 33) {
    return physicalLayouts.PS5;
  }
  // Aya Neo 2
  // if (device.capabilities.length === 155) {
  //   return physicalLayouts.SteamDeck;
  // }
  if (device.capabilities.length === 173) {
    return physicalLayouts.SteamDeck;
  }
  if (device.capabilities.length === 186) {
    return physicalLayouts.ROGAlly;
  }
  console.log("Unknown device", device);
  console.log("Device capabilities", device.capabilities);
  return physicalLayouts.Generic;
};

export const ControllerEdit: React.FC<ControllerEditProps> = ({
  appInfo,
  activeTab,
  currentPhysicalLayout,
  setSelectedKey,
  setInputMapping,
  onClose,
  handleSave,
  setActiveTab,
  setCurrentPhysicalLayout,
  targetLayout,
  setTargetLayout
}) => {
  const playserve = usePlayserve();
  const { editLayout, setEditLayout } = useSubmissionsContext();
  const { inputDevices, setInputDevices, getInputDevices } =
    useInputDevice(playserve);

  useEffect(() => {
    getInputDevices().then((devices) => {
      if (devices?.length) {
        setCurrentPhysicalLayout(getPhysicalLayoutFromDevice(devices[0]));
      }
    });
  }, [getInputDevices]);

  usePlayserve({
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onMessage: (message: any) => {
      if (message.message_type == MessageType.InputDevicesUpdate) {
        const inputDevices = Object.values(message.body) as ControllerInfo[];
        setInputDevices(inputDevices);
        if (inputDevices.length > 0) {
          const layout = getPhysicalLayoutFromDevice(inputDevices[0]);
          if (layout.id !== currentPhysicalLayout.id) {
            setCurrentPhysicalLayout(layout);
            setActiveTab(layout.layout[0]);
          }
        }
      }
    }
  });

  if (!editLayout) {
    return null;
  }

  const targetLayouts = [
    { value: "default", label: getControllerLayoutLabel("default") },
    { value: "ps5", label: getControllerLayoutLabel("ps5") },
    { value: "xbox", label: getControllerLayoutLabel("xbox") }
  ];

  const controllerList = inputDevices.map((inputDevice: ControllerInfo) => {
    const layout = getPhysicalLayoutFromDevice(inputDevice);
    return (
      <ConfigOverrideChip
        key={layout.id}
        label={layout.label}
        selected={currentPhysicalLayout.id === layout.id}
        onSelect={() => {
          setCurrentPhysicalLayout(layout);
          setActiveTab(layout.layout[0]);
          setSelectedKey(null);
        }}
        icon={<GamepadLine fill="white" />}
      />
    );
  });
  const gameName = appInfo.app.name;
  return (
    <div className="select-none cursor-default">
      <SubmissionEditHeader
        title={t`Input Config for ${gameName}`}
        onClose={() => {
          setEditLayout(null);
          onClose();
        }}
      />
      <div className="flex">
        <div className="w-[288px] bg-black flex flex-col h-[calc(90vh-64px)]">
          <header className="flex align-baseline gap-2 p-4">
            <span className="font-bold">
              <Trans>CONFIG NAME</Trans>
            </span>
            <span className="flex-grow m-auto">
              <Divider type="subtle" />
            </span>
          </header>
          <div className="px-4">
            <TextInput
              value={editLayout.name}
              onChange={(name) => setEditLayout({ ...editLayout, name })}
            />
          </div>

          <header className="flex align-baseline gap-2 p-4 mt-4">
            <span className="font-bold">
              <Trans>INPUT DEVICES</Trans>
            </span>
            <span className="flex-grow m-auto">
              <Divider type="subtle" />
            </span>
          </header>
          <div className="px-4 flex flex-col gap-2">{controllerList}</div>
          <div className="flex-grow "></div>
          <div className="flex-shrink bg-[--fill-subtle]">
            <textarea
              className="m-4 border border-[--stroke-normal] rounded-lg p-4 w-64 h-24 mb-2"
              value={editLayout.description}
              onChange={(e) => {
                setEditLayout({
                  ...editLayout,
                  description: e.target.value
                });
              }}
            ></textarea>
            <Button
              label={t`Save`}
              primary
              className="w-64 mt-0 m-4"
              onClick={handleSave}
            />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center bg-gradient-to-t from-[--color-neutral-0] to-[--color-neutral-5] p-6 m-auto gap-10 border-b border-[--stroke-subtle] h-44">
            <div className="flex-1"></div>
            <div className="flex-1 max-w-[230px]">
              <img
                className="float-right align-middle "
                src={currentPhysicalLayout.images[activeTab.section]}
                height="131px"
              />
            </div>
            <div>
              <h1 className="text-[48px] font-bold">
                {currentPhysicalLayout.label}
              </h1>
              <div className="font-bold flex items-center">
                <span className="whitespace-nowrap">
                  <Trans>Gamepad Type</Trans>
                </span>
                <SelectInput
                  value={{
                    value: targetLayout,
                    label: getControllerLayoutLabel(targetLayout)
                  }}
                  options={targetLayouts}
                  onChange={(value) => {
                    setTargetLayout(value.value);
                  }}
                  className="mx-4 w-52"
                />
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
          <div className="mt-4 m-auto text-center">
            {currentPhysicalLayout.layout.map((group: ControlGroup) => (
              <span
                key={group.id}
                onClick={() => setActiveTab(group)}
                className={classNames(
                  "border-2 border-[--stroke-subtle] px-4 py-2 rounded-full m-1 inline-block hover:outline cursor-pointer outline-[-stroke-strong] outline-offset-2",
                  group.id === activeTab.id &&
                    "bg-[--color-neutral-100] text-[--text-weak]"
                )}
              >
                {group.name}
              </span>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="controller-buttons grid grid-cols-2 gap-y-4 gap-x-12 p-8 mx-auto">
              {activeTab.inputs.map((key) => {
                const value = editLayout.mapping?.filter(
                  (mapping: InputMapping) => {
                    return mappingCmp(mapping.source_event, {
                      [key.device]: key.mapping
                    });
                  }
                )[0];
                return (
                  <div
                    key={key.label}
                    className="button-group flex gap-2 items-center"
                  >
                    {key.icon && (
                      <key.icon
                        fill={styles.variablesDark.fill.white}
                        width={32}
                        height={32}
                      />
                    )}
                    <ArrowRightLine fill={styles.variablesDark.fill.subtle} />
                    <div className="border-2 w-[200px] bg-[--fill-default] rounded-lg border-[--stroke-subtle] flex">
                      <Button
                        className="border-none flex-grow"
                        centerContents={false}
                        label={getInputLabel(value?.target_events[0])}
                        onClick={() => {
                          if (value) {
                            setInputMapping(value);
                          } else {
                            setInputMapping({
                              name: key.label,
                              source_event: {
                                [key.device]: key.mapping
                              },
                              target_events: []
                            });
                          }
                          setSelectedKey(key);
                        }}
                      />
                      {value && (
                        <Button
                          className="border-0"
                          onClick={() => {
                            // Remove mapping from the layout
                            const mapping = editLayout.mapping || [];
                            const newMapping: InputMapping[] = [
                              ...mapping.filter(
                                (m) =>
                                  !mappingCmp(m.source_event, {
                                    [key.device]: key.mapping
                                  })
                              )
                            ];
                            setEditLayout({
                              ...editLayout,
                              mapping: newMapping
                            });
                          }}
                          size="small"
                          Icon={XCircle}
                          color={styles.variablesDark.fill.subtle}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
