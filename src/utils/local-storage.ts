import { error } from "@tauri-apps/plugin-log";

const ONE_YEAR_MILLISECONDS = 1000 * 60 * 60 * 24 * 7 * 52;

type LocalStorageKey = string;

export const setInLocalStorage = <T>(key: LocalStorageKey, value: T) => {
  if (typeof window !== "undefined") {
    const item = {
      value,
      expiresIn: Date.now() + ONE_YEAR_MILLISECONDS
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
};

export const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.log("error parsing json", { e });
    error("failed to parse local storage json value");
    return null;
  }
};

export const getFromLocalStorage = (key: LocalStorageKey) => {
  const item = localStorage.getItem(key);
  if (item) {
    const parsedItem = parseJson(item);

    if (Date.now() < parsedItem?.expiresIn) {
      return parsedItem.value;
    }
  }
};

export const removeFromLocalStorage = (key: LocalStorageKey) => {
  localStorage.removeItem(key);
};
