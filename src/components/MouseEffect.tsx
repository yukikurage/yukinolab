"use client";

import { useEffect, useState } from "react";
import {
  usePrefersReducedMotion,
  useIsTouchDevice,
  MouseFollower,
  useAnimatedElements,
} from "@/lib/ui";
import "./MouseEffect.css";

interface MouseEffectProps {
  /** 星の形状パス生成関数 */
  generateStarPath: (
    size: number,
    spikeLength: number,
    curvature: number,
    cornerRadius: number
  ) => string;
}

const TEXT_SELECTOR =
  'input:not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable=""], [contenteditable="true"], [data-text-region]';

const STAR_CONFIG = {
  viewBox: 200,
  initial: {
    spikeLength: 60,
    curvature: 30,
    cornerRadius: 2,
  },
  final: {
    spikeLength: 20,
    curvature: 2,
    cornerRadius: 2,
  },
};

/**
 * マウスクリックエフェクトコンポーネント（このプロジェクト固有）
 * - MouseFollowerで星がマウスを追従
 * - useAnimatedElementsでクリック時のエフェクト
 */
export default function MouseEffect({ generateStarPath }: MouseEffectProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const [isOverText, setIsOverText] = useState(false);
  const { elements, trigger } = useAnimatedElements<{ x: number; y: number }>({
    duration: 1000,
  });

  // マウス位置がテキスト領域上かチェック
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      setIsOverText(!!elementAtPoint?.closest(TEXT_SELECTOR));
    };

    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMouseMove);
  }, [prefersReducedMotion, isTouchDevice]);

  // グローバルなクリックイベントをリスニング（モバイルでも click で統一）
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      // フォーム内のクリックは無効化
      const target = e.target as HTMLElement;
      if (target.closest("form")) return;

      // テキスト領域ではエフェクトをスキップ
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      if (elementAtPoint?.closest(TEXT_SELECTOR)) return;

      trigger({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [prefersReducedMotion, trigger]);

  if (prefersReducedMotion) return null;

  return (
    <>
      {/* マウス追従の星 - タッチデバイスでは非表示 */}
      {!isTouchDevice && (
        <MouseFollower
          offset={{ x: -20, y: -20 }}
          className="z-[9999]"
          style={{
            opacity: isOverText ? 0 : 1,
            transition: "opacity 200ms",
          }}
        >
          <svg
            className="text-primary-light mouse-star"
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
        </MouseFollower>
      )}

      {/* クリックエフェクト - PC/モバイル両方で表示 */}
      {elements.map((el) => (
        <div key={el.id}>
          {/* 拡大する円 */}
          <div
            className="click-effect-circle z-100 shadow-primary-light"
            style={{
              left: el.data.x - 30,
              top: el.data.y - 30,
            }}
          />

          {/* 回転縮小する星 */}
          <div
            className="click-effect-star z-100"
            style={{
              left: el.data.x - STAR_CONFIG.viewBox / 2,
              top: el.data.y - STAR_CONFIG.viewBox / 2,
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
