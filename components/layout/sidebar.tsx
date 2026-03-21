import { LayoutDashboard, BarChart3, Brain, TrendingUp } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r px-6 py-6 flex flex-col justify-between">

      {/* LOGO */}
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="font-semibold text-lg">VentureScope</span>
        </div>

        {/* NAV */}
        <nav className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-100 text-blue-600 font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </div>

          <div className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <BarChart3 size={18} />
            Skill Gap
          </div>

          <div className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <TrendingUp size={18} />
            Market Trends
          </div>

          <div className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Brain size={18} />
            AI Advisor
          </div>
        </nav>
      </div>

      {/* USER */}
      <div className="text-sm text-gray-500">
        Marcus Chen
      </div>
    </div>
  );
}