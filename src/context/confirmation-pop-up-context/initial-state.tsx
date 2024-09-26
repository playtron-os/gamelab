import { ConfirmationPopUpProps } from "@playtron/styleguide";

export const INITIAL_STATE: ConfirmationPopUpProps = {
  isOpen: false,
  title: "",
  cancelText: undefined,
  confirmText: undefined,
  onConfirm: () => {},
  onClose: undefined
};
