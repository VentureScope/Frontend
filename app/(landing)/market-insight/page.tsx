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
      <section className="mx-auto max-w-7xl px-6 pt-16 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
              Ethiopia Tech Report 2024
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">
              Market Insights
            </h1>
            <p className="max-w-xl text-lg text-slate-500 leading-relaxed">
              Real-time intelligence on the evolving digital economy in Addis
              Ababa and beyond. We track human capital, fiscal trends, and
              emerging skill ecosystems.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
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
      <section className="mx-auto max-w-7xl px-6 mt-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Emerging Skill Demand */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-10 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900">
                Emerging Skill Demand
              </h2>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest">
                LIVE FEED
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-20">
              Quarterly growth in job postings by core competency
            </p>

            <div className="grid grid-cols-5 gap-4">
              {[
                { name: "Python", grow: "+24%" },
                { name: "Cloud", grow: "+18%" },
                { name: "AI/ML", grow: "+42%" },
                { name: "React", grow: "+12%" },
                { name: "FinTech", grow: "+9%" },
              ].map((s, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-xs font-bold text-slate-800">{s.name}</p>
                  <p className="text-xs font-bold text-blue-600">{s.grow}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Forecast Card */}
          <div className="rounded-3xl bg-[#1d59db] p-10 text-white relative overflow-hidden flex flex-col justify-between">
            <TrendingUp className="absolute right-[-20px] top-[-20px] h-48 w-48 text-white/10 rotate-12" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Market Forecast</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Projected 32% growth in Ethiopia's IT sector outsourcing for
                2025.
              </p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-1">$450M+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                Estimated Local Value
              </p>
            </div>
            <Button className="w-full bg-white text-blue-700 font-bold hover:bg-blue-50 mt-8 py-6 rounded-xl">
              Unlock Full Report
            </Button>
          </div>
        </div>
      </section>

      {/* SECOND GRID */}
      <section className="mx-auto max-w-7xl px-6 mt-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Top Hiring Hubs */}
          <div className="lg:col-span-2 rounded-3xl bg-blue-50/50 p-10 border border-blue-100">
            <h2 className="text-xl font-bold text-slate-900 mb-8">
              Top Hiring Hubs
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "Bole District",
                  sub: "Tech & Logistics Focus",
                  pct: "42%",
                },
                { name: "Kazanchis", sub: "FinTech & NGO Core", pct: "28%" },
                {
                  name: "Lideta (ICT Park)",
                  sub: "Infrastructure & Data",
                  pct: "15%",
                },
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {h.name}
                      </p>
                      <p className="text-xs text-slate-500">{h.sub}</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-600">{h.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Benchmarks */}
          <div className="lg:col-span-3 rounded-3xl bg-white p-10 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Salary Benchmarks
            </h2>
            <p className="text-sm text-slate-500 mb-8 mt-2">
              Monthly gross averages in ETB for Mid-Senior levels
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  role: "Software Engineer",
                  sal: "85k - 140k",
                  border: "border-l-blue-600",
                },
                {
                  role: "AI Specialist",
                  sal: "120k - 210k",
                  border: "border-l-rose-500",
                },
                {
                  role: "DevOps Architect",
                  sal: "95k - 160k",
                  border: "border-l-indigo-600",
                },
                {
                  role: "Data Scientist",
                  sal: "80k - 135k",
                  border: "border-l-slate-400",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl bg-slate-50/50 border-l-4 ${b.border}`}
                >
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    {b.role}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {b.sal}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      ETB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mx-auto max-w-7xl px-6 mt-16 lg:px-8">
        <div className="rounded-[40px] bg-gradient-to-b from-slate-50 to-white border border-slate-100 p-12 lg:p-24 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl font-bold text-slate-900 max-w-2xl mx-auto sm:text-5xl leading-tight">
              Ready for deeper intelligence?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Get custom market maps, predictive career pathing, and direct
              connections to top-tier Ethiopian tech firms.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="h-14 px-10 rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
                Sign Up for Personalized Insights
              </Button>
              <Button
                variant="outline"
                className="h-14 px-10 rounded-xl border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50"
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
