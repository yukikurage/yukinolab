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

    if (env?.RATE_LIMIT_KV && ip !== "unknown") {
      const rateLimitKey = `rate_limit:${ip}`;
      const currentCount = await env.RATE_LIMIT_KV.get(rateLimitKey);
      const count = currentCount ? parseInt(currentCount, 10) : 0;

      // 1時間に10回まで
      if (count >= 10) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
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
      // スパム通知（MAIL_PROXY経由）
      const toEmail = env?.CONTACT_EMAIL;
      if (toEmail && env?.MAIL_PROXY) {
        await env.MAIL_PROXY.fetch(
          new Request("https://dummy/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: toEmail }] }],
              from: {
                email: "noreply@yukikurage.net",
                name: "Yukinolab スパム検知",
              },
              subject: "🚫 スパム検知（ハニーポット）",
              content: [
                {
                  type: "text/plain",
                  value: `
お名前: ${name || "未入力"}
連絡方法: ${contactMethod || "未入力"}
連絡先: ${contactInfo || "未入力"}
件名: ${subject || "未入力"}
内容: ${message || "未入力"}
ハニーポット値: ${website}
                  `.trim(),
                },
              ],
            }),
          })
        ).catch((err) =>
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
      // スパム通知（MAIL_PROXY経由）
      const toEmail = env?.CONTACT_EMAIL;
      if (toEmail && env?.MAIL_PROXY) {
        await env.MAIL_PROXY.fetch(
          new Request("https://dummy/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: toEmail }] }],
              from: {
                email: "noreply@yukikurage.net",
                name: "Yukinolab スパム検知",
              },
              subject: "🚫 スパム検知（URL過多）",
              content: [
                {
                  type: "text/plain",
                  value: `
お名前: ${name}
連絡方法: ${contactMethod}
連絡先: ${contactInfo}
件名: ${subject}
内容: ${message}
URL数: ${urlCount}個
                  `.trim(),
                },
              ],
            }),
          })
        ).catch((err) =>
          console.error("Failed to send spam notification:", err)
        );
      }

      return NextResponse.json(
        { error: "Too many links in message" },
        { status: 400 }
      );
    }

    // Turnstile検証（本番環境のみ）
    if (env.NEXTJS_ENV === "production" && turnstileToken) {
      const turnstileSecret = env.TURNSTILE_SECRET;
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

    // MailChannels でメール送信
    const toEmail = env?.CONTACT_EMAIL;

    if (!toEmail) {
      return NextResponse.json({ success: true });
    }

    const contactMethodLabel =
      contactMethod === "email"
        ? "メール"
        : contactMethod === "discord"
        ? "Discord"
        : "Twitter (X)";

    const mailPayload = {
      personalizations: [
        {
          to: [{ email: toEmail }],
        },
      ],
      from: {
        email: "noreply@yukikurage.net",
        name: "Yukinolab お問い合わせフォーム",
      },
      subject: `【お問い合わせ】${subject}`,
      content: [
        {
          type: "text/plain",
          value: `
お名前: ${name}
連絡方法: ${contactMethodLabel}
連絡先: ${contactInfo}
件名: ${subject}

お問い合わせ内容:
${message}
          `.trim(),
        },
      ],
    };

    const mailResponse = await env.MAIL_PROXY.fetch(
      new Request("https://dummy/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mailPayload),
      })
    );

    if (!mailResponse.ok) {
      const text = await mailResponse.text();
      console.error("MailChannels error:", mailResponse.status, text);

      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // メール送信成功後にレート制限カウントアップ
    if (env?.RATE_LIMIT_KV && ip !== "unknown") {
      const rateLimitKey = `rate_limit:${ip}`;
      const currentCount = await env.RATE_LIMIT_KV.get(rateLimitKey);
      const count = currentCount ? parseInt(currentCount, 10) : 0;

      await env.RATE_LIMIT_KV.put(rateLimitKey, `${count + 1}`, {
        expirationTtl: 3600, // 1時間
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
