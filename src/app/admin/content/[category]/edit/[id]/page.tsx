"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCategoryById } from "@/lib/cms-config";
import ContentForm from "@/components/admin/ContentForm";

export default function EditContent() {
  const { category, id } = useParams();
  const router = useRouter();
  const categoryConfig = getCategoryById(category as string);
  const [initialData, setInitialData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/content/${category}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitialData(data as Record<string, unknown>);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load content:", error);
        setLoading(false);
      });
  }, [category, id]);

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);

    try {
      await fetch(`/api/admin/content/${category}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      alert("保存しました");
      router.push(`/admin/content/${category}`);
    } catch (error) {
      alert("保存に失敗しました");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/content/${category}`);
  };

  if (!categoryConfig) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-secondary">カテゴリが見つかりません</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-secondary">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-title font-bold text-text">
            {categoryConfig.name}を編集
          </h1>
          <Link
            href={`/admin/content/${category}`}
            className="text-text-secondary hover:text-text transition-colors"
          >
            ← 一覧に戻る
          </Link>
        </div>

        <ContentForm
          fields={categoryConfig.fields}
          initialData={initialData}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>
    </div>
  );
}
