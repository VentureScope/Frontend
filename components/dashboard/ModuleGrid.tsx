import { BookOpen, HelpCircle, FileText, Send } from "lucide-react";

export default function ModuleGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      <div className="vs-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="vs-icon-tile vs-icon-tile-primary p-2.5 sm:p-3">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-label text-primary">Active Module</span>
        </div>
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">
            Advanced ARIMA Modeling
          </h3>
          <p className="text-body text-muted-foreground">
            Mastering Time Series Analysis
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-label text-muted-foreground">
            <span>Progress</span>
            <span>62%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[62%] rounded-full bg-primary/80" />
          </div>
        </div>
      </div>

      <div className="vs-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="vs-icon-tile vs-icon-tile-accent p-2.5 sm:p-3">
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="vs-badge vs-badge-success">Online</span>
        </div>
        <h3 className="mb-4 text-lg font-semibold text-foreground sm:mb-6 sm:text-xl">
          Ask your advisor anything
        </h3>
        <div className="relative">
          <input
            placeholder="How can I negotiate my salary?"
            className="text-body w-full rounded-md border border-border bg-muted py-3.5 pr-12 pl-4 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/35 focus:ring-1 focus:ring-primary/20 sm:py-4"
          />
          <Send className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 cursor-pointer text-primary sm:right-5" />
        </div>
      </div>

      <div className="vs-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="vs-icon-tile vs-icon-tile-secondary p-2.5 sm:p-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="text-right">
            <p className="text-label text-muted-foreground">ATS Match</p>
            <p className="text-lg font-semibold text-secondary sm:text-xl">92%</p>
          </div>
        </div>
        <h3 className="mb-6 text-lg font-semibold text-foreground sm:mb-8 sm:text-xl">
          Resume Version 4.2
        </h3>
        <button
          type="button"
          className="text-btn w-full rounded-md border border-border bg-muted py-3 font-medium text-foreground transition-colors hover:bg-muted/80 sm:py-3.5"
        >
          Build New Resume
        </button>
      </div>
    </div>
  );
}

