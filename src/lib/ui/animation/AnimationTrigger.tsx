"use client";

import { ReactNode, ReactElement } from "react";
import { useAnimatedElements, AnimatedElement } from "./useAnimatedElements";

interface AnimationTriggerProps<T> {
  /**
   * トリガー可能な子要素（onClick propsを受け取る）
   */
  children: (props: { onClick: (e: React.MouseEvent) => void }) => ReactNode;

  /**
   * クリックイベントからアニメーションデータを生成する関数
   * nullを返すとアニメーションをスキップ
   */
  dataFromEvent: (e: React.MouseEvent) => T | null;

  /**
   * アニメーション要素をレンダリングする関数
   */
  renderElement: (element: AnimatedElement<T>) => ReactElement;

  /**
   * アニメーション継続時間（ミリ秒）
   * @default 1000
   */
  duration?: number;

  /**
   * 追加のクリックハンドラー
   */
  onTrigger?: (data: T | null) => void;
}

/**
 * クリックでアニメーション要素を追加するコンポーネント
 *
 * @example
 * <AnimationTrigger
 *   dataFromEvent={(e) => ({ x: e.clientX, y: e.clientY })}
 *   renderElement={(el) => <Ripple key={el.id} {...el.data} />}
 *   duration={800}
 * >
 *   {({ onClick }) => <button onClick={onClick}>Click me</button>}
 * </AnimationTrigger>
 */
export function AnimationTrigger<T>({
  children,
  dataFromEvent,
  renderElement,
  duration = 1000,
  onTrigger,
}: AnimationTriggerProps<T>) {
  const { elements, trigger } = useAnimatedElements<T>({ duration });

  const handleClick = (e: React.MouseEvent) => {
    const data = dataFromEvent(e);
    if (data !== null) {
      trigger(data);
    }
    onTrigger?.(data);
  };

  return (
    <>
      {children({ onClick: handleClick })}
      {elements.map(renderElement)}
    </>
  );
}
