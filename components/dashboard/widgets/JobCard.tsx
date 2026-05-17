import { Briefcase } from "lucide-react";

export default function JobCard() {
  return (
    <div className="bg-card p-4 rounded-xl shadow-sm border flex justify-between items-center hover:shadow-md transition">

      <div className="flex items-center gap-3">
        <Briefcase size={20} className="text-primary" />

        <div>
          <h3 className="font-semibold">Backend Engineer</h3>
          <p className="text-sm text-muted-foreground">Google • Remote</p>
        </div>
      </div>

      <span className="font-medium text-success">90%</span>
    </div>
  );
}