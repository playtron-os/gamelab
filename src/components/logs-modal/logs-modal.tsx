import React, { useState } from "react";
import { t, Trans } from "@lingui/macro";
import {
  Modal,
  Button,
  ClipboardLine,
  EraserLine,
  PageSeparator
} from "@playtron/styleguide";

import { AppInformation } from "@/types";

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appInfo: AppInformation;
}

export const LogsModal: React.FC<LogsModalProps> = ({
  isOpen,
  onClose,
  appInfo
}) => {
  const [logs, setLogs] = useState<string>(JSON.stringify(appInfo, null, 2));
  // TODO : Connect to a playserve endoint to receive all messages of type game log for this app
  return (
    <Modal isOpen={isOpen} onClose={onClose} noContentPadding rightMargin={384}>
      <div>
        <div className="bg-[--fill-subtle] flex align-middle font-bold text-2xl items-center ">
          <div className="flex-grow p-1 ps-5">
            <Trans>Logs</Trans>
          </div>
          <div className="flex-shrink p-1 pe-5">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(logs);
              }}
              Icon={ClipboardLine}
              label={t`Copy`}
              backgroundColor="bg-[--fill-subtle]"
              size="small"
            />
            <Button
              onClick={() => setLogs("")}
              Icon={EraserLine}
              label={t`Clear`}
              backgroundColor="bg-[--fill-subtle]"
              size="small"
            />
            <Button
              onClick={() => console.log("Insert delimiter")}
              Icon={PageSeparator}
              label={t`Insert Delimiter`}
              backgroundColor="bg-[--fill-subtle]"
              size="small"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="h-[calc(95vh-100px)] w-[calc(95vw-384px)] overflow-y-scroll">
            <pre>{logs}</pre>
          </div>
        </div>
      </div>
    </Modal>
  );
};
