"use client";

import { ReactNode, CSSProperties, useEffect, useState } from "react";
import { useMousePosition } from "./useMousePosition";

interface MouseParallaxProps {
  /**
   * パララックス効果を適用する要素
   */
  children: ReactNode;

  /**
   * パララックスの強度（ピクセル単位）
   * @default 20
   */
  strength?: number;

  /**
   * 反転するか
   * @default false
   */
  invert?: boolean;

  /**
   * 追加のスタイル
   */
  style?: CSSProperties;

  /**
   * 追加のクラス名
   */
  className?: string;

  /**
   * HTML要素の種類
   * @default "div"
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * マウスに追従してパララックス効果を適用するコンポーネント
 *
 * @example
 * <MouseParallax strength={30}>
 *   <img src="/image.png" alt="parallax" />
 * </MouseParallax>
 */
export function MouseParallax({
  children,
  strength = 20,
  invert = false,
  style = {},
  className = "",
  as: Component = "div",
}: MouseParallaxProps) {
  const mousePos = useMousePosition(true); // 正規化された座標
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion チェック
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // タッチデバイス判定
    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };

    window.addEventListener("touchstart", handleTouchStart, { once: true });

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  // prefers-reduced-motion またはタッチデバイスの時は無効化
  const isDisabled = prefersReducedMotion || isTouchDevice;

  // マウス位置から中心への差分を計算（-0.5 ~ 0.5）
  const offsetX = isDisabled ? 0 : (mousePos.x - 0.5) * strength * (invert ? -1 : 1);
  const offsetY = isDisabled ? 0 : (mousePos.y - 0.5) * strength * (invert ? -1 : 1);

  return (
    <Component
      className={className}
      style={{
        transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
        transition: "transform 0.2s ease-out",
        willChange: isDisabled ? undefined : "transform",
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
