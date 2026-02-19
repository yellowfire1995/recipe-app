import { useState } from "react";
import logger from "./logger";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      logger.log(err);
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      logger.log(err);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
