import React, { useState } from "react";
import { Button, Modal, TextInput } from "@playtron/styleguide";
import { SigninLayout } from "@/components/signin-layout/signin-layout";
import { useNavigate } from "react-router-dom";
import { useLoadingSpinner } from "@/context/loading-spinner-context";
import { useAppDispatch } from "@/redux/store";
import { setDeviceIp, resetLibrary } from "@/redux/modules";
import { sendPlayserveMessage } from "@/hooks";
import { getMessage, MessageType } from "@/types";
import { handleUser } from "./hooks";
import { invoke } from "@tauri-apps/api/core";
import { getFromLocalStorage, setInLocalStorage } from "@/utils/local-storage";
import { t, Trans } from "@lingui/macro";
import { error } from "@tauri-apps/plugin-log";

export const ConnectDeviceScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const savedDeviceIp = getFromLocalStorage("last_ip");
  const [localDeviceIp, setLocalDeviceIp] = useState(savedDeviceIp);
  const { showLoadingSpinner, hideLoadingSpinner } = useLoadingSpinner();

  const [errorText, setErrorText] = useState("");

  const [isInvalidCreds, setInvalidCreds] = useState(false);
  const [username, setUsername] = useState<string>("playtron");
  const [password, setPassword] = useState<string | null>(null);

  const handleConnection = async () => {
    showLoadingSpinner();
    setErrorText("");
    setInvalidCreds(false);

    const address = await invoke("initialize_device_connection", {
      address: localDeviceIp,
      username,
      password
    }).catch((err) => {
      if (err.endsWith("Disconnect")) {
        setPassword(null);
        setInvalidCreds(true);
        error("Default credentials didn't work, asking for input");
      } else if (err.endsWith("ConnectionTimeout")) {
        setErrorText(t`The device did not respond in time`);
        error("SSH connection timed out");
      } else {
        setErrorText(t`Unable to connect with the device: ${err}`);
      }
      console.error("Failed to ssh", err);
    });
    if (typeof address !== "string" || !address) {
      hideLoadingSpinner();
      error("SSH connection failed");
      return;
    }
    console.log(`Connnection address is ${address}`);
    if (!address) {
      hideLoadingSpinner();
      setErrorText(t`Unable to connect to playtron service on the device`);
      return;
    }
    const message = getMessage(MessageType.GetCurrentUser, {});
    const response = await sendPlayserveMessage(address, message)();
    if (response.status !== 200 || !response.body) {
      hideLoadingSpinner();
      console.error("Unable to communicate with playserve");
      error("Unable to communicate with playserve");
      setErrorText(t`Unable to connect to playtron service on the device`);
      return;
    }

    setInLocalStorage("last_ip", localDeviceIp);
    dispatch(setDeviceIp(address));
    dispatch(resetLibrary());
    await handleUser(dispatch, address, response.body);
    hideLoadingSpinner();
    navigate("/");
  };

  return (
    <SigninLayout>
      <div>
        <h1 className="text-3xl font-bold text-white py-6">
          <Trans>Test Games on Playtron Device via Local Network</Trans>
        </h1>
        <div>
          <Trans>
            Initiate direct testing on a Playtron device within your local
            network. Begin by enabling SSH connections: navigate to
            &apos;Settings &gt; Advanced &gt; Remote Access&apos; on your
            device.
          </Trans>
        </div>
        <div className="py-4">
          <label>
            <Trans>IP Address of the Playtron device</Trans>
          </label>
          <TextInput
            value={localDeviceIp}
            errorText={errorText}
            onChange={(value) => {
              setLocalDeviceIp(value);
              setErrorText("");
            }}
          />
        </div>
        <div className="py-4">
          <Button
            label={t`Connect`}
            className="w-full"
            primary
            onClick={handleConnection}
          />
        </div>
      </div>
      <Modal
        id="ssh-creds"
        isOpen={isInvalidCreds}
        onClose={() => setInvalidCreds(false)}
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold">
            <Trans>Invalid SSH credentials</Trans>
          </h2>
          <div className="max-w-96 mb-2">
            <Trans>
              Labs is unable to connect to the device using default credentials.
              Please provide correct username and password.
            </Trans>
          </div>
          <TextInput
            value={username || ""}
            onChange={(v) => setUsername(v)}
            placeholder={t`Username`}
            label={t`Username`}
          />
          <TextInput
            value={password || ""}
            onChange={(v) => setPassword(v)}
            placeholder={t`Password`}
            label={t`Password`}
            type="password"
          />
          <div className="mt-3 flex flex-col gap-2">
            <Button
              label={t`Connect`}
              className="w-full"
              primary
              onClick={handleConnection}
            />
            <Button
              label={t`Cancel`}
              className="w-full"
              onClick={() => setInvalidCreds(false)}
            />
          </div>
        </div>
      </Modal>
    </SigninLayout>
  );
};
