import ChatInterface from "@/components/advisor/ChatInterface";
import AdvisorSidebar from "@/components/advisor/AdvisorSideBar";
import { Menu } from "lucide-react";

export default function AdvisorPage() {
  return (
    <div className="flex h-[calc(100dvh-5rem)] overflow-hidden bg-muted/50 lg:h-[calc(100dvh-9rem)] relative">
      {/* Mobile Sidebar Toggle - Hidden on desktop */}
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />
      <label
        htmlFor="sidebar-toggle"
        className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-card rounded-lg shadow-sm border border-border cursor-pointer hover:bg-muted text-muted-foreground"
      >
        <Menu size={20} />
      </label>

      {/* Overlay for mobile when sidebar is open */}
      <label
        htmlFor="sidebar-toggle"
        className="absolute inset-0 z-30 hidden bg-foreground/20 backdrop-blur-sm peer-checked:block lg:peer-checked:hidden"
      ></label>

      {/* Main Chat Area */}
      <section className="relative z-10 flex min-w-0 w-full flex-1 flex-col rounded-none border-t border-border/60 bg-card pt-14 shadow-sm lg:rounded-tr-lg lg:pt-0">
        <ChatInterface />
      </section>

      {/* Analytics Sidebar - Responsive toggling */}
      <aside className="absolute right-0 lg:relative w-70 sm:w-[320px] xl:w-100 h-full transform translate-x-full peer-checked:translate-x-0 lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col border-l border-t border-border bg-card/90 lg:bg-card/80 p-6 sm:p-8 overflow-y-auto custom-scrollbar shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] lg:shadow-sm z-40 backdrop-blur-2xl">
        <label
          htmlFor="sidebar-toggle"
          className="lg:hidden absolute top-4 left-4 text-muted-foreground hover:text-muted-foreground cursor-pointer p-2"
        >
          X
        </label>
        <AdvisorSidebar />
      </aside>
    </div>
  );
}
