# MetaKit 🛠️

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![MUI](https://img.shields.io/badge/MUI-v9-007FFF?style=flat-square&logo=mui)
![Redis](https://img.shields.io/badge/Redis-Upstash-red?style=flat-square&logo=redis)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)

A developer toolbox for auditing website meta tags and SEO health. Paste a URL and get a full breakdown of Open Graph, Twitter Card, and standard meta tags — with actionable warnings and pixel-accurate social card previews.

---

## Features

- **OG Image Auditor** — audit any URL for Open Graph, Twitter Card, and standard meta tags
- **Platform Previews** — see exactly how your URL renders on Facebook, Twitter, LinkedIn, and Slack
- **Warning Engine** — actionable warnings with severity levels (error, warning, info)
- **Audit History** — personal audit history stored locally, full results persisted to MongoDB
- **Redis Caching** — audit results cached for 24 hours via Upstash
- **Rate Limiting** — per-IP request throttling via Upstash Ratelimit
- **Public REST API** — use MetaKit as an API in your own projects
- **CI/CD Pipeline** — GitHub Actions runs lint, type check, and deploys to Vercel on every push to main

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Material UI (MUI) v9 |
| Database | MongoDB Atlas + Mongoose |
| Caching | Upstash Redis |
| Rate Limiting | Upstash Ratelimit |
| Parsing | Cheerio |
| Local History | IndexedDB (idb) |
| CI/CD | GitHub Actions + Vercel |

---

## API

### `GET /api/audit`

Audit any public URL for meta tags. Results are cached for 24 hours.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | The URL to audit |
| `refresh` | boolean | No | Set to `true` to bypass the 24-hour cache |

**Example Request**
```bash
curl "https://metakit.dev/api/audit?url=https://github.com"
```

**Example Response**
```json
{
  "data": {
    "url": "https://github.com",
    "pageStatus": { "status": 200, "statusText": "OK" },
    "auditedAt": "2026-04-24T05:54:13.518Z",
    "cached": false,
    "meta": {
      "title": "GitHub",
      "description": "...",
      "canonical": "https://github.com",
      "favicon": "https://github.githubassets.com/favicons/favicon.svg",
      "og": { "title": "...", "description": "...", "image": "..." },
      "twitter": { "title": "...", "description": "...", "image": "..." }
    },
    "warnings": [
      { "message": "Title too long", "severity": "error" }
    ]
  },
  "remaining": 19,
  "limit": 20,
  "reset": "2026-04-25T05:54:13.518Z"
}
```

---

### `GET /api/history`

Fetch a specific audit result by MongoDB ID.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | MongoDB `_id` of the audit document |

**Example Request**
```bash
curl "https://metakit.dev/api/history?id=64f1a2b3c4d5e6f7a8b9c0d1"
```

---

## Getting Started

```bash
git clone https://github.com/alifaizan786-op/MetaKit.git
cd metakit
npm install
```

Create a `.env` file in the root:

```dotenv
MONGODB_URI=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

```bash
npm run dev
```

---

## Roadmap

- [x] Phase 1 — OG Image Auditor
- [x] Phase 1 — Redis Caching + Rate Limiting
- [x] Phase 1 — Audit History (IndexedDB + MongoDB)
- [x] Phase 1 — Public REST API
- [x] Phase 1 — CI/CD via GitHub Actions
- [ ] Phase 2 — Favicon Generator
- [ ] Phase 3 — robots.txt + Sitemap Auditor

---

## Author

**Faizan Ali** — Full Stack Software Engineer
[LinkedIn](https://linkedin.com/in/alifaizan786) · [GitHub](https://github.com/alifaizan786-op)