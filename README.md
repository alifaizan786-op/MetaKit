# MetaKit 🛠️

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![MUI](https://img.shields.io/badge/MUI-v6-007FFF?style=flat-square&logo=mui)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)

A developer toolbox for auditing website meta tags and SEO health. Paste a URL and get a full breakdown of Open Graph, Twitter Card, and standard meta tags — with actionable warnings.

---

## Features

- **OG Image Auditor** — audit any URL for Open Graph, Twitter Card, and standard meta tags
- **Warning Engine** — actionable warnings with severity levels (error, warning, info)
- **Audit History** — every audit is persisted to MongoDB
- **Public REST API** — use MetaKit as an API in your own projects
- **Redis Caching** — coming soon
- **Rate Limiting** — coming soon

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Material UI (MUI) |
| Database | MongoDB Atlas + Mongoose |
| Caching | Upstash Redis (coming soon) |
| Parsing | Cheerio |
| Deployment | Vercel |

---

## API

### `GET /api/audit`

Audit any public URL for meta tags.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | The URL to audit |

**Example Request**
```bash
curl https://metakit.dev/api/audit?url=https://github.com
```

**Example Response**
```json
{
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
}
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
- [ ] Phase 1 — Redis Caching + Rate Limiting
- [ ] Phase 2 — Favicon Generator
- [ ] Phase 3 — robots.txt + Sitemap Auditor

---

## Author

**Faizan Ali** — Full Stack Software Engineer
[LinkedIn](https://linkedin.com/in/alifaizan786) · [GitHub](https://github.com/alifaizan786-op)