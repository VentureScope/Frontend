"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Layers,
  Settings2,
  Download,
  ArrowLeft,
  X,
  BarChart3,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import ResumePreview from "./ResumePreview";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";
import { generateResume } from "@/lib/resume-api";
import { generatedResumeToListingResume } from "@/lib/map-generated-resume-to-ui";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { mockResumes } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { toast } from "sonner";

interface WorkflowItem {
  id: string;
  icon: ReactNode;
  label: string;
  completed: boolean;
}

const WORKFLOW_ITEMS: WorkflowItem[] = [
  {
    id: "personal",
    icon: <User size={20} />,
    label: "Personal Information",
    completed: true,
  },
  {
    id: "experience",
    icon: <Briefcase size={20} />,
    label: "Professional Experience",
    completed: true,
  },
  {
    id: "education",
    icon: <GraduationCap size={20} />,
    label: "Academic History",
    completed: false,
  },
  {
    id: "projects",
    icon: <Layers size={20} />,
    label: "Portfolio Projects",
    completed: false,
  },
];

export default function Step3Editor() {
  const { selectedRole, setStep, closeFlow } = useResumeBuilderStore();
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);
  const [genLoading, setGenLoading] = useState(true);

  useEffect(() => {
    if (!selectedRole) {
      setPreviewResume(mockResumes[0]);
      setGenLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setGenLoading(true);
      try {
        const out = await generateResume(selectedRole);
        if (!cancelled) {
          setPreviewResume(generatedResumeToListingResume(out));
        }
      } catch {
        if (!cancelled) {
          toast.error("Could not generate resume from API.");
          setPreviewResume(mockResumes[0]);
        }
      } finally {
        if (!cancelled) {
          setGenLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedRole]);

  return (
    <div className="flex flex-col bg-muted rounded-3xl border border-border overflow-hidden h-[calc(100vh-150px)] min-h-[600px]">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep("step2")}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Back to highlights"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Resume Editor
              </h1>
              <p className="text-sm text-muted-foreground">{selectedRole}</p>
            </div>
          </div>
          <button
            onClick={() => closeFlow()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-[600px] overflow-hidden">
        {/* Left Sidebar: ATS Analysis & Workflow */}
        <div className="w-full sm:w-72 lg:w-80 border-r border-border overflow-y-auto bg-card p-6">
          {/* ATS Analysis Section */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              AI Analysis
            </p>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-card rounded-full border-4 border-primary flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-primary">88</span>
                </div>
                <p className="text-sm font-bold text-foreground mb-3">
                  ATS Match Score
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your profile ranks in the top 5% for Senior DevOps positions
                  in North America.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-muted-foreground">
                      Keyword Density
                    </label>
                    <span className="text-xs font-bold text-primary">
                      High
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-muted-foreground">
                      Formatting Compatibility
                    </label>
                    <span className="text-xs font-bold text-primary">
                      Optimal
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Workflow */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Editor Workflow
            </p>
            <div className="space-y-3">
              {WORKFLOW_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 p-4 bg-muted hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <div
                    className={`flex-shrink-0 ${
                      item.completed ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.completed ? <CheckCircle2 size={20} /> : item.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.completed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.completed && (
                    <span className="ml-auto text-xs text-primary font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Resume Preview */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            {genLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm font-medium">
                  Generating your resume…
                </p>
              </div>
            ) : (
              <ResumePreview resume={previewResume ?? mockResumes[0]} />
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => setShowExportSettings(!showExportSettings)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>

            {/* Export Settings */}
            {showExportSettings && (
              <div className="mt-6 p-6 bg-primary/10 rounded-2xl border border-primary/30">
                <h3 className="font-bold text-foreground mb-4">
                  Export Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="export"
                      defaultChecked
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      PDF (ATS Optimized)
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="export"
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      Interactive Portfolio
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
