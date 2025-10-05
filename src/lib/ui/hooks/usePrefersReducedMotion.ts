"use client";

import { useState, useEffect } from "react";

/**
 * prefers-reduced-motionメディアクエリの状態を追跡
 *
 * @returns ユーザーがアニメーション軽減を希望しているかどうか
 *
 * @example
 * const prefersReducedMotion = usePrefersReducedMotion();
 * if (prefersReducedMotion) {
 *   // アニメーションをスキップ
 * }
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
