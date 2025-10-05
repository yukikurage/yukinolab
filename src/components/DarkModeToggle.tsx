"use client";
import { useTheme } from "@/lib/ui";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  if (theme == null) return null; // 初期レンダ時にちらつきを防ぐ

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
      aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg
          className="w-6 h-6 text-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
