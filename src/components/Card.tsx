"use client";

import { useCrossEffect } from "@/hooks/useCrossEffect";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  "data-text-region"?: boolean;
  onClick?: (e: React.MouseEvent) => void;
} & Omit<React.HTMLAttributes<HTMLElement>, "onClick">;

export default function Card({
  children,
  className = "",
  clickable = true,
  "data-text-region": dataTextRegion = false,
  onClick,
  ...props
}: CardProps) {
  const { trigger, CrossEffectRenderer } = useCrossEffect();

  const handleClick = (e: React.MouseEvent) => {
    if (!clickable) return;
    trigger(e.clientX, e.clientY);
    onClick?.(e);
  };

  const baseClassName = `border w-full h-full border-border-strong dark:border-primary bg-bg/40 rounded-lg backdrop-blur-2xl transition-shadow ${className}`;

  if (clickable) {
    return (
      <>
        <button
          data-text-region={dataTextRegion ? true : undefined}
          onClick={handleClick}
          className={`${baseClassName} cursor-pointer hover:shadow-lg`}
          type="button"
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
        <CrossEffectRenderer />
      </>
    );
  }

  return (
    <div
      data-text-region={dataTextRegion ? true : undefined}
      className={baseClassName}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}
