import { useContext } from "react";
import { ConfirmationPopUpProps } from "@playtron/styleguide";

import {
  ConfirmationPopUpContext,
  UseConfirmationPopUpReturn
} from "./confirmation-pop-up-context";
import { INITIAL_STATE } from "./initial-state";

export const useConfirmationPopUp = (): UseConfirmationPopUpReturn => {
  const context = useContext(ConfirmationPopUpContext);
  if (!context) {
    throw new Error(
      "useConfirmationPopUp must be used within a ConfirmationPopUpContextProvider"
    );
  }

  const { popUpState, setPopUpState } = context;

  const openConfirmationPopUp = (props: ConfirmationPopUpProps) => {
    setPopUpState({
      isOpen: true,
      ...props
    });
  };

  const closeConfirmationPopUp = () => {
    setPopUpState(INITIAL_STATE);
  };

  return {
    props: popUpState,
    openConfirmationPopUp,
    closeConfirmationPopUp
  };
};
