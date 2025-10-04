"use client";

import Image from "next/image";

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
    <div
      onClick={onClick}
      className="group cursor-pointer border border-neutral-300 bg-white/40 backdrop-blur-2xl rounded-lg overflow-hidden transition-all hover:shadow-2xl aspect-[4/3] flex flex-col"
    >
      {/* 上半分: 画像 + グラデーション */}
      <div className="absolute overflow-hidden inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* グラデーション: 下に向かって白く */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-90 z-10" />
      </div>

      {/* 下半分: タイトルと説明 */}
      <div className="flex-1 p-6 flex flex-col justify-end z-20">
        <h3 className="font-title text-2xl font-semibold mb-2 text-neutral-900">
          {title}
        </h3>
        <p className="text-neutral-600 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
