import { ConfirmationPopUpProps } from "@playtron/styleguide";
import { INITIAL_STATE } from "./initial-state";
import React, { createContext, ReactNode, useState } from "react";

export const ConfirmationPopUpContext = createContext<{
  popUpState: ConfirmationPopUpProps;
  setPopUpState: (state: ConfirmationPopUpProps) => void;
} | null>(null);

type ConfirmationPopUpContextProviderProps = {
  children: ReactNode;
};

export const ConfirmationPopUpContextProvider: React.FC<
  ConfirmationPopUpContextProviderProps
> = ({ children }) => {
  const [popUpState, setPopUpState] =
    useState<ConfirmationPopUpProps>(INITIAL_STATE);

  return (
    <ConfirmationPopUpContext.Provider value={{ popUpState, setPopUpState }}>
      {children}
    </ConfirmationPopUpContext.Provider>
  );
};

export interface UseConfirmationPopUpReturn {
  props: ConfirmationPopUpProps;
  openConfirmationPopUp: (props: ConfirmationPopUpProps) => void;
  closeConfirmationPopUp: () => void;
}
