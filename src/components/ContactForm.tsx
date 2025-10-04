"use client";

import { useEffect, useRef, useState } from "react";
import Card from "./Card";

export default function ContactForm() {
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

  useEffect(() => {
    // Turnstileスクリプト読み込み
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // コールバック設定
    (window as any).onTurnstileVerify = () => {
      setTurnstileVerified(true);
    };

    return () => {
      document.body.removeChild(script);
      delete (window as any).onTurnstileVerify;
    };
  }, []);

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
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            ご連絡方法
            <select
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
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer"
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

        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-callback="onTurnstileVerify"
        ></div>

        <button
          type="submit"
          disabled={status === "sending" || !turnstileVerified}
          className="w-full bg-primary-dark text-bg font-semibold py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-text-tertiary disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "sending" ? "送信中..." : "送信する"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-center font-semibold">
            送信が完了しました！ご連絡ありがとうございます。
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 text-center font-semibold">
            送信に失敗しました。もう一度お試しください。
          </p>
        )}
      </form>
    </Card>
  );
}
