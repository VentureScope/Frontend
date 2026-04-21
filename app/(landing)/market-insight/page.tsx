import {
  RefreshCw,
  MapPin,
  TrendingUp,
  Lock,
  FileText,
  Globe,
  MessageSquare,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketInsightsPage() {
  return (
    <div className="bg-slate-50/50 pb-24">
      {/* HEADER SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-16 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:gap-8 md:flex-row md:items-end">
          <div className="space-y-3 sm:space-y-4 text-center md:text-left">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
              Ethiopia Tech Report 2024
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Market Insights
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-base sm:text-lg text-slate-500 leading-relaxed">
              Real-time intelligence on the evolving digital economy in Addis
              Ababa and beyond. We track human capital, fiscal trends, and
              emerging skill ecosystems.
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Last Updated
              </p>
              <p className="font-bold text-slate-900">12 Minutes Ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 sm:mt-12 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Emerging Skill Demand */}
          <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-2 gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Emerging Skill Demand
              </h2>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest shrink-0">
                LIVE FEED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">
              Quarterly growth in job postings by core competency
            </p>

            <div className="space-y-6">
              {[
                { name: "Python", growth: 24, color: "bg-blue-600" },
                { name: "Cloud", growth: 18, color: "bg-sky-500" },
                { name: "AI/ML", growth: 42, color: "bg-indigo-600" },
                { name: "React", growth: 12, color: "bg-cyan-500" },
                { name: "FinTech", growth: 9, color: "bg-blue-400" },
              ].map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {skill.name}
                    </span>
                    <span className="text-blue-600 font-bold">
                      +{skill.growth}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${skill.color} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${skill.growth}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Forecast Card */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#1d59db] p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-75 sm:min-h-0">
            <TrendingUp className="absolute -right-5 -top-5 h-32 w-32 sm:h-48 sm:w-48 text-white/10 rotate-12" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-lg sm:text-xl font-bold">Market Forecast</h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-[80%]">
                Projected 32% growth in Ethiopia's IT sector outsourcing for
                2025.
              </p>
            </div>
            <div className="relative z-10 mt-6 sm:mt-0">
              <p className="text-4xl sm:text-5xl font-bold mb-1">$450M+</p>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-200">
                Estimated Local Value
              </p>
            </div>
            <Button className="w-full bg-white text-blue-700 font-bold hover:bg-blue-50 mt-6 sm:mt-8 py-5 sm:py-6 rounded-xl relative z-10">
              Unlock Full Report
            </Button>
          </div>
        </div>
      </section>

      {/* SECOND GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-6 sm:mt-8 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-5">
          {/* Top Hiring Hubs */}
          <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-blue-50/50 p-6 sm:p-8 lg:p-10 border border-blue-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 sm:mb-8">
              Top Hiring Hubs
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  name: "Bole District",
                  sub: "Tech & Logistics Focus",
                  pct: "42%",
                  value: 42,
                },
                {
                  name: "Kazanchis",
                  sub: "FinTech & NGO Core",
                  pct: "28%",
                  value: 28,
                },
                {
                  name: "Lideta (ICT Park)",
                  sub: "Infrastructure & Data",
                  pct: "15%",
                  value: 15,
                },
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 gap-3 sm:gap-2"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 flex shrink-0 items-center justify-center rounded-full bg-slate-50">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        {h.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500">
                        {h.sub}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 ml-10 sm:ml-0">
                    <div className="w-12 sm:w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${h.value}%` }}
                      />
                    </div>
                    <span className="font-bold text-blue-600 text-xs sm:text-sm w-10 text-right">
                      {h.pct}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Benchmarks */}
          <div className="lg:col-span-3 rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Salary Benchmarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 mt-1 sm:mt-2">
              Monthly gross averages in ETB for Mid-Senior levels
            </p>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {[
                {
                  role: "Software Engineer",
                  sal: "85k - 140k",
                  border: "border-l-blue-600",
                  min: 85,
                  max: 140,
                },
                {
                  role: "AI Specialist",
                  sal: "120k - 210k",
                  border: "border-l-rose-500",
                  min: 120,
                  max: 210,
                },
                {
                  role: "DevOps Architect",
                  sal: "95k - 160k",
                  border: "border-l-indigo-600",
                  min: 95,
                  max: 160,
                },
                {
                  role: "Data Scientist",
                  sal: "80k - 135k",
                  border: "border-l-slate-400",
                  min: 80,
                  max: 135,
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl bg-slate-50/50 border-l-4 ${b.border}`}
                >
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    {b.role}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {b.sal}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      ETB
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-200 text-xs">
                      <div
                        style={{ width: `${(b.min / 250) * 100}%` }}
                        className="flex flex-col justify-center overflow-hidden bg-blue-500 shadow-none"
                      />
                      <div
                        style={{ width: `${((b.max - b.min) / 250) * 100}%` }}
                        className="flex flex-col justify-center overflow-hidden bg-blue-300 shadow-none"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>{b.min}k</span>
                      <span>{b.max}k</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 sm:mt-16 lg:px-8">
        <div className="rounded-3xl sm:rounded-[40px] bg-linear-to-b from-slate-50 to-white border border-slate-100 p-8 sm:p-12 lg:p-24 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 space-y-6 sm:space-y-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 max-w-2xl mx-auto leading-tight">
              Ready for deeper intelligence?
            </h2>
            <p className="text-slate-500 text-sm sm:text-lg max-w-xl mx-auto">
              Get custom market maps, predictive career pathing, and direct
              connections to top-tier Ethiopian tech firms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
              <Button className="h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-10 rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
                Sign Up for Personalized Insights
              </Button>
              <Button
                variant="outline"
                className="h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-10 rounded-xl border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50"
              >
                Download Sample Report
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
