"use client";

import { AnimationTrigger } from "@/lib/ui";
import { CrossEffect } from "./CrossEffect";
import { useEffect, useState, ReactNode } from "react";

const TEXT_SELECTOR =
  'input:not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable=""], [contenteditable="true"], [data-text-region]';

interface WithCrossEffectProps {
  children: (props: { fireEffect: (e: React.MouseEvent) => void }) => ReactNode;
}

/**
 * クロスエフェクトを提供するラッパーコンポーネント
 * 子要素にfireEffect関数を渡す
 */
export function WithCrossEffect({ children }: WithCrossEffectProps) {
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

  return (
    <AnimationTrigger<{ x: number; y: number }>
      dataFromEvent={(e) => {
        // prefers-reduced-motion またはテキスト領域ではエフェクトをスキップ
        if (prefersReducedMotion) return null;

        // クライアント座標が有限の数値であることを確認
        if (!Number.isFinite(e.clientX) || !Number.isFinite(e.clientY)) return null;

        const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
        if (elementAtPoint?.closest(TEXT_SELECTOR)) return null;

        return { x: e.clientX, y: e.clientY };
      }}
      renderElement={(el) => <CrossEffect key={el.id} {...el.data} id={el.id} />}
      duration={400}
    >
      {({ onClick }) => <>{children({ fireEffect: onClick })}</>}
    </AnimationTrigger>
  );
}
