"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoadmapDetailView } from "@/components/roadmap-view/RoadmapDetailView";
import { learningPathsData } from "../mockData";

export default function StandaloneRoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  
  const [path, setPath] = useState(() => learningPathsData.find(p => p.id === id));

  if (!path) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900">Roadmap Not Found</h1>
        <Link href="/dashboard/learning-path" className="mt-4 text-blue-600 hover:underline">
          Go back to Learning Paths
        </Link>
      </div>
    );
  }

  const handleToggleResource = (moduleId: string, resourceId: string) => {
    setPath(prevPath => {
      if (!prevPath) return prevPath;
      return {
        ...prevPath,
        modules: prevPath.modules.map(module => {
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
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/learning-path"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-slate-900">
                {path.title}
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                Path ID: {id.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden h-10 gap-2 rounded-full border-slate-200 px-5 font-semibold text-slate-600 sm:flex"
            >
              <Share2 size={16} />
              Share
            </Button>
            <Button className="h-10 rounded-full bg-[#0052cc] px-6 font-semibold text-white hover:bg-blue-700">
              Update Progress
            </Button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <RoadmapDetailView path={{ ...path, onToggleResource: handleToggleResource }} />
      </main>
    </div>
  );
}
