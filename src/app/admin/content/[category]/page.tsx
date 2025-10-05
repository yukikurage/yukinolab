"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCategoryById } from "@/lib/cms-config";

interface ContentItem {
  id: string;
  [key: string]: unknown;
}

export default function ContentList() {
  const { category } = useParams();
  const categoryConfig = getCategoryById(category as string);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load items:", error);
        setItems([]);
        setLoading(false);
      });
  }, [category]);

  const handleDelete = async (id: string) => {
    if (!confirm("このアイテムを削除しますか？")) return;

    try {
      await fetch(`/api/admin/content/${category}/${id}`, {
        method: "DELETE",
      });

      setItems(items.filter((item) => item.id !== id));
      alert("削除しました");
    } catch (error) {
      alert("削除に失敗しました");
    }
  };

  if (!categoryConfig) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-secondary">カテゴリが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{categoryConfig.icon}</span>
              <h1 className="text-3xl font-title font-bold text-text">
                {categoryConfig.name}管理
              </h1>
            </div>
            <p className="text-text-secondary text-sm mt-1">
              {categoryConfig.description}
            </p>
          </div>
          <Link
            href="/admin"
            className="text-text-secondary hover:text-text transition-colors"
          >
            ← ダッシュボード
          </Link>
        </div>

        <Link
          href={`/admin/content/${category}/new`}
          className="inline-block px-6 py-3 bg-primary text-bg rounded-lg hover:bg-primary-dark transition-colors cursor-pointer font-semibold"
        >
          ＋ 新規追加
        </Link>

        {loading ? (
          <div className="text-center py-12 text-text-secondary">
            読み込み中...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            まだアイテムがありません。新規追加してください。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-bg border border-border-strong dark:border-primary rounded-lg p-4 space-y-3"
              >
                {item.image ? (
                  <img
                    src={item.image as string}
                    alt={item.title as string}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-40 bg-border flex items-center justify-center rounded">
                    <span className="text-text-secondary">No Image</span>
                  </div>
                )}
                <h3 className="font-semibold text-text line-clamp-2">
                  {(item.title as string) || "（タイトルなし）"}
                </h3>
                {item.description ? (
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {item.description as string}
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/content/${category}/edit/${item.id}`}
                    className="flex-1 px-4 py-2 bg-primary text-bg rounded text-center hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-surface-secondary text-text rounded hover:bg-border transition-colors cursor-pointer"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
