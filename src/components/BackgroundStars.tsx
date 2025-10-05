"use client";

import { useEffect, useState } from "react";
import "./BackgroundStars.css";
import { generateStarPath } from "@/utils/starPath";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  parallaxStrength: number;
}

// 星の設定
const STAR_CONFIG = {
  minSize: 20, // 最小サイズ
  maxSize: 50, // 最大サイズ
  minDuration: 3000, // 最小表示時間(ms)
  maxDuration: 5000, // 最大表示時間(ms)
  spawnInterval: 800, // 星の出現間隔(ms)
  spikeLength: 1, // 突起の長さ（0-1, radiusに対する比率）
  curvature: 0.2, // 辺のカーブ
  cornerRadius: 0.05, // 角の丸み（0-1, radiusに対する比率）
  minParallaxStrength: 0,
  maxParallaxStrength: 40,
};

export default function BackgroundStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
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
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion, isTouchDevice]);

  useEffect(() => {
    // prefers-reduced-motion の時は無効化
    if (prefersReducedMotion) return;

    const spawnStar = () => {
      const newStar: Star = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size:
          STAR_CONFIG.minSize +
          Math.random() * (STAR_CONFIG.maxSize - STAR_CONFIG.minSize),
        duration:
          STAR_CONFIG.minDuration +
          Math.random() * (STAR_CONFIG.maxDuration - STAR_CONFIG.minDuration),
        parallaxStrength:
          STAR_CONFIG.minParallaxStrength +
          Math.random() *
            (STAR_CONFIG.maxParallaxStrength - STAR_CONFIG.minParallaxStrength),
      };

      setStars((prev) => [...prev, newStar]);

      // 指定時間後に削除
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, newStar.duration);
    };

    const interval = setInterval(spawnStar, STAR_CONFIG.spawnInterval);
    return () => clearInterval(interval);
  }, [stars.length, prefersReducedMotion]);

  return (
    <div className="background-stars" aria-hidden="true">
      {stars.map((star) => {
        const offsetX = isTouchDevice ? 0 : (mousePos.x - 0.5) * star.parallaxStrength;
        const offsetY = isTouchDevice ? 0 : (mousePos.y - 0.5) * star.parallaxStrength;

        return (
          <svg
            key={star.id}
            className="background-star text-primary-light"
            style={{
              left: star.x - star.size / 2 + offsetX,
              top: star.y - star.size / 2 + offsetY,
              width: star.size,
              height: star.size,
              animationDuration: `${star.duration}ms`,
              transition: "left 0.2s ease-out, top 0.2s ease-out",
            }}
            viewBox={`0 0 ${star.size} ${star.size}`}
          >
            <path
              d={generateStarPath(
                star.size,
                (star.size / 2) * STAR_CONFIG.spikeLength,
                STAR_CONFIG.curvature * star.size,
                (star.size / 2) * STAR_CONFIG.cornerRadius
              )}
              fill="currentColor"
            />
          </svg>
        );
      })}
    </div>
  );
}
