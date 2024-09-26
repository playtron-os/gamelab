import { useContext } from "react";
import {
  AppLibraryContextProps,
  AppLibraryContext
} from "./app-library-context";

export const useAppLibraryContext = (): AppLibraryContextProps => {
  const context = useContext(AppLibraryContext);
  if (!context) {
    throw new Error(
      "useAppLibraryContext must be used within a AppLibraryContextProvider"
    );
  }
  return context;
};
