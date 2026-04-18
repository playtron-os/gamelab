import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

interface AppSelectionContextValue {
  selectedApps: Set<string>;
  setSelectedApps: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleApp: (id: string) => void;
}

const AppSelectionContext = createContext<AppSelectionContextValue | null>(
  null
);

export const AppSelectionProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());

  const toggleApp = useCallback((id: string) => {
    setSelectedApps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ selectedApps, setSelectedApps, toggleApp }),
    [selectedApps, toggleApp]
  );

  return (
    <AppSelectionContext.Provider value={value}>
      {children}
    </AppSelectionContext.Provider>
  );
};

export const useAppSelectionContext = (): AppSelectionContextValue => {
  const context = useContext(AppSelectionContext);
  if (!context) {
    throw new Error(
      "useAppSelectionContext must be used within an AppSelectionProvider"
    );
  }
  return context;
};
