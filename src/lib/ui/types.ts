/**
 * 再利用可能なUIコンポーネントの型定義
 */

import { ReactNode } from "react";

/**
 * 基本的なコンポーネントProps
 */
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

/**
 * クリック可能なコンポーネントのProps
 */
export interface ClickableProps {
  onClick?: (e: React.MouseEvent) => void;
  clickable?: boolean;
}

/**
 * モーダルコンポーネントのProps
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * セクションコンポーネントのProps
 */
export interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * カードコンポーネントのProps
 */
export interface CardProps extends BaseComponentProps, ClickableProps {
  /**
   * テキスト領域としてマークするか
   * trueの場合、マウス追従エフェクトが無効化される
   */
  "data-text-region"?: boolean;
}
