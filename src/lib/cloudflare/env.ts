import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Cloudflare環境変数の型定義
 * プロジェクトに応じてカスタマイズ
 */
export interface CloudflareEnv {
  // KV Namespaces
  CONTENT_KV: KVNamespace;
  RATE_LIMIT_KV: KVNamespace;

  // R2 Buckets
  UPLOADS_BUCKET: R2Bucket;
  NEXT_INC_CACHE_R2_BUCKET: R2Bucket;

  // Environment variables
  NEXTJS_ENV?: string;
  ALLOWED_EMAILS?: string;
  DEVELOPMENT_ADMIN_EMAIL?: string;
  UPLOADS_BUCKET_URL?: string;
}

/**
 * Cloudflare環境を取得する
 * getCloudflareContextのラッパー関数
 */
export async function getEnv(): Promise<CloudflareEnv> {
  const ctx = await getCloudflareContext({ async: true });

  if (!ctx?.env) {
    throw new Error("Failed to get Cloudflare environment");
  }

  return ctx.env as CloudflareEnv;
}

/**
 * 開発環境かどうかを判定
 */
export function isDevelopment(env: CloudflareEnv): boolean {
  return env.NEXTJS_ENV === "development";
}
