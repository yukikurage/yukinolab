"use client";

import { useCallback, useState, useEffect } from "react";
import "./useCrossEffect.css";

interface CrossEffect {
  id: number;
  x: number;
  y: number;
}

export function useCrossEffect() {
  const [effects, setEffects] = useState<CrossEffect[]>([]);
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

  const trigger = useCallback((x: number, y: number) => {
    // prefers-reduced-motion の時はエフェクトを無効化
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const newEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== newEffect.id));
    }, 400);
  }, []);

  const CrossEffectRenderer = useCallback(
    () => (
      <>
        {effects.map((effect) => (
          <div
            key={effect.id}
            className="fixed left-0 right-0 pointer-events-none z-100"
            style={{
              left: 0,
              top: 0,
            }}
          >
            {/* 縦の線 */}
            <div
              className="absolute bg-primary-light animate-cross-expand-vertical"
              style={{
                left: effect.x,
                top: 0,
                width: "3px",
                height: "100dvh",
                transformOrigin: `center ${effect.y}px`,
              }}
            />
            {/* 横の線 */}
            <div
              className="absolute bg-primary-light animate-cross-expand-horizontal"
              style={{
                left: 0,
                top: effect.y,
                width: "100vw",
                height: "3px",
                transformOrigin: `${effect.x}px center`,
              }}
            />
          </div>
        ))}
      </>
    ),
    [effects]
  );

  return { trigger, CrossEffectRenderer };
}
