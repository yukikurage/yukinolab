"use client";

import { useEffect, useRef, useState } from "react";
import "./MouseEffect.css";
import { generateStarPath } from "@/utils/starPath";

interface Effect {
  id: number;
  x: number;
  y: number;
}

// 星の形状パラメータ
const STAR_CONFIG = {
  viewBox: 200, // SVGのviewBoxサイズ
  initial: {
    spikeLength: 60, // 初期の突起の長さ
    curvature: 30, // 突起のカーブの強さ
    cornerRadius: 2, // 角の丸み
  },
  final: {
    spikeLength: 20, // 最終的な突起の長さ
    curvature: 2, // 最終的なカーブの強さ
    cornerRadius: 2, // 角の丸み
  },
};

const TEXT_SELECTOR =
  'input:not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable=""], [contenteditable="true"], [data-text-region]';

export default function MouseEffect() {
  const [effects, setEffects] = useState<Effect[]>([]);
  const mouseStarRef = useRef<SVGSVGElement>(null);
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
      if (mouseStarRef.current) {
        mouseStarRef.current.style.left = `${e.clientX - 20}px`;
        mouseStarRef.current.style.top = `${e.clientY - 20}px`;

        const t = e.target as HTMLElement;
        const overText = !!document
          .elementFromPoint(e.clientX, e.clientY)
          ?.closest(TEXT_SELECTOR);
        const shouldHide = overText;

        mouseStarRef.current.style.transform = `translate3d(${
          e.clientX - 20
        }px, ${e.clientY - 20}px, 0) ${shouldHide ? "scale(0)" : "scale(1)"}`;
        mouseStarRef.current.style.opacity = shouldHide ? "0" : "1";
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      handleMouseMove(e);
    };
    const handlePointerOut = (e: PointerEvent) => {
      handleMouseMove(e);
    };

    window.addEventListener("pointerover", handlePointerOver);

    window.addEventListener("pointerout", handlePointerOut);

    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, [prefersReducedMotion, isTouchDevice]);

  // マウスクリックでエフェクトを追加（グローバル軌跡用）
  useEffect(() => {
    // prefers-reduced-motion の時は無効化
    if (prefersReducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      // フォーム内のクリックは無効化
      const target = e.target as HTMLElement;
      if (target.closest("form")) {
        return;
      }

      const newEffect = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setEffects((prev) => [...prev, newEffect]);

      // アニメーション終了後に削除
      setTimeout(() => {
        setEffects((prev) =>
          prev.filter((effect) => effect.id !== newEffect.id)
        );
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [prefersReducedMotion]);

  // prefers-reduced-motion またはタッチデバイスの時は何も表示しない
  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <>
      {/* マウス追従の星 */}
      <svg
        key={"mouse-star"}
        ref={mouseStarRef}
        className="fixed pointer-events-none z-100 text-primary-light mouse-star"
        style={{
          transform: "translate3d(0,0,0)",
          transition: "opacity 200ms, transform 200ms",
          willChange: "transform, opacity",
        }}
        width={40}
        height={40}
        viewBox="0 0 40 40"
      >
        <path
          d="M 20,5 Q 22,18 35,20 Q 22,22 20,35 Q 18,22 5,20 Q 18,18 20,5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      {/* クリックで生成されるグローバル軌跡 */}
      {effects.map((effect) => (
        <div key={effect.id}>
          {/* 拡大する円 */}
          <div
            className="click-effect-circle z-100 shadow-primary-light"
            style={{
              left: effect.x - 30,
              top: effect.y - 30,
            }}
          />

          {/* 回転縮小する星（突起が長い十字型） */}
          <div
            className="click-effect-star z-100"
            style={{
              left: effect.x - STAR_CONFIG.viewBox / 2,
              top: effect.y - STAR_CONFIG.viewBox / 2,
              width: STAR_CONFIG.viewBox,
              height: STAR_CONFIG.viewBox,
            }}
          >
            <svg
              width={STAR_CONFIG.viewBox}
              height={STAR_CONFIG.viewBox}
              viewBox={`0 0 ${STAR_CONFIG.viewBox} ${STAR_CONFIG.viewBox}`}
              className="star-svg text-primary-light"
            >
              <path
                d={generateStarPath(
                  STAR_CONFIG.viewBox,
                  STAR_CONFIG.initial.spikeLength,
                  STAR_CONFIG.initial.curvature,
                  STAR_CONFIG.initial.cornerRadius
                )}
                fill="currentColor"
              >
                <animate
                  attributeName="d"
                  dur="0.8s"
                  fill="freeze"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0 0.8 0.2 1"
                  values={`${generateStarPath(
                    STAR_CONFIG.viewBox,
                    STAR_CONFIG.initial.spikeLength,
                    STAR_CONFIG.initial.curvature,
                    STAR_CONFIG.initial.cornerRadius
                  )};${generateStarPath(
                    STAR_CONFIG.viewBox,
                    STAR_CONFIG.final.spikeLength,
                    STAR_CONFIG.final.curvature,
                    STAR_CONFIG.final.cornerRadius
                  )}`}
                />
              </path>
            </svg>
          </div>
        </div>
      ))}
    </>
  );
}
