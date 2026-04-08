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
      <div className="relative rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-12">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-48 rounded-xl" />
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <GraduationCap size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Academic Extraction Status
            </h3>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
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

        <div className="flex flex-wrap items-center gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Latest Batch
            </p>
            <p
              className={`font-bold \${isConnected ? 'text-slate-900' : 'text-slate-400'}`}
            >
              {isConnected
                ? `${latestSemester?.semester || "Unknown Semester"} Processed`
                : "Pending..."}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              GPA Weighted
            </p>
            <p
              className={`text-lg font-bold ${isConnected ? "text-blue-600" : "text-slate-400"}`}
            >
              {isConnected
                ? `${latestCGPA.toFixed(2)} / ${gpaScale.toFixed(1)}`
                : "-"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              disabled={!isConnected}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold \${
                isConnected
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : "bg-slate-50 text-slate-400 cursor-not-allowed"
              }`}
            >
              <FileText size={16} /> View Full Transcript
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              <UploadCloud size={16} /> Update Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
