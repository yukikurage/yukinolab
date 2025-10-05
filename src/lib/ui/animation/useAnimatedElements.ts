"use client";

import { useState, useCallback } from "react";

export interface AnimatedElement<T = unknown> {
  id: string | number;
  data: T;
}

interface UseAnimatedElementsOptions {
  /**
   * アニメーション終了後に要素を削除するまでの時間（ミリ秒）
   * @default 1000
   */
  duration?: number;
}

/**
 * アニメーション要素を管理する汎用hook
 *
 * @example
 * interface ClickEffect {
 *   x: number;
 *   y: number;
 * }
 *
 * const { elements, trigger } = useAnimatedElements<ClickEffect>();
 *
 * // クリック時
 * trigger({ x: e.clientX, y: e.clientY });
 *
 * // レンダリング
 * {elements.map(el => (
 *   <EffectComponent key={el.id} {...el.data} />
 * ))}
 */
export function useAnimatedElements<T = unknown>(
  options: UseAnimatedElementsOptions = {}
) {
  const { duration = 1000 } = options;
  const [elements, setElements] = useState<AnimatedElement<T>[]>([]);

  const trigger = useCallback(
    (data: T) => {
      const id = Date.now() + Math.random();
      const newElement: AnimatedElement<T> = { id, data };

      setElements((prev) => [...prev, newElement]);

      // アニメーション終了後に削除
      setTimeout(() => {
        setElements((prev) => prev.filter((el) => el.id !== id));
      }, duration);

      return id;
    },
    [duration]
  );

  /**
   * 特定の要素を手動で削除
   */
  const remove = useCallback((id: string | number) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  }, []);

  /**
   * 全ての要素をクリア
   */
  const clear = useCallback(() => {
    setElements([]);
  }, []);

  return {
    elements,
    trigger,
    remove,
    clear,
  };
}
