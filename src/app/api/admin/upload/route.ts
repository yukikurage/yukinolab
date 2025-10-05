import { NextRequest } from "next/server";
import { getEnv, isDevelopment } from "@/lib/cloudflare/env";
import { requireAuth } from "@/lib/cloudflare/auth";
import { uploadFile } from "@/lib/cloudflare/r2";

export async function POST(request: NextRequest) {
  try {
    const env = await getEnv();

    // 認証チェック
    const authResult = requireAuth(request, env);
    if (authResult instanceof Response) {
      return authResult;
    }

    if (isDevelopment(env)) {
      console.log("Development mode: authenticated as", authResult.email);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const bucketUrl = env.UPLOADS_BUCKET_URL;
    if (!bucketUrl) {
      throw new Error("UPLOADS_BUCKET_URL is not defined");
    }

    // R2にアップロード
    const result = await uploadFile(env.UPLOADS_BUCKET, file, bucketUrl);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
