import { NextRequest } from "next/server";
import { getEnv } from "@/lib/cloudflare/env";
import { requireAuth } from "@/lib/cloudflare/auth";
import { listByCategory, getItem, putItem, deleteItem } from "@/lib/cloudflare/kv";

/**
 * APIルートファクトリー
 * CMS設定から自動的にCRUD APIを生成
 */

/**
 * カテゴリ一覧取得ハンドラーを生成
 * GET /api/content/[category]
 */
export function createListHandler() {
  return async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> }
  ) {
    const { category } = await params;

    try {
      const env = await getEnv();
      const items = await listByCategory(env.CONTENT_KV, category);

      return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to list content" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}

/**
 * 単一アイテム取得ハンドラーを生成
 * GET /api/content/[category]/[id]
 */
export function createGetHandler() {
  return async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string; id: string }> }
  ) {
    const { category, id } = await params;

    try {
      const env = await getEnv();
      const value = await getItem(env.CONTENT_KV, category, id);

      if (!value) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(value), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch content" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}

/**
 * アイテム作成・更新ハンドラーを生成（認証必須）
 * POST /api/admin/content/[category]/[id]
 */
export function createPostHandler() {
  return async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ category: string; id: string }> }
  ) {
    try {
      const env = await getEnv();

      // 認証チェック
      const authResult = requireAuth(request, env);
      if (authResult instanceof Response) {
        return authResult;
      }

      const { category, id } = await params;
      const value = await request.json();

      await putItem(env.CONTENT_KV, category, id, value);

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to write content" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}

/**
 * アイテム削除ハンドラーを生成（認証必須）
 * DELETE /api/admin/content/[category]/[id]
 */
export function createDeleteHandler() {
  return async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ category: string; id: string }> }
  ) {
    try {
      const env = await getEnv();

      // 認証チェック
      const authResult = requireAuth(request, env);
      if (authResult instanceof Response) {
        return authResult;
      }

      const { category, id } = await params;

      await deleteItem(env.CONTENT_KV, category, id);

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to delete content" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}
