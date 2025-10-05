import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
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

    if (env.NEXTJS_ENV === "development") {
      console.log("Development mode: skipping email check");
      console.log("Allowed emails:", allowedEmails);
    }

    if (!email || !allowedEmails.includes(email)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const key = `uploads/${filename}`;

    // Upload to R2
    await env.UPLOADS_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Return public URL (you may need to configure R2 custom domain)
    const bucketUrl = process.env.UPLOADS_BUCKET_URL;

    if (!bucketUrl) {
      throw new Error("UPLOADS_BUCKET_URL is not defined");
    }
    const url = `${bucketUrl}/${key}`;

    return new Response(JSON.stringify({ url, key }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
