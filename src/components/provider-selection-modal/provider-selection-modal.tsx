import React from "react";
import { t } from "@lingui/macro";

import {
  ProviderSelectionDialogState,
  closeProviderSelectionDialog,
  selectProviderSelectionDialogState
} from "@/redux/modules/provider-selection-dialog/provider-selection-dialog-slice";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { AppInformation } from "@/types";
import { Modal } from "@playtron/styleguide";
import { getProviderName } from "@/utils/app-info";
import { getProviderIcon } from "../app-library/game-card";

interface ProviderSelectionModalProps {
  appInfo: AppInformation;
  onProviderSelect: (provider: string) => void;
}

export const ProviderSelectionModal: React.FC<ProviderSelectionModalProps> = ({
  appInfo,
  onProviderSelect
}) => {
  const { isProviderSelectionDialogOpen } =
    useAppSelector<ProviderSelectionDialogState>(
      selectProviderSelectionDialogState
    );
  const dispatch = useAppDispatch();
  return (
    <Modal
      isOpen={isProviderSelectionDialogOpen}
      onClose={() => dispatch(closeProviderSelectionDialog())}
      title={t`Select a provider`}
      className="p-4"
    >
      <div className="flex flex-col gap-2 py-4">
        {appInfo.owned_apps.map((provider) => (
          <div
            key={provider.id}
            className={`flex flex-row items-center gap-2 p-2 rounded-md cursor-pointer hover:outline-2 hover:outline-double`}
            onClick={() => {
              onProviderSelect(provider.id);
              dispatch(closeProviderSelectionDialog());
            }}
          >
            {getProviderIcon(provider.provider)}
            {getProviderName(provider.provider)}
          </div>
        ))}
      </div>
    </Modal>
  );
};
