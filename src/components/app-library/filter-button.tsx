import React from "react";
import { CaretDown, CaretTop, styles } from "@playtron/styleguide";

interface FilterSelectorProps {
  label: string;
  open?: boolean;
}

export const FilterButton: React.FC<FilterSelectorProps> = ({
  label,
  open = false
}) => {
  return (
    <div className="flex items-center border border-[--stroke-subtle] rounded-md bg-[--fill-default] w-[240px] px-3 py-2">
      <span className="flex-grow">{label}</span>

      <span className="flex-shrink">
        {open ? (
          <CaretTop fill={styles.variablesDark.fill.normal} />
        ) : (
          <CaretDown fill={styles.variablesDark.fill.normal} />
        )}
      </span>
    </div>
  );
};
