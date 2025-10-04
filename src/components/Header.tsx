"use client";

import { useState, useEffect } from "react";
import { useCrossEffect } from "@/hooks/useCrossEffect";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { trigger, CrossEffectRenderer } = useCrossEffect();

  useEffect(() => {
    const handleScroll = () => {
      // ヒーローセクション（1画面分）を過ぎたら表示
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // メニューを閉じる
  };

  const fireClickEffect = (e: React.MouseEvent) => {
    trigger(e.clientX, e.clientY);
  };

  return (
    <>
      <CrossEffectRenderer />
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200 transition-all duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          {/* ハンバーガーボタン（md未満で表示） */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            aria-label="メニュー"
          >
            <span
              className={`w-6 h-0.5 bg-neutral-900 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-neutral-900 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-neutral-900 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>

          {/* デスクトップナビゲーション（md以上で表示） */}
          <nav className="hidden md:block">
            <ul className="flex gap-8">
              <li>
                <button
                  onClick={(e) => {
                    scrollToSection("works");
                    fireClickEffect(e);
                  }}
                  className="font-title text-lg font-semibold transition-colors hover:text-amber-600 cursor-pointer"
                >
                  WORKS
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    scrollToSection("price");
                    fireClickEffect(e);
                  }}
                  className="font-title text-lg font-semibold transition-colors hover:text-amber-600 cursor-pointer"
                >
                  PRICE
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    scrollToSection("contact");
                    fireClickEffect(e);
                  }}
                  className="font-title text-lg font-semibold transition-colors hover:text-amber-600 cursor-pointer"
                >
                  CONTACT
                </button>
              </li>
            </ul>
          </nav>

          {/* 中央：タイトル */}
          <button
            onClick={(e) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              fireClickEffect(e);
            }}
            className="absolute left-1/2 -translate-x-1/2 font-title text-2xl font-bold text-neutral-900 transition-all hover:text-amber-600 cursor-pointer"
          >
            YUKINOLABO
          </button>
        </div>
      </header>
      {/* モバイルメニュー */}
      <div
        className={`md:hidden fixed top-20 left-0 right-0 bottom-0 bg-white/50 backdrop-blur-lg z-30 border-t border-neutral-200
        ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-all duration-300`}
      >
        <nav className="container mx-auto px-8 py-8">
          <ul className="space-y-6">
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("works");
                  fireClickEffect(e);
                }}
                className="font-title text-2xl font-semibold transition-colors hover:text-amber-600 cursor-pointer w-full text-left"
              >
                WORKS
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("price");
                  fireClickEffect(e);
                }}
                className="font-title text-2xl font-semibold transition-colors hover:text-amber-600 cursor-pointer w-full text-left"
              >
                PRICE
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("contact");
                  fireClickEffect(e);
                }}
                className="font-title text-2xl font-semibold transition-colors hover:text-amber-600 cursor-pointer w-full text-left"
              >
                CONTACT
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
