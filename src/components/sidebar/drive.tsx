import React from "react";
import { t } from "@lingui/macro";
import { Checkbox, ProgressBar } from "@playtron/styleguide";
import { getDiskSizeLabel } from "@/utils/app-info";

interface DriveProps {
  label: string;
  capacity: number;
  size: number;
  icon: React.ReactNode;
  enabled?: boolean;
  disabled?: boolean;
  singleDrive?: boolean;
  onClick: () => void;
}

export const Drive: React.FC<DriveProps> = ({
  label,
  capacity,
  size,
  icon,
  enabled = false,
  disabled = false,
  singleDrive = false,
  onClick
}) => {
  return (
    <>
      <div className="flex text-gray-400 w-full items-center space-x-1 ps-3 py-1">
        <span className="flex-col w-5 text-xl text-white">{icon}</span>
        <span className="flex-grow text-sm ps-2 max-w-36 overflow-hidden">
          <span className="text-sm text-nowrap pe-2">{label}</span>
          <br />
          <span className="text-xs text-gray-500">
            {capacity}%&nbsp; {t`used of`} {getDiskSizeLabel(size)}
          </span>
        </span>
        <br />

        <span className="flex-initial text-sm"></span>
        <span className="flex">
          {singleDrive === false && (
            <Checkbox
              checked={enabled}
              disabled={disabled}
              onChange={onClick}
            />
          )}
        </span>
      </div>
      <div className="ps-3 mb-2">
        <ProgressBar value={capacity} size="sm" />
      </div>
    </>
  );
};

export default Drive;
