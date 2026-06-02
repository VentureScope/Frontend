"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import {
  createCertificate,
  deleteCertificate,
  getApiErrorMessage,
  updateCertificate,
} from "@/lib/auth-api";
import { useCertificatesQuery } from "@/hooks/queries/use-profile-queries";
import { queryKeys } from "@/lib/query-keys";
import type {
  Certificate,
  CertificatePayload,
} from "@/types/certificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function toIsoDate(value: string): string | null {
  if (!value.trim()) {
    return null;
  }
  return new Date(value).toISOString();
}

function formatCertificateDate(value: string | null): string {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
}

export default function CertificatesSection() {
  const queryClient = useQueryClient();
  const certificatesQuery = useCertificatesQuery();
  const certificates = certificatesQuery.data ?? [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");

  const setCertificatesCache = (next: Certificate[]) => {
    queryClient.setQueryData(queryKeys.profile.certificates(), next);
  };

  const resetForm = () => {
    setName("");
    setIssuer("");
    setCredentialId("");
    setCredentialUrl("");
    setIssueDate("");
    setExpiryDate("");
    setDescription("");
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (cert: Certificate) => {
    setName(cert.name);
    setIssuer(cert.issuer);
    setCredentialId(cert.credential_id ?? "");
    setCredentialUrl(cert.credential_url ?? "");
    setIssueDate(cert.issue_date ? cert.issue_date.substring(0, 10) : "");
    setExpiryDate(cert.expiry_date ? cert.expiry_date.substring(0, 10) : "");
    setDescription(cert.description ?? "");
    setEditingId(cert.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setDeletingId(id);
    try {
      await deleteCertificate(id);
      setCertificatesCache(certificates.filter((cert) => cert.id !== id));
      toast.success("Certificate deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const buildPayload = (): CertificatePayload => ({
    name: name.trim(),
    issuer: issuer.trim(),
    credential_id: credentialId.trim() || null,
    credential_url: credentialUrl.trim() || null,
    issue_date: toIsoDate(issueDate),
    expiry_date: toIsoDate(expiryDate),
    description: description.trim() || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim()) {
      toast.error("Certificate name and issuer are required");
      return;
    }

    setSubmitting(true);
    const payload = buildPayload();

    try {
      if (editingId) {
        const updated = await updateCertificate(editingId, payload);
        setCertificatesCache(
          certificates.map((cert) => (cert.id === editingId ? updated : cert)),
        );
        toast.success("Certificate updated successfully");
      } else {
        const created = await createCertificate(payload);
        setCertificatesCache([created, ...certificates]);
        toast.success("Certificate added successfully");
      }
      resetForm();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (certificatesQuery.isPending) {
    return (
      <div className="relative rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-2 text-muted-foreground/50">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Award size={18} />
          <span className="text-label">Certificates</span>
        </div>
        {!isFormOpen && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-full border-border px-3 text-xs text-primary hover:bg-muted"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Certificate</span>
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border bg-muted/50 p-4 sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="certName" className="text-xs font-semibold text-muted-foreground">
                Certificate Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="certName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="AWS Certified Solutions Architect"
                className="bg-card"
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="certIssuer" className="text-xs font-semibold text-muted-foreground">
                Issuing Organization <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="certIssuer"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Amazon Web Services"
                className="bg-card"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="certIssueDate" className="text-xs font-semibold text-muted-foreground">
                Issue Date
              </Label>
              <Input
                id="certIssueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="bg-card"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="certExpiryDate" className="text-xs font-semibold text-muted-foreground">
                Expiry Date
              </Label>
              <Input
                id="certExpiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="bg-card"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="certCredentialId" className="text-xs font-semibold text-muted-foreground">
                Credential ID
              </Label>
              <Input
                id="certCredentialId"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="ABC123456"
                className="bg-card"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="certCredentialUrl" className="text-xs font-semibold text-muted-foreground">
                Credential URL
              </Label>
              <Input
                id="certCredentialUrl"
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://..."
                className="bg-card"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="certDescription" className="text-xs font-semibold text-muted-foreground">
                Description
              </Label>
              <textarea
                id="certDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Optional notes about this credential..."
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetForm}
              disabled={submitting}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="min-w-[100px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Add Certificate"
              )}
            </Button>
          </div>
        </form>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 py-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
            <Award size={20} />
          </div>
          <p className="mb-1 text-sm font-bold text-muted-foreground">
            No certificates listed
          </p>
          <p className="mb-4 max-w-[280px] text-center text-xs text-muted-foreground">
            Add professional certifications to strengthen your profile and resume
            generation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors hover:border-border hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground">{cert.name}</h4>
                  <p className="mb-1 text-xs font-semibold text-primary">
                    {cert.issuer}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={12} />
                      Issued {formatCertificateDate(cert.issue_date)}
                    </span>
                    {cert.expiry_date ? (
                      <span>Expires {formatCertificateDate(cert.expiry_date)}</span>
                    ) : (
                      <span>No expiry</span>
                    )}
                  </div>
                  {cert.credential_id ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      ID: {cert.credential_id}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-primary"
                      title="View credential"
                    >
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-primary"
                    onClick={() => handleEdit(cert)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                    onClick={() => void handleDelete(cert.id)}
                    disabled={deletingId === cert.id}
                  >
                    {deletingId === cert.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                </div>
              </div>
              {cert.description ? (
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {cert.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
