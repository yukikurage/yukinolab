"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import Section from "@/components/Section";
import Card from "@/components/Card";
import TitleCircle from "@/components/TitleCircle";
import WorkCard from "@/components/WorkCard";
import WorkModal from "@/components/WorkModal";
import ContactForm from "@/components/ContactForm";
import { useCrossEffect } from "@/hooks/useCrossEffect";

interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
  contentPath: string;
}

export default function Home() {
  const [works, setWorks] = useState<Work[]>([]);
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});
  const [workContents, setWorkContents] = useState<Record<string, string>>({});
  const { trigger, CrossEffectRenderer } = useCrossEffect();

  useEffect(() => {
    fetch("/works/works.json")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data as Work[]);
        // 全てのコンテンツを事前に読み込む
        (data as Work[]).forEach((work) => {
          fetch(work.contentPath)
            .then((res) => res.text())
            .then((text) => {
              setWorkContents((prev) => ({ ...prev, [work.id]: text }));
            })
            .catch((error) => {
              console.error(`Failed to load content for ${work.id}:`, error);
              setWorkContents((prev) => ({ ...prev, [work.id]: "" }));
            });
        });
      })
      .catch((error) => console.error("Failed to load works:", error));
  }, []);

  const handleWorkClick = (work: Work, e: React.MouseEvent) => {
    trigger(e.clientX, e.clientY);
    setOpenModals((prev) => ({ ...prev, [work.id]: true }));
  };

  const handleClose = (workId: string) => {
    setOpenModals((prev) => ({ ...prev, [workId]: false }));
  };

  return (
    <div className="relative w-full text-neutral-900">
      <CrossEffectRenderer />
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-screen w-full font-sans flex justify-center items-center">
        <Navigation />
        <TitleCircle />
        <div className="font-title text-5xl md:text-6xl font-bold text-center select-none relative z-10 text-neutral-900">
          {"YUKINOLABO"}
        </div>
      </section>

      {/* Works Section */}
      <Section id="works" title="WORKS">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              title={work.title}
              description={work.description}
              image={work.image}
              onClick={(e) => {
                handleWorkClick(work, e);
              }}
            />
          ))}
        </div>
      </Section>

      {/* Work Modals */}
      {works.map((work) => (
        <WorkModal
          key={work.id}
          isOpen={!!openModals[work.id]}
          onClose={() => handleClose(work.id)}
          title={work.title}
          description={work.description}
          image={work.image}
          content={workContents[work.id] || ""}
        />
      ))}

      {/* Price Section */}
      <Section
        id="price"
        title="PRICE"
        className="bg-neutral-100/50 backdrop-blur-lg relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          {/* 基本料金 */}
          <Card
            data-text-region
            clickable={false}
            className="border border-amber-400 bg-white"
          >
            <div className="mb-12">
              <h3 className="font-title text-2xl font-bold mb-6 text-neutral-900">
                基本料金
              </h3>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                依頼者さんの求める世界観に合わせてホームページを作ります。
                YUKINOLABOは2025年10月にスタートし、まだ実績がありません……是非初めての依頼者さんになってください！
              </p>
            </div>

            <div className="space-y-4 mb-12">
              <div className="border-b border-neutral-100 pb-3">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                  <span className="text-neutral-700 font-semibold md:font-normal">カスタムデザイン</span>
                  <span className="text-sm text-neutral-500">
                    求める世界観やデザインに合わせて制作します
                  </span>
                </div>
              </div>
              <div className="border-b border-neutral-100 pb-3">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                  <span className="text-neutral-700 font-semibold md:font-normal">レスポンシブ対応</span>
                  <span className="text-sm text-neutral-500">
                    スマホ・タブレットから見ても綺麗です
                  </span>
                </div>
              </div>
              <div className="border-b border-neutral-100 pb-3">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                  <span className="text-neutral-700 font-semibold md:font-normal">基本ページ</span>
                  <span className="text-sm text-neutral-500">
                    About / Works / Links が含まれます
                  </span>
                </div>
              </div>
              <div className="border-b border-neutral-100 pb-3">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                  <span className="text-neutral-700 font-semibold md:font-normal">アニメーション</span>
                  <span className="text-sm text-neutral-500">
                    基本的な遷移アニメーションなどです
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-neutral-500 mb-1">基本料金</p>
              <p className="text-3xl font-bold text-amber-600">¥50,000〜</p>
            </div>
          </Card>

          {/* 追加オプション */}
          <div data-text-region>
            <h3 className="font-title text-2xl font-bold mb-10 text-neutral-900">
              追加オプション
            </h3>
            <div className="space-y-6">
              <div className="flex items-start justify-between py-6 border-b border-neutral-200">
                <div className="flex-1">
                  <h4 className="font-title text-lg font-semibold mb-2 text-neutral-900">
                    コンテンツ追加
                  </h4>
                  <p className="text-neutral-600">
                    追加ページやセクションの制作
                  </p>
                </div>
                <div className="text-right ml-8">
                  <p className="text-xl font-bold text-amber-600">+¥5,000〜</p>
                  <p className="text-xs text-neutral-400">/ ページ</p>
                </div>
              </div>

              <div className="flex items-start justify-between py-6 border-b border-neutral-200">
                <div className="flex-1">
                  <h4 className="font-title text-lg font-semibold mb-2 text-neutral-900">
                    動きのある背景・エフェクト
                  </h4>
                  <p className="text-neutral-600">
                    パーティクル、パララックス等の実装
                  </p>
                </div>
                <div className="text-right ml-8">
                  <p className="text-xl font-bold text-amber-600">+¥10,000〜</p>
                </div>
              </div>

              <div className="flex items-start justify-between py-6 border-b border-neutral-200">
                <div className="flex-1">
                  <h4 className="font-title text-lg font-semibold mb-2 text-neutral-900">
                    特殊なデザイン・処理
                  </h4>
                  <p className="text-neutral-600">
                    工数の多いデザインやカスタム機能
                  </p>
                </div>
                <div className="text-right ml-8">
                  <p className="text-xl font-bold text-amber-600">+¥15,000〜</p>
                </div>
              </div>

              <div className="flex items-start justify-between py-6">
                <div className="flex-1">
                  <h4 className="font-title text-lg font-semibold mb-2 text-neutral-900">
                    後からの追加・修正
                  </h4>
                  <p className="text-neutral-600">
                    納品後のページ追加やコンテンツ更新
                  </p>
                </div>
                <div className="text-right ml-8">
                  <p className="text-xl font-bold text-amber-600">要相談</p>
                </div>
              </div>
            </div>
          </div>

          {/* サイトタイプ別の目安 */}
          <div data-text-region>
            <h3 className="font-title text-2xl font-bold mb-10 text-neutral-900">
              サイトタイプ別の目安
            </h3>
            <div className="space-y-8">
              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <p className="font-semibold text-lg text-neutral-900 mb-2">
                    ゲーム公式ページ
                  </p>
                  <p className="text-neutral-600">
                    ゲーム紹介・キャラクター・ストーリー等
                  </p>
                </div>
                <p className="text-xl font-bold text-amber-600 ml-8">
                  ¥70,000〜
                </p>
              </div>

              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <p className="font-semibold text-lg text-neutral-900 mb-2">
                    クリエイター・VTuberサイト
                  </p>
                  <p className="text-neutral-600">
                    プロフィール・活動紹介・リンク集等
                  </p>
                </div>
                <p className="text-xl font-bold text-amber-600 ml-8">
                  ¥60,000〜
                </p>
              </div>

              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <p className="font-semibold text-lg text-neutral-900 mb-2">
                    イベントページ
                  </p>
                  <p className="text-neutral-600">
                    イベント告知・タイムテーブル・申込等
                  </p>
                </div>
                <p className="text-xl font-bold text-amber-600 ml-8">
                  ¥80,000〜
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-neutral-600 text-sm">
              ※料金は内容により変動します。詳細はお気軽にお問い合わせください。
            </p>
            <p className="text-neutral-700 font-semibold">
              お支払いは Stripe による安全なオンライン決済に対応しています
            </p>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" title="CONTACT">
        <div className="w-full flex justify-center items-center">
          <ContactForm />
        </div>
      </Section>
    </div>
  );
}
