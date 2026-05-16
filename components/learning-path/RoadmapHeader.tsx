import ReadinessCard from "./ReadinessCard";

export default function RoadmapHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Personalized Growth
        </p>
        <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
          Adaptive Career Roadmap
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Precision-engineered path toward{" "}
          <span className="font-bold text-foreground underline decoration-border underline-offset-4">
            Senior Data Scientist
          </span>{" "}
          at Tier-1 Tech.
        </p>
      </div>

      {/* Circular Readiness Badge */}
      <ReadinessCard />
    </div>
  );
}
