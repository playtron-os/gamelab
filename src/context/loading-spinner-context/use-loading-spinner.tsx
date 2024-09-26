import { useContext } from "react";

import {
  UseLoadingSpinnerReturn,
  LoadingSpinnerContext
} from "./loading-spinner-context";

export const useLoadingSpinner = (): UseLoadingSpinnerReturn => {
  const context = useContext(LoadingSpinnerContext);
  if (!context) {
    throw new Error(
      "useLoadingSpinner must be used within a LoadingSpinnerContextProvider"
    );
  }

  return context;
};
