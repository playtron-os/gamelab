import React from "react";
import classNames from "classnames";
import { ControllerComponentProps } from "@/types/input-config";
import {
  KEYBOARD_QWERTY_LAYOUT,
  getKeyWidth,
  getKeyLabel
} from "@/utils/controllers";
export const Keyboard: React.FC<ControllerComponentProps> = ({
  mappedKey,
  onSelectKey
}) => {
  const rowComponents = KEYBOARD_QWERTY_LAYOUT.map((row, rowIndex) => {
    return (
      <div className="flex gap-1 mb-1" key={rowIndex}>
        {row.map((key, index) => {
          const isSelected = mappedKey === key;
          return (
            <button
              key={index}
              className={classNames(
                "border-2 flex-grow border-[--fill-subtle] rounded-md w-12 hover:border-[--fill-primary]",
                rowIndex == 0 ? "h-10" : "h-12",
                getKeyWidth(key),
                isSelected
                  ? "bg-[--fill-default] border-[--stroke-selected]"
                  : ""
              )}
              onClick={() => {
                onSelectKey({ label: key, device: "keyboard", mapping: key });
              }}
            >
              {getKeyLabel(key)}
            </button>
          );
        })}
      </div>
    );
  });

  return (
    <div className="border-2 border-[--fill-subtle] p-6 rounded-md">
      {rowComponents}
    </div>
  );
};
