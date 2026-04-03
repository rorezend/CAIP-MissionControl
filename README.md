# CAIP Mission Control

CAIP Mission Control is an internal Build-style field enablement hub for SSPs and SEs.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- shadcn-style UI components + Radix primitives
- Prisma + SQLite
- lucide-react
- recharts

## Run locally
1. Install dependencies:
   npm install
2. Generate Prisma client:
   npm run prisma:generate
3. Push schema to SQLite:
   npm run prisma:push
4. Seed realistic mock content:
   npm run prisma:seed
5. Run app:
   npm run dev

## Core routes
- / (Build-style Home)
- /community
- /wiki
- /offers
- /dashboards
- /plays
- /leadership
- /about
- /search

## Data model highlights
- Users (mock field personas and moderation roles)
- Topics
- Threaded comments
- Ratings
- Reactions + bookmarks
- Wiki pages + revision history
- Offers catalog
- Dashboards
- Leadership posts
- LayoutConfig JSON blocks for modular page composition

## Notes
- Trending score formula is implemented as:
  (reactions*2 + comments*3 + avgRating*4) * recencyBoost
- recencyBoost decays over 14 days.
- Home and Leadership are layout-driven through JSON blocks in LayoutConfig.
- Auth is mocked with a user switcher and designed for future Entra/MSAL wiring.
