# Project Notes for Claude

## Package Manager
- **Use pnpm** (not npm)
- Commands: `pnpm install`, `pnpm add`, `pnpm run`, etc.

## Environment
- Next.js 15.5.4
- Deployed on Cloudflare Pages
- Contact form: Discord Webhook + Turnstile + Rate Limiting

## Development
- Local dev: `pnpm dev`
- Cloudflare preview: `pnpm preview`
- Deploy: `pnpm deploy`

## Cloudflare KV Setup (Required for Rate Limiting)

### 1. Create KV Namespaces
```bash
# Production KV
wrangler kv:namespace create "RATE_LIMIT_KV"
# Output: id = "xxxxx"

# Preview KV (for local development)
wrangler kv:namespace create "RATE_LIMIT_KV" --preview
# Output: preview_id = "yyyyy"
```

### 2. Update wrangler.jsonc
Replace the placeholder IDs in `kv_namespaces` section:
```jsonc
"kv_namespaces": [
  {
    "binding": "RATE_LIMIT_KV",
    "id": "xxxxx",  // from step 1
    "preview_id": "yyyyy"  // from step 1
  }
]
```

### 3. Rate Limit Settings
- **Limit**: 3 requests per hour per IP
- **Spam notifications**: Sent to `DISCORD_SPAM_WEBHOOK_URL`
- **Local dev**: Rate limiting is automatically disabled
