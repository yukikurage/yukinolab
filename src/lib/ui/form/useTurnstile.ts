"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTurnstileOptions {
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
}

/**
 * Cloudflare Turnstileを管理するhook
 *
 * @example
 * const { isVerified, token, reset } = useTurnstile({
 *   siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
 *   onVerify: (token) => console.log('Verified:', token),
 * });
 */
export function useTurnstile({
  siteKey,
  onVerify,
  onError,
}: UseTurnstileOptions) {
  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // 最新のコールバックを保持
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
  }, [onVerify, onError]);

  useEffect(() => {
    // グローバルコールバック関数を先に登録（Turnstileウィジェットレンダリング前に必要）
    (window as any).onTurnstileVerify = (responseToken: string) => {
      setIsVerified(true);
      setToken(responseToken);
      onVerifyRef.current?.(responseToken);
    };

    (window as any).onTurnstileError = () => {
      setIsVerified(false);
      setToken("");
      onErrorRef.current?.();
    };

    // スクリプトが既に読み込まれているかチェック
    if (document.querySelector('script[src*="turnstile"]')) {
      setIsLoaded(true);
      return () => {
        delete (window as any).onTurnstileVerify;
        delete (window as any).onTurnstileError;
      };
    }

    // Turnstileスクリプト読み込み
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      delete (window as any).onTurnstileVerify;
      delete (window as any).onTurnstileError;
      // スクリプトは他のコンポーネントでも使う可能性があるので削除しない
    };
  }, []);

  /**
   * Turnstileをリセット
   */
  const reset = useCallback(() => {
    setIsVerified(false);
    setToken("");
    if ((window as any).turnstile?.reset) {
      (window as any).turnstile.reset();
    }
  }, []);

  return {
    isVerified,
    token,
    isLoaded,
    reset,
    siteKey,
  };
}
