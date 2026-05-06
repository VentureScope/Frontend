"use client";
import { useState } from "react";
import { HeaderSection } from "@/components/learning-path/HeaderSection";
import { TabNavigation } from "@/components/learning-path/TabNavigation";
import { PathCard } from "@/components/learning-path/PathCard";
import { BarChart3, Cloud } from "lucide-react";
import { learningPathsData, tabsData } from "./mockData";
import { useRouter } from "next/navigation";

export default function LearningPathPage() {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useState(tabsData[0].id);
  const [paths, setPaths] = useState(learningPathsData);
  const [expandedPathIds, setExpandedPathIds] = useState<string[]>(
    paths.filter(p => p.isExpanded).map(p => p.id)
  );

  const handleToggleExpand = (id: string) => {
    setExpandedPathIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/learning-path/${id}`);
  };

  const handleToggleResource = (pathId: string, moduleId: string, resourceId: string) => {
    setPaths(prevPaths => prevPaths.map(path => {
      if (path.id !== pathId) return path;
      return {
        ...path,
        modules: path.modules.map(module => {
          if (module.id !== moduleId) return module;
          return {
            ...module,
            resources: module.resources.map(resource => {
              if (resource.id !== resourceId) return resource;
              const newStatus = resource.status === "completed" ? "in-progress" : "completed";
              return { ...resource, status: newStatus as any };
            })
          };
        })
      };
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BarChart3": return <BarChart3 className="h-5 w-5 text-blue-600" />;
      case "Cloud": return <Cloud className="h-5 w-5 text-blue-600" />;
      default: return <BarChart3 className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <HeaderSection />
        <TabNavigation tabs={tabsData} activeTabId={activeTabId} onTabChange={setActiveTabId} />

        <div className="mt-8 space-y-6">
          {paths.map(path => (
            <PathCard
              key={path.id}
              path={{ ...path, icon: getIcon(path.iconName), onToggleResource: (mId: string, rId: string) => handleToggleResource(path.id, mId, rId) }}
              isExpanded={expandedPathIds.includes(path.id)}
              onToggleExpand={handleToggleExpand}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
