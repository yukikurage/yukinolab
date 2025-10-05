"use client";

import { useState, useEffect, useCallback } from "react";

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

  useEffect(() => {
    // スクリプトが既に読み込まれているかチェック
    if (document.querySelector('script[src*="turnstile"]')) {
      setIsLoaded(true);
      return;
    }

    // Turnstileスクリプト読み込み
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // スクリプトは他のコンポーネントでも使う可能性があるので削除しない
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // グローバルコールバック関数を登録
    (window as any).onTurnstileVerify = (responseToken: string) => {
      setIsVerified(true);
      setToken(responseToken);
      onVerify?.(responseToken);
    };

    (window as any).onTurnstileError = () => {
      setIsVerified(false);
      setToken("");
      onError?.();
    };

    return () => {
      delete (window as any).onTurnstileVerify;
      delete (window as any).onTurnstileError;
    };
  }, [isLoaded, onVerify, onError]);

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
