"use client";

import { useEffect, useState } from "react";
import { GraduationCap, FileText, UploadCloud } from "lucide-react";
import { getLatestTranscript, getTranscriptConfig } from "@/lib/auth-api";
import {
  TranscriptResponse,
  TranscriptConfigResponse,
} from "@/types/transcript";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AcademicStatusCard() {
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [config, setConfig] = useState<TranscriptConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [transcriptData, configData] = await Promise.all([
          getLatestTranscript().catch((err: any) => {
            if (err.response?.status !== 404) {
              console.error("Error fetching latest transcript:", err);
              toast.error("Failed to load transcript data");
            }
            return null;
          }),
          getTranscriptConfig().catch((err: any) => {
            console.error("Error fetching transcript config:", err);
            toast.error("Failed to load transcript configuration");
            return null;
          }),
        ]);

        if (transcriptData) {
          setTranscript(transcriptData);
          toast.success("Academic records updated");
        }
        if (configData) setConfig(configData);
      } catch (error) {
        console.error("Failed to load academic data", error);
        toast.error("An expected error occurred while fetching records");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const semesters = transcript?.transcript_data?.semesters || [];
  // Assuming the latest semester is either the first or last. Usually we take the last if chronological.
  const latestSemester =
    semesters.length > 0 ? semesters[semesters.length - 1] : null;
  const isConnected = semesters.length > 0;

  const gpaScale = config?.gpa_scale || 4.0;
  const latestCGPA = latestSemester?.cumulative_summary?.cgpa || 0;

  const formattedDate = transcript?.created_at
    ? new Date(transcript.created_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  if (loading && !transcript) {
    return (
      <div className="relative rounded-2xl sm:rounded-[32px] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl shrink-0" />
            <div className="space-y-1 sm:space-y-2">
              <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 sm:gap-12">
            <div className="flex gap-8 sm:gap-12 w-full sm:w-auto">
              <div className="space-y-1 sm:space-y-2">
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
                <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
                <Skeleton className="h-5 sm:h-6 w-12 sm:w-16" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Skeleton className="h-10 sm:h-12 w-full sm:w-48 rounded-lg sm:rounded-xl" />
              <Skeleton className="h-10 sm:h-12 w-full sm:w-40 rounded-lg sm:rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl sm:rounded-[32px] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-50 text-rose-500 shrink-0">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Academic Extraction Status
            </h3>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-slate-400">
              {isConnected
                ? `Last extraction: ${formattedDate}`
                : "No extraction yet"}{" "}
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  isConnected ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 sm:gap-12">
          <div className="flex gap-8 sm:gap-12 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Latest Batch
              </p>
              <p
                className={`text-sm sm:text-base font-bold ${isConnected ? "text-slate-900" : "text-slate-400"}`}
              >
                {isConnected
                  ? `${latestSemester?.semester || "Unknown Semester"} Processed`
                  : "Pending..."}
              </p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                GPA Weighted
              </p>
              <p
                className={`text-base sm:text-lg font-bold ${isConnected ? "text-blue-600" : "text-slate-400"}`}
              >
                {isConnected
                  ? `${latestCGPA.toFixed(2)} / ${gpaScale.toFixed(1)}`
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              disabled={!isConnected}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold ${
                isConnected
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : "bg-slate-50 text-slate-400 cursor-not-allowed"
              }`}
            >
              <FileText className="h-4 w-4" /> View Full Transcript
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-800">
              <UploadCloud className="h-4 w-4" /> Update Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
