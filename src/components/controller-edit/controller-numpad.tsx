import React from "react";
import { ControllerComponentProps } from "@/types/input-config";
import classNames from "classnames";
import { KEYBOARD_NUMPAD_LAYOUT, getKeyLabel } from "@/utils/controllers";

export const Numpad: React.FC<ControllerComponentProps> = ({
  mappedKey,
  onSelectKey
}) => {
  const rowComponents = KEYBOARD_NUMPAD_LAYOUT.map((row, rowIndex) => {
    return (
      <div className="flex gap-1 mb-1 h-12" key={rowIndex}>
        {row.map((key, colIndex) => {
          if (!key) {
            return <span className="h-12 w-12" key={colIndex}></span>;
          }
          const label = getKeyLabel(key);
          return (
            <button
              className={classNames(
                "border-2 border-[--fill-subtle] rounded-md hover:border-[--fill-primary]",
                key == "KeyKp0" ? "w-[100px]" : "w-12",
                key == "KeyEnter" || key == "KeyPlus" ? "h-[100px]" : "h-12",
                label.length > 2 ? "text-xs" : "",
                rowIndex == 0 ? "h-10" : "h-12",
                colIndex == 3 ? "ms-5" : "",
                mappedKey === key
                  ? "bg-[--fill-default] border-[--stroke-selected]"
                  : ""
              )}
              onClick={() =>
                onSelectKey({ label: key, device: "keyboard", mapping: key })
              }
              key={colIndex}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  });

  return (
    <div className="m-auto text-center">
      <div className="border-2 border-[--fill-subtle] p-6 rounded-md inline-block">
        <div>{rowComponents}</div>
      </div>
    </div>
  );
};
