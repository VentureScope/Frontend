import type { DataHubSourceStatus } from "@/lib/data-hub-utils";

const STEP_META = [
  {
    number: "01",
    title: "Connect Portal",
    description:
      "Link GitHub OAuth or upload a transcript via the Chrome extension.",
  },
  {
    number: "02",
    title: "Enrich profile",
    description:
      "Add your CV and skills so embeddings include experience and academics.",
  },
  {
    number: "03",
    title: "Unlock matching",
    description:
      "Connected data powers resumes, roadmaps, and VentureMatch scoring.",
  },
] as const;

type OnboardingStepsProps = {
  sources: DataHubSourceStatus[];
};

export default function OnboardingSteps({ sources }: OnboardingStepsProps) {
  const github = sources.find((s) => s.id === "github")?.status === "synced";
  const transcript =
    sources.find((s) => s.id === "transcript")?.status === "synced";
  const cv = sources.find((s) => s.id === "cv")?.status === "synced";
  const skills = sources.find((s) => s.id === "skills")?.status === "synced";

  const completed = [github || transcript, cv || skills, github && transcript && (cv || skills)];

  return (
    <section className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
      {STEP_META.map((step, index) => (
        <div
          key={step.number}
          className={`vs-surface group relative flex flex-col gap-6 p-10 transition-colors hover:border-primary/20 hover:bg-primary/[0.03] ${
            completed[index] ? "border-success/20" : ""
          }`}
        >
          <span className="text-5xl font-semibold tracking-tighter text-primary/10 transition-colors group-hover:text-primary/20">
            {step.number}
          </span>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-bold text-foreground">{step.title}</h4>
              {completed[index] ? (
                <span className="vs-badge vs-badge-success text-[10px]">
                  Done
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>

          <div className="absolute bottom-0 left-10 right-10 h-1 rounded-lg bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </section>
  );
}
