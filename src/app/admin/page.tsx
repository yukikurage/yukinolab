"use client";

import Link from "next/link";
import { CMS_CATEGORIES } from "@/lib/cms-config";

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-title font-bold text-text">
          CMS管理ダッシュボード
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CMS_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={
                category.singleton
                  ? `/admin/content/${category.id}/edit`
                  : `/admin/content/${category.id}`
              }
              className="p-6 bg-bg border border-border-strong dark:border-primary rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h2 className="text-xl font-semibold text-text">
                {category.name}
                {category.singleton && (
                  <span className="ml-2 text-xs text-text-secondary">(単一)</span>
                )}
              </h2>
              <p className="text-text-secondary text-sm">
                {category.description}
              </p>
            </Link>
          ))}

          <Link
            href="/"
            className="p-6 bg-bg border border-border-strong dark:border-primary rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-2">🏠</div>
            <h2 className="text-xl font-semibold text-text">サイトに戻る</h2>
            <p className="text-text-secondary text-sm">公開ページを確認</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

