# Frontend Performance Optimization — Implementation Guide

This document describes what was implemented in each phase of the VentureScope frontend performance initiative. It complements [Full-Stack Performance Analysis Venturescope.txt](../Full-Stack%20Performance%20Analysis%20Venturescope.txt), which analyzes root causes and backend impact.

**Stack:** Next.js 16 (App Router), React 19, Axios, Zustand (client/UI state), TanStack Query v5 (server state).

**Out of scope for this repo:** Phase 7 backend changes (auth query cache, notification SQL consolidation). Multi-org **first-load** batch APIs also require backend work.

---

## Architecture after all phases

```
┌─────────────────────────────────────────────────────────────┐
│  App (QueryClientProvider in app/layout.tsx)                │
├─────────────────────────────────────────────────────────────┤
│  Zustand          → auth, theme, sidebar, chat, wizard      │
│  TanStack Query   → API reads/writes, dedup, cache, retry     │
│  In-memory TTL    → MFA AAL only (lib/mfa-aal-cache.ts)     │
└─────────────────────────────────────────────────────────────┘
```

**Query defaults** (`lib/query-client.ts`): `staleTime` 60s, `gcTime` 5m, `retry` 1, `refetchOnWindowFocus` true.

**Logout:** `useAppStore.clearAuth()` clears MFA cache and `queryClient.clear()`.

---

## Phase 1 — Quick wins (no new dependencies)

**Goal:** Remove obvious wasted requests on every dashboard load without introducing TanStack Query.

### 1.1 Notifications — no fetch on layout mount

| Before | After |
|--------|-------|
| `useNotifications` auto-fetched 20 items on every page | Full list (`per_page=20`) only when the notification panel **opens** |
| Dashboard overview also fetched 5 items → **duplicate** | Home: `per_page=5` activity query; other dashboard routes: `per_page=1` summary for badge only |

**Files:** `hooks/useNotifications.ts`, `components/dashboard/layout/NotificationPanel.tsx`

### 1.2 Unread badge (interim cache)

Until Phase 3, a small in-memory cache backed the nav bell:

- `lib/notification-summary-cache.ts` (removed in Phase 3)
- `hooks/useNotificationUnreadBadge.ts` — on `/dashboard`, overview populated cache; elsewhere minimal fetch (`per_page: 1`)

### 1.3 Removed disabled job-match API

| Item | Detail |
|------|--------|
| Endpoint | `GET /api/jobs/match-profile` returns **501** |
| Dashboard | Removed from `useDashboardOverview` |
| Profile | `ProfileJobMatchesCard` — static CTA, no fetch |

**Files:** `hooks/useDashboardOverview.ts`, `components/dashboard/profile/ProfileJobMatchesCard.tsx`

### 1.4 MFA AAL cache

| Item | Detail |
|------|--------|
| TTL | 5 minutes, in-memory only (not persisted) |
| Helper | `getMfaAalCached()` in `lib/mfa-aal-cache.ts` |
| Consumer | `app/(dashboard)/dashboard/layout.tsx` |

### 1.5 Dashboard market period — partial refetch

Changing market analytics period refetches **only**:

- `getTrendingCareers`
- `getInDemandSkills`

Not roadmaps, resumes, notifications, GitHub, transcript, or readiness.

**File:** `hooks/useDashboardOverview.ts` (split `loadCore` / `loadMarket`; superseded by Phase 3 queries)

### Phase 1 impact (dashboard load, approximate)

| Metric | Before | After Phase 1 |
|--------|--------|----------------|
| HTTP requests | ~10 | ~7–8 |
| Wasted calls | Duplicate notifications + 501 match | 0 |

---

## Phase 2 — TanStack Query foundation

**Goal:** Add shared server-state layer; no hook migrations yet.

### Installed

- `@tanstack/react-query`

### Added

| File | Purpose |
|------|---------|
| `lib/query-client.ts` | `createQueryClient()`, browser singleton `getQueryClient()` |
| `lib/query-keys.ts` | Centralized query keys (extended in later phases) |
| `components/providers/query-provider.tsx` | `QueryClientProvider` wrapper |
| `app/layout.tsx` | Wraps app in `QueryProvider` |

### Query key namespaces (initial + extended)

- `notifications`, `organizations`, `profile`, `dataHub`, `market`, `dashboard`, `roadmaps`, `resumes`, `readiness`

---

## Phase 3 — Core query migrations

**Goal:** Deduplicate high-traffic reads; cache across components and navigation.

### 3.1 Notifications (single list)

| Item | Detail |
|------|--------|
| Key | `list(20)` panel; `activity()` home; `summary()` other dashboard routes |
| Hooks | `use-notifications-list-query`, `use-notifications-activity-query`, `use-notifications-summary-query` |
| Consumers | `useNotifications` (panel), `useNotificationUnreadBadge`, `useDashboardOverview` (activity) |
| Mutations | `useNotifications` updates cache optimistically; `reload` = `refetch` |

**Removed:** `lib/notification-summary-cache.ts` (Phase 1 interim).

### 3.2 Organizations list

| Item | Detail |
|------|--------|
| Key | `queryKeys.organizations.mine()` |
| Hook | `hooks/useOrganizationsList.ts` → `useQuery` + `fetchMyOrganizations` |

**Effect:** Org advisor sidebar + chat (after Phase 4 lift) share one request.

### 3.3 Organization detail (one HTTP, two shapes)

| Item | Detail |
|------|--------|
| Key | `queryKeys.organizations.detail(orgId)` |
| Hook | `hooks/queries/use-organization-detail-query.ts` |
| Consumers | `useOrganization`, `useOrganizationProfile` (different mappers, same cache) |
| Writes | `saveProfile` uses `queryClient.setQueryData` |

### 3.4 Organization members

| Item | Detail |
|------|--------|
| Key | `queryKeys.organizations.members(orgId)` + user id/email |
| Hook | `hooks/useOrganizationMembers.ts` |

### 3.5 Dashboard overview

`useDashboardOverview` uses multiple `useQuery` / `useQueries`:

| Query key | Data |
|-----------|------|
| Shared notifications query | Activity + unread |
| `roadmaps.list` | Roadmaps |
| `resumes.list` | Resumes |
| `profile.github` | GitHub sync |
| `profile.transcriptLatest` | Transcript |
| `readiness.user` | Readiness |
| `market.trending(days, 7)` | Trending careers |
| `market.inDemandSkills(days, 6)` | Skills |

`refreshReadiness` updates readiness via `setQueryData`. `reload` refetches all.

**File:** `hooks/useDashboardOverview.ts`

---

## Phase 4 — Obvious duplicate hooks

**Goal:** Small fixes that do not require new dependencies (some amplified by Phase 3 cache).

### 4.1 `CreateOrgRoadmapWizard`

- **Before:** `useOrganizationProfile(orgId)` called **twice**
- **After:** Single call; destructure `displayName` and `profile`

**File:** `components/organization/roadmaps/create/CreateOrgRoadmapWizard.tsx`

### 4.2 `OrgTeamRoadmapsView`

- **Before:** `useOrganizationMembers` + `useOrganizationRoadmaps` (members fetched twice)
- **After:** `members` exported from `useOrganizationRoadmaps` only

**Files:** `hooks/useOrganizationRoadmaps.ts`, `OrgTeamRoadmapsView.tsx`

### 4.3 Parallel roadmap list fetch

- **Before:** `listOrganizationRoadmaps` waited for `membersLoading`
- **After:** Roadmap list fetches immediately; re-parsed when members arrive

**File:** `hooks/useOrganizationRoadmaps.ts` (refined again in Phase 6 with React Query)

### 4.4 Org advisor — lift org list

- **Before:** `useOrganizationsList()` in sidebar and chat
- **After:** `OrgAdvisorPageClient` calls once; passes `organizations` as props

**Files:** `components/organization/advisor/OrgAdvisorPageClient.tsx`, `OrgAdvisorSidebar.tsx`, `OrgAdvisorChat.tsx`, `app/.../organization/advisor/page.tsx`

---

## Phase 5 — Profile / data-hub / settings consolidation

**Goal:** Profile page sibling components and settings/data-hub share the same profile queries.

### Shared profile hooks

**File:** `hooks/queries/use-profile-queries.ts`

| Hook | Query key | Notes |
|------|-----------|--------|
| `useGithubSyncedQuery` | `profile.github` | Returns `null` on error |
| `useLatestTranscriptQuery` | `profile.transcriptLatest` | Returns `null` on error |
| `useUserProfileQuery` | `profile.me` | |
| `useExperiencesQuery` | `profile.experiences` | Sorted in `select` |
| `useInvalidateProfileQueries` | — | `invalidateAll`, per-resource helpers |

### Data hub keys

| Key | Data |
|-----|------|
| `dataHub.transcriptList` | All transcripts |
| `dataHub.transcriptConfig` | Transcript config |

### Migrated consumers

| Area | File(s) |
|------|---------|
| Profile — connected accounts | `ConnectedAccounts.tsx` |
| Profile — skills | `SkillIntelligence.tsx` |
| Profile — CV | `CVManager.tsx` |
| Profile — experiences | `ExperienceSection.tsx` |
| Data hub | `hooks/useDataHub.ts` |
| Settings | `hooks/useSettingsPageData.ts` |

### Cross-page sharing

Dashboard overview (Phase 3) already uses `profile.github` and `profile.transcriptLatest` — **same keys** as profile and data-hub. Navigating between those routes reuses cache for ~60s.

### Phase 5 impact (profile page, approximate)

| Metric | Before | After (first visit) | After (cached) |
|--------|--------|---------------------|----------------|
| HTTP (profile mount) | ~8 (4 redundant) | ~4 unique | 0–4 |

---

## Phase 6 — Organization O(N) and roadmap detail

**Goal:** Cache per-org data; avoid duplicate roadmap list on detail page. **First visit** with many orgs still does O(N) HTTP unless backend adds batch APIs.

### 6.1 Per-org roadmap query

| Item | Detail |
|------|--------|
| Key | `queryKeys.organizations.roadmaps(orgId)` |
| Fetcher | `lib/queries/organization-roadmaps.ts` → `fetchOrganizationRoadmapsRaw` |
| Hook | `hooks/queries/use-organization-roadmaps-query.ts` |
| Consumer | `useOrganizationRoadmaps` |

### 6.2 Multi-org hooks use `fetchQuery` (dedup)

| Hook | Aggregated key | Per-org keys reused |
|------|----------------|---------------------|
| `useMyOrganizationMemberContexts` | `organizations.myMemberContexts(...)` | `detail`, `members` |
| `useMyOrganizationRoadmaps` | `organizations.myRoadmaps(orgIdsKey)` | `roadmaps` |

If the user already visited an org’s team roadmaps or hub, repeat loads hit cache instead of new HTTP.

### 6.3 Roadmap detail — skip second list fetch

| Item | Detail |
|------|--------|
| Helper | `resolveOrgRoadmapContentIdFromList()` in `lib/organization-roadmap-service.ts` |
| Option | `fetchOrgRoadmapLessonPage(..., { roadmapsListRaw })` |
| Page | `app/.../organization/[orgId]/roadmaps/[roadmapId]/page.tsx` uses `useOrganizationRoadmapsQuery` |

**Flow:** Team roadmaps page loads list → user opens detail → list resolved from cache (no second `listOrganizationRoadmaps`).

### Still requires backend (not implemented here)

- `GET /api/organizations/member-contexts` (batch)
- `GET /api/organizations/my-roadmaps` (batch)

---

## Phase 7 — Backend (not in this repo)

Documented in the full-stack analysis for backend teams:

| Fix | Purpose |
|-----|---------|
| `get_current_user` caching | Cuts 2 DB roundtrips per authenticated request |
| Notification SQL consolidation | 3 queries → 1 |
| Batch org endpoints | Fixes first-load O(N) for multi-org users |

Frontend Phases 1–6 and 8 do not replace these.

---

## Phase 8 — Frontend polish

**Goal:** Rendering resilience, smaller admin bundles, better UX on errors.

### 8.1 `React.memo`

| Component | File |
|-----------|------|
| `OrgMemberCard` | `components/organization/members/OrgMemberCard.tsx` |
| `OrgRoadmapPathCard` | `components/organization/roadmaps/OrgRoadmapPathCard.tsx` |
| `PathCard` | `components/learning-path/PathCard.tsx` |
| Chat rows | `components/chat/ChatMessageList.tsx` (`ChatMessageRow`) |

**Note:** Memo helps most when parent callbacks are stable (`useCallback`). Optional follow-up.

### 8.2 Admin code-splitting

| Item | Detail |
|------|--------|
| Helper | `lib/lazy-admin-page.ts` — `lazyAdminNamedPage()` |
| Loading UI | `components/admin/AdminPageLoading.tsx` |
| Pages | All `app/(admin)/admin/*/page.tsx` except embeddings redirect |

Admin routes load with `next/dynamic`, `ssr: false`.

### 8.3 Dashboard error UI

- `DashboardOverview` shows error banner + **Retry** when overview queries fail
- Uses `error` and `reload` from `useDashboardOverview`

**File:** `components/dashboard/DashboardOverview.tsx`

### 8.4 Error boundaries

| Location | Wrapper |
|----------|---------|
| Dashboard main | `app/(dashboard)/dashboard/layout.tsx` → `<ErrorBoundary section="Dashboard">` |
| Admin | `app/(admin)/admin/layout.tsx` → `<ErrorBoundary section="Admin">` |
| Component | `components/ErrorBoundary.tsx` |

---

## How to verify (manual)

### Dashboard

1. DevTools → Network → filter `api`
2. Hard refresh `/dashboard`
3. On `/dashboard/profile`: **no** `per_page=20`; at most `per_page=1` summary. On `/dashboard`: `per_page=5` activity. Opening panel: `per_page=20`
4. Expect: **no** `jobs/match-profile`
5. Change market period → only trending + in-demand-skills refetch

### Profile ↔ data-hub ↔ settings

1. Load `/dashboard/profile`, then `/dashboard/data-hub`
2. Within 60s, shared endpoints (`users/me`, `github`, `transcript`, `experiences`) should come from cache (fewer new requests)

### Organization

1. Open `/dashboard/organization/[orgId]/roadmaps`, then a roadmap detail
2. Expect: **one** `listOrganizationRoadmaps` for that org (detail uses cached list)

### Admin

1. Navigate between admin pages
2. Each route loads its own chunk (separate JS in Network → JS filter)

---

## Optional follow-ups (not scheduled)

| Item | Why |
|------|-----|
| Stable `useCallback` for list expand/fork handlers | Improves memo effectiveness |
| `queryClient.getQueryData` in `organization-roadmap-fork.ts` | Avoid extra list fetch on fork edge case |
| `dynamic()` for Recharts org charts | Smaller initial org profile bundle |
| Re-enable job matches query | When backend removes 501 |
| React Query Devtools (dev only) | Easier cache debugging |
| Fix ESLint `eslint-config-next` resolution | CI/DX |

---

## Commit message reference

Suggested messages used or proposed during implementation:

```
perf(dashboard): Phase 1 request reduction — notifications, MFA cache, job matches
feat(data): add TanStack Query foundation for server-state caching (Phase 2)
feat(data): migrate core hooks to TanStack Query (Phase 3)
perf(org): dedupe org hooks and parallelize roadmap list fetch (Phase 4)
feat(data): share profile queries across profile, data-hub, and settings (Phase 5)
perf(org): cache org roadmaps and dedupe multi-org fetches (Phase 6)
perf(ui): Phase 8 polish — memo, admin code-split, error boundaries
```

---

## Related documents

- [Full-Stack Performance Analysis Venturescope.txt](../Full-Stack%20Performance%20Analysis%20Venturescope.txt) — Original analysis, auth multiplier, backend recommendations
