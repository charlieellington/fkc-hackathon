# Nami 🔥

**Keep the spark, daily.** — *Duolingo for relationships.*

A front-end-only prototype for the FKC hackathon. This repo is the **scaffold** — a clean,
mobile-first starting point. The team builds the real screens on top.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (default http://localhost:5173).

## Stack — and why

**Vite · React · TypeScript · Tailwind CSS v4 · shadcn/ui · react-router-dom** (package manager: **npm**).

- Lightest, fastest front-end loop — no server/SSR machinery a faked-data demo doesn't need.
- **Mobile-first**: the app renders inside a centred `max-w-md` "phone column" so it looks like a
  phone on desktop and full-bleed on a real phone. Design for the phone column first.
- It matches **Lovable's** own stack, so this repo can be imported into Lovable later (see below).
- shadcn/ui = beautiful, accessible components you own (no lock-in).

## Project structure

```
src/
  App.tsx            routes + the mobile-first phone-column shell
  pages/             one screen per file — start here (Home.tsx is the placeholder)
  components/ui/     shadcn components (button is installed)
  lib/utils.ts       cn() class-merge helper
  index.css          Tailwind v4 theme + Nami brand tokens
```

## Building screens

Add a file in `src/pages`, then add a `<Route>` in `src/App.tsx`.

Pull in more shadcn components as needed:

```bash
npx shadcn@latest add card slider dialog drawer tabs progress badge sonner
```

Brand accent tokens are available as Tailwind utilities: `bg-ember`, `text-plum`, `border-coral`,
`bg-gold`, `bg-cream` (defined in `src/index.css`).

## Hackathon rules (keep the demo bulletproof)

- **No backend, no auth, no external APIs.** All state lives in memory; reset-on-refresh is fine.
- Fake any "AI" with pre-written content + a short delay. Never call a real model on stage.

## Importing into Lovable (optional)

This scaffold is intentionally Lovable-compatible. To bring it in:

1. In Lovable: **New Project → Import from GitHub**.
2. Authorise the Lovable GitHub App on the **`fkc-hackathon`** repo.
3. Lovable detects the Vite/React/TS/Tailwind stack and sets up two-way sync.

**Guardrail to keep import working:** keep it a single **Vite SPA** — one `package.json` at the root,
no monorepo/workspaces, don't switch to Next.js, and keep `npm run dev` green.
