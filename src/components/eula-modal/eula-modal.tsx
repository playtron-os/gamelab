import React, { useMemo, useRef, useState } from "react";
import { ProgressSpinner, Modal, Checkbox, Button } from "@playtron/styleguide";
import { t, Trans } from "@lingui/macro";
import { AppInformation } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import { AppEulaResponseBody } from "@/types/app";

interface EulaModalProps {
  appInfo?: AppInformation;
  eula: AppEulaResponseBody | null;
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
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
  onReject
}) => {
  const scrollable = useRef<HTMLDivElement>(null);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eulaBody, setEulaBody] = useState("");
  useMemo(async () => {
    if (eula) {
      setIsLoading(true);
      const body = await getEulaBody(eula);
      setEulaBody(body);
      setIsLoading(false);
    }
  }, [eula]);

  return (
    <Modal isOpen={isOpen}>
      <div>
        <div className="bg-[--fill-subtle] flex align-middle font-bold text-2xl items-center ">
          <div className="flex-grow p-1 ps-5">
            <Trans>End User License Agreements for</Trans> {appInfo?.app.name}
          </div>
        </div>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(95vh-120px)] w-[calc(95vw-384px)]">
            <ProgressSpinner size={64} />
          </div>
        ) : (
          <div
            ref={scrollable}
            className="h-[calc(95vh-120px)] w-[calc(95vw-384px)] overflow-y-scroll"
          >
            {eula && (
              <div className="h-[calc(100vh-180px)] w-[calc(95vw-404px)]">
                <div dangerouslySetInnerHTML={{ __html: eulaBody }}></div>
              </div>
            )}
          </div>
        )}

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
                  onReject();
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
