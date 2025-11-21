"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const expirationMs = 30 * 24 * 60 * 60 * 1000; // 30 days

  const [data, setData] = useState<T>(() => {
    try {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue !== null) {
        const parsed = JSON.parse(jsonValue);

        if (parsed.timestamp && (Date.now() - parsed.timestamp) > expirationMs) {
          localStorage.removeItem(key);
          return typeof initialValue === "function"
            ? (initialValue as () => T)()
            : initialValue;
        }
        return parsed.value;
      }

      if (typeof initialValue === "function") {
        return (initialValue as () => T)();
      } else {
        return initialValue;
      }
    } catch {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
  });

  useEffect(() => {
    const wrapper={
      value: data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(wrapper));
  }, [data, setData]);

  return [data, setData] as [typeof data, typeof setData];
}