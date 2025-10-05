/**
 * 再利用可能なUIコンポーネントライブラリ
 * 他のプロジェクトでも使用可能な汎用コンポーネント
 */

// 型定義
export type {
  BaseComponentProps,
  ClickableProps,
  ModalProps,
  SectionProps,
  CardProps,
} from "./types";

// 基本コンポーネント
export { default as Card } from "./Card";
export { default as Modal } from "./Modal";
export { default as Section } from "./Section";

// マウストラッキングシステム
export {
  useMousePosition,
  useMousePositionRelative,
  MouseFollower,
  MouseParallax,
} from "./mouse";

// アニメーションシステム
export {
  useAnimatedElements,
  AnimationTrigger,
} from "./animation";
export type { AnimatedElement } from "./animation";

// フォームシステム
export {
  useTurnstile,
  TurnstileField,
} from "./form";
export type { TurnstileFieldRef } from "./form";

// カスタムhooks
export {
  usePrefersReducedMotion,
  useIsTouchDevice,
  useTheme,
  getThemeScript,
} from "./hooks";
export type { Theme } from "./hooks";
