"use client";

import { useEffect, ReactNode, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // フォーカスを保存してモーダル内に移動
      previousFocusRef.current = document.activeElement as HTMLElement;

      // モーダル内の最初のフォーカス可能要素（閉じるボタン）にフォーカス
      setTimeout(() => {
        const closeButton = modalRef.current?.querySelector(
          'button[aria-label="モーダルを閉じる"]'
        );
        if (closeButton) {
          (closeButton as HTMLElement).focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // フォーカスを元の位置に戻す
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // フォーカストラップ
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleTabKey);
    return () => window.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-lg transition-opacity duration-100
        ${
          isOpen
            ? " opacity-100 pointer-events-auto"
            : " opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      inert={!isOpen}
    >
      <div
        ref={modalRef}
        className="bg-bg rounded-lg max-w-4xl w-full max-h-[85dvh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-6 right-8 z-10 w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity cursor-pointer"
          aria-label="モーダルを閉じる"
        >
          <span className="text-5xl text-text" aria-hidden="true">
            ×
          </span>
        </button>

        {children}
      </div>
    </div>
  );
}
