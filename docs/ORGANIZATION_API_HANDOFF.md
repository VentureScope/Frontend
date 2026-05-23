# Organization Module — Backend API Handoff

**For:** Backend team  
**Scope:** All `/dashboard/organization/*` pages  
**Frontend refs:** `types/organization-api.ts`, `lib/organizations-api.ts`, `api.json`  
**Last verified:** May 2026 — against `api.json` and current frontend integration

---

## Summary

| | Count |
|--|-------|
| REST endpoints in client | 33 |
| WebSocket in use | 1 |
| Cross-domain (roadmaps, jobs) | 3 |
| **Contract extensions requested** | 7 → **7 in spec** ✅ |
| **New endpoints requested** | 10 → **8 in spec** (2 missing) |
| **Client exists, no UI yet** | 5 |

**Spec coverage:** 17 of 19 distinct API asks are in `api.json` (~89%). The two missing items are **N9** (member intelligence) and **N10** (aggregate org roadmaps, optional).

Most org features are **in the OpenAPI spec and wired in the frontend**. Remaining gaps are mostly **UI for management actions**, **member intelligence (N9)**, and a few **thin/empty response schemas** the frontend has to work around.

---

## Spec vs handoff (quick audit)

| Category | Requested | In `api.json` | Notes |
|----------|-----------|---------------|-------|
| Extend existing APIs | 7 groups | **7 / 7** | Minor gaps: accept response body empty; `OrganizationOut.products` typed as generic `object[]` |
| New endpoints N1–N10 | 10 | **8 / 10** | Missing: **N9**, **N10** |
| Confirm client-only | 2 | **2 / 2** | `DELETE …/leave`, `DELETE …/roadmaps/{id}` |
| Bonus (not in original handoff) | — | `GET /api/organizations/search` | Semantic search for member's orgs |

---

## Pages (15 routes)

| Route | Status | APIs used |
|-------|--------|-----------|
| `/organization` | ✅ | List orgs, pending-invite badge (`my-invites`) |
| `/organization/new` | ✅ | Create org, upload logo |
| `/organization/[orgId]` | ✅ | Get org |
| `/organization/[orgId]/profile` | ✅ | Get/PATCH org, logo — extended fields mapped |
| `/organization/profile` | ⚠️ Partial | List orgs, get org + members — **skill charts still faked** (no N9) |
| `/organization/[orgId]/members` | ✅ | Org, members, invites with **`team_role`**, resend |
| `/organization/[orgId]/members/[memberId]` | ⚠️ Partial | Members + remove — **intelligence faked** (no N9) |
| `/organization/invites` | ✅ | `GET /invites/my-invites` inbox |
| `/organization/invites/accept` | ✅ | Preview (`N2`), accept, decline |
| `/organization/invites/[inviteId]` | — | Redirect only |
| `/organization/roadmaps` | ✅ | List orgs + roadmaps, `created_by_*`, `my_enrollment` |
| `/organization/[orgId]/roadmaps` | ✅ | Team roadmaps, filters, fork via API |
| `/organization/[orgId]/roadmaps/new` | ✅ | Profile, members, assign roadmap (any member) |
| `/organization/[orgId]/roadmaps/[id]` | ⚠️ Partial | Detail + **`POST …/resources/{id}/toggle`** — **no enroll button in UI** |
| `/organization/advisor` | ✅ | Chat REST + WebSocket |

---

## Implemented APIs

### Organizations
`GET/POST /api/organizations` · `GET/PATCH/DELETE /api/organizations/{orgId}` · `POST/DELETE …/logo` · `GET /api/organizations/search`

### Members
`GET …/members` · `PATCH …/members/{userId}` *(N5 — access role)* · `DELETE …/members/{userId}` · `DELETE …/leave`

### Invites
`GET/POST …/invites` · `DELETE …/invites/{inviteId}` · `POST …/invites/{inviteId}/resend` *(N4)*  
`GET /api/organizations/invites/my-invites` *(N1)* · `GET …/invites/preview?token=` *(N2)*  
`POST …/invites/accept` · `POST …/invites/decline` *(N3)*

### Roadmaps
`GET/POST …/roadmaps` · `GET/DELETE …/roadmaps/{orgRoadmapId}`  
`POST …/roadmaps/{orgRoadmapId}/enroll` *(N7)* · `POST …/roadmaps/{orgRoadmapId}/fork` *(N8)*  
`GET /api/roadmaps/{roadmapId}` *(content)* · `POST /api/roadmaps/resources/{resource_id}/toggle` *(org + personal progress)*

### Org Advisor
`GET/POST …/chat/sessions` · `GET/PATCH/DELETE …/chat/sessions/{id}` · `WS …/chat/ws/{sessionId}?token=…`

### Other
`GET /api/jobs/trending` — optional on create-roadmap wizard

### In client, not wired to UI
| Method | Endpoint | Notes |
|--------|----------|-------|
| DELETE | `…/leave` | No "Leave organization" button |
| DELETE | `/api/organizations/{orgId}` | No delete-org button *(N6 in spec)* |
| DELETE | `…/roadmaps/{orgRoadmapId}` | No unassign/remove button |
| PATCH | `…/members/{userId}` | No edit access-role dialog *(N5 in spec)* |
| POST | `…/roadmaps/{orgRoadmapId}/enroll` | Client exists; no "Join" action on cards *(N7 in spec)* |

---

## Feature status

| Feature | Spec | Frontend | Notes |
|---------|------|----------|-------|
| Invite by **email** | ✅ | ✅ | |
| Invite by **email + team role** | ✅ | ✅ | `team_role` on `OrgInviteCreate` / `OrgInviteOut` |
| Invitee **pending inbox** | ✅ | ✅ | Path is **`/my-invites`** (handoff said `/mine`) |
| Invite **preview / decline / resend** | ✅ | ✅ | N2–N4 |
| Filter roadmaps by **organization** | ✅ | ✅ | Client filter on `orgId` |
| Filter/tab **created by me** | ✅ | ✅ | `created_by_user_id` on list items |
| **my_enrollment** badges / progress | ✅ | ✅ | Used in roadmap utils |
| **Roadmap progress** on org detail | ✅ | ✅ | `POST …/resources/{id}/toggle` (preferred over step PATCH) |
| **Fork roadmap** | ⚠️ | ✅ | Endpoint exists; **response schema empty** — frontend re-lists to find fork |
| **Company profile extras** | ✅ | ✅ | All extended fields on create/update/out |
| Member **job_title**, **github**, roadmap counts | ✅ | ✅ | On `OrgMemberOut` |
| **Member skill intelligence** | ❌ | ❌ | N9 not in spec; charts synthesized client-side |
| **Enroll** before progress | ✅ | ⚠️ | N7 in spec; no enroll UI yet |
| **PATCH member access role** | ✅ | ❌ | N5 in spec; dialog removed, no UI |
| **Leave / delete org / unassign roadmap** | ✅ | ❌ | Endpoints in spec; no UI |

---

## Extend existing APIs

Status of each contract extension against **`api.json`**.

### `GET/PATCH /api/organizations/{orgId}` (+ `POST /api/organizations`) — ✅ In spec

Frontend maps all fields on company profile create/edit.

| Field | In spec | Schema |
|-------|---------|--------|
| `twitter_url` | ✅ | Create, Update, Out |
| `tech_stacks[]` | ✅ | Create, Update, Out |
| `products[]` | ✅ | Create/Update use `ProductEntry`; Out uses generic `object[]` *(tighten typing)* |
| `headquarters`, `founded_year`, `company_size` | ✅ | Create, Update, Out |
| `contact_email`, `contact_phone`, `mission_statement` | ✅ | Create, Update, Out |
| `custom_fields[]` | ✅ | Create/Update use `CustomField`; Out uses generic `object[]` *(tighten typing)* |

`OrganizationListItem` also includes `pending_invites_count` (supports inbox badge).

---

### `GET /api/organizations/{orgId}/members` — ✅ In spec

| Field | In spec (`OrgMemberOut`) | Frontend |
|-------|--------------------------|----------|
| `job_title` | ✅ | ✅ |
| `github_username` | ✅ | ✅ |
| `roadmaps_enrolled` | ✅ | ✅ |
| `roadmaps_created` | ✅ | ✅ |

---

### `GET /api/organizations/{orgId}/roadmaps` — ✅ In spec

| Field | In spec (`OrgRoadmapListItem`) | Frontend |
|-------|--------------------------------|----------|
| `created_by_user_id` | ✅ | ✅ |
| `created_by_name` | ✅ | ✅ |
| `my_enrollment.enrolled` | ✅ | ✅ |
| `my_enrollment.completion_percentage` | ✅ | ✅ |
| `my_enrollment.steps_completed` / `total_steps` | ✅ | ✅ |

**Optional — not in spec:** `participant_preview[]` for expanded cards without N+1 detail calls.

---

### `GET /api/organizations/{orgId}/roadmaps/{orgRoadmapId}` — ✅ In spec

Same `created_by_*` and `my_enrollment` on `OrgRoadmapOut`. `per_member_progress[]` present for participant avatars.

---

### `POST /api/organizations/{orgId}/invites` — ✅ In spec

**Request:**
```json
{ "email": "colleague@company.com", "team_role": "Frontend Engineer" }
```

**Response:** `team_role` on `OrgInviteOut`.

**Role concepts (unchanged):**
- **`team_role`** — job title (e.g. Frontend Engineer). Set at invite time.
- **`access_role`** — org permission (`admin` | `member`). Changed via N5 PATCH, not invite.

**Backend verify:** On accept, new member's `job_title` should reflect invited `team_role`.

---

### `POST /api/organizations/invites/accept` — ⚠️ Partial

Accept works. **Response schema is empty** in OpenAPI — frontend expects `OrganizationOut`.

Preview before accept is covered by **N2** (`GET …/invites/preview`) — ✅ in spec and wired in UI.

---

### Roadmap progress (org context) — ✅ In spec

| Endpoint | Status | Notes |
|----------|--------|-------|
| `PATCH /api/roadmaps/steps/{step_id}/progress` | ✅ | Manual override; documented |
| `POST /api/roadmaps/resources/{resource_id}/toggle` | ✅ | **Preferred** — explicitly works for org team roadmaps |

**Backend verify:** Return `403` with clear message when user must enroll first (N7). Toggle description says it works for org roadmaps; confirm enrollment gate behavior.

---

## New APIs (N1–N10)

| # | Handoff path | `api.json` path | Spec | Frontend | Gap |
|---|--------------|-----------------|------|----------|-----|
| **N1** | `GET …/invites/mine` | `GET …/invites/my-invites` | ✅ `MyInviteOut` | ✅ | Path name differs from handoff |
| **N2** | `GET …/invites/preview?token=` | Same | ✅ `InvitePreviewOut` | ✅ | |
| **N3** | `POST …/invites/decline` | Same | ✅ | ✅ | |
| **N4** | `POST …/invites/{id}/resend` | Same | ✅ | ✅ | |
| **N5** | `PATCH …/members/{userId}` | Same | ✅ `MemberRoleUpdate` | Client only | Response schema empty; **no UI** |
| **N6** | `DELETE …/{orgId}` | Same | ✅ | Client only | **no UI** |
| **N7** | `POST …/roadmaps/{id}/enroll` | Same | ✅ | Client only | Response schema empty; **no enroll UI** |
| **N8** | `POST …/roadmaps/{id}/fork` | Same | ⚠️ | ✅ | **Response schema empty** — should return fork id + source roadmap id |
| **N9** | `GET …/members/me/intelligence` | — | ❌ | ❌ | **Still needed** for real skill benchmarks |
| **N10** | `GET /api/users/me/organization-roadmaps` | — | ❌ | — | **Optional** — reduces N× list calls on My roadmaps |

---

## Permissions

| Action | Who can do it |
|--------|---------------|
| Edit profile / logo | owner |
| Invite / cancel / resend invites | owner |
| Remove member | owner |
| PATCH member access role (N5) | owner |
| Delete organization (N6) | owner |
| **Create team roadmap** | **any org member** |
| Accept / decline invite | invited user (matching email) |
| Leave org | any member |

### What “create / assign team roadmap” means

`POST /api/organizations/{orgId}/roadmaps` — shared team roadmap from the create wizard. Frontend: `assignOrganizationRoadmap`, `canAssignRoadmaps` (all members). API should set `created_by_user_id` on the new assignment.

---

## Remaining work

### Backend (spec gaps)

**P0 — Still missing**
1. **N9** — `GET …/members/me/intelligence` (skill benchmarks, growth areas, developer insight)
2. **N8 response** — document fork id, source org roadmap id, and/or full `OrgRoadmapOut`
3. **N7 / N5 / accept responses** — fill empty OpenAPI response schemas

**P1 — Polish**
4. **N10** *(optional)* — aggregate org roadmaps for current user
5. **`participant_preview[]`** *(optional)* — on roadmap list items
6. **`OrganizationOut`** — use `ProductEntry` / `CustomField` refs (match Create/Update)
7. Confirm **enroll-on-first-toggle** vs explicit N7 behavior and document 403 cases

### Frontend (UI gaps — APIs already exist)

1. Enroll button on roadmap cards / detail (N7 client ready)
2. Edit member access role dialog (N5 client ready)
3. Leave organization, delete organization, unassign roadmap buttons
4. Wire `GET /api/organizations/search` if product wants org search

---

*Verified against all 15 organization page routes, `lib/organizations-api.ts`, and `api.json` (OpenAPI).*
