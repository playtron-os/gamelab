import { error } from "@tauri-apps/plugin-log";

const ONE_WEEK_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;

type LocalStorageKey = "user_id" | "last_ip"; // | 'otherKey' | 'anotherKey';

export const setInLocalStorage = <T>(key: LocalStorageKey, value: T) => {
  if (typeof window !== "undefined") {
    const item = {
      value,
      expiresIn: Date.now() + ONE_WEEK_MILLISECONDS
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
};

export const parseJson = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log("error parsing json", { e });
    error("failed to parse local storage json value");
    return null;
  }
};

export const getFromLocalStorage = (key: LocalStorageKey, remove = true) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    if (item) {
      const parsedItem = parseJson(item);

      if (Date.now() < parsedItem?.expiresIn) {
        return parsedItem.value;
      }

      if (remove) {
        localStorage.removeItem(key);
      }
    }
  }
  return null;
};

export const removeFromLocalStorage = (key: LocalStorageKey) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
