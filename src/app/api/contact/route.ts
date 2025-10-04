import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック（Cloudflare環境のみ）
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx?.env;
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";

    console.log("Rate limit debug:", {
      hasCtx: !!ctx,
      hasEnv: !!env,
      hasKV: !!env?.RATE_LIMIT_KV,
      ip,
    });

    if (env?.RATE_LIMIT_KV && ip !== "unknown") {
      const rateLimitKey = `rate_limit:${ip}`;
      const currentCount = await env.RATE_LIMIT_KV.get(rateLimitKey);
      const count = currentCount ? parseInt(currentCount, 10) : 0;

      console.log(`Rate limit for ${ip}: ${count}/3`);

      // 1時間に3回まで
      if (count >= 3) {
        console.log(`Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }

      // カウントアップ（1時間で期限切れ）
      await env.RATE_LIMIT_KV.put(rateLimitKey, `${count + 1}`, {
        expirationTtl: 3600, // 1時間
      });
      console.log(`Rate limit updated for ${ip}: ${count + 1}/3`);
    } else {
      console.log("Rate limit skipped:", {
        reason: !env?.RATE_LIMIT_KV ? "No KV" : "Unknown IP",
      });
    }

    const {
      name,
      contactMethod,
      contactInfo,
      subject,
      message,
      website,
      "cf-turnstile-response": turnstileToken,
    } = (await request.json().catch(() => ({}))) as {
      name?: string;
      contactMethod?: string;
      contactInfo?: string;
      subject?: string;
      message?: string;
      website?: string;
      "cf-turnstile-response"?: string;
    };

    // ハニーポットチェック（botが入力したら拒否）
    if (website) {
      console.log("Bot detected: honeypot filled");

      // スパム通知
      const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK_URL;
      if (spamWebhookUrl) {
        await fetch(spamWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "🚫 スパム検知（ハニーポット）",
                color: 0xef4444, // red-500
                fields: [
                  { name: "お名前", value: name || "未入力", inline: true },
                  {
                    name: "連絡方法",
                    value: contactMethod || "未入力",
                    inline: true,
                  },
                  {
                    name: "連絡先",
                    value: contactInfo || "未入力",
                    inline: false,
                  },
                  { name: "件名", value: subject || "未入力", inline: false },
                  { name: "内容", value: message || "未入力", inline: false },
                  { name: "ハニーポット値", value: website, inline: false },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        }).catch((err) =>
          console.error("Failed to send spam notification:", err)
        );
      }

      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // バリデーション
    if (!name || !contactMethod || !contactInfo || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // スパムフィルタ: URLリンクが多すぎる場合は拒否
    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount > 2) {
      console.log("Spam detected: too many URLs");

      // スパム通知
      const spamWebhookUrl = process.env.DISCORD_SPAM_WEBHOOK_URL;
      if (spamWebhookUrl) {
        await fetch(spamWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "🚫 スパム検知（URL過多）",
                color: 0xef4444, // red-500
                fields: [
                  { name: "お名前", value: name, inline: true },
                  { name: "連絡方法", value: contactMethod, inline: true },
                  { name: "連絡先", value: contactInfo, inline: false },
                  { name: "件名", value: subject, inline: false },
                  { name: "内容", value: message, inline: false },
                  { name: "URL数", value: `${urlCount}個`, inline: false },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        }).catch((err) =>
          console.error("Failed to send spam notification:", err)
        );
      }

      return NextResponse.json(
        { error: "Too many links in message" },
        { status: 400 }
      );
    }

    // Turnstile検証（本番環境のみ）
    if (process.env.NODE_ENV === "production" && turnstileToken) {
      const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
      if (turnstileSecret) {
        const verifyResponse = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret: turnstileSecret,
              response: turnstileToken,
            }),
          }
        );

        const verifyData = (await verifyResponse.json()) as {
          success: boolean;
          ["error-codes"]?: string[];
        };
        if (!verifyData.success) {
          return NextResponse.json(
            { error: "Verification failed" },
            { status: 400 }
          );
        }
      }
    }

    // Discord Webhook送信
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log("DEV MODE - Discord message would be sent:");
      console.log({ name, contactMethod, contactInfo, subject, message });
      return NextResponse.json({ success: true });
    }

    const contactMethodLabel =
      contactMethod === "email"
        ? "メール"
        : contactMethod === "discord"
        ? "Discord"
        : "Twitter (X)";

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "📬 お問い合わせ",
            color: 0xf59e0b,
            fields: [
              { name: "お名前", value: name, inline: true },
              { name: "連絡方法", value: contactMethodLabel, inline: true },
              { name: "連絡先", value: contactInfo, inline: false },
              { name: "件名", value: subject, inline: false },
              { name: "お問い合わせ内容", value: message, inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
