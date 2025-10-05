import { NextRequest } from "next/server";
import { CloudflareEnv, isDevelopment } from "./env";

/**
 * 認証結果
 */
export interface AuthResult {
  authenticated: boolean;
  email?: string;
  error?: string;
}

/**
 * Cloudflare Accessによる認証チェック
 * 開発環境では DEVELOPMENT_ADMIN_EMAIL をフォールバックとして使用
 */
export function checkAuth(
  request: NextRequest,
  env: CloudflareEnv
): AuthResult {
  // Cloudflare Accessヘッダーから認証済みメールアドレスを取得
  let email = request.headers.get("CF-Access-Authenticated-User-Email");

  // 開発環境のフォールバック
  if (isDevelopment(env) && !email) {
    email = env.DEVELOPMENT_ADMIN_EMAIL || "";
  }

  if (!email) {
    return {
      authenticated: false,
      error: "No authenticated email found",
    };
  }

  // 許可されたメールアドレスのリスト
  const allowedEmails = (env.ALLOWED_EMAILS || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  // メールアドレスが許可リストに含まれているかチェック
  if (!allowedEmails.includes(email)) {
    return {
      authenticated: false,
      email,
      error: "Email not in allowed list",
    };
  }

  return {
    authenticated: true,
    email,
  };
}

/**
 * 認証エラーレスポンスを作成
 */
export function createAuthErrorResponse(authResult: AuthResult): Response {
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * 認証ミドルウェア
 * 認証が失敗した場合はエラーレスポンスを返す
 */
export function requireAuth(
  request: NextRequest,
  env: CloudflareEnv
): AuthResult | Response {
  const authResult = checkAuth(request, env);

  if (!authResult.authenticated) {
    return createAuthErrorResponse(authResult);
  }

  return authResult;
}
