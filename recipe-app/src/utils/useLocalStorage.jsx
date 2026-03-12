import { useEffect, useMemo, useRef, useState } from "react";

function useLocalStorage(key, defaultValue, options) {
  const opts = useMemo(() => {
    return {
      serializer: JSON.stringify,
      parser: JSON.parse,
      logger: () => {},
      syncData: true,
      ...options,
    };
  }, [options]);

  const { serializer, parser, logger, syncData } = opts;
  const rawValueRef = useRef(null);

  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Sync ref after mount, not during render
  useEffect(() => {
    if (typeof window === "undefined") return;
    rawValueRef.current = window.localStorage.getItem(key);
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (value !== undefined) {
        const newValue = serializer(value);
        const oldValue = rawValueRef.current;
        rawValueRef.current = newValue;
        window.localStorage.setItem(key, newValue);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: window.localStorage,
            url: window.location.href,
            key,
            newValue,
            oldValue,
          }),
        );
      } else {
        window.localStorage.removeItem(key);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: window.localStorage,
            url: window.location.href,
            key,
          }),
        );
      }
    } catch (e) {
      logger(e);
    }
  }, [value, key, serializer, logger]);

  useEffect(() => {
    if (!syncData || typeof window === "undefined") return;
    const handleStorageChange = (e) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      try {
        if (e.newValue !== rawValueRef.current) {
          rawValueRef.current = e.newValue;
          setValue(e.newValue ? parser(e.newValue) : undefined);
        }
      } catch (e) {
        logger(e);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, syncData, parser, logger]);

  return [value, setValue];
}

export default useLocalStorage;
