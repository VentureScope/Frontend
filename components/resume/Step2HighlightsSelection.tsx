"use client";

import { useState } from "react";
import { ChevronRight, X, Zap } from "lucide-react";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";
import { GITHUB_PROJECTS, EDUCATION, SKILLS, Highlight } from "@/app/(dashboard)/dashboard/resume-builder/mockData";

export default function Step2HighlightsSelection() {
  const [githubProjects, setGithubProjects] = useState(GITHUB_PROJECTS);
  const [education, setEducation] = useState(EDUCATION);
  const [skills, setSkills] = useState(SKILLS);
  const { setSelectedHighlights, setStep, closeFlow, selectedRole } =
    useResumeBuilderStore();

  const toggleProject = (id: string) => {
    setGithubProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)),
    );
  };

  const toggleEducation = (id: string) => {
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e)),
    );
  };

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)),
    );
  };

  const handleGenerateResume = () => {
    setSelectedHighlights({
      githubProjects: githubProjects.filter((p) => p.selected).map((p) => p.id),
      education: education.filter((e) => e.selected).map((e) => e.id),
      skills: skills.filter((s) => s.selected).map((s) => s.id),
    });
    setStep("step3");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-8 sm:px-8 flex items-start gap-4 rounded-t-3xl z-10">
          <button
            onClick={() => setStep("step1")}
            className="flex-shrink-0 mt-1 p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <span className="sr-only">Go back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-600"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Step 02
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Select Your Highlights
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Curate the most impactful data points from your digital footprint
              to construct a high-conversion professional profile tailored for
              your next move.
            </p>
          </div>
          <button
            onClick={() => closeFlow()}
            className="flex-shrink-0 mt-1 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-8 sm:px-8">
          {/* Left Column: Integrated Data */}
          <div className="lg:col-span-2 space-y-8">
            {/* GitHub Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-1">
                    <span className="inline-block text-lg">📁</span>
                    Your Integrated Data
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-50 w-fit px-2 py-1 rounded">
                    LIVE SYNC: ACTIVE
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4">
                    GitHub Projects
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Showcase your technical depth and contributions.
                  </p>
                  <div className="space-y-3">
                    {githubProjects.map((project) => (
                      <label
                        key={project.id}
                        className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={project.selected}
                          onChange={() => toggleProject(project.id)}
                          className="mt-1 w-5 h-5 accent-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-bold text-slate-900">
                            {project.title}
                          </h5>
                          <p className="text-sm text-slate-600 mt-1">
                            {project.description}
                          </p>
                          {project.tags.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">
                    eStudent Records
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Academic excellence and verified course completions.
                  </p>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <label
                        key={edu.id}
                        className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={edu.selected}
                          onChange={() => toggleEducation(edu.id)}
                          className="mt-1 w-5 h-5 accent-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-bold text-slate-900">
                            {edu.title}
                          </h5>
                          <p className="text-sm text-slate-600 mt-1">
                            {edu.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900">
                      Verified Skills
                    </h4>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      Manage Skills
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {skills.map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={`p-3 text-center rounded-lg border-2 transition-all ${
                          skill.selected
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        {skill.selected && (
                          <div className="flex justify-center mb-1">
                            <span className="inline-block w-4 h-4 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
                              ✓
                            </span>
                          </div>
                        )}
                        <p className="text-xs font-bold text-slate-900">
                          {skill.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {skill.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Assistant */}
          <div className="lg:col-span-1">
            <div className="sticky top-[120px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold">AI Assistant</h3>
              </div>

              <p className="text-sm leading-relaxed mb-6">
                I can analyze the job description you&apos;ve targeted and
                automatically select the most relevant projects and courses to
                maximize your match score.
              </p>

              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm font-medium">
                    Auto-Selection Mode
                  </label>
                </div>
                <p className="text-xs text-blue-100 mt-2">
                  RECOMMENDATION ENGINE OPTIMIZED FOR FAANG STANDARDS
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-xs font-bold text-blue-100 mb-2">
                  PREDICTED MATCH SCORE
                </p>
                <p className="text-4xl font-black">94%</p>
                <p className="text-xs text-blue-100 mt-1">+12% from base</p>
              </div>

              <button
                onClick={handleGenerateResume}
                className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Generate Resume
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-6 sm:px-8 flex items-center justify-between gap-4">
          <button
            onClick={() => closeFlow()}
            className="px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
