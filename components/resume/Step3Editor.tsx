"use client";

import { useState } from "react";
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
} from "lucide-react";
import ResumePreview from "./ResumePreview";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";

interface WorkflowItem {
  id: string;
  icon: React.ReactNode;
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

  return (
    <div className="flex flex-col bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden h-[calc(100vh-150px)] min-h-[600px]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep("step2")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Back to highlights"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Resume Editor
              </h1>
              <p className="text-sm text-slate-500">{selectedRole}</p>
            </div>
          </div>
          <button
            onClick={() => closeFlow()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-[600px] overflow-hidden">
        {/* Left Sidebar: ATS Analysis & Workflow */}
        <div className="w-full sm:w-72 lg:w-80 border-r border-slate-100 overflow-y-auto bg-white p-6">
          {/* ATS Analysis Section */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              AI Analysis
            </p>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-white rounded-full border-4 border-blue-600 flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-blue-600">88</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mb-3">
                  ATS Match Score
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your profile ranks in the top 5% for Senior DevOps positions
                  in North America.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">
                      Keyword Density
                    </label>
                    <span className="text-xs font-bold text-blue-600">
                      High
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">
                      Formatting Compatibility
                    </label>
                    <span className="text-xs font-bold text-blue-600">
                      Optimal
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Workflow */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              Editor Workflow
            </p>
            <div className="space-y-3">
              {WORKFLOW_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
                >
                  <div
                    className={`flex-shrink-0 ${
                      item.completed ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {item.completed ? <CheckCircle2 size={20} /> : item.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.completed ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.completed && (
                    <span className="ml-auto text-xs text-blue-600 font-bold">
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
            <ResumePreview />

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
              <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-slate-900 mb-4">
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
                    <span className="text-sm font-medium text-slate-700">
                      PDF (ATS Optimized)
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="export"
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
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
