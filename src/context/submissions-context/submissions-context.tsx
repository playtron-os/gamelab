import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useEffect
} from "react";
import { flashErrorMessage, flashMessage } from "redux-flash";
import {
  AppInformation,
  getMessage,
  MessageType,
  Submission,
  SubmissionType,
  SubmissionItemType,
  LaunchConfig,
  InputConfig,
  SubmissionSaveModel,
  LaunchParams
} from "@/types";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectCurrentAppState,
  selectAppLibraryAppsState
} from "@/redux/modules";
import { selectAuthState, AuthState } from "@/redux/modules/auth";
import { useSubmissions } from "./hooks/use-submissions";
import { SubmissionCategory } from "@/constants";
import { DEFAULT_INPUT_CONFIG } from "@/constants/input-config";
import { DEFAULT_LAUNCH_CONFIG } from "@/constants/launch-config";
import { usePlayserve } from "@/hooks";
import { ConfirmationPopUp } from "@playtron/styleguide";
import { t } from "@lingui/macro";
import { error, warn } from "@tauri-apps/plugin-log";

export type useSubmissionsType = ReturnType<typeof useSubmissions>;

interface LaunchPreferences {
  resetWinePrefix?: boolean;
  bypassAppUpdate?: boolean;
  enhancedDebugging?: boolean;
}

export interface SubmissionsContextType {
  clickedApp?: AppInformation;
  isLoading: boolean;
  launchSubmissions: useSubmissionsType;
  inputSubmissions: useSubmissionsType;
  editLayout: InputConfig | null;
  editLaunchConfig: LaunchConfig | null;
  launchParams: LaunchParams;
  toggleBypassAppUpdate: () => void;
  toggleEnhancedDebugging: () => void;
  toggleResetWinePrefix: () => void;
  setEditLayout: (sub: InputConfig | null) => void;
  setEditLaunchConfig: (sub: LaunchConfig | null) => void;

  saveSubmission: (
    appId: string,
    item_type: SubmissionItemType,
    item: SubmissionSaveModel
  ) => void;
  createSubmission: (
    appId: string,
    item_type: SubmissionItemType
  ) => Promise<InputConfig | LaunchConfig | null>;
  copySubmission: (item: Submission, item_type: SubmissionItemType) => void;
  promoteSubmission: (
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
  const dispatch = useAppDispatch();
  const [itemToDelete, setItemToDelete] = useState<{
    item_id: string;
    app_id: string;
    item_type: SubmissionItemType;
  } | null>(null);
  const { email, username, userId } = useAppSelector(
    selectAuthState
  ) as AuthState;
  const [editLayout, setEditLayout] = useState<InputConfig | null>(null);
  const [resetWinePrefix, setResetWinePrefix] = useState<boolean>(false);
  const [bypassAppUpdate, setBypassAppUpdate] = useState<boolean>(false);
  const [enhancedDebugging, setEnhancedDebugging] = useState<boolean>(false);

  const [editLaunchConfig, setEditLaunchConfig] = useState<LaunchConfig | null>(
    null
  );
  const apps = useAppSelector(selectAppLibraryAppsState);
  const currentApp = useAppSelector(selectCurrentAppState);
  const clickedApp = useMemo(() => {
    if (currentApp) {
      for (const app of apps) {
        if (app.app.id === currentApp.app.id) {
          return app;
        }
      }
    }
  }, [currentApp, apps]);

  const loadLaunchPreferences = (): LaunchPreferences => {
    if (!currentApp) return {};
    const preferences = localStorage.getItem(
      `${currentApp.app.id}.launchPreferences`
    );
    return preferences ? JSON.parse(preferences) : {};
  };
  const saveLaunchPreferences = (launchPreferences: LaunchPreferences) => {
    if (!currentApp) return;
    localStorage.setItem(
      `${currentApp.app.id}.launchPreferences`,
      JSON.stringify(launchPreferences)
    );
  };

  const toggleResetWinePrefix = () => {
    const launchPreferences = loadLaunchPreferences();
    launchPreferences.resetWinePrefix = !resetWinePrefix;
    setResetWinePrefix(!resetWinePrefix);
    saveLaunchPreferences(launchPreferences);
  };
  const toggleBypassAppUpdate = () => {
    const launchPreferences = loadLaunchPreferences();
    launchPreferences.bypassAppUpdate = !bypassAppUpdate;
    setBypassAppUpdate(!bypassAppUpdate);
    saveLaunchPreferences(launchPreferences);
  };
  const toggleEnhancedDebugging = () => {
    const launchPreferences = loadLaunchPreferences();
    launchPreferences.enhancedDebugging = !enhancedDebugging;
    setEnhancedDebugging(!enhancedDebugging);
    saveLaunchPreferences(launchPreferences);
  };

  useEffect(() => {
    const launchPreferences = loadLaunchPreferences();

    setResetWinePrefix(launchPreferences.resetWinePrefix || false);
    setBypassAppUpdate(launchPreferences.bypassAppUpdate || false);
    setEnhancedDebugging(launchPreferences.enhancedDebugging || false);
  }, [clickedApp]);

  const inputSubmissions = useSubmissions(
    SubmissionType.InputConfig,
    currentApp?.app.id
  );
  const launchSubmissions = useSubmissions(
    SubmissionType.LaunchConfig,
    currentApp?.app.id
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
      clickedApp,
      resetWinePrefix,
      bypassAppUpdate,
      inputSubmissions.selectedItem,
      launchSubmissions.selectedItem,
      enhancedDebugging
    ]
  );
  const { sendMessage } = usePlayserve({
    onMessage: (message) => {
      if (message.message_type === MessageType.SubmissionGetAllUpdate) {
        const submissions = message.body as Submission[];
        if (submissions.length > 0) {
          const type = submissions[0].submission_item_type;
          if (submissions[0].app_id !== currentApp?.app.id) {
            return;
          }
          const newSubmissions = submissions.map((submission) => ({
            ...submission,
            ...JSON.parse(submission.data)
          }));
          if (type === "InputConfig") {
            inputSubmissions.setSubmissions(newSubmissions);
          } else if (type === "LaunchConfig") {
            launchSubmissions.setSubmissions(newSubmissions);
          }
        }
      }
    }
  });

  const isLoading = inputSubmissions.loading || launchSubmissions.loading;

  // Utilities
  const saveSubmission = useCallback(
    async (
      appId: string,
      item_type: SubmissionItemType,
      item: SubmissionSaveModel
    ) => {
      const configCreateMessage = getMessage(MessageType.SubmissionSave, {
        app_id: appId,
        item_type,
        item
      });

      return await sendMessage(configCreateMessage)()
        .then((response) => {
          if (response.status === 200) {
            let newSubmission = null;
            if (item_type === "InputConfig") {
              newSubmission = response.body as InputConfig;
            } else if (item_type === "LaunchConfig") {
              newSubmission = response.body as LaunchConfig;
            }
            return newSubmission;
          } else {
            dispatch(flashMessage(response.body.message));
            return null;
          }
        })
        .catch((err) => {
          error(err);
          return null;
        });
    },
    [sendMessage, dispatch]
  );

  const createSubmission = useCallback(
    async (appId: string, item_type: SubmissionItemType) => {
      let item = null;
      if (item_type === "InputConfig") {
        item = DEFAULT_INPUT_CONFIG;
      } else if (item_type === "LaunchConfig") {
        item = DEFAULT_LAUNCH_CONFIG;
      } else {
        warn("Attempt to created unimplemented submission type");
        return null;
      }
      return await saveSubmission(appId, item_type, item);
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
        dispatch(flashMessage(response.body.message));
      }
    });
  }, [
    sendMessage,
    dispatch,
    itemToDelete,
    launchSubmissions,
    inputSubmissions
  ]);

  const copySubmission = useCallback(
    async (submission: Submission, item_type: SubmissionItemType) => {
      const updatedSubmission = {
        app_id: submission.app_id,
        author_id: userId,
        author_name: username,
        name: submission.name + " (copy)",
        data: submission.data,
        description: submission.description,
        submission_category: SubmissionCategory.Local,
        submission_item_type: submission.submission_item_type
      };

      const item = {
        data: JSON.stringify(updatedSubmission),
        name: updatedSubmission.name,
        description: updatedSubmission.description
      };
      await saveSubmission(updatedSubmission.app_id, item_type, item);
    },
    [sendMessage, dispatch]
  );

  const promoteSubmission = useCallback(
    (item_id: string, item_type: SubmissionItemType, app_id: string) => {
      const payload = {
        item_type,
        app_id,
        item_id
      };
      const promoteConfigMessage = getMessage(
        MessageType.SubmissionPromote,
        payload
      );
      sendMessage(promoteConfigMessage)().then((response) => {
        if (response.status === 200) {
          dispatch(flashMessage(t`Submission promoted`));
        } else {
          console.error("Error promoting config", response);
          error(
            `Error promoting config ${response.status} ${response.body.message}`
          );
          dispatch(flashMessage(response.body.message));
        }
      });
    },
    [sendMessage, dispatch, inputSubmissions, launchSubmissions]
  );

  const submitSubmission = useCallback(
    (item_id: string, item_type: SubmissionItemType, app_id: string) => {
      const submitMessage = getMessage(MessageType.SubmissionSubmit, {
        item_id,
        item_type,
        app_id
      });
      const submissions =
        item_type === "LaunchConfig" ? launchSubmissions : inputSubmissions;
      sendMessage(submitMessage)().then((response) => {
        if (response.status === 200) {
          const newCategory = email?.endsWith("@playtron.one")
            ? SubmissionCategory.Official
            : SubmissionCategory.Community;
          const newSubmissions = submissions.submissions.map((submission) =>
            submission.item_id === item_id
              ? {
                  ...submission,
                  submission_category: newCategory
                }
              : submission
          );

          if (item_type === "InputConfig") {
            inputSubmissions.setSubmissions(newSubmissions);
          } else if (item_type === "LaunchConfig") {
            launchSubmissions.setSubmissions(newSubmissions);
          }
          dispatch(flashMessage(t`Configuration has been submitted`));
        } else {
          // TODO: Translate errrors properly
          const errorMessage = response.body.message;
          dispatch(
            flashErrorMessage(
              t`There was an error with the submission ${errorMessage}`
            )
          );
        }
      });
    },
    [sendMessage, dispatch, inputSubmissions, launchSubmissions]
  );

  const askDeleteSubmission = useCallback(
    (item_id: string, item_type: SubmissionItemType, app_id: string) =>
      setItemToDelete({ item_id, item_type, app_id }),
    [setItemToDelete]
  );

  return (
    <SubmissionsContext.Provider
      value={{
        clickedApp,
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
        promoteSubmission,
        askDeleteSubmission,
        submitSubmission,
        toggleBypassAppUpdate,
        toggleEnhancedDebugging,
        toggleResetWinePrefix,
        launchParams
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
