import { Modal, AirplaneMode, Button } from "@playtron/styleguide";
import React, { useCallback, useState } from "react";
import { Trans, t } from "@lingui/macro";
import { SubmissionType } from "@/types/submission";
import { SubmissionsEmpty } from "@/components/submission-config/submissions-empty";
import { SubmissionsList } from "@/components/submission-config/submissions-list";
import { useSubmissionsContext } from "@/context/submissions-context";
import { ConfigModalHeader } from "@/components/submission-config/submissions-modal-header";
import { LaunchConfigEditor } from "@/components/launch-config-editor";

interface InputConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchConfigModal: React.FC<InputConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const [configFilter, setConfigFilter] = useState("");
  const {
    clickedApp: currentApp,
    launchSubmissions,
    createSubmission,
    saveSubmission,
    editLaunchConfig,
    setEditLaunchConfig
  } = useSubmissionsContext();

  const submissionType = SubmissionType.LaunchConfig;
  const handleSave = useCallback(() => {
    if (!editLaunchConfig) {
      return;
    }
    const saveItem = {
      item_id: editLaunchConfig.item_id,
      app_id: editLaunchConfig.app_id,
      name: editLaunchConfig.name,
      description: editLaunchConfig.description,
      data: JSON.stringify({
        ...(editLaunchConfig.configuration || {}),
        overrides: editLaunchConfig.overrides
      })
    };

    saveSubmission(editLaunchConfig.app_id, submissionType, saveItem);
    setEditLaunchConfig(null);
    onClose();
  }, [editLaunchConfig, saveSubmission, setEditLaunchConfig, onClose]);

  if (!currentApp) {
    return null;
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} className="z-10" noContentPadding>
      <div className="bg-[--fill-subtler] h-[90vh] w-[90vw] flex flex-col">
        <>
          {editLaunchConfig ? (
            <LaunchConfigEditor
              appInfo={currentApp}
              onClose={onClose}
              handleSave={handleSave}
            />
          ) : (
            <>
              <ConfigModalHeader
                currentApp={currentApp}
                submissions={launchSubmissions.submissions}
                configFilter={configFilter}
                setConfigFilter={setConfigFilter}
              />
              <h2 className="flex text-2xl items-center gap-4 mb-4 px-8">
                <AirplaneMode fill="white" /> <Trans>Launch Config List</Trans>
              </h2>
              {launchSubmissions.submissions.length ? (
                <>
                  <SubmissionsList
                    submissions={launchSubmissions.submissions}
                    submissionType={submissionType}
                    selectedItemId={launchSubmissions.selectedItemId}
                    setSelectedItemId={launchSubmissions.setSelectedItemId}
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
                  appInfo={currentApp}
                  onClose={onClose}
                  submissionType={submissionType}
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

//
