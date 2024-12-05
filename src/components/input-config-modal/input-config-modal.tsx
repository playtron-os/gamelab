import { Modal, Gamecontroller, Button } from "@playtron/styleguide";
import React, { useState, useCallback, useEffect } from "react";
import { Trans, t } from "@lingui/macro";
import { SubmissionsList } from "../submission-config/submissions-list";
import { ControllerEdit } from "../controller-edit/controller-edit";
import {
  ControlGroup,
  ControllerInput,
  InputMapping,
  InputEvent,
  TargetControllerType
} from "@/types/input-config";
import { SubmissionType } from "@/types/submission";
import { MapTo } from "../controller-edit/map-to";
import { SubmissionsEmpty } from "../submission-config/submissions-empty";
import { useSubmissionsContext } from "@/context/submissions-context";
import { ConfigModalHeader } from "@/components/submission-config/submissions-modal-header";
import {
  physicalLayouts,
  PhysicalLayoutType
} from "@/constants/physical-layouts";
import { mappingCmp } from "@/utils/controllers";
import { inputTypes } from "@/constants/input-config";

interface InputConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLayout: TargetControllerType;
  setTargetLayout: (layout: TargetControllerType) => void;
}

export const InputConfigModal: React.FC<InputConfigModalProps> = ({
  isOpen,
  onClose,
  targetLayout,
  setTargetLayout
}) => {
  const submissionType = SubmissionType.InputConfig;
  const [configFilter, setConfigFilter] = useState("");
  const {
    clickedApp: currentApp,
    inputSubmissions,
    setEditLayout,
    createSubmission,
    saveSubmission,
    editLayout
  } = useSubmissionsContext();

  if (!currentApp) {
    return null;
  }

  const [selectedKey, setSelectedKey] = useState<ControllerInput | null>(null);
  const [inputMapping, setInputMapping] = useState<InputMapping | null>(null);
  const onSelectMapping = (key: ControllerInput | null) => {
    let newTargetEvent: InputEvent | null = null;
    if (key === null) {
      newTargetEvent = {};
    } else {
      newTargetEvent = { [key.device]: key.mapping };
    }

    if (!editLayout || !selectedKey || !inputMapping) {
      console.error(
        "Unable to update mapping, not enough data to make changes"
      );
      return;
    }
    const mapping = editLayout.mapping || [];
    const newMapping: InputMapping[] = [
      ...mapping.filter(
        (m) =>
          !mappingCmp(m.source_event, {
            [selectedKey.device]: selectedKey.mapping
          })
      ),
      {
        ...inputMapping,
        target_events: [newTargetEvent]
      }
    ];

    setEditLayout({ ...editLayout, mapping: newMapping });
    setInputMapping(null);
    setSelectedKey(null);
  };

  const handleSave = useCallback(() => {
    if (!editLayout) {
      console.error(
        "Selected Layout is null on save, something is really wrong..."
      );
      return;
    }
    let targetDevice = "gamepad";
    switch (targetLayout) {
      case "ps5":
        targetDevice = "ds5";
        break;
      case "xbox":
        targetDevice = "xb360";
        break;
    }
    const saveItem = {
      item_id: editLayout.item_id,
      app_id: editLayout.app_id,
      name: editLayout.name || t`Untitled Layout`,
      description: editLayout.description,
      data: JSON.stringify({
        target_devices: ["mouse", "keyboard", targetDevice],
        mapping: editLayout.mapping
      })
    };

    saveSubmission(editLayout.app_id, submissionType, saveItem);
    setEditLayout(null);
    onClose();
  }, [editLayout, targetLayout, saveSubmission, setEditLayout, onClose]);
  useEffect(() => {
    if (editLayout && !editLayout.mapping) {
      const InputConfig = JSON.parse(editLayout.data);
      setEditLayout({
        ...editLayout,
        mapping: InputConfig.mapping
      });
    }
  }, [editLayout, setEditLayout]);
  const [currentPhysicalLayout, setCurrentPhysicalLayout] =
    useState<PhysicalLayoutType>(physicalLayouts.Xbox);

  const [activeTab, setActiveTab] = useState<ControlGroup>(
    physicalLayouts.Xbox.layout[0]
  );

  const [activeMappingTab, setActiveMappingTab] = useState<string>(
    inputTypes.gamepad
  );

  return (
    <Modal onClose={onClose} isOpen={isOpen} className="z-30" noContentPadding>
      <div className="bg-[--fill-subtler] h-[90vh] w-[90vw] flex flex-col">
        <>
          {editLayout ? (
            <>
              {selectedKey && inputMapping ? (
                <MapTo
                  targetLayout={targetLayout}
                  setSelectedKey={setSelectedKey}
                  onSelectKey={onSelectMapping}
                  inputMapping={inputMapping}
                  activeTab={activeMappingTab}
                  setActiveTab={setActiveMappingTab}
                />
              ) : (
                <ControllerEdit
                  appInfo={currentApp}
                  setInputMapping={setInputMapping}
                  onClose={onClose}
                  handleSave={handleSave}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  currentPhysicalLayout={currentPhysicalLayout}
                  setCurrentPhysicalLayout={setCurrentPhysicalLayout}
                  selectedKey={selectedKey}
                  setSelectedKey={setSelectedKey}
                  targetLayout={targetLayout}
                  setTargetLayout={setTargetLayout}
                />
              )}
            </>
          ) : (
            <>
              <ConfigModalHeader
                currentApp={currentApp}
                submissions={inputSubmissions.submissions}
                configFilter={configFilter}
                setConfigFilter={setConfigFilter}
              />
              <h2 className="flex text-2xl items-center gap-4 mb-4 px-8">
                <Gamecontroller fill="white" /> <Trans>Input Config List</Trans>
              </h2>
              {inputSubmissions.submissions.length ? (
                <>
                  <SubmissionsList
                    submissions={inputSubmissions.submissions}
                    submissionType={SubmissionType.InputConfig}
                    selectedItemId={inputSubmissions.selectedItemId}
                    setSelectedItemId={inputSubmissions.setSelectedItemId}
                    configFilter={configFilter}
                    onClose={onClose}
                  />

                  <div className="flex flex-row-reverse bg-black gap-2 p-6 pr-8">
                    <Button
                      onClick={() => {
                        createSubmission(currentApp.app.id, submissionType);
                      }}
                      primary
                      label={t`Add New Config`}
                    />
                    <Button onClick={onClose} label={t`Close`} />
                  </div>
                </>
              ) : (
                <SubmissionsEmpty
                  submissionType={submissionType}
                  appInfo={currentApp}
                  onClose={onClose}
                  createSubmission={createSubmission}
                />
              )}
            </>
          )}
        </>
      </div>
    </Modal>
  );
};
