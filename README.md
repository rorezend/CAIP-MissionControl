# CAIP-MissionControl
CAIP Mission Control Panel to manage Everyday SSP tasks

from pathlib import Path

readme = r"""# CAIP Mission Control

**CAIP Mission Control** is an internal, Build‑style enablement and execution hub for **SSPs** and **SEs**. It’s designed to be a **single pane of glass** to:

- Stay aligned to **leadership priorities** and weekly Top‑of‑Mind
- Discover **trending field topics** and best practices
- Collaborate in a **wiki-like knowledge base** with revision history
- Find the right **Programs & Offers** fast (Navigator/AFO/ECIF/ACO/Factory)
- Jump into **dashboards** and execution tooling quickly

> The site’s IA and seed content are grounded in CAIP’s mission and field execution emphasis as described in <File>Cloud & AI Platforms.aspx</File> and your own weekly recap format in <File>friday-recap-2026-03-17.html</File>. citeturn3search225turn3search226

---

## ✨ Key Features

### Build-style Homepage
A modern landing experience inspired by Microsoft Build:
- Big hero + “Now shipping” strip
- Featured and trending content cards
- Upcoming agenda / enablement calendar blocks
- Leadership Top‑of‑Mind hero module

### Community Hub
- Create and browse Topics/Posts
- **Ratings (1–5)**, reactions, bookmarks
- Threaded comments
- Trending and personalization by role (SSP/SE/CSA)

### Collaborative Wiki (Modular + Versioned)
- Markdown editor (MD/MDX)
- Block inserts (Tip/Warning/Checklist/LinkList)
- Revision history + diff viewer + restore
- Quality signals: rating, contributors, last updated, “needs review”

### Programs & Offers Finder
- Offer catalog with filters (Play, pre/post-sales, ROI notes)
- Offer detail pages with positioning + nomination checklist
- Community tips/gotchas on each offer

### Dashboards Hub
- Curated dashboard cards by category
- Copy link + bookmark
- Comment threads (e.g., “best filters”, “where to find X”)

### Leadership “Top of Mind”
A dedicated page for:
- Monthly priorities
- Field calls to action
- Community feedback loop (“I need help applying this”)

---

## 🧱 Architecture Overview

### Tech Stack
- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **lucide-react** icons
- **recharts** for charts
- **Prisma + SQLite** for MVP persistence

### Data Model (MVP)
- Users (mock)
- Topics / Posts / Articles
- Comments (threaded)
- Ratings
- Reactions / Bookmarks
- WikiPages + Revisions
- Featured content + Layout blocks

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm (or pnpm/yarn)

### Install
```bash
npm install
