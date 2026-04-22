```
metakit/
├── app/
│   ├── api/
│   │   └── audit/
│   │       └── route.ts        # Main API endpoint
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # UI (temporary location)
│
├── components/
│   └── previews/
│       ├── FacebookPreview.tsx
│       ├── TwitterPreview.tsx
│       ├── LinkedInPreview.tsx
│       └── SlackPreview.tsx
│
├── lib/
│   ├── metaParser.ts          # HTML parsing logic
│   └── redis.ts               # Redis + rate limiting client
│
├── types/
│   └── audit.ts               # Shared TypeScript types
│
└── __tests__/
    └── metaParser.test.ts     # Unit tests
```
