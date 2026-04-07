import ChatInterface from "@/components/advisor/ChatInterface";
import AdvisorSidebar from "@/components/advisor/AdvisorSideBar";
import { Menu } from "lucide-react";

export default function AdvisorPage() {
  return (
    <div className="flex h-[calc(100dvh-5rem)] overflow-hidden bg-slate-50/50 lg:h-[calc(100dvh-9rem)] relative">
      {/* Mobile Sidebar Toggle - Hidden on desktop */}
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />
      <label
        htmlFor="sidebar-toggle"
        className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50 text-slate-600"
      >
        <Menu size={20} />
      </label>

      {/* Overlay for mobile when sidebar is open */}
      <label
        htmlFor="sidebar-toggle"
        className="hidden peer-checked:block lg:peer-checked:hidden absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-30"
      ></label>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col min-w-0 bg-white border-t border-slate-200 rounded-none lg:rounded-tr-2xl shadow-sm relative z-10 w-full pt-14 lg:pt-0">
        <ChatInterface />
      </section>

      {/* Analytics Sidebar - Responsive toggling */}
      <aside className="absolute right-0 lg:relative w-[280px] sm:w-[320px] xl:w-[400px] h-full transform translate-x-full peer-checked:translate-x-0 lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col border-l border-t border-slate-200 bg-white/90 lg:bg-white/80 p-6 sm:p-8 overflow-y-auto custom-scrollbar shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] lg:shadow-sm z-40 backdrop-blur-2xl">
        <label
          htmlFor="sidebar-toggle"
          className="lg:hidden absolute top-4 left-4 text-slate-400 hover:text-slate-600 cursor-pointer p-2"
        >
          X
        </label>
        <AdvisorSidebar />
      </aside>
    </div>
  );
}
