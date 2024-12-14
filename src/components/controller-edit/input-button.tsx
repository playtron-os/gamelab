import React from "react";
import classNames from "classnames";
import { styles } from "@playtron/styleguide";
import { ControllerInput, InputEvent } from "@/types/input-config";
import { mappingCmp, convertOrientationToButton } from "@/utils/controllers";

interface InputButtonProps {
  input: ControllerInput;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | null;
  onSelectKey: (input: ControllerInput) => void;
  mappedKey?: InputEvent;
  className?: string;
  layout?: string;
  color?: string;
}

export const InputButton: React.FC<InputButtonProps> = ({
  input,
  onSelectKey,
  mappedKey,
  className,
  layout,
  color = styles.variablesDark.fill.white
}) => {
  const getInputIcon = () => {
    if (!input.icon) {
      return null;
    }
    if (layout === "ps5" && input.psIcon) {
      return <input.psIcon fill={color} />;
    } else {
      return <input.icon fill={color} />;
    }
  };
  return (
    <div
      className={classNames(
        "border border-[--stroke-subtle] hover:border-[--stroke-default] hover:bg-[--state-hovered-neutral] rounded-md flex",
        "items-center p-2 gap-2  w-[148px] h-[36px] font-bold text-sm mb-2 cursor-pointer",
        mappingCmp(mappedKey, { [input.device]: input.mapping })
          ? "bg-[--fill-default] border-[--stroke-selected]"
          : "bg-[--state-default-neutral]",
        className
      )}
      onClick={() => onSelectKey(input)}
    >
      {getInputIcon()}
      {convertOrientationToButton(input.label, layout)}
    </div>
  );
};
