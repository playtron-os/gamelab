import React from "react";
import { t } from "@lingui/macro";
import { AppInformation } from "@/types";
import { Modal } from "@playtron/styleguide";
import { getProviderName } from "@/utils/app-info";
import { getProviderIcon } from "../app-library/game-card";

interface ProviderSelectionModalProps {
  appInfo: AppInformation;
  isOpen: boolean;
  onClose: () => void;
  onProviderSelect: (provider: string) => void;
}

export const ProviderSelectionModal: React.FC<ProviderSelectionModalProps> = ({
  appInfo,
  isOpen,
  onClose,
  onProviderSelect
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t`Select a provider`}
      className="p-4"
    >
      <div className="flex flex-col gap-2 py-4">
        {appInfo.owned_apps.map((provider) => (
          <div
            key={provider.id}
            className={`flex flex-row items-center gap-2 p-2 rounded-md cursor-pointer hover:outline-2 hover:outline-double`}
            onClick={() => onProviderSelect(provider.id)}
          >
            {getProviderIcon(provider.provider)}
            {getProviderName(provider.provider)}
          </div>
        ))}
      </div>
    </Modal>
  );
};
