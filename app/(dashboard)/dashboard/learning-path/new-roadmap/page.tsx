"use client";

import React, { useState } from "react";
import { NewRoadmapHeader } from "@/components/new-roadmap/NewRoadmapHeader";
import { EvolutionTabs } from "@/components/new-roadmap/NewRoadmapTabs";
import { RoleSelectionList } from "@/components/new-roadmap/RoleSelectionList";
import { rolesData } from "../mockData";

export default function NewRoadmapPage() {
  const [selectedRoleId, setSelectedRoleId] = useState(rolesData[0].id);
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Decorative SVG Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute right-0 top-0 h-[600px] w-auto opacity-40"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M800 50C600 150 400 50 200 250S0 450 -100 550"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <path
            d="M850 150C650 250 450 150 250 350S50 550 -50 650"
            stroke="#eff6ff"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <NewRoadmapHeader />

        <div className="mt-16">
          <EvolutionTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-10">
            <RoleSelectionList
              roles={activeTab === "current" ? rolesData : rolesData.slice().reverse()}
              selectedId={selectedRoleId}
              onSelect={setSelectedRoleId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
