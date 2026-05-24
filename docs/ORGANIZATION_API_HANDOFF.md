# Organization API — Implementation Summary

**For:** Backend team · **Refs:** `api.json`, `lib/organizations-api.ts` · **Updated:** May 2026

---

## Status at a glance

| | |
|--|--|
| Pages fully integrated | **11 / 15** |
| REST endpoints in frontend client | **33** |
| Spec contract extensions | **7 / 7** in `api.json` |
| New endpoints (N1–N10) | **8 in spec**, **2 missing** (N9, N10) |

---

## What is implemented

### Frontend (wired to UI)

| Area | Endpoints / behavior |
|------|----------------------|
| **Orgs** | List, create, get, patch, logo upload/delete, search *(client only)* |
| **Members** | List, remove |
| **Invites (outgoing)** | List, send with `team_role`, cancel, resend |
| **Invites (incoming)** | Inbox (`my-invites`), preview, accept, decline |
| **Company profile** | Full extended fields (tech stacks, products, custom fields, etc.) |
| **Team roadmaps** | List, create (any member), detail, expand, progress toggle |
| **My roadmaps** | Cross-org list, filters, created-by-me, enrollment progress |
| **Fork** | `POST …/fork` + client-side metadata |
| **Advisor** | Chat sessions REST + WebSocket |

### API schema extensions (existing endpoints)

| Endpoint | New / extended fields |
|----------|----------------------|
| `GET/PATCH/POST …/organizations` | `twitter_url`, `tech_stacks`, `products`, `headquarters`, `founded_year`, `company_size`, `contact_email`, `contact_phone`, `mission_statement`, `custom_fields` |
| `GET …/organizations` (list item) | `pending_invites_count` |
| `GET …/members` | `job_title`, `github_username`, `roadmaps_enrolled`, `roadmaps_created` |
| `GET …/roadmaps` | `created_by_user_id`, `created_by_name`, `my_enrollment` |
| `GET …/roadmaps/{id}` | Same + `per_member_progress[]` |
| `POST …/invites` | Request/response `team_role` |
| `POST …/resources/{id}/toggle` | Org + personal roadmap progress (preferred over step PATCH) |

### In API client only (no UI yet)

`DELETE …/leave` · `DELETE …/{org_id}` · `DELETE …/roadmaps/{id}` · `PATCH …/members/{user_id}` · `POST …/roadmaps/{id}/enroll`

### Partial pages (blocked on missing API)

| Page | Gap |
|------|-----|
| `/organization/profile`, `/members/[memberId]` | **N9** intelligence — charts faked client-side |
| `/organization/…/roadmaps/[id]` | Enroll button not wired (N7 client ready) |

---

## New APIs (N1–N10)

| # | Method | Path | In spec | Frontend | Notes |
|---|--------|------|---------|----------|-------|
| **N1** | GET | `/api/organizations/invites/my-invites` | ✅ | ✅ | Invitee inbox + badge |
| **N2** | GET | `/api/organizations/invites/preview?token=` | ✅ | ✅ | Accept-page preview |
| **N3** | POST | `/api/organizations/invites/decline` | ✅ | ✅ | `{ token }` |
| **N4** | POST | `/api/organizations/{org_id}/invites/{invite_id}/resend` | ✅ | ✅ | Owner only |
| **N5** | PATCH | `/api/organizations/{org_id}/members/{user_id}` | ✅ | Client | `{ role: "admin" \| "member" }` |
| **N6** | DELETE | `/api/organizations/{org_id}` | ✅ | Client | Owner only |
| **N7** | POST | `/api/organizations/{org_id}/roadmaps/{roadmap_id}/enroll` | ✅ | Client | |
| **N8** | POST | `/api/organizations/{org_id}/roadmaps/{roadmap_id}/fork` | ✅ | ✅ | Response body empty in spec |
| **N9** | GET | `/api/organizations/{org_id}/members/me/intelligence` | ❌ | ❌ | Skill benchmarks, insights |
| **N10** | GET | `/api/users/me/organization-roadmaps` | ❌ | — | Optional aggregate list |

**Bonus in spec (not in original handoff):** `GET /api/organizations/search?q=&limit=`

---

## Roadmap data layers (rule of thumb)

Always use **`roadmap_id`** (content id) in URLs and path params — never the org assignment `id`.

| Need | Endpoint | Used on |
|------|----------|---------|
| **Detailed** — steps, resources, checkboxes | `GET /api/roadmaps/{roadmap_id}` | Personal + org expand, all detail pages, progress toggles |
| **Basic org** — enrollment, team %, creator, avatars | `GET /api/organizations/{org_id}/roadmaps` (list) or `…/roadmaps/{roadmap_id}` (single) | Org list cards, org detail header |
| **Progress toggle** | `POST /api/roadmaps/resources/{resource_id}/toggle` | Personal + org (same endpoint) |

### Frontend mapping (`lib/organization-roadmap-service.ts`)

| UI moment | API calls |
|-----------|-----------|
| Personal list | `GET /api/roadmaps` → stubs only |
| Personal expand / detail | `GET /api/roadmaps/{roadmap_id}` |
| Org team / my roadmaps list | `GET …/organizations/{org_id}/roadmaps` |
| Org card **expand** | `GET /api/roadmaps/{roadmap_id}` only (keeps list metadata) |
| Org **detail page** | Both org summary + `GET /api/roadmaps/{roadmap_id}` in parallel |

User-facing hints: `components/roadmap-view/RoadmapUxTips.tsx` on each roadmap surface.

---

## Backend still needed (short list)

1. **N9** — member intelligence endpoint  
2. **Response bodies** for accept, decline, logo, PATCH member, resend, enroll, **fork** (fork should return `OrgRoadmapOut`)  
3. **Roadmap id rule** — `{roadmap_id}` in org paths = content roadmap id; list `roadmap_id` must match detail GET  
4. **Accept invite** — set member `job_title` from invite `team_role`  
5. **Enroll policy** — explicit N7 vs auto-enroll on toggle; document 403  
6. *(Optional)* N10, `participant_preview[]` on roadmap list, tighten `OrganizationOut` product/custom_field types  

---

## Permissions (reference)

| Action | Who |
|--------|-----|
| Profile, invites, remove member, PATCH role, delete org | owner |
| Create team roadmap | any member |
| Accept / decline invite | invited user |
| Leave org | any member |

**`team_role`** on invite = job title (e.g. Frontend Engineer). **`role`** on member PATCH = access level (`admin` / `member`).
