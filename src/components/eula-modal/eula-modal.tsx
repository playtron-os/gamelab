import React, { useMemo, useRef, useState } from "react";
import { Modal, Checkbox, Button } from "@playtron/styleguide";
import { t, Trans } from "@lingui/macro";
import { AppInformation } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import { AppEulaResponseBody } from "@/types/app";

interface EulaModalProps {
  appInfo?: AppInformation;
  eula: AppEulaResponseBody | null;
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const getEulaBody = async (
  eula: AppEulaResponseBody | null
): Promise<string> => {
  if (!eula) return "";
  if (eula.body) {
    return eula.body;
  }
  const eulaBody: string = await invoke("download_eula", {
    eulaUrl: eula.url
  });
  return eulaBody;
};

export const EulaModal: React.FC<EulaModalProps> = ({
  appInfo,
  eula,
  isOpen,
  onAccept,
  onClose
}) => {
  const scrollable = useRef<HTMLDivElement>(null);
  const [accepted, setAccepted] = useState(false);
  const [eulaBody, setEulaBody] = useState("");
  useMemo(async () => {
    if (eula) {
      const body = await getEulaBody(eula);
      setEulaBody(body);
    }
  }, [eula]);

  return (
    <Modal isOpen={isOpen}>
      <div>
        <div className="bg-[--fill-subtle] flex align-middle font-bold text-2xl items-center ">
          <div className="flex-grow p-1 ps-5">
            <Trans>End User License Agreements for</Trans>
            {appInfo?.app.name}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div
          ref={scrollable}
          className="h-[calc(95vh-120px)] w-[calc(95vw-384px)] overflow-y-scroll"
        >
          {eula && (
            <div className="h-[calc(100vh-180px)] w-[calc(95vw-384px)]">
              <div dangerouslySetInnerHTML={{ __html: eulaBody }}></div>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex-grow"></div>
          <div className="py-2">
            <Checkbox
              label={t`I agree to this EULA`}
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />
          </div>
          <div>
            <Button
              onClick={() => {
                if (accepted) {
                  onAccept();
                } else {
                  onClose();
                }
              }}
              label={accepted ? t`Submit` : t`Close`}
              primary={accepted}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
