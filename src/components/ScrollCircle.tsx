"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollCircle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion チェック
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    let autoRotation = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (containerRef.current) {
        // containerは画面下端(bottom: 0)が基準、上に行くほど負の値
        // 円のサイズは 600vh、半径は 300vh (= vh * 3)
        // 初期位置: 円の上端が画面上部に配置
        const initialY = -(vh * 0.92 - vh * 3);
        // スクロール後: 少し下に移動
        const targetY = -(vh * 0.9 - vh * 3);
        const translateY = scrollY > vh * 0.8 ? targetY : initialY;
        containerRef.current.style.transform = `translateY(${translateY}px)`;
        containerRef.current.style.opacity = scrollY > vh * 0.8 ? "1" : "0";
      }
    };

    // 自動回転アニメーション（prefers-reduced-motion で無効化）
    const animate = () => {
      if (!prefersReducedMotion) {
        autoRotation += 0.004;
      }
      if (wrapperRef.current) {
        const scrollY = window.scrollY;
        wrapperRef.current.style.transform = `rotate(${
          scrollY * 0.01 + autoRotation
        }deg)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed -bottom-0 left-1/2 overflow-visible h-0 w-0 pointer-events-none -z-15 transition-all duration-200 ease-in-out"
      style={{
        transform: `translateY(calc(-0.92 * 100dvh + 3 * 100dvh))`,
        opacity: 0,
      }}
      aria-hidden="true"
    >
      <div
        ref={wrapperRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "0px",
          height: "0px",
        }}
      >
        {/* 円 */}
        <div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-light"
          style={{
            width: "600dvh",
            height: "600dvh",
          }}
        />

        {/* 放射状のメモリ線 */}
        {Array.from({ length: 36 }, (_, i) => {
          const angle = (i / 36) * 360;

          return (
            <div
              key={`scroll-memory-${i}`}
              className="absolute top-1/2 left-1/2 origin-left bg-primary-light"
              style={{
                width: "100px",
                height: "3px",
                transform: `rotate(${angle}deg) translateX(calc(300dvh - 40px))`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
