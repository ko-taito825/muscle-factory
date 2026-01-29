// import { useEffect, useState } from "react";

import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initiaValue: T) => {
  const [value, setValue] = useState<T>(initiaValue);

  useEffect(() => {
    if (typeof window === "undefined" || !key) return;
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error("読み込みエラー", error);
    }
  }, [key]);
  useEffect(() => {
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("保存エラー", error);
    }
  }, [key, value]);
  return [value, setValue] as const;
};
