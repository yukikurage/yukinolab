"use client";

// import { AnimationTrigger, usePrefersReducedMotion } from "@/lib/ui";
// import { CrossEffect } from "./CrossEffect";
import { ReactNode } from "react";

// const TEXT_SELECTOR =
//   'input:not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable=""], [contenteditable="true"], [data-text-region]';

interface WithCrossEffectProps {
  children: (props: { fireEffect: (e: React.MouseEvent) => void }) => ReactNode;
}

/**
 * クロスエフェクトを提供するラッパーコンポーネント
 * 子要素にfireEffect関数を渡す
 *
 * 注: クロスエフェクトは無効化されていますが、
 * 互換性のためfireEffect関数は提供されます
 */
export function WithCrossEffect({ children }: WithCrossEffectProps) {
  // エフェクトを無効化（常にnullを返す）
  const noOpEffect = () => {};

  return <>{children({ fireEffect: noOpEffect })}</>;

  // 元のコード（十字エフェクト有効版）:
  // const prefersReducedMotion = usePrefersReducedMotion();
  //
  // return (
  //   <AnimationTrigger<{ x: number; y: number }>
  //     dataFromEvent={(e) => {
  //       // prefers-reduced-motion またはテキスト領域ではエフェクトをスキップ
  //       if (prefersReducedMotion) return null;
  //
  //       // クライアント座標が有限の数値であることを確認
  //       if (!Number.isFinite(e.clientX) || !Number.isFinite(e.clientY)) return null;
  //
  //       const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
  //       if (elementAtPoint?.closest(TEXT_SELECTOR)) return null;
  //
  //       return { x: e.clientX, y: e.clientY };
  //     }}
  //     renderElement={(el) => <CrossEffect key={el.id} {...el.data} id={el.id} />}
  //     duration={400}
  //   >
  //     {({ onClick }) => <>{children({ fireEffect: onClick })}</>}
  //   </AnimationTrigger>
  // );
}
