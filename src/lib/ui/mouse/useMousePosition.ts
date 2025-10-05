"use client";

import { useState, useEffect } from "react";

/**
 * マウス位置を追跡するhook
 *
 * @param normalized - true の場合、0-1の正規化された座標を返す
 * @returns マウスの座標 { x, y }
 *
 * @example
 * const { x, y } = useMousePosition();
 * const { x, y } = useMousePosition(true); // 正規化された座標
 */
export function useMousePosition(normalized = false) {
  const [position, setPosition] = useState(() =>
    normalized ? { x: 0.5, y: 0.5 } : { x: 0, y: 0 }
  );

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      if (normalized) {
        setPosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      } else {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMouseMove);
  }, [normalized]);

  return position;
}

/**
 * 特定の要素に対するマウスの相対位置を追跡
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const { x, y, isHovering } = useMousePositionRelative(ref);
 */
export function useMousePositionRelative<T extends HTMLElement>(
  ref: React.RefObject<T>
) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return { ...position, isHovering };
}
