import { create } from "zustand";

export type ResomeBuilderStep = "closed" | "step1" | "step2" | "step3";

interface SelectedHighlights {
  githubProjects: string[];
  education: string[];
  skills: string[];
}

interface ResumeBuilderState {
  step: ResomeBuilderStep;
  selectedRole: string | null;
  selectedHighlights: SelectedHighlights;

  // Actions
  openFlow: () => void;
  closeFlow: () => void;
  setStep: (step: ResomeBuilderStep) => void;
  setSelectedRole: (role: string) => void;
  setSelectedHighlights: (highlights: SelectedHighlights) => void;
  resetFlow: () => void;
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  step: "closed",
  selectedRole: null,
  selectedHighlights: {
    githubProjects: [],
    education: [],
    skills: [],
  },

  openFlow: () => set({ step: "step1" }),
  closeFlow: () => set({ step: "closed" }),
  setStep: (step) => set({ step }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  setSelectedHighlights: (highlights) =>
    set({ selectedHighlights: highlights }),
  resetFlow: () =>
    set({
      step: "closed",
      selectedRole: null,
      selectedHighlights: { githubProjects: [], education: [], skills: [] },
    }),
}));
