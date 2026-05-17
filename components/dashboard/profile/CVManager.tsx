"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  RefreshCw,
  Upload,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  getApiErrorMessage,
  getCurrentUserProfile,
  uploadCurrentUserCv,
} from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CVManager() {
  const authData = useAppStore((state) => state.authData);
  const setAuthData = useAppStore((state) => state.setAuthData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProfile = async () => {
    const user = await getCurrentUserProfile();
    const nextCvUrl = typeof user.cv_url === "string" ? user.cv_url : null;

    setCvUrl(nextCvUrl);
    setAuthData({
      ...authData,
      user,
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadProfile();
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const cvFileName = useMemo(() => {
    if (!cvUrl) {
      return null;
    }

    try {
      const parsed = new URL(cvUrl);
      const lastSegment = parsed.pathname.split("/").filter(Boolean).pop();
      if (!lastSegment) {
        return "Uploaded CV";
      }
      return decodeURIComponent(lastSegment);
    } catch {
      return "Uploaded CV";
    }
  }, [cvUrl]);

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const lowerName = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((ext) =>
      lowerName.endsWith(ext),
    );

    if (!allowedMimeTypes.includes(file.type) && !hasAllowedExtension) {
      toast.error("Unsupported file type. Please upload PDF, DOC, or DOCX.");
      event.target.value = "";
      return;
    }

    const maxFileSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxFileSizeBytes) {
      toast.error("File is too large. Maximum size is 10MB.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadCurrentUserCv(file);
      setCvUrl(result.cv_url);

      const refreshedUser = await getCurrentUserProfile().catch(() => null);
      if (refreshedUser) {
        setAuthData({
          ...authData,
          user: refreshedUser,
        });
      }

      toast.success(result.message || "CV uploaded successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadProfile();
      toast.success("CV status refreshed.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-primary">
          <FileText size={18} />
          <span className="text-label">Curriculum Vitae</span>
        </div>
        <button
          type="button"
          onClick={() => {
            void handleRefresh();
          }}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/90 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {cvUrl ? (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm text-primary border border-border">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <p className="break-all text-sm font-bold text-foreground">
                {cvFileName}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Stored in backend
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <button
              type="button"
              onClick={onUploadClick}
              disabled={isUploading}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:border-border hover:text-primary disabled:opacity-60 sm:flex-initial"
            >
              {isUploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              Replace
            </button>
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:border-border hover:text-primary sm:flex-initial"
            >
              View
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUploadClick}
          disabled={isUploading}
          className="group block w-full rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 transition-all hover:border-primary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70 sm:p-8"
        >
          <div className="flex flex-col items-center text-center">
            {isUploading ? (
              <Loader2 size={24} className="mb-2 animate-spin text-primary" />
            ) : (
              <Upload
                size={24}
                className="mb-2 text-muted-foreground group-hover:text-primary transition-colors"
              />
            )}
            <p className="text-sm font-bold text-muted-foreground group-hover:text-foreground">
              {isUploading ? "Uploading CV..." : "Upload your CV"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              PDF, DOC, DOCX up to 10MB.
            </p>
          </div>
        </button>
      )}

      <p className="text-[11px] text-muted-foreground leading-relaxed italic">
        * Uploading your CV helps the backend update embeddings and improve
        profile intelligence.
      </p>
    </div>
  );
}
