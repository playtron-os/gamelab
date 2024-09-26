import { getFromLocalStorage, setInLocalStorage } from "./local-storage";

export const setUserIdToLocalStorage = (userId?: string) => {
  return setInLocalStorage("user_id", userId);
};

export const getUserIdFromLocalStorage = () => {
  return getFromLocalStorage("user_id");
};
