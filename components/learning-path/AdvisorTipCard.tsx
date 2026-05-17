import { Lightbulb } from "lucide-react";

export default function AdvisorTipCard() {
  return (
    <div className="relative h-72 overflow-hidden rounded-xl bg-foreground shadow-2xl sm:h-80">
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 pb-8 sm:p-10 sm:pb-12">
        <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/20 text-accent backdrop-blur-md">
          <Lightbulb className="h-5 w-5" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-background sm:text-xl">
          Pro Advisor Tip
        </h3>
        <p className="text-body italic leading-relaxed text-background/70">
          &ldquo;For Senior roles, recruiters prioritize system thinking over raw
          coding speed. Focus on how your models impact the bottom line.&rdquo;
        </p>
      </div>
    </div>
  );
}
