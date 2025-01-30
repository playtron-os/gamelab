import React from "react";
import { Checkbox, styles, ProgressBar } from "@playtron/styleguide";
import { getProviderName } from "@/utils/app-info";

interface ProviderProps {
  provider?: string;
  name?: string;
  installed: number;
  total: number;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | null;
  enabled?: boolean;
  loadingProgress: number;
  onClick: () => void;
}

export const Provider: React.FC<ProviderProps> = ({
  provider,
  name,
  installed,
  total,
  Icon,
  enabled = false,
  loadingProgress,
  onClick
}) => {
  return (
    <>
      <div className="flex text-gray-400 w-full items-center space-x-3 ps-3 py-1">
        <span className="flex-col w-5 text-xl text-white">
          {Icon && <Icon fill={styles.variablesDark.fill.white} />}
        </span>
        <span className="flex-grow">
          {provider ? getProviderName(provider) : name}: {installed}/{total}
        </span>
        <span className="flex">
          <Checkbox checked={enabled} onChange={onClick} />
        </span>
      </div>

      <div className="ps-3 mb-2">
        {loadingProgress ? (
          <ProgressBar value={loadingProgress} size="sm" />
        ) : (
          <span></span>
        )}
      </div>
    </>
  );
};

export default Provider;
