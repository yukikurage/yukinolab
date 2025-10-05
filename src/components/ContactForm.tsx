"use client";

import { useRef, useState } from "react";
import Card from "./Card";
import { TurnstileField } from "@/lib/ui";
import { useSingleton } from "@/lib/cms/hooks";

interface SiteSettings {
  acceptingOrders: boolean;
  closedMessage?: string;
}

export default function ContactForm() {
  const { data: settings } = useSingleton<SiteSettings>("settings");
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    contactMethod: "email" as "email" | "discord" | "twitter",
    contactInfo: "",
    subject: "",
    message: "",
    website: "", // ハニーポット
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [turnstileVerified, setTurnstileVerified] = useState(false);

  // Turnstileキーの有効性をチェック
  const hasTurnstileKey = Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.trim() !== ""
  );

  // 受付停止中かチェック（デフォルトは受付中）
  const isAcceptingOrders = settings?.acceptingOrders ?? true;
  const closedMessage =
    settings?.closedMessage ||
    "現在、新規のご依頼を一時的に停止しております。再開までしばらくお待ちください。";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    let turnstileToken = "";
    if (formRef.current) {
      const fd = new FormData(formRef.current);
      turnstileToken = (fd.get("cf-turnstile-response") as string) || "";
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          "cf-turnstile-response": turnstileToken,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          contactMethod: "email",
          contactInfo: "",
          subject: "",
          message: "",
          website: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  // 受付停止中の場合
  if (!isAcceptingOrders) {
    return (
      <Card clickable={false} className="max-w-xl w-full p-8">
        <div className="text-center space-y-6" data-text-region>
          <div className="mb-6">
            <div className="inline-block p-4 bg-surface-secondary rounded-full mb-4">
              <svg
                className="w-12 h-12 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-3">
              現在、ご依頼を受け付けておりません
            </h3>
            <p className="text-text-secondary whitespace-pre-wrap">
              {closedMessage}
            </p>
          </div>
          <p className="text-sm text-text-tertiary">
            再開時期につきましては、X（Twitter）等でお知らせいたします。
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card clickable={false} className="max-w-xl w-full p-8">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg relative z-20"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-text-secondary mb-2"
          >
            お名前（活動名でも可）
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="山田太郎"
              autoComplete="name"
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="contactMethod"
            className="block text-sm font-semibold text-text-secondary mb-2"
          >
            ご連絡方法
            <select
              id="contactMethod"
              value={formData.contactMethod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactMethod: e.target.value as
                    | "email"
                    | "discord"
                    | "twitter",
                  contactInfo: "",
                })
              }
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer bg-bg text-text"
            >
              <option value="email">メールアドレス</option>
              <option value="discord">Discord DM</option>
              <option value="twitter">Twitter (X) DM</option>
            </select>
          </label>
        </div>

        <div>
          <label
            htmlFor="contactInfo"
            className="block text-sm font-semibold text-text-secondary mb-2"
          >
            {formData.contactMethod === "email" && "メールアドレス"}
            {formData.contactMethod === "discord" && "Discord ユーザー名"}
            {formData.contactMethod === "twitter" && "Twitter (X) ユーザー名"}
            <input
              type={formData.contactMethod === "email" ? "email" : "text"}
              id="contactInfo"
              required
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder={
                formData.contactMethod === "email"
                  ? "example@mail.com"
                  : formData.contactMethod === "discord"
                  ? "username#1234 または @username"
                  : "@username"
              }
              autoComplete={formData.contactMethod === "email" ? "email" : "off"}
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-semibold text-text-secondary mb-2"
          >
            件名
            <input
              type="text"
              id="subject"
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="ホームページ制作の依頼"
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-text-secondary mb-2"
          >
            お問い合わせ内容
            <textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              placeholder="ご要望や質問などをお書きください"
            />
          </label>
        </div>

        {/* ハニーポット（bot検知用・人間には見えない） */}
        <div
          style={{ position: "absolute", left: "-9999px" }}
          aria-hidden="true"
        >
          <label htmlFor="website">
            ウェブサイト
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </label>
        </div>

        {hasTurnstileKey ? (
          <TurnstileField
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={() => setTurnstileVerified(true)}
            onError={() => setTurnstileVerified(false)}
          />
        ) : (
          <div className="text-sm text-text-tertiary">
            開発環境: Turnstile認証なし
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending" || (hasTurnstileKey && !turnstileVerified)}
          className="w-full bg-primary-dark text-bg font-semibold py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-text-tertiary disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "sending" ? "送信中..." : "送信する"}
        </button>

        {status === "success" && (
          <p
            className="text-green-600 text-center font-semibold"
            role="status"
            aria-live="polite"
          >
            送信が完了しました！ご連絡ありがとうございます。
          </p>
        )}

        {status === "error" && (
          <p
            className="text-red-600 text-center font-semibold"
            role="alert"
            aria-live="assertive"
          >
            送信に失敗しました。もう一度お試しください。
          </p>
        )}
      </form>
    </Card>
  );
}
