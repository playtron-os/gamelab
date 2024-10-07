import { useSubmissionsContext } from "@/context/submissions-context";
import { AppInformation, LaunchConfig } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { flashMessage } from "redux-flash";
import {
  Divider,
  Button,
  TextInput,
  CloseFill,
  AddLine
} from "@playtron/styleguide";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";

import "./launch-config-editor.scss";
import { useAppDispatch } from "@/redux/store";
import { Trans, t } from "@lingui/macro";
import { Override } from "@/types/launch";
import { ConfigOverrideChip } from "../config-override-chip";

export interface LaunchConfigEditorProps {
  appInfo: AppInformation;
  handleSave: () => void;
  onClose: () => void;
}

const DEFAULT_OVERRIDE: Override = {
  conditions: { providers: [], architectures: [] },
  name: "New override", // eslint-disable-line
  actions: [{ op: "add", path: "/env/SOME_ENV", value: "1" }]
};

export const LaunchConfigEditor: React.FC<LaunchConfigEditorProps> = ({
  appInfo,
  handleSave,
  onClose
}) => {
  const { editLaunchConfig: selectedConfig, setEditLaunchConfig } =
    useSubmissionsContext();
  const flashDispatch = useAppDispatch();

  const [valid, setValid] = useState(true);
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(-1);
  const [overrides, setOverrides] = useState<Override[]>([]);

  const appName = appInfo.app.name;

  if (!selectedConfig) {
    // We assume selected config is always present when we are in editor
    return null;
  }

  const removeOverride = useCallback(
    (index: number) => {
      const newOverrides = overrides.filter((_, itemI) => index !== itemI);
      setOverrides(newOverrides);
      setEditLaunchConfig({ ...selectedConfig, overrides: newOverrides });
      setEditMode(-1);
    },
    [overrides]
  );

  useEffect(() => {
    try {
      if (!selectedConfig) {
        return;
      }
      const parsed = JSON.parse(selectedConfig.data);
      const overrides = parsed.overrides || [];
      setOverrides(parsed.overrides || []);
      delete parsed.overrides;
      delete parsed.unsubmittedChanges;
      const configuration = parsed;
      setContent(JSON.stringify(configuration, undefined, 2));
      setEditLaunchConfig({
        ...selectedConfig,
        configuration,
        overrides
      });
    } catch (err) {
      console.error("Failed to parse config", err);
    }
  }, []);

  const lineNumbers: string = useMemo(
    () =>
      [...Array((content?.match(/\n/g)?.length || 0) + 2).keys()]
        .slice(1)
        .join("<br/>"),
    [content]
  );

  useEffect(() => {
    setValid(false);
    const debounce = setTimeout(() => {
      if (!selectedConfig) {
        return;
      }
      try {
        const data: LaunchConfig | Override = JSON.parse(content);
        if (editMode === -1) {
          setEditLaunchConfig({
            ...selectedConfig,
            configuration: data as LaunchConfig
          });
        } else {
          const newOverrides: Override[] = [...overrides];
          newOverrides[editMode] = data as Override;
          setOverrides(newOverrides);
          setEditLaunchConfig({ ...selectedConfig, overrides: newOverrides });
        }
        setValid(true);
      } catch (err) {
        console.error("Failed to update edit config object", err);
      }
    }, 1000);

    return () => clearTimeout(debounce);
  }, [content, setEditLaunchConfig]);

  // Display config based on currently selected one
  useEffect(() => {
    if (editMode === -1) {
      if (selectedConfig?.configuration) {
        setContent(JSON.stringify(selectedConfig.configuration, undefined, 2));
      }
      return;
    }
    const data = overrides[editMode];
    const jsonData = JSON.stringify(data, undefined, 2);
    setContent(jsonData);
  }, [editMode]);

  const overridesList = overrides.map((override, index) => {
    // Using an index is a bad idea although it doesn't matter on small lists that much, what else can we do?
    return (
      <ConfigOverrideChip
        key={`launch-override-${index}`}
        label={override.name}
        selected={editMode === index}
        onSelect={() => setEditMode(index)}
        onDelete={() => removeOverride(index)}
      />
    );
  });

  return (
    <>
      <div className="bg-[--fill-subtle] flex flex-row items-center justify-center font-bold text-2xl h-[64px] py-3 px-6">
        <div className="flex-grow">
          <Trans>Launch Config for {appName}</Trans>
        </div>
        <Button
          className="px-4"
          Icon={CloseFill}
          onClick={() => {
            setEditLaunchConfig(null);
            onClose();
          }}
        />
      </div>
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
              value={selectedConfig.name}
              onChange={(name) =>
                setEditLaunchConfig({ ...selectedConfig, name })
              }
            />
          </div>
          <header className="flex align-baseline gap-2 p-4 mt-4">
            <span className="font-bold">
              <Trans>CONFIGURATION</Trans>
            </span>
            <span className="flex-grow m-auto">
              <Divider type="subtle" />
            </span>
            <button
              className="cursor-pointer"
              role="button"
              onClick={() => setOverrides([...overrides, DEFAULT_OVERRIDE])}
            >
              <AddLine fill="white" />
            </button>
          </header>
          <div className="px-4 py-2 flex flex-col gap-2 overflow-y-auto">
            <ConfigOverrideChip
              label={t`Base config`}
              selected={editMode === -1}
              onSelect={() => setEditMode(-1)}
            />
            {overridesList}
          </div>
          <div className="flex-grow "></div>
          <div className="flex-shrink bg-[--fill-subtle]">
            <textarea
              className="m-4 border border-[--stroke-normal] rounded-lg p-4 w-64 h-24 mb-2"
              value={selectedConfig.description}
              onChange={(e) => {
                setEditLaunchConfig({
                  ...selectedConfig,
                  description: e.target.value
                });
              }}
            ></textarea>
            <Button
              label={t`Save`}
              primary
              disabled={!valid}
              className="w-64 mt-0 m-4"
              onClick={handleSave}
            />
          </div>
        </div>

        <div className="flex-grow flex flex-col bg-[--fill-subtler] p-6 max-h-[calc(90vh-64px)] text-base gap-[24px]">
          <div className="flex-grow overflow-auto border border-[--stroke-subtle] p-4 rounded-lg relative pb-6">
            <span
              dangerouslySetInnerHTML={{ __html: lineNumbers }}
              className="text-[--text-weak] text-right w-8 select-none absolute"
            ></span>
            <Editor
              className="ml-10 resize-none min-h-full"
              value={content}
              onValueChange={setContent}
              highlight={(code) =>
                highlight(code || "", languages.json, "json")
              }
            />
          </div>

          <div className="flex-shrink flex gap-[12px]">
            <Button
              label={t`Validate JSON`}
              onClick={() => {
                try {
                  JSON.parse(content);
                } catch (err) {
                  flashDispatch(
                    flashMessage(t`JSON structure is invalid ${err}`)
                  );
                }
              }}
            />
            <Button label={t`Clear`} onClick={() => setContent("{\n}")} />
            <Button
              label={t`Format`}
              onClick={() =>
                setContent(JSON.stringify(JSON.parse(content), null, 2))
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
