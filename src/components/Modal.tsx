"use client";

import { useEffect, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
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
    >
      <div
        className="bg-bg rounded-lg max-w-4xl w-full max-h-[85dvh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-bg/90 backdrop-blur-sm rounded-full hover:bg-bg transition-colors shadow-lg"
        >
          <span className="text-2xl text-text">×</span>
        </button>

        {children}
      </div>
    </div>
  );
}
