import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

// GET /api/content/[category] - カテゴリ全体の一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  const ctx = await getCloudflareContext({ async: true });
  const env = ctx?.env;

  try {
    const list = await env.CONTENT_KV.list({ prefix: `${category}:` });

    const items = await Promise.all(
      list.keys.map(async (key: { name: string }) => {
        const value = (await env.CONTENT_KV.get(key.name, "json")) as Record<
          string,
          unknown
        > | null;
        return {
          id: key.name.replace(`${category}:`, ""),
          ...value,
        };
      })
    );

    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to list content" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
