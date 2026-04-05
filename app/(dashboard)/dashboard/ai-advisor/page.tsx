import ChatInterface from "@/components/advisor/ChatInterface";
import AdvisorSidebar from "@/components/advisor/AdvisorSideBar";

export default function AdvisorPage() {
  return (
    <div className="flex h-[calc(100dvh-8rem)] overflow-hidden bg-slate-50/30 lg:h-[calc(100dvh-9rem)]">
      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col min-w-0 bg-white lg:rounded-tl-[40px] border-l border-t border-slate-100">
        <ChatInterface />
      </section>

      {/* Analytics Sidebar */}
      <aside className="hidden xl:flex w-[400px] flex-col border-l border-t border-slate-100 bg-white p-8 overflow-y-auto">
        <AdvisorSidebar />
      </aside>
    </div>
  );
}
