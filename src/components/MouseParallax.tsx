"use client";

import { useEffect, useState } from "react";

interface MouseParallaxProps {
  children: React.ReactNode;
  strength?: number;
}

export default function MouseParallax({
  children,
  strength = 20,
}: MouseParallaxProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
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

  useEffect(() => {
    // prefers-reduced-motion またはタッチデバイスの時は無効化
    if (prefersReducedMotion || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength, prefersReducedMotion, isTouchDevice]);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        transform: prefersReducedMotion || isTouchDevice ? "translate(0, 0)" : `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {children}
    </div>
  );
}
