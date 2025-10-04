"use client";

import { useCrossEffect } from "@/hooks/useCrossEffect";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  "data-text-region"?: boolean;
}

export default function Card({
  children,
  className = "",
  clickable = true,
  "data-text-region": dataTextRegion = false,
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
        className={`border w-full h-full border-neutral-300 bg-white/40 rounded-lg backdrop-blur-2xl p-8 transition-shadow ${
          clickable ? "cursor-pointer hover:shadow-lg" : ""
        } ${className}`}
      >
        {children}
      </div>
      {clickable && <CrossEffectRenderer />}
    </>
  );
}
