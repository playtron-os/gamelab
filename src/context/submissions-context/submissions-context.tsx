import React, { createContext, useCallback, useMemo, useState } from "react";
import { flashMessage } from "redux-flash";
import {
  AppInformation,
  getMessage,
  MessageType,
  Submission,
  SubmissionType,
  SubmissionItemType,
  LaunchConfig,
  InputConfig,
  SubmissionSaveModel
} from "@/types";
import { useAppLibraryContext } from "@/context";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectAppLibraryAppsState } from "@/redux/modules";
import { useSubmissions } from "./hooks/use-submissions";
import { DEFAULT_INPUT_CONFIG } from "@/constants/input-config";
import { DEFAULT_LAUNCH_CONFIG } from "@/constants/launch-config";
import { usePlayserve } from "@/hooks";
import { ConfirmationPopUp } from "@playtron/styleguide";
import { t } from "@lingui/macro";
import { error, info, warn } from "@tauri-apps/plugin-log";

export type useSubmissionsType = ReturnType<typeof useSubmissions>;

export interface SubmissionsContextType {
  currentApp?: AppInformation;
  isLoading: boolean;
  launchSubmissions: useSubmissionsType;
  inputSubmissions: useSubmissionsType;
  editLayout: InputConfig | null;
  editLaunchConfig: LaunchConfig | null;
  setEditLayout: (sub: InputConfig | null) => void;
  setEditLaunchConfig: (sub: LaunchConfig | null) => void;

  saveSubmission: (
    appId: string,
    item_type: SubmissionItemType,
    item: SubmissionSaveModel
  ) => void;
  createSubmission: (appId: string, item_type: SubmissionItemType) => void;
  copySubmission: (
    item_id: string,
    item_type: SubmissionItemType,
    app_id: string
  ) => void;
  askDeleteSubmission: (
    item_id: string,
    item_type: SubmissionItemType,
    appId: string
  ) => void;
  submitSubmission: (
    item_id: string,
    item_type: SubmissionItemType,
    app_id: string
  ) => void;
}

export const SubmissionsContext = createContext<SubmissionsContextType | null>(
  null
);

interface SubmissionsContextProviderProps {
  children: React.ReactNode;
}

export const SubmissionsContextProvider = ({
  children
}: SubmissionsContextProviderProps) => {
  const { clickedApp } = useAppLibraryContext();
  const apps = useAppSelector(selectAppLibraryAppsState);
  const flashDispatch = useAppDispatch();
  const [itemToDelete, setItemToDelete] = useState<{
    item_id: string;
    app_id: string;
    item_type: SubmissionItemType;
  } | null>(null);

  const [editLayout, setEditLayout] = useState<InputConfig | null>(null);

  const [editLaunchConfig, setEditLaunchConfig] = useState<LaunchConfig | null>(
    null
  );

  const currentApp = useMemo(() => {
    if (clickedApp) {
      for (const app of apps) {
        if (app.app.id === clickedApp.app.id) {
          return app;
        }
      }
    } else if (apps && apps.length > 0) {
      return apps[0];
    }
  }, [clickedApp, apps]);

  const inputSubmissions = useSubmissions(
    SubmissionType.InputConfig,
    currentApp?.app.id
  );
  const launchSubmissions = useSubmissions(
    SubmissionType.LaunchConfig,
    currentApp?.app.id
  );
  //const testSubmissions = useSubmissions("TestScript", currentApp?.app.id);

  const { sendMessage } = usePlayserve({
    onMessage: (message) => {
      if (message.message_type === MessageType.SubmissionGetAllUpdate) {
        const submissions = message.body as Submission[];
        if (submissions.length > 0) {
          const type = submissions[0].submission_item_type;
          if (submissions[0].app_id !== currentApp?.app.id) {
            return;
          }
          const array = submissions.map((sub) => ({
            ...sub,
            ...JSON.parse(sub.data)
          }));
          if (type === "InputConfig") {
            inputSubmissions.setSubmissions(array);
          } else if (type === "LaunchConfig") {
            launchSubmissions.setSubmissions(array);
          }
        }
      }
    }
  });

  const isLoading = inputSubmissions.loading || launchSubmissions.loading;

  // Utilities
  const saveSubmission = useCallback(
    (
      appId: string,
      item_type: SubmissionItemType,
      item: SubmissionSaveModel
    ) => {
      const configCreateMessage = getMessage(MessageType.SubmissionSave, {
        app_id: appId,
        item_type,
        item
      });

      sendMessage(configCreateMessage)().then((response) => {
        if (response.status === 200) {
          console.log("Successfully created config");
          info("Successfully create config");
        } else {
          flashDispatch(flashMessage(response.body.message));
        }
      });
    },
    [sendMessage, flashDispatch]
  );

  const createSubmission = useCallback(
    (appId: string, item_type: SubmissionItemType) => {
      let item = null;
      if (item_type === "InputConfig") {
        item = DEFAULT_INPUT_CONFIG;
      } else if (item_type === "LaunchConfig") {
        item = DEFAULT_LAUNCH_CONFIG;
      } else {
        warn("Attempt to created unimplemented submission type");
        throw new Error("Invalid submission type");
      }
      saveSubmission(appId, item_type, item);
    },
    [saveSubmission]
  );

  const deleteSubmission = useCallback(() => {
    if (!itemToDelete) {
      return;
    }
    const item_id = itemToDelete.item_id;
    const message = getMessage(MessageType.SubmissionDelete, itemToDelete);
    const submissions =
      itemToDelete.item_type === "LaunchConfig"
        ? launchSubmissions
        : inputSubmissions;
    setItemToDelete(null);
    sendMessage(message)().then((response) => {
      if (response.status === 200) {
        const newSubmissions = submissions.submissions.filter(
          (layout) => layout.item_id !== item_id
        );
        if (item_id === submissions.selectedItem?.item_id) {
          submissions.setSelectedItemId(null);
        }
        submissions.setSubmissions(newSubmissions);
      } else if ("error_code" in response.body) {
        flashDispatch(flashMessage(response.body.message));
      }
    });
  }, [
    sendMessage,
    flashDispatch,
    itemToDelete,
    launchSubmissions,
    inputSubmissions
  ]);

  const copySubmission = useCallback(
    (item_id: string, item_type: SubmissionItemType, app_id: string) => {
      console.log("Duplicating config", item_id);
      const copyConfigMessage = getMessage(MessageType.SubmissionDuplicate, {
        item_type,
        app_id,
        item_id
      });
      sendMessage(copyConfigMessage)()
        .then((response) => {
          if (response.status === 200) {
            console.log("Successfully copied submissions");
            info("Successfully copied submissions");
          } else {
            console.error("Error duplicating config", response);
            error(
              `Error duplicating config ${response.status} ${response.body.message}`
            );
            flashDispatch(flashMessage(response.body.message));
          }
        })

        .catch((error: Error) => {
          console.error(error.message);
          flashDispatch(flashMessage(error.message));
        });
    },
    [sendMessage, flashDispatch]
  );

  const submitSubmission = useCallback(
    (item_id: string, item_type: SubmissionItemType, app_id: string) => {
      console.log("Submitting submission to the server");
      const submitMessage = getMessage(MessageType.SubmissionSubmit, {
        item_id,
        item_type,
        app_id
      });
      sendMessage(submitMessage)().then((response) => {
        if (response.status === 200) {
          flashDispatch(flashMessage(t`Configuration has been submitted`));
        } else {
          // TODO: Translate errrors properly
          const errorMessage = response.body.message;
          flashDispatch(
            flashMessage(
              t`There was an error with the submission ${errorMessage}`
            )
          );
        }
      });
    },
    [sendMessage, flashDispatch]
  );

  const askDeleteSubmission = useCallback(
    (item_id: string, item_type: SubmissionItemType, app_id: string) =>
      setItemToDelete({ item_id, item_type, app_id }),
    [setItemToDelete]
  );

  return (
    <SubmissionsContext.Provider
      value={{
        currentApp,
        isLoading,
        inputSubmissions,
        launchSubmissions,
        editLayout,
        setEditLayout,
        editLaunchConfig,
        setEditLaunchConfig,
        saveSubmission,
        createSubmission,
        copySubmission,
        askDeleteSubmission,
        submitSubmission
      }}
    >
      {children}
      {!!itemToDelete && (
        <ConfirmationPopUp
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          title={t`Delete this configuration?`}
          onConfirm={deleteSubmission}
          className="z-[62]"
        />
      )}
    </SubmissionsContext.Provider>
  );
};
