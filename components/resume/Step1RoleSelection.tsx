"use client";

import { useState } from "react";
import { Search, TrendingUp, TrendingDown, X } from "lucide-react";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: string;
  demand: "HIGH DEMAND" | "STABLE" | "EMERGING";
  demandColor: string;
  trend: number;
  trendDirection: "up" | "down" | "stable";
}

const TRENDING_ROLES: Role[] = [
  {
    id: "senior-devops",
    title: "Senior DevOps Engineer",
    description: "Infrastructure automation and scaling expert.",
    icon: "☁️",
    demand: "HIGH DEMAND",
    demandColor: "bg-red-100 text-red-700",
    trend: 18,
    trendDirection: "up",
  },
  {
    id: "fullstack-dev",
    title: "Fullstack Developer",
    description: "Versatile architect across front-end and back-end.",
    icon: "</> ",
    demand: "STABLE",
    demandColor: "bg-blue-100 text-blue-700",
    trend: 2.4,
    trendDirection: "up",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "ML modeling and predictive analytics leader.",
    icon: "📊",
    demand: "HIGH DEMAND",
    demandColor: "bg-red-100 text-red-700",
    trend: 12,
    trendDirection: "up",
  },
  {
    id: "ai-research",
    title: "AI Research Lead",
    description: "Pioneering LLM and generative AI strategy.",
    icon: "🧠",
    demand: "EMERGING",
    demandColor: "bg-purple-100 text-purple-700",
    trend: 45,
    trendDirection: "up",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    description: "Expert in UX strategy and visual design systems.",
    icon: "🎨",
    demand: "STABLE",
    demandColor: "bg-blue-100 text-blue-700",
    trend: 0.8,
    trendDirection: "up",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    description: "Protecting enterprise assets from threats.",
    icon: "🛡️",
    demand: "HIGH DEMAND",
    demandColor: "bg-red-100 text-red-700",
    trend: 22,
    trendDirection: "up",
  },
];

export default function Step1RoleSelection() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSelectedRole, setStep, closeFlow } = useResumeBuilderStore();

  const filteredRoles = TRENDING_ROLES.filter(
    (role) =>
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role.title);
    setStep("step2");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-8 sm:px-8 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Step 1 of 4
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Select Target Role
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              To build a high-performance resume, we first need to define your
              target. This allows VentureScope to curate relevant market
              keywords and demand signals.
            </p>
          </div>
          <button
            onClick={() => closeFlow()}
            className="flex-shrink-0 mt-1 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-6 sm:px-8 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for any professional role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Roles Grid */}
        <div className="px-6 py-8 sm:px-8">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="inline-block">Trending Roles</span>
            <span className="text-xs font-bold text-red-600">
              Real-time Market Data
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role)}
                className="text-left p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-blue-50 hover:to-slate-100 border border-slate-200 hover:border-blue-300 rounded-2xl transition-all hover:shadow-md active:scale-98"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{role.icon}</div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${role.demandColor}`}
                  >
                    {role.demand}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {role.title}
                </h4>
                <p className="text-sm text-slate-600 mb-4">{role.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Demand Trend
                  </span>
                  <div className="flex items-center gap-1">
                    {role.trendDirection === "up" ? (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-slate-400" />
                    )}
                    <span
                      className={`font-bold text-sm ${
                        role.trendDirection === "up"
                          ? "text-red-600"
                          : "text-slate-400"
                      }`}
                    >
                      {role.trendDirection === "up" ? "+" : ""}
                      {role.trend}% MoM
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No roles found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-6 sm:px-8 flex gap-4 justify-between">
          <button
            onClick={() => closeFlow()}
            className="px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
