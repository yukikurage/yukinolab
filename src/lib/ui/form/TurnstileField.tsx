"use client";

import { forwardRef, useImperativeHandle } from "react";
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

export interface TurnstileFieldRef {
  reset: () => void;
}

/**
 * Cloudflare Turnstileフィールドコンポーネント
 *
 * @example
 * const turnstileRef = useRef<TurnstileFieldRef>(null);
 *
 * <TurnstileField
 *   ref={turnstileRef}
 *   siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
 *   onVerify={(token) => console.log('Verified')}
 * />
 *
 * // Reset after form submission
 * turnstileRef.current?.reset();
 */
export const TurnstileField = forwardRef<TurnstileFieldRef, TurnstileFieldProps>(
  ({ siteKey, onVerify, onError, className = "" }, ref) => {
    const { reset } = useTurnstile({ siteKey, onVerify, onError });

    useImperativeHandle(ref, () => ({
      reset,
    }));

    return (
      <div
        className={`cf-turnstile ${className}`}
        data-sitekey={siteKey}
        data-callback="onTurnstileVerify"
        data-error-callback="onTurnstileError"
      />
    );
  }
);

TurnstileField.displayName = "TurnstileField";
