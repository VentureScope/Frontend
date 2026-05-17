# VentureScope UI redesign (Geist + green system)

**Decisions (locked):**

- **C** — Light consumer app by default; dark mode via theme toggle (no admin app in this repo).
- **Theme toggle** — Kept (`venturescope-theme` in `localStorage`).
- **Scope** — `app/(auth)/*`, `app/(dashboard)/*`, `app/(landing)/*`, and all `components/**` recursively.

## Palette

| Token | Light | Dark |
|-------|-------|------|
| Background | `#ffffff` | `#0a0a0a` |
| Foreground | `#000000` | `#fafafa` |
| Primary | `#00dc82` | `#00dc82` |
| Secondary | `#ff3e00` | `#ff3e00` |
| Accent | `#5865f2` | `#5865f2` |
| Border | `#e5e5e5` (subtle dividers) | `#2e2e2e` |
| Muted text | `#333333` | `#a3a3a3` |
| Error | `#ef4444` | `#ef4444` |
| Success | `#10b981` | `#10b981` |

Legacy aliases: `--brand` → primary green, `--brand-accent` → accent purple.

## Typography

- **Sans:** Geist (`--font-geist-sans`)
- **Mono:** Geist Mono (`--font-geist-mono`) — use `.font-data` for tables/IDs
- **Scale:** H1 36px/400, label 12px/600 uppercase, body 15px, button 14px/500
- Utilities: `.text-h1`, `.text-label`, `.text-body`, `.text-btn`

## Milestones

| # | Scope | Status |
|---|--------|--------|
| **M0** | `globals.css` tokens, Geist fonts, typography, `ui/button`, theme provider/toggle | **Done** |
| **M1** | Shells: dashboard Sidebar/TopNav, landing Navbar/Footer, layouts | **Done** |
| **M2** | Dashboard home, profile, settings | **Done** |
| **M3** | Learning path, new-roadmap, roadmap detail | **Done** |
| **M4** | Resume builder | **Done** |
| **M5** | Data hub, market trends, AI advisor | **Done** |
| **M6** | Landing pages, auth flows | **Done** |

## Usage

- Prefer semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary`, `bg-accent`, `text-success` (charts/badges).
- Avoid new hardcoded blues (`#2f65f1`, `#2563eb`) or `text-[#0f172a]`.
- Run `npm run check:theme` after each milestone.

## Prior theme doc

Supersedes executive blue palette in `docs/THEMING_MILESTONES.md` for new work; keep that file for historical reference only.
