"use client";

import { ReactNode, CSSProperties } from "react";
import { useMousePosition } from "./useMousePosition";

interface MouseFollowerProps {
  /**
   * マウスについていく要素
   */
  children: ReactNode;

  /**
   * オフセット（中心からのずれ）
   * @default { x: 0, y: 0 }
   */
  offset?: { x: number; y: number };

  /**
   * 追従の遅延（0-1、0は即座、1は遅い）
   * @default 0 (即座)
   */
  lag?: number;

  /**
   * 追加のスタイル
   */
  style?: CSSProperties;

  /**
   * 追加のクラス名
   */
  className?: string;
}

/**
 * マウスについていくコンポーネント
 *
 * @example
 * <MouseFollower offset={{ x: -20, y: -20 }}>
 *   <div className="w-10 h-10 bg-blue-500 rounded-full" />
 * </MouseFollower>
 */
export function MouseFollower({
  children,
  offset = { x: 0, y: 0 },
  lag = 0,
  style = {},
  className = "",
}: MouseFollowerProps) {
  const mousePos = useMousePosition();

  const transition = lag > 0 ? `transform ${lag * 500}ms ease-out` : undefined;

  const transformStyle = `translate3d(${mousePos.x + offset.x}px, ${mousePos.y + offset.y}px, 0)`;

  return (
    <div
      className={`fixed pointer-events-none z-50 ${className}`}
      style={{
        left: 0,
        top: 0,
        ...style,
        transform: transformStyle,
        transition: style.transition || transition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
