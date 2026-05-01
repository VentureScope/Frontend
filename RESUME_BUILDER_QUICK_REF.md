# Resume Builder Flow - Quick Reference

## All Files at a Glance

### 🆕 5 NEW FILES
```
store/
└── useResumeBuilderStore.ts                    [Zustand state management]

components/resume/
├── ResumeBuilderFlow.tsx                       [Flow wrapper/renderer]
├── Step1RoleSelection.tsx                      [Step 1: Select Target Role]
├── Step2HighlightsSelection.tsx               [Step 2: Select Highlights]
└── Step3Editor.tsx                            [Step 3: Resume Editor]
```

### ✏️ 3 MODIFIED FILES
```
app/(dashboard)/dashboard/
└── resume-builder/page.tsx                     [MODIFIED: Added flow logic]

app/(dashboard)/
└── dashboard/page.tsx                          [REVERTED: No changes]

components/dashboard/
└── ModuleGrid.tsx                              [REVERTED: No changes]
```

### 📦 EXISTING DEPENDENCIES (7+ files, not modified)
```
components/resume/
├── ResumePreview.tsx
├── ProfileIntelligence.tsx
├── ProfessionalSummary.tsx
├── SkillMatrix.tsx
├── ExperienceHistory.tsx
├── AtsAnalytics.tsx
└── ResumeBreadCrumb.tsx

store/
└── useAppStore.ts                              [User/auth data]

lib/
├── user-profile.ts
└── auth-api.ts

types/
├── transcript.ts
└── github.ts
```

---

## What Each File Does

| File | Type | Purpose | Size |
|------|------|---------|------|
| `useResumeBuilderStore.ts` | Store | Manages flow state & selections | 1.2 KB |
| `Step1RoleSelection.tsx` | Component | Role selection modal | 7.76 KB |
| `Step2HighlightsSelection.tsx` | Component | Highlights curation modal | 12.76 KB |
| `Step3Editor.tsx` | Component | Resume editor modal | 8.2 KB |
| `ResumeBuilderFlow.tsx` | Component | Flow controller/renderer | 733 B |
| `resume-builder/page.tsx` | Page | Entry point + router | Modified |

---

## How They Connect

```
📄 resume-builder/page.tsx (entry point)
    ↓ imports & uses ↓
🏪 useResumeBuilderStore (state)
    ↓ provides state to ↓
🎛️ ResumeBuilderFlow (renderer)
    ↓ renders based on step ↓
┌─────────┬──────────────┬──────────┐
│         │              │          │
V         V              V          V
Step1     Step2          Step3      Fallback
Role      Highlights     Editor     (Original)
Modal     Modal          Modal      Editor
```

---

## File Relationships

### Store → Components (unidirectional)
- `useResumeBuilderStore` → used by ALL 4 components
- Step1, Step2, Step3, ResumeBuilderFlow all read/write to store

### Component → Subcomponent
- `Step3Editor` imports `ResumePreview`
- `resume-builder/page.tsx` imports all Step components + existing components

### External Dependencies
- All use `react`
- All use `zustand` (store), `lucide-react` (icons), `next`

---

## State Properties

```typescript
Interface: ResumeBuilderState {
  // Current step in flow
  step: "closed" | "step1" | "step2" | "step3"
  
  // Selected data
  selectedRole: string | null
  selectedHighlights: Object | null
  
  // Actions
  openFlow: () => void
  closeFlow: () => void
  setStep: (step: string) => void
  setSelectedRole: (role: string) => void
  setSelectedHighlights: (highlights: Object) => void
  resetFlow: () => void
}
```

---

## Step Flow

```
START: /dashboard/resume-builder
  ↓
Step 1: Select Target Role
  [User selects from 6 trending roles]
  → setSelectedRole(role) → setStep("step2")
  ↓
Step 2: Select Highlights
  [User checks projects, education, skills]
  → setSelectedHighlights(data) → setStep("step3")
  ↓
Step 3: Resume Editor
  [User reviews/edits resume in split-panel layout]
  → closeFlow() → step = "closed"
  ↓
RESULT: Original Resume Editor
  [Existing resume builder functionality]
```

---

## Quick Start for Development

### To run the app:
```bash
cd /vercel/share/v0-project
npm run dev
# Navigate to: http://localhost:3000/dashboard/resume-builder
```

### To modify a step:
1. Edit the corresponding component in `components/resume/Step*.tsx`
2. It automatically uses the store for state
3. Changes reflect immediately with HMR

### To add new state properties:
1. Edit `store/useResumeBuilderStore.ts`
2. Add property to the store
3. Update TypeScript interface
4. Use in components via `useResumeBuilderStore()`

### To debug flow:
1. Add console.log in any component
2. Check store state: `console.log(useResumeBuilderStore.getState())`
3. Check step: `console.log(step)` from store

---

## Critical Import Paths

```javascript
// Store
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore"

// Components
import Step1RoleSelection from "@/components/resume/Step1RoleSelection"
import Step2HighlightsSelection from "@/components/resume/Step2HighlightsSelection"
import Step3Editor from "@/components/resume/Step3Editor"
import ResumeBuilderFlow from "@/components/resume/ResumeBuilderFlow"

// Existing
import ResumePreview from "@/components/resume/ResumePreview"
import { useAppStore } from "@/store/useAppStore"
import { getUserProfileView } from "@/lib/user-profile"
```

---

## Files NOT Changed

❌ Dashboard page - flows are in resume-builder, not dashboard
❌ ModuleGrid - no button trigger, navigation is direct
❌ All other app files - isolated to resume-builder route
✅ Only resume-builder/page.tsx and 5 new files added

---

## Total Impact

| Metric | Value |
|--------|-------|
| New Files | 5 |
| Modified Files | 1 (page.tsx) |
| Lines of Code (new) | ~500 |
| New Dependencies | 0 (all existing) |
| Breaking Changes | 0 |
| Routes Changed | 0 |
