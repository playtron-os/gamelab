import { useContext } from "react";
import { SubmissionsContext } from "..";

export const useSubmissionsContext = () => {
  const context = useContext(SubmissionsContext);
  if (!context) {
    throw Error(
      "useSubmissionsContext must be used within SubmissionsContextProvider"
    );
  }
  return context;
};
