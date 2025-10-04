"use client";

import { useCallback, useState } from "react";
import "./useCrossEffect.css";

interface CrossEffect {
  id: number;
  x: number;
  y: number;
}

export function useCrossEffect() {
  const [effects, setEffects] = useState<CrossEffect[]>([]);

  const trigger = useCallback((x: number, y: number) => {
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
            className="fixed inset-0 pointer-events-none z-100"
            style={{
              left: 0,
              top: 0,
            }}
          >
            {/* 縦の線 */}
            <div
              className="absolute bg-amber-400 animate-cross-expand-vertical"
              style={{
                left: effect.x,
                top: 0,
                width: "3px",
                height: "100vh",
                transformOrigin: `center ${effect.y}px`,
              }}
            />
            {/* 横の線 */}
            <div
              className="absolute bg-amber-400 animate-cross-expand-horizontal"
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
