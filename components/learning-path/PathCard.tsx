import {
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import ResourceItem from "./ResourceItem";

export const PathCard = ({ path, isExpanded, onToggleExpand, onViewDetails }: any) => {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between p-6 sm:p-8 cursor-pointer" onClick={() => onToggleExpand(path.id)}>
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            {path.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors" onClick={(e) => { e.stopPropagation(); onViewDetails(path.id); }}>{path.title}</h3>
            <p className="text-sm font-medium text-slate-400">Focus: {path.focus}</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden w-64 md:block">
            <div className="mb-2 flex justify-between text-[11px] font-bold">
              <span className="text-slate-400">Progress</span>
              <span className="text-blue-600">{path.progress}% Complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${path.progress}%` }}
              />
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-6 w-6 text-slate-400 cursor-pointer" />
          ) : (
            <ChevronDown className="h-6 w-6 text-slate-400 cursor-pointer" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-[#fcfdff] border-t border-slate-50 p-6 sm:p-10">
          <div className="relative space-y-12">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[15px] top-4 bottom-0 w-[1px] bg-blue-100" />

            {path.modules.map((module: any, index: number) => (
              <div key={module.id} className="relative pl-12">
                <div className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-[#fcfdff] ${module.status === 'completed' ? 'bg-blue-600 text-white' : 'border-2 border-blue-600 bg-white text-blue-600 font-bold text-sm'}`}>
                  {module.status === 'completed' ? <Check size={16} strokeWidth={3} /> : index + 1}
                </div>
                <h4 className="mb-6 text-lg font-bold text-slate-900">
                  {module.title}
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {module.resources.map((resource: any) => (
                    <ResourceItem
                      key={resource.id}
                      id={resource.id}
                      type={resource.type}
                      title={resource.title}
                      meta={resource.meta}
                      status={resource.status}
                      thumbnail={resource.thumbnail}
                      onToggle={() => path.onToggleResource && path.onToggleResource(module.id, resource.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
