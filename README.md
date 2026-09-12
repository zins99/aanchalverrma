# Aanchal Verma Creator Site

Vite + React mobile-first creator landing page with a Cloudflare-backed `/admin` content editor.

## Local development

```bash
npm install
npm run dev
```

## Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- D1 binding: `DB` → `aanchal-content`
- R2 binding: `MEDIA` → `aanchal-media` (when enabled)

The admin is intentionally unauthenticated for the prototype phase. Content is designed to use Cloudflare D1 and media is designed to use R2.

Deployment trigger check: 2026-09-12
