"use client";

import { useCrossEffect } from "@/hooks/useCrossEffect";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  "data-text-region"?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Card({
  children,
  className = "",
  clickable = true,
  "data-text-region": dataTextRegion = false,
  ...props
}: CardProps) {
  const { trigger, CrossEffectRenderer } = useCrossEffect();

  const handleClick = (e: React.MouseEvent) => {
    if (!clickable) return;
    trigger(e.clientX, e.clientY);
  };

  return (
    <>
      <div
        data-text-region={dataTextRegion ? true : undefined}
        onClick={handleClick}
        className={`border w-full h-full border-border-strong dark:border-primary bg-bg/40 rounded-lg backdrop-blur-2xl transition-shadow ${
          clickable ? "cursor-pointer hover:shadow-lg" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
      {clickable && <CrossEffectRenderer />}
    </>
  );
}
