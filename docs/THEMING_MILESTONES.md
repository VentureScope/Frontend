# VentureScope theme rollout

Executive dark palette: navy/midnight surfaces, off-white headings, brand `#2F65F1`, dark accents `#60A5FA`. Theme persists via `next-themes` (`localStorage` key `venturescope-theme`) and syncs to Zustand for legacy reads.

## Milestones

| # | Scope | Status |
|---|--------|--------|
| **M1** | `ThemeProvider`, `ThemeToggle`, `globals.css` tokens, root layout, `ThemeSync` | Done |
| **M2** | App shells: landing layout, dashboard layout, Navbar, Sidebar, TopNav, Footer | Done |
| **M3** | Dashboard pages: learning-path, resume, profile, data-hub, advisor, settings | Done |
| **M4** | Marketing: Hero, MarketPulse, about, market-insight; auth (sign-in/up) | Done |
| **M5** | Remaining components, resume print, `npm run check:theme` guard | Done |
| **M5b** | Dashboard dark-text cleanup (`text-[#0f172a]`, inline colors, badges) | **Done** |

## Usage

- Prefer semantic tokens: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-[var(--brand-accent)]`.
- Avoid new hardcoded `bg-white`, `text-slate-900`, `bg-[#1d59db]` in feature code.
- Toggle: `<ThemeToggle />` (icon) or `<ThemeToggle variant="pill" />` in Navbar and TopNav.

## Toggle placement

- Public: `components/landing/Navbar.tsx`
- Dashboard: `components/dashboard/layout/TopNav.tsx`

## Resume print / PDF

- Preview wrapper: `resume-print-surface` on `ResumePreview`.
- Action bar: `no-print` (hidden when printing).
- **Export PDF** calls `window.print()`; `@media print` in `globals.css` forces white paper and dark text.

## CI / local guard

```bash
npm run check:theme
```

Scans `app/` and `components/` for legacy Tailwind color utilities. Allowed exceptions include dark marketing panels (`bg-[#020817]`), overlays (`bg-slate-900/…`), and print-only classes.

## Migration helper

`node scripts/migrate-theme-tokens.mjs` — batch-replace common legacy classes (edit `roots` in the script before running).
