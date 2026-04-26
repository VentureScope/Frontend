"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  FileText,
  UploadCloud,
  TrendingUp,
  BookOpen,
  Calendar,
  Hash,
  Award,
} from "lucide-react";
import { getLatestTranscript, getTranscriptConfig } from "@/lib/auth-api";
import {
  TranscriptResponse,
  TranscriptConfigResponse,
  SemesterSchema,
} from "@/types/transcript";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/**
 * Finds the latest semester that has meaningful data (non-zero CGPA or graded courses).
 * Falls back to the very last semester if none qualify.
 */
function findLatestGradedSemester(
  semesters: SemesterSchema[]
): SemesterSchema | null {
  if (semesters.length === 0) return null;

  // Walk backwards to find the latest semester with a non-zero CGPA
  for (let i = semesters.length - 1; i >= 0; i--) {
    const sem = semesters[i];
    if (
      sem.cumulative_summary.cgpa > 0 ||
      sem.courses.some((c) => c.grade !== "-" && c.points && c.points > 0)
    ) {
      return sem;
    }
  }

  return semesters[semesters.length - 1];
}

/**
 * Counts total unique courses that have been graded across all semesters.
 */
function countGradedCourses(semesters: SemesterSchema[]): number {
  return semesters.reduce((total, sem) => {
    return total + sem.courses.filter((c) => c.grade !== "-").length;
  }, 0);
}

/**
 * Counts total semesters that have graded data.
 */
function countCompletedSemesters(semesters: SemesterSchema[]): number {
  return semesters.filter(
    (sem) =>
      sem.cumulative_summary.cgpa > 0 ||
      sem.courses.some((c) => c.grade !== "-")
  ).length;
}

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
  const latestSemester = findLatestGradedSemester(semesters);
  const isConnected = semesters.length > 0 && latestSemester !== null;

  const gpaScale = config?.gpa_scale || 4.0;
  const latestCGPA = latestSemester?.cumulative_summary?.cgpa || 0;
  const latestSGPA = latestSemester?.semester_summary?.sgpa || 0;
  const totalCreditHours = latestSemester?.cumulative_summary?.credit_hours || 0;
  const totalGradedCourses = countGradedCourses(semesters);
  const completedSemesters = countCompletedSemesters(semesters);
  const studentId =
    transcript?.transcript_data?.student_id || transcript?.student_id || null;
  const yearLevel = latestSemester?.year_level || null;
  const academicYear = latestSemester?.academic_year || null;

  const formattedDate = transcript?.uploaded_at
    ? new Date(transcript.uploaded_at).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "Never";

  const versionLabel = transcript?.version
    ? `v${transcript.version}`
    : null;

  // Determine CGPA status color
  const cgpaColor =
    latestCGPA >= 3.7
      ? "text-emerald-600"
      : latestCGPA >= 3.0
        ? "text-blue-600"
        : latestCGPA >= 2.0
          ? "text-amber-600"
          : "text-red-500";

  const cgpaBgColor =
    latestCGPA >= 3.7
      ? "bg-emerald-50"
      : latestCGPA >= 3.0
        ? "bg-blue-50"
        : latestCGPA >= 2.0
          ? "bg-amber-50"
          : "bg-red-50";

  if (loading && !transcript) {
    return (
      <div className="relative rounded-2xl sm:rounded-[32px] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl shrink-0" />
            <div className="space-y-1 sm:space-y-2 flex-1">
              <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            </div>
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 p-4 rounded-xl bg-slate-50">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
          {/* Footer skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Skeleton className="h-10 sm:h-12 w-full sm:w-48 rounded-lg sm:rounded-xl" />
            <Skeleton className="h-10 sm:h-12 w-full sm:w-40 rounded-lg sm:rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl sm:rounded-[32px] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-50 text-rose-500 shrink-0">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Academic Transcript
                </h3>
                {versionLabel && (
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-slate-500">
                    {versionLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-slate-400">
                {isConnected ? (
                  <>
                    <span>Last synced: {formattedDate}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </>
                ) : (
                  <>
                    <span>No extraction yet</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Student Info Pills */}
          {isConnected && (
            <div className="flex flex-wrap items-center gap-2">
              {studentId && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  <Hash className="h-3 w-3 text-slate-400" />
                  {studentId.toUpperCase()}
                </span>
              )}
              {yearLevel && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 border border-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-600">
                  <Award className="h-3 w-3" />
                  {yearLevel}
                </span>
              )}
              {academicYear && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-600">
                  <Calendar className="h-3 w-3" />
                  {academicYear}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {isConnected ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* CGPA */}
            <div className={`rounded-xl ${cgpaBgColor} p-4 sm:p-5`}>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Cumulative GPA
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className={`text-2xl sm:text-3xl font-extrabold ${cgpaColor}`}>
                  {latestCGPA.toFixed(2)}
                </p>
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  / {gpaScale.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Semester GPA */}
            <div className="rounded-xl bg-indigo-50 p-4 sm:p-5">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Latest SGPA
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
                  {latestSGPA.toFixed(2)}
                </p>
                <TrendingUp className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="text-[10px] sm:text-xs text-indigo-400 font-medium mt-1 truncate">
                {latestSemester?.semester}
              </p>
            </div>

            {/* Credit Hours */}
            <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Credit Hours
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-700">
                {totalCreditHours}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">
                {completedSemesters} semester{completedSemesters !== 1 ? "s" : ""} completed
              </p>
            </div>

            {/* Courses */}
            <div className="rounded-xl bg-amber-50 p-4 sm:p-5">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Courses Graded
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                  {totalGradedCourses}
                </p>
                <BookOpen className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-[10px] sm:text-xs text-amber-400 font-medium mt-1">
                Across all semesters
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 p-8 sm:p-12">
            <div className="text-center space-y-2">
              <GraduationCap className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-500">
                No transcript data available
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Use the VentureScope Chrome extension to extract your academic
                records from the university portal.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold ${isConnected
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
  );
}
