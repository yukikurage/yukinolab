"use client";

import { useState, useEffect } from "react";

/**
 * CMSフロントエンド操作用hooks
 */

/**
 * カテゴリ内の全コンテンツを取得
 */
export function useContentList<T = Record<string, unknown>>(category: string) {
  const [data, setData] = useState<Array<T & { id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`/api/content/${category}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Failed to load ${category}:`, error);
        setError(error);
        setLoading(false);
      });
  }, [category]);

  return { data, loading, error };
}

/**
 * 単一コンテンツを取得
 */
export function useContentItem<T = Record<string, unknown>>(
  category: string,
  id: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`/api/content/${category}/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setData(null);
          setLoading(false);
          return null;
        }
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setData(data as T);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Failed to load ${category}/${id}:`, error);
        setError(error);
        setLoading(false);
      });
  }, [category, id]);

  return { data, loading, error };
}

/**
 * シングルトンコンテンツを取得
 * IDは常に "singleton"
 */
export function useSingleton<T = Record<string, unknown>>(category: string) {
  return useContentItem<T>(category, "singleton");
}

/**
 * コンテンツの変更操作（作成・更新・削除）
 */
export function useContentMutation() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * コンテンツを作成・更新
   */
  const save = async <T = Record<string, unknown>>(
    category: string,
    id: string,
    data: T
  ): Promise<boolean> => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/content/${category}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to save: ${res.status}`);
      }

      setSaving(false);
      return true;
    } catch (error) {
      console.error(`Failed to save ${category}/${id}:`, error);
      setError(error as Error);
      setSaving(false);
      return false;
    }
  };

  /**
   * コンテンツを削除
   */
  const remove = async (category: string, id: string): Promise<boolean> => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/content/${category}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.status}`);
      }

      setSaving(false);
      return true;
    } catch (error) {
      console.error(`Failed to delete ${category}/${id}:`, error);
      setError(error as Error);
      setSaving(false);
      return false;
    }
  };

  return {
    save,
    remove,
    saving,
    error,
  };
}
