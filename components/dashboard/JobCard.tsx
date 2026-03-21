import { Briefcase } from "lucide-react";

export default function JobCard() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center hover:shadow-md transition">

      <div className="flex items-center gap-3">
        <Briefcase size={20} className="text-blue-600" />

        <div>
          <h3 className="font-semibold">Backend Engineer</h3>
          <p className="text-sm text-gray-500">Google • Remote</p>
        </div>
      </div>

      <span className="text-green-600 font-medium">
        90%
      </span>
    </div>
  );
}