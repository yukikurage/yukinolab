"use client";

import { useEffect, useRef } from "react";
import "./CircularBackground.css";

// 円の設定
const CONFIG = {
  centerX: -600,
  centerY: -50,
  radius: 800,
  innerRadius: 500,
  lineCount: 12,
};

// viewBoxの範囲を計算（円全体+メモリ線が入るように）
const memoryInnerLength = 50; // メモリ（大）の内側の長さ
const memoryOuterLength = 150; // メモリ（大）の外側の長さ
const smallMemoryInnerLength = 25; // メモリ（小）の内側の長さ
const smallMemoryOuterLength = 25; // メモリ（小）の外側の長さ
const viewBoxPadding = memoryOuterLength + 10; // 余裕を持たせる
const viewBoxMinX = CONFIG.centerX - CONFIG.radius - viewBoxPadding;
const viewBoxMinY = CONFIG.centerY - CONFIG.radius - viewBoxPadding;
const viewBoxSize = CONFIG.radius * 2 + viewBoxPadding * 2;

// 回転中心の位置（viewBox内での円の中心の位置）
const originXPercent = ((CONFIG.centerX - viewBoxMinX) / viewBoxSize) * 100;
const originYPercent = ((CONFIG.centerY - viewBoxMinY) / viewBoxSize) * 100;

export default function CircularBackground() {
  const lines = Array.from({ length: CONFIG.lineCount }, (_, i) => i);
  const smallLines = Array.from({ length: CONFIG.lineCount * 5 }, (_, i) => i);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (containerRef.current) {
        // 一番上にいる時のみ表示
        const opacity = scrollY === 0 ? 1 : 0;
        containerRef.current.style.opacity = `${opacity}`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="circular-background text-amber-400 transition-opacity duration-500 hidden md:block"
      style={{ opacity: 1 }}
    >
      <svg
        className="circular-grid"
        viewBox={`${viewBoxMinX} ${viewBoxMinY} ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
        style={
          {
            "--svg-size": `${viewBoxSize}px`,
            "--origin-x-percent": `${originXPercent}%`,
            "--origin-y-percent": `${originYPercent}%`,
            "--center-x": `${CONFIG.centerX}px`,
            "--center-y": `${CONFIG.centerY}px`,
          } as React.CSSProperties
        }
      >
        {/* 大きな円（中心は左下、画面外） */}
        <circle
          cx={CONFIG.centerX}
          cy={CONFIG.centerY}
          r={CONFIG.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* 放射状のメモリ線（大） */}
        {lines.map((i) => {
          const angle = (i / CONFIG.lineCount) * 360;
          const angleRad = (angle * Math.PI) / 180;

          // メモリ線の長さ（円周をまたぐ、外側が長い）
          const memoryInnerRadius = CONFIG.radius - memoryInnerLength;
          const memoryOuterRadius = CONFIG.radius + memoryOuterLength;

          // 円の中心(centerX, centerY)を基準に座標を計算
          const x1 =
            Math.round(
              (CONFIG.centerX + Math.cos(angleRad) * memoryInnerRadius) * 100
            ) / 100;
          const y1 =
            Math.round(
              (CONFIG.centerY + Math.sin(angleRad) * memoryInnerRadius) * 100
            ) / 100;
          const x2 =
            Math.round(
              (CONFIG.centerX + Math.cos(angleRad) * memoryOuterRadius) * 100
            ) / 100;
          const y2 =
            Math.round(
              (CONFIG.centerY + Math.sin(angleRad) * memoryOuterRadius) * 100
            ) / 100;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="3"
            />
          );
        })}

        {/* 放射状のメモリ線（小） */}
        {smallLines.map((i) => {
          // 大きいメモリと重なる位置はスキップ
          if (i % 5 === 0) return null;

          const angle = (i / (CONFIG.lineCount * 5)) * 360;
          const angleRad = (angle * Math.PI) / 180;

          const memoryInnerRadius = CONFIG.radius - smallMemoryInnerLength;
          const memoryOuterRadius = CONFIG.radius + smallMemoryOuterLength;

          const x1 =
            Math.round(
              (CONFIG.centerX + Math.cos(angleRad) * memoryInnerRadius) * 100
            ) / 100;
          const y1 =
            Math.round(
              (CONFIG.centerY + Math.sin(angleRad) * memoryInnerRadius) * 100
            ) / 100;
          const x2 =
            Math.round(
              (CONFIG.centerX + Math.cos(angleRad) * memoryOuterRadius) * 100
            ) / 100;
          const y2 =
            Math.round(
              (CONFIG.centerY + Math.sin(angleRad) * memoryOuterRadius) * 100
            ) / 100;

          return (
            <line
              key={`small-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="3"
            />
          );
        })}
      </svg>
    </div>
  );
}
