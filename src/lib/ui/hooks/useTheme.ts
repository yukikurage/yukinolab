"use client";

import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

/**
 * テーマ管理hook
 * localStorageとprefers-color-schemeを考慮してテーマを管理
 *
 * @returns 現在のテーマとテーマ切り替え関数
 *
 * @example
 * const { theme, setTheme, toggleTheme } = useTheme();
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    // ページロード時にすでにdarkクラスが適用されているかチェック
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    if (theme == null) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, setTheme, toggleTheme };
}
