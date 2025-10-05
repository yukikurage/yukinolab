import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

// POST /api/admin/content/[category]/[id] - 作成・更新
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; id: string }> }
) {
  const ctx = await getCloudflareContext({ async: true });
  const env = ctx?.env;

  try {
    // Cloudflare Access authentication check
    let email = request.headers.get("CF-Access-Authenticated-User-Email");

    if (env.NEXTJS_ENV === "development" && !email) {
      email = env.DEVELOPMENT_ADMIN_EMAIL || ""; // Development fallback
    }

    const allowedEmails = (env.ALLOWED_EMAILS || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (!email || !allowedEmails.includes(email)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { category, id } = await params;
    const key = `${category}:${id}`;
    const value = await request.json();

    await env.CONTENT_KV.put(key, JSON.stringify(value));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to write content" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE /api/admin/content/[category]/[id] - 削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; id: string }> }
) {
  const ctx = await getCloudflareContext({ async: true });
  const env = ctx?.env;

  try {
    let email = request.headers.get("CF-Access-Authenticated-User-Email");

    if (env.NEXTJS_ENV === "development" && !email) {
      email = env.DEVELOPMENT_ADMIN_EMAIL || ""; // Development fallback
    }

    const allowedEmails = (env.ALLOWED_EMAILS || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (!email || !allowedEmails.includes(email)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { category, id } = await params;
    const key = `${category}:${id}`;

    await env.CONTENT_KV.delete(key);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete content" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
