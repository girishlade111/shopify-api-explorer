# Shopify API Explorer

A client-side web app for exploring and interacting with the Shopify Storefront / Admin APIs. Browse endpoints, build and run requests against a store, inspect responses, and experiment with voice-driven interaction via the built-in voice widget.

## Features

- **API explorer UI** — browse Shopify API resources and compose requests with an interactive form-driven interface
- **Live request/response view** — send requests to a configured store URL and inspect formatted JSON responses
- **Voice widget** — talk to the demo assistant (Atelier chat / voice demo) powered by a configurable backend URL
- **Charts & data views** — visualize API results with charts (recharts)
- **Modern UI** — Radix UI primitives, shadcn-style components, Tailwind CSS, dark/light theming
- **100% client-side** — no backend required; API base URLs are configured via environment variables with sensible defaults

## Tech Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS + Radix UI + shadcn/ui components
- React Router, React Query, React Hook Form, Zod
- Recharts for visualizations

## Quick Start

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# production build
npm run build   # outputs to dist/
```

## Configuration

Optional environment variables (all have defaults, so the app runs without them):

| Variable | Description |
| --- | --- |
| `VITE_NGROK_URL` | Backend URL used by the voice widget |
| `VITE_STORE_URL` | Default Shopify store URL |

Create a `.env` file in the project root, e.g.:

```env
VITE_STORE_URL=https://your-store.myshopify.com
VITE_NGROK_URL=https://your-backend.example.com
```

## Project Structure

```
├── index.html            # entry HTML
├── src/
│   ├── main.tsx          # app entry
│   ├── App.tsx           # routes + providers
│   ├── pages/            # page components
│   ├── components/       # UI components incl. VoiceWidget/
│   ├── hooks/            # shared React hooks
│   ├── lib/              # utilities
│   └── styles/           # global styles
├── public/               # static assets
└── vite.config.ts        # Vite config
```

## Deploy Notes

Static build — the production `dist/` output can be hosted on any static host (Cloudflare Pages, Netlify, GitHub Pages).

## Credit

Built by Girish Lade — https://ladestack.in
