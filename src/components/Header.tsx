"use client";

import { useEffect, useState } from "react";
import { WithCrossEffect } from "./WithCrossEffect";
import DarkModeToggle from "./DarkModeToggle";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ヒーローセクション（1画面分）を過ぎたら表示
      setIsVisible(window.scrollY > window.innerHeight * 0.2);
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

  return (
    <WithCrossEffect>
      {({ fireEffect }) => (
        <>
        <header
        className={`fixed top-0 left-0 right-0 z-40 bg-bg/80 backdrop-blur-lg border-b border-border dark:border-primary transition-all duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
        inert={!isVisible}
      >
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          {/* ハンバーガーボタン（xl未満で表示） */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            aria-label="メニュー"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`w-6 h-0.5 bg-text transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-text transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-text transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>

          {/* デスクトップナビゲーション（xl以上で表示） */}
          <nav className="hidden xl:block" aria-label="メインナビゲーション">
            <ul className="flex gap-8">
              <li>
                <button
                  onClick={(e) => {
                    scrollToSection("about");
                    fireEffect(e);
                  }}
                  className="font-title text-lg font-semibold transition-colors hover:text-primary-dark cursor-pointer"
                >
                  ABOUT
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    scrollToSection("works");
                    fireEffect(e);
                  }}
                  className="font-title text-lg font-semibold transition-colors hover:text-primary-dark cursor-pointer"
                >
                  WORKS
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    scrollToSection("price");
                    fireEffect(e);
                  }}
                  className="font-title text-lg font-semibold transition-colors hover:text-primary-dark cursor-pointer"
                >
                  PRICE
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    scrollToSection("contact");
                    fireEffect(e);
                  }}
                  className="font-title text-lg font-semibold transition-colors hover:text-primary-dark cursor-pointer"
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
              fireEffect(e);
            }}
            className="absolute left-1/2 -translate-x-1/2 font-title text-2xl font-bold text-text transition-all hover:text-primary-dark cursor-pointer"
          >
            YUKINOLABO
          </button>

          {/* 右：ダークモードトグル */}
          <div className="ml-auto">
            <DarkModeToggle />
          </div>
        </div>
      </header>
      {/* モバイルメニュー */}
      <div
        id="mobile-menu"
        className={`xl:hidden fixed top-20 left-0 right-0 bottom-0 bg-bg/50 backdrop-blur-lg z-30 border-t border-border
        ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-all duration-300`}
      >
        <nav className="container mx-auto px-8 py-8" aria-label="モバイルナビゲーション">
          <ul className="space-y-6">
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("about");
                  fireEffect(e);
                }}
                className="font-title text-2xl font-semibold transition-colors hover:text-primary-dark cursor-pointer w-full text-left"
              >
                ABOUT
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("works");
                  fireEffect(e);
                }}
                className="font-title text-2xl font-semibold transition-colors hover:text-primary-dark cursor-pointer w-full text-left"
              >
                WORKS
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("price");
                  fireEffect(e);
                }}
                className="font-title text-2xl font-semibold transition-colors hover:text-primary-dark cursor-pointer w-full text-left"
              >
                PRICE
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("contact");
                  fireEffect(e);
                }}
                className="font-title text-2xl font-semibold transition-colors hover:text-primary-dark cursor-pointer w-full text-left"
              >
                CONTACT
              </button>
            </li>
          </ul>
        </nav>
      </div>
      </>
      )}
    </WithCrossEffect>
  );
}
