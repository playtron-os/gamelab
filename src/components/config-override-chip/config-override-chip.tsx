import React from "react";

import { DeleteBinLine } from "@playtron/styleguide";
import classNames from "classnames";

export interface ConfigOverrideChipProps {
  label: string;
  selected: boolean;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  onDelete?: () => void;
  onSelect?: () => void;
}

export const ConfigOverrideChip: React.FC<ConfigOverrideChipProps> = ({
  label,
  selected,
  icon,
  iconAfter,
  onSelect,
  onDelete
}) => {
  return (
    <div
      className={classNames(
        "config-override-chip-rct-component",
        "group p-3 outline-1 rounded-[--radii-md] outline-[--stroke-subtle] text-base hover:outline",
        "flex flex-row gap-2 cursor-pointer",
        { "bg-[--fill-subtler]": selected, outline: selected }
      )}
      onClick={onSelect}
    >
      {icon}
      <span className="flex-grow truncate w-1/2">{label}</span>
      {onDelete && (
        <DeleteBinLine
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="invisible cursor-pointer group-hover:visible"
          fill="white"
          width={"1.2em"}
        />
      )}
      {iconAfter}
    </div>
  );
};
