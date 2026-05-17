import ReadinessCard from "./ReadinessCard";

export default function RoadmapHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="space-y-2">
        <p className="text-label text-primary">Personalized Growth</p>
        <h1 className="text-h1 text-foreground">Adaptive Career Roadmap</h1>
        <p className="max-w-xl text-body text-muted-foreground">
          Precision-engineered path toward{" "}
          <span className="font-semibold text-foreground underline decoration-border underline-offset-4">
            Senior Data Scientist
          </span>{" "}
          at Tier-1 Tech.
        </p>
      </div>
      <ReadinessCard />
    </div>
  );
}
