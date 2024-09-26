import React, { createContext, ReactNode } from "react";
import { ProgressSpinner } from "@playtron/styleguide";
import { useBoolean } from "ahooks";
import "./loading-spinner-context.scss";

export const LoadingSpinnerContext = createContext<{
  isLoadingSpinnerActive: boolean;
  showLoadingSpinner: () => void;
  hideLoadingSpinner: () => void;
} | null>(null);

type ConfirmationPopUpContextProviderProps = {
  children: ReactNode;
};

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-rct-component">
      <ProgressSpinner />
    </div>
  );
};

export const LoadingSpinnerContextProvider: React.FC<
  ConfirmationPopUpContextProviderProps
> = ({ children }) => {
  const [
    isLoadingSpinnerActive,
    { setTrue: showLoadingSpinner, setFalse: hideLoadingSpinner }
  ] = useBoolean(false);

  return (
    <LoadingSpinnerContext.Provider
      value={{
        isLoadingSpinnerActive,
        showLoadingSpinner,
        hideLoadingSpinner
      }}
    >
      {children}
      {isLoadingSpinnerActive && <LoadingSpinner />}
    </LoadingSpinnerContext.Provider>
  );
};

export interface UseLoadingSpinnerReturn {
  isLoadingSpinnerActive: boolean;
  showLoadingSpinner: () => void;
  hideLoadingSpinner: () => void;
}
