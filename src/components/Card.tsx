"use client";
import BaseCard from "@/lib/ui/Card";
import { CardProps } from "@/lib/ui/types";
import { WithCrossEffect } from "./WithCrossEffect";

/**
 * CrossEffect付きCardコンポーネント（このサイト専用）
 * クリック時に十字エフェクトが発火する
 */
export default function Card({
  children,
  onClick,
  clickable = true,
  ...props
}: CardProps & Omit<React.HTMLAttributes<HTMLElement>, "onClick">) {
  return (
    <WithCrossEffect>
      {({ fireEffect: onAnimationClick }) => (
        <BaseCard
          {...props}
          clickable={clickable}
          onClick={(e) => {
            if (!clickable) return;
            if (onClick) onClick(e);
            onAnimationClick(e);
          }}
        >
          {children}
        </BaseCard>
      )}
    </WithCrossEffect>
  );
}
