import React, { useState, useEffect } from "react";
import { Keyboard } from "./controller-keyboard";
import { Numpad } from "./controller-numpad";
import { Mouse } from "./controller-mouse";
import { Gamepad } from "./controller-gamepad";
import { t } from "@lingui/macro";
import {
  ControllerInput,
  InputMapping,
  InputEvent,
  TargetControllerType
} from "@/types/input-config";
import { inputTypes } from "@/constants/input-config";
import classNames from "classnames";
import { SubmissionEditHeader } from "@/components/submission-config/submission-edit-header";

const getInputTypeLabel = (inputType: string): string => {
  switch (inputType) {
    case inputTypes.gamepad:
      return t`Gamepad`;
    case inputTypes.mouse:
      return t`Mouse`;
    case inputTypes.keyboard:
      return t`Keyboard`;
    case inputTypes.numpad:
      return t`Numpad`;
    default:
      return "?";
  }
};

interface MapToProps {
  activeTab: string;
  inputMapping: InputMapping;
  targetLayout: TargetControllerType;
  setSelectedKey: (key: ControllerInput | null) => void;
  setActiveTab: (tab: string) => void;
  onSelectKey: (key: ControllerInput | null) => void;
}

export const MapTo: React.FC<MapToProps> = ({
  activeTab,
  inputMapping,
  targetLayout,
  setActiveTab,
  setSelectedKey,
  onSelectKey
}) => {
  const [mappedKey, setMappedKey] = useState<InputEvent | undefined>(undefined);

  useEffect(() => {
    setMappedKey(inputMapping?.target_events[0]);
  }, [inputMapping]);

  return (
    <>
      <SubmissionEditHeader
        title={t`Map to...`}
        onClose={() => {
          setSelectedKey(null);
        }}
      />

      <div className="flex">
        <div className="m-auto mt-10">
          <div className="bg-[--fill-default] rounded-lg border border-[--stroke-subtle] font-bold  mx-[220px]">
            {Object.values(inputTypes).map((group) => (
              <span
                key={group}
                onClick={() => setActiveTab(group)}
                className={classNames(
                  "px-5 py-2 rounded-lg inline-block hover:outline cursor-pointer ",
                  group === activeTab && "border border-[--stroke-normal] "
                )}
              >
                {getInputTypeLabel(group)}
              </span>
            ))}
          </div>

          <h1 className="p-5 text-2xl font-bold text-center">
            {getInputTypeLabel(activeTab)}
          </h1>
          {activeTab === inputTypes.gamepad && (
            <Gamepad
              targetLayout={targetLayout}
              mappedKey={mappedKey}
              onSelectKey={onSelectKey}
            />
          )}
          {activeTab === inputTypes.numpad && (
            <Numpad mappedKey={mappedKey} onSelectKey={onSelectKey} />
          )}
          {activeTab === inputTypes.mouse && (
            <Mouse mappedKey={mappedKey} onSelectKey={onSelectKey} />
          )}
          {activeTab === inputTypes.keyboard && (
            <Keyboard
              mappedKey={mappedKey}
              onSelectKey={onSelectKey}
            ></Keyboard>
          )}
        </div>
      </div>
    </>
  );
};
