"use client";

import { useTurnstile } from "./useTurnstile";

interface TurnstileFieldProps {
  /**
   * Turnstileサイトキー
   */
  siteKey: string;

  /**
   * 検証成功時のコールバック
   */
  onVerify?: (token: string) => void;

  /**
   * 検証失敗時のコールバック
   */
  onError?: () => void;

  /**
   * 追加のクラス名
   */
  className?: string;
}

/**
 * Cloudflare Turnstileフィールドコンポーネント
 *
 * @example
 * <TurnstileField
 *   siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
 *   onVerify={(token) => console.log('Verified')}
 * />
 */
export function TurnstileField({
  siteKey,
  onVerify,
  onError,
  className = "",
}: TurnstileFieldProps) {
  useTurnstile({ siteKey, onVerify, onError });

  return (
    <div
      className={`cf-turnstile ${className}`}
      data-sitekey={siteKey}
      data-callback="onTurnstileVerify"
      data-error-callback="onTurnstileError"
    />
  );
}
