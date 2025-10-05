"use client";

import { useState, useEffect } from "react";

/**
 * タッチデバイスかどうかを判定
 * 初回のtouchstartイベントで判定する
 *
 * @returns タッチデバイスかどうか
 *
 * @example
 * const isTouchDevice = useIsTouchDevice();
 * if (!isTouchDevice) {
 *   // マウス専用のエフェクトを表示
 * }
 */
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };

    window.addEventListener("touchstart", handleTouchStart, { once: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return isTouchDevice;
}
