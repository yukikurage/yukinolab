import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

// GET /api/content/[category]/[id] - 個別取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; id: string }> }
) {
  const ctx = await getCloudflareContext({ async: true });
  const env = ctx?.env;

  const { category, id } = await params;
  const key = `${category}:${id}`;

  try {
    const value = await env.CONTENT_KV.get(key, "json");

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
    return new Response(JSON.stringify({ error: "Failed to fetch content" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
