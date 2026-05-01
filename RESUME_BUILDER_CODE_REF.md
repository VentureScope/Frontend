# Resume Builder Flow - Code Reference

## File Locations & Key Code Snippets

---

## 1. State Management Store

### Location: `store/useResumeBuilderStore.ts`

```typescript
import { create } from "zustand";

export type ResumeBuilderStep = "closed" | "step1" | "step2" | "step3";

interface ResumeBuilderState {
  step: ResumeBuilderStep;
  selectedRole: string | null;
  selectedHighlights: any;
  openFlow: () => void;
  closeFlow: () => void;
  setStep: (step: ResumeBuilderStep) => void;
  setSelectedRole: (role: string) => void;
  setSelectedHighlights: (highlights: any) => void;
  resetFlow: () => void;
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  step: "closed",
  selectedRole: null,
  selectedHighlights: null,
  openFlow: () => set({ step: "step1" }),
  closeFlow: () => set({ step: "closed" }),
  setStep: (step) => set({ step }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  setSelectedHighlights: (highlights) => set({ selectedHighlights: highlights }),
  resetFlow: () => set({ step: "closed", selectedRole: null, selectedHighlights: null }),
}));
```

**Key Methods**:
- `openFlow()`: Start the flow at step 1
- `closeFlow()`: Exit flow, return to normal editor
- `setStep(step)`: Navigate between steps
- `setSelectedRole(role)`: Save role selection
- `setSelectedHighlights(data)`: Save highlights selection

---

## 2. Flow Controller Component

### Location: `components/resume/ResumeBuilderFlow.tsx`

```typescript
"use client";

import dynamic from "next/dynamic";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";

// Dynamic imports to reduce bundle size
const Step1RoleSelection = dynamic(
  () => import("./Step1RoleSelection"),
  { ssr: false }
);
const Step2HighlightsSelection = dynamic(
  () => import("./Step2HighlightsSelection"),
  { ssr: false }
);
const Step3Editor = dynamic(
  () => import("./Step3Editor"),
  { ssr: false }
);

export default function ResumeBuilderFlow() {
  const { step } = useResumeBuilderStore();

  if (step === "closed") return null;

  return (
    <>
      {step === "step1" && <Step1RoleSelection />}
      {step === "step2" && <Step2HighlightsSelection />}
      {step === "step3" && <Step3Editor />}
    </>
  );
}
```

**How it works**:
1. Reads current `step` from store
2. Renders nothing if flow is closed
3. Conditionally renders appropriate step component
4. Uses dynamic imports for performance

---

## 3. Resume Builder Page (Entry Point)

### Location: `app/(dashboard)/dashboard/resume-builder/page.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";
import Step1RoleSelection from "@/components/resume/Step1RoleSelection";
import Step2HighlightsSelection from "@/components/resume/Step2HighlightsSelection";
import Step3Editor from "@/components/resume/Step3Editor";
import ResumeBreadcrumb from "@/components/resume/ResumeBreadCrumb";
import ProfileIntelligence from "@/components/resume/ProfileIntelligence";
import ProfessionalSummary from "@/components/resume/ProfessionalSummary";
import SkillMatrix from "@/components/resume/SkillMatrix";
import ExperienceHistory from "@/components/resume/ExperienceHistory";
import AtsAnalytics from "@/components/resume/AtsAnalytics";
import ResumePreview from "@/components/resume/ResumePreview";

export default function ResumeBuilderPage() {
  const { step, openFlow } = useResumeBuilderStore();

  // Auto-open flow when page loads
  useEffect(() => {
    if (step === "closed") {
      openFlow();
    }
  }, []);

  // Show flow modals while active
  if (step !== "closed") {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        {step === "step1" && <Step1RoleSelection />}
        {step === "step2" && <Step2HighlightsSelection />}
        {step === "step3" && <Step3Editor />}
      </div>
    );
  }

  // Show original editor after flow completes
  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 xl:px-12">
      <div className="mx-auto max-w-7xl">
        <ResumeBreadcrumb />
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          <div className="space-y-6 sm:space-y-8 lg:col-span-7">
            <ProfileIntelligence />
            <div className="space-y-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:space-y-10 sm:p-7 lg:rounded-[32px] lg:p-10">
              <ProfessionalSummary />
              <SkillMatrix />
              <ExperienceHistory />
            </div>
          </div>
          <div className="space-y-6 sm:space-y-8 lg:col-span-5">
            <AtsAnalytics />
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Key Features**:
- `useEffect()` calls `openFlow()` on mount
- Conditional rendering based on `step`
- Falls back to original editor layout when flow closes

---

## 4. Step 1 - Role Selection

### Location: `components/resume/Step1RoleSelection.tsx`

```typescript
"use client";

import { useState, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, X } from "lucide-react";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";

const TRENDING_ROLES = [
  {
    id: 1,
    title: "Senior DevOps Engineer",
    icon: "☁️",
    description: "Infrastructure automation and scaling expert.",
    demand: "HIGH DEMAND",
    trend: 18,
    trendType: "up",
  },
  // ... 5 more roles
];

export default function Step1RoleSelection() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRoleLocal] = useState<string | null>(null);
  const { setSelectedRole, setStep } = useResumeBuilderStore();

  const filteredRoles = useMemo(
    () =>
      TRENDING_ROLES.filter((role) =>
        role.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const handleSelectRole = (role: string) => {
    setSelectedRoleLocal(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      setSelectedRole(selectedRole);
      setStep("step2");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Select Target Role</h2>
          <button onClick={() => setStep("closed")}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for any professional role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg"
          />
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleSelectRole(role.title)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedRole === role.title
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200"
              }`}
            >
              <div className="text-3xl mb-2">{role.icon}</div>
              <h3 className="font-bold text-left">{role.title}</h3>
              <p className="text-sm text-slate-600 text-left">{role.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-red-600">{role.demand}</span>
                <span className="text-sm font-bold text-red-600">
                  {role.trendType === "up" ? "+" : ""}{role.trend}% MoM
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => setStep("closed")}
            className="px-6 py-2 text-slate-700 border border-slate-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedRole}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Store Integration**:
- `setSelectedRole(role)`: Save user's role choice
- `setStep("step2")`: Navigate to highlights selection
- `setStep("closed")`: Cancel and exit flow

---

## 5. Step 2 - Highlights Selection

### Location: `components/resume/Step2HighlightsSelection.tsx`

```typescript
"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";

export default function Step2HighlightsSelection() {
  const [selected, setSelected] = useState({
    projects: [],
    education: [],
    skills: [],
  });

  const { setSelectedHighlights, setStep } = useResumeBuilderStore();

  const GITHUB_PROJECTS = [
    {
      name: "quantum-viz-engine",
      tag: "MAINTAINED",
      language: "TypeScript",
      stars: "1.2k",
      description: "Real-time data visualization library utilizing WebGL...",
    },
    // ... more projects
  ];

  const EDUCATION = [
    {
      institution: "STANFORD UNIVERSITY",
      course: "Advanced Machine Learning",
      grade: "A+",
      verified: true,
    },
    // ... more courses
  ];

  const SKILLS = [
    { name: "System Design", category: "ARCHITECTURE", icon: "🏗️" },
    { name: "AWS Solutions", category: "CLOUD", icon: "☁️" },
    { name: "GraphQL", category: "BACKEND", icon: "📊" },
  ];

  const handleGenerateResume = () => {
    setSelectedHighlights(selected);
    setStep("step3");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-sm font-bold text-blue-600 mb-1">STEP 02</p>
            <h2 className="text-3xl font-bold">Select Your Highlights</h2>
          </div>
          <button onClick={() => setStep("closed")}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* GitHub Projects */}
            <section>
              <h3 className="font-bold text-lg mb-4">GitHub Projects</h3>
              <div className="space-y-3">
                {GITHUB_PROJECTS.map((project) => (
                  <label key={project.name} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.projects.includes(project.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected({
                            ...selected,
                            projects: [...selected.projects, project.name],
                          });
                        } else {
                          setSelected({
                            ...selected,
                            projects: selected.projects.filter((p) => p !== project.name),
                          });
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold">{project.name}</h4>
                      <p className="text-sm text-slate-600">{project.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="font-bold text-lg mb-4">Education</h3>
              <div className="space-y-3">
                {EDUCATION.map((edu) => (
                  <label key={edu.course} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <h4 className="font-bold">{edu.institution}</h4>
                      <p>{edu.course}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h3 className="font-bold text-lg mb-4">Verified Skills</h3>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => {
                      if (selected.skills.includes(skill.name)) {
                        setSelected({
                          ...selected,
                          skills: selected.skills.filter((s) => s !== skill.name),
                        });
                      } else {
                        setSelected({
                          ...selected,
                          skills: [...selected.skills, skill.name],
                        });
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      selected.skills.includes(skill.name)
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200"
                    }`}
                  >
                    {skill.icon} {skill.name}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="bg-blue-600 text-white rounded-lg p-6 h-fit space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              👑 AI Assistant
            </h3>
            <p className="text-sm">
              I can analyze the job description you&apos;ve targeted and automatically select
              the most relevant projects and courses to maximize your match score.
            </p>
            <div className="bg-blue-700 rounded-lg p-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Auto-Selection Mode</span>
              </label>
            </div>
            <div className="bg-blue-700 rounded-lg p-4 space-y-2">
              <p className="text-sm font-bold">PREDICTED MATCH SCORE</p>
              <p className="text-3xl font-bold">94%</p>
              <p className="text-xs text-blue-100">+12% from base</p>
            </div>
            <button
              onClick={handleGenerateResume}
              className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Generate Resume ⚡
            </button>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-4 justify-between mt-8">
          <button
            onClick={() => setStep("step1")}
            className="px-6 py-2 border border-slate-300 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={handleGenerateResume}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Generate Resume →
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Store Integration**:
- `setSelectedHighlights(data)`: Save selections
- `setStep("step3")`: Navigate to editor
- `setStep("step1")`: Go back to role selection

---

## 6. Step 3 - Resume Editor

### Location: `components/resume/Step3Editor.tsx`

```typescript
"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import ResumePreview from "./ResumePreview";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";

export default function Step3Editor() {
  const { closeFlow } = useResumeBuilderStore();
  const [activeStep, setActiveStep] = useState(0);

  const EDITOR_STEPS = [
    { icon: "👤", label: "Personal Information", desc: "Name, Contact, LinkedIn & Portfolio" },
    { icon: "💼", label: "Professional Experience", desc: "4 Roles, 12 Achievements optimized" },
    { icon: "🎓", label: "Academic History", desc: "MSc Computer Science & Certifications" },
    { icon: "🎨", label: "Portfolio Projects", desc: "Cloud Architecture & Automation tools" },
  ];

  return (
    <div className="fixed inset-0 bg-[#f8fafc] flex">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-sm font-bold text-blue-600">STEP 03 • RESUME GENERATION</p>
          <button onClick={closeFlow} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* ATS Analytics */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold mb-4">ATS Match Score</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeDasharray={`${251.2 * 0.88} 251.2`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  88
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-1">Keyword Density</p>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-4/5"></div>
                  </div>
                  <p className="text-sm font-bold mt-1 text-blue-600">High</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Formatting Compatibility</p>
                  <p className="text-sm font-bold text-green-600">Optimal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Workflow */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
            <h3 className="font-bold">Editor Workflow</h3>
            {EDITOR_STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${
                  idx === activeStep
                    ? "bg-blue-50 border border-blue-300"
                    : "hover:bg-slate-50"
                }`}
              >
                <span className="text-2xl">{step.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-bold">{step.label}</p>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100">
              Save Version
            </button>
            <button
              onClick={closeFlow}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-7">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
```

**Store Integration**:
- `closeFlow()`: Exit flow and show original editor

---

## Usage Summary

| Component | Store Method | Purpose |
|-----------|--------------|---------|
| resume-builder/page.tsx | `openFlow()` | Auto-start flow |
| Step1RoleSelection | `setSelectedRole()` + `setStep("step2")` | Navigate after role selection |
| Step2HighlightsSelection | `setSelectedHighlights()` + `setStep("step3")` | Navigate after highlights |
| Step3Editor | `closeFlow()` | Exit flow and show editor |
| All Steps | `setStep("closed")` | Cancel button (exit flow) |

---

## Common Patterns

### To navigate to next step:
```typescript
const { setStep } = useResumeBuilderStore();
setStep("step2");
```

### To save data:
```typescript
const { setSelectedRole } = useResumeBuilderStore();
setSelectedRole("Senior DevOps Engineer");
```

### To close flow:
```typescript
const { closeFlow } = useResumeBuilderStore();
closeFlow();
```

### To read current step:
```typescript
const { step } = useResumeBuilderStore();
if (step === "step1") { /* ... */ }
```

---

## Build & Test Commands

```bash
# Build project
npm run build

# Run development server
npm run dev

# Navigate to
http://localhost:3000/dashboard/resume-builder
```
