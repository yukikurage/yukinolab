"use client";

import Image from "next/image";
import Card from "./Card";

interface WorkCardProps {
  title: string;
  description: string;
  image: string;
  onClick: (e: React.MouseEvent) => void;
}

export default function WorkCard({
  title,
  description,
  image,
  onClick,
}: WorkCardProps) {
  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden transition-all aspect-[2/1] flex flex-col"
    >
      {/* 上半分: 画像 + グラデーション */}
      <div className="absolute overflow-hidden inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* グラデーション: 下に向かって背景色へ */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-overlay-light), var(--color-overlay))",
          }}
        />
      </div>

      {/* 下半分: タイトルと説明 */}
      <div className="flex-1 p-6 flex flex-col justify-end z-20">
        <h3 className="font-title text-2xl font-semibold mb-2 text-text">
          {title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">{description}</p>
      </div>
    </Card>
  );
}
