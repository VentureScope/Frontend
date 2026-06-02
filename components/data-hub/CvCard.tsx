"use client";

import { useMemo, useRef, useState } from "react";
import { FileText, Upload, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { DataHubProfileCardSkeleton } from "@/components/data-hub/DataHubSkeletons";
import { getApiErrorMessage } from "@/lib/auth-api";
import { deleteCurrentUserCv, getCvPresignedUrl } from "@/lib/data-hub-api";
import { formatHubTimestamp, isCvSynced } from "@/lib/data-hub-utils";
import type { AuthUser } from "@/types/auth";
import { toast } from "sonner";

type CvCardProps = {
  profile: AuthUser | null;
  loading?: boolean;
  onUpload: (file: File) => Promise<{ message?: string }>;
  onChanged: () => Promise<void>;
};

export default function CvCard({
  profile,
  loading,
  onUpload,
  onChanged,
}: CvCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [opening, setOpening] = useState(false);

  const connected = isCvSynced(profile);
  const cvUrl = typeof profile?.cv_url === "string" ? profile.cv_url : null;

  const fileName = useMemo(() => {
    if (!cvUrl) {
      return null;
    }
    try {
      const parsed = new URL(cvUrl);
      const segment = parsed.pathname.split("/").filter(Boolean).pop();
      return segment ? decodeURIComponent(segment) : "Uploaded CV";
    } catch {
      return "Uploaded CV";
    }
  }, [cvUrl]);

  if (loading) {
    return <DataHubProfileCardSkeleton />;
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowed = [".pdf", ".doc", ".docx"];
    const lower = file.name.toLowerCase();
    if (!allowed.some((ext) => lower.endsWith(ext))) {
      toast.error("Upload PDF, DOC, or DOCX (max 10MB).");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const result = await onUpload(file);
      toast.success(result.message || "CV uploaded.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleView = async () => {
    setOpening(true);
    try {
      const url = await getCvPresignedUrl();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      if (cvUrl) {
        window.open(cvUrl, "_blank", "noopener,noreferrer");
        return;
      }
      toast.error("No download URL available.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setOpening(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCurrentUserCv();
      await onChanged();
      toast.success("CV removed.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="vs-icon-tile vs-icon-tile-secondary h-12 w-12">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">CV document</h3>
              <p className="text-sm text-muted-foreground">
                Used for resume generation and embeddings
              </p>
            </div>
          </div>
          <span
            className={
              connected
                ? "vs-badge vs-badge-success"
                : "vs-badge bg-muted text-muted-foreground"
            }
          >
            {connected ? "Uploaded" : "Missing"}
          </span>
        </div>

        {connected && fileName ? (
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="break-all text-sm font-semibold text-foreground">
              {fileName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Stored securely · updates profile intelligence
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Upload your CV so VentureScope can parse experience and improve
            AI-generated resumes.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Last checked {formatHubTimestamp(new Date().toISOString())}
        </p>
        <div className="flex flex-wrap gap-2">
          {connected ? (
            <>
              <button
                type="button"
                onClick={() => void handleView()}
                disabled={opening}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                {opening ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5" />
                )}
                View
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Replace
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Remove
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload CV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
