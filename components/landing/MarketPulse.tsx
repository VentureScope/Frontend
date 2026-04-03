import { BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketPulse() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Ethiopia Tech Market Pulse
            </h2>
            <p className="text-slate-500">
              Real-time intelligence from our ecosystem trackers. Data refreshed
              every 24 hours.
            </p>
          </div>
          <Button className="bg-blue-600 rounded-full px-6 font-bold">
            Detailed Trends <Activity className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Skill Demand Card */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">
                Emerging Skill Demand
              </h3>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                Live Data
              </span>
            </div>
            <div className="space-y-6">
              {[
                {
                  name: "Python & AI Implementation",
                  val: "75%",
                  color: "bg-blue-800",
                  inc: "+28%",
                },
                {
                  name: "Cloud Architecture (AWS/Azure)",
                  val: "45%",
                  color: "bg-blue-400",
                  inc: "+14%",
                },
                {
                  name: "FinTech & Blockchain",
                  val: "85%",
                  color: "bg-rose-500",
                  inc: "+42%",
                },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-tight">
                    <span>{s.name}</span>
                    <span className="text-blue-600">{s.inc}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full ${s.color}`}
                      style={{ width: s.val }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Hubs Card */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <h3 className="mb-8 font-bold text-slate-900">Top Hiring Hubs</h3>
            <div className="space-y-6">
              {[
                {
                  name: "Safaricom ET",
                  sub: "42 Openings",
                  init: "S",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  name: "Ethio Telecom",
                  sub: "18 Openings",
                  init: "E",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  name: "Chapa Financials",
                  sub: "12 Openings",
                  init: "C",
                  color: "bg-emerald-100 text-emerald-600",
                },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${h.color}`}
                  >
                    {h.init}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-none mb-1">
                      {h.name}
                    </p>
                    <p className="text-xs text-slate-500">{h.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Score Card */}
          <div className="flex flex-col justify-between rounded-2xl bg-blue-700 p-8 text-white shadow-xl shadow-blue-200">
            <BarChart3 className="h-8 w-8 text-blue-200" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-100">
                Avg. Match Score
              </p>
              <h4 className="text-6xl font-bold">64%</h4>
              <p className="text-xs text-blue-200/80 leading-relaxed pt-2">
                Local talent readiness index vs. industry needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
