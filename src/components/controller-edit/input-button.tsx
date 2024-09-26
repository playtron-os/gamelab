import React from "react";
import classNames from "classnames";
import { styles } from "@playtron/styleguide";
import { ControllerInput, InputEvent } from "@/types/input-config";
import { mappingCmp } from "@/utils/controllers";
interface InputButtonProps {
  input: ControllerInput;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | null;
  onSelectKey: (input: ControllerInput) => void;
  mappedKey?: InputEvent;
  className?: string;
  color?: string;
}

export const InputButton: React.FC<InputButtonProps> = ({
  input,
  onSelectKey,
  className,
  mappedKey,
  color = styles.variablesDark.fill.white
}) => {
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
      {input.icon && <input.icon fill={color} />}
      {input.label}
    </div>
  );
};
