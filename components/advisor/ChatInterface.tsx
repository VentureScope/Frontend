"use client";

import {
  Bot,
  Paperclip,
  ArrowUp,
  Mic,
  FileText,
  Link2,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable Chat History */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-10">
        {/* Bot Message 1 */}
        <div className="flex gap-4 max-w-3xl">
          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl rounded-tl-none bg-blue-50/50 p-6 text-slate-700 leading-relaxed">
              Hello, David. I've analyzed your current career trajectory against
              the emerging tech landscape in{" "}
              <span className="font-bold text-blue-600">Addis Ababa</span>.
              Given your background in Full-Stack Development, you're in a
              strong position for Lead Engineer roles at local fintech startups.
              How can I help you today?
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700 border border-blue-100 w-fit">
              <FileText size={12} /> Source: LinkedIn Local Market Trends -
              Ethiopia Q3
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex justify-end gap-4">
          <div className="max-w-xl rounded-2xl rounded-tr-none bg-blue-600 p-6 text-white leading-relaxed shadow-lg shadow-blue-500/10">
            I want to target a Senior DevOps role at a multinational company.
            What are the specific gaps in my GitHub profile that I should
            address?
          </div>
          <div className="h-10 w-10 flex-shrink-0 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=David"
              alt="User"
            />
          </div>
        </div>

        {/* Bot Message 2 (Analysis Result) */}
        <div className="flex gap-4 max-w-3xl">
          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div className="w-full space-y-6">
            <div className="rounded-2xl rounded-tl-none bg-blue-50/50 p-8 border border-blue-100/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <Bot size={16} />
                </div>
                <h3 className="font-bold text-slate-900">
                  GitHub Analysis Results
                </h3>
              </div>

              <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                Based on your recent repository activity and common requirements
                for Senior DevOps roles at companies like Google and Safaricom:
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <XCircle
                    className="text-rose-500 mt-1 flex-shrink-0"
                    size={18}
                  />
                  <p className="text-sm font-bold text-slate-800 leading-snug">
                    Missing Infrastructure as Code (IaC): No public Terraform or
                    CloudFormation scripts found.
                  </p>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2
                    className="text-emerald-500 mt-1 flex-shrink-0"
                    size={18}
                  />
                  <p className="text-sm font-bold text-slate-800 leading-snug">
                    Strong CI/CD Patterns: Your "Nexus-Flow" repo shows
                    excellent GitHub Actions proficiency.
                  </p>
                </div>
              </div>

              {/* Grounding Sources */}
              <div className="mt-10 pt-8 border-t border-blue-100/50 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Grounding Sources (3):
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[11px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50">
                    <Link2 size={14} /> github.com/d-alemu/nexus-flow
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[11px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50">
                    <FileText size={14} /> Job_Desc_Senior_DevOps_Safaricom.pdf
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input Area */}
      <div className="p-6 lg:p-10 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 p-2">
            <Paperclip size={22} />
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask your advisor anything about your career journey..."
              className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 pr-14 text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <button className="absolute right-2 top-2 h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <ArrowUp size={20} />
            </button>
          </div>

          <button className="text-slate-400 hover:text-slate-600 p-2">
            <Mic size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
