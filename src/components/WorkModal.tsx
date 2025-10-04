"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Modal from "./Modal";

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image: string;
  content?: string;
}

export default function WorkModal({
  isOpen,
  onClose,
  title,
  description,
  image,
  content,
}: WorkModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* スクロール可能なコンテンツ */}
      <div className="overflow-y-auto">
        {/* ヘッダー: 画像 + グラデーション + タイトル・説明 */}
        <div className="relative w-full h-80">
          <Image src={image} alt={title} fill className="object-cover" />
          {/* グラデーション: 下に向かって背景色へ */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-overlay-light), var(--color-overlay))",
            }}
          />

          {/* タイトルと説明 */}
          <div
            data-text-region
            className="absolute inset-0 flex flex-col justify-end px-12 py-4 z-20"
          >
            <h2 className="font-title text-4xl font-bold mb-4 text-text">
              {title}
            </h2>
            <p className="text-text-secondary text-lg">{description}</p>
          </div>
        </div>

        {/* マークダウンコンテンツ */}
        <div data-text-region className="p-8">
          {content && (
            <div className="prose prose-neutral max-w-none px-4">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-6 text-text">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mt-8 mb-4 text-text">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-6 mb-3 text-text">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-text-secondary mb-6 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-6 text-text-secondary space-y-2 ml-4">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-text-secondary">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-text">
                      {children}
                    </strong>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-primary hover:text-primary-dark underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
