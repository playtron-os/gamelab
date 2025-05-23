import React, { useEffect, useRef, useState } from "react";
import { t, Trans } from "@lingui/macro";
import {
  Modal,
  Button,
  ClipboardLine,
  EraserLine,
  PageSeparator,
  FileListLine
} from "@playtron/styleguide";

import { AppInformation, MessageType } from "@/types";
import { usePlayserve } from "@/hooks";
import { invoke } from "@tauri-apps/api/core";

const MAX_LOG_LINES = 5000;

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appInfo: AppInformation;
  isEnhancedDebuggingEnabled: boolean;
}

export const LogsModal: React.FC<LogsModalProps> = ({
  isOpen,
  onClose,
  appInfo,
  isEnhancedDebuggingEnabled
}) => {
  const [logs, setLogs] = useState<string>("");
  const scrollable = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogs("");
  }, [appInfo.app.id]);

  usePlayserve({
    onMessage: (message) => {
      if (
        message.message_type == MessageType.AppLogUpdate &&
        message.status == 200
      ) {
        invoke("app_log_stream", {
          appId: message.body.owned_app_id,
          content: message.body.content
        });
        if (appInfo.installed_app?.owned_app.id === message.body.owned_app_id) {
          setLogs(
            (logs + message.body.content)
              .split("\n")
              .slice(-1 * MAX_LOG_LINES)
              .join("\n")
          );
          setTimeout(() => {
            if (scrollable.current)
              scrollable.current.scrollTo({
                left: scrollable.current.scrollLeft,
                top: scrollable.current.scrollHeight,
                behavior: "smooth"
              });
          }, 400);
        }
      }
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      id={"logs-modal"}
      onClose={onClose}
      noContentPadding
      rightMargin={480}
      className="z-30 m-4"
    >
      <div>
        <div className="bg-[--fill-subtle] flex align-middle font-bold text-2xl items-center">
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
              onClick={() => {
                invoke("app_log_show", {
                  appId: appInfo.installed_app?.owned_app.id
                });
              }}
              Icon={FileListLine}
              label={t`Open Full Log`}
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
              onClick={() => setLogs(logs + "\n\n")}
              Icon={PageSeparator}
              label={t`Insert Delimiter`}
              backgroundColor="bg-[--fill-subtle]"
              size="small"
            />
          </div>
        </div>
        <div className="p-6">
          <div
            ref={scrollable}
            className="h-[calc(95vh-100px)] w-[calc(95vw-484px)] overflow-y-scroll"
          >
            <pre>
              {isEnhancedDebuggingEnabled
                ? logs ||
                  t`Game logs will appear here next time you launch the game`
                : t`Turn on Enhanced Debugging to see the log`}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  );
};
