"use client";

import { usePathname } from "next/navigation";
import MouseEffect from "@/components/MouseEffect";
import CircularBackground from "@/components/CircularBackground";
import BackgroundStars from "@/components/BackgroundStars";
import PageBackground from "@/components/PageBackground";
import ScrollCircle from "@/components/ScrollCircle";

export default function LayoutEffects() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  // 管理画面ではエフェクトを表示しない
  if (isAdminPage) {
    return null;
  }

  return (
    <>
      <PageBackground />
      <CircularBackground />
      <ScrollCircle />
      <BackgroundStars />
      <MouseEffect />
    </>
  );
}
