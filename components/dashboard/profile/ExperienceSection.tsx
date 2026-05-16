"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  createExperience,
  deleteExperience,
  getExperiences,
  getApiErrorMessage,
  updateExperience,
} from "@/lib/auth-api";
import { Experience, ExperiencePayload } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [skillsUsed, setSkillsUsed] = useState("");

  const loadExperiences = async () => {
    try {
      const data = await getExperiences();
      // sort by start date descending
      data.sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
      );
      setExperiences(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const resetForm = () => {
    setJobTitle("");
    setCompany("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setSkillsUsed("");
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (exp: Experience) => {
    setJobTitle(exp.job_title);
    setCompany(exp.company);
    setStartDate(exp.start_date ? exp.start_date.substring(0, 10) : "");
    setEndDate(exp.end_date ? exp.end_date.substring(0, 10) : "");
    setDescription(exp.description);
    setSkillsUsed(exp.skills_used ? exp.skills_used.join(", ") : "");
    setEditingId(exp.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    setDeletingId(id);
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter((exp) => exp.id !== id));
      toast.success("Experience deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company || !startDate) {
      toast.error(
        "Please fill in the required fields: Job Title, Company, Start Date",
      );
      return;
    }

    setSubmitting(true);
    const payload: ExperiencePayload = {
      job_title: jobTitle,
      company: company,
      start_date: new Date(startDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      description: description,
      skills_used: skillsUsed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        const updated = await updateExperience(editingId, payload);
        setExperiences(
          experiences.map((exp) => (exp.id === editingId ? updated : exp)),
        );
        toast.success("Experience updated successfully");
      } else {
        const created = await createExperience(payload);
        console.log("sending experience", payload);
        setExperiences(
          [...experiences, created].sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime(),
          ),
        );
        toast.success("Experience added successfully");
      }
      resetForm();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
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
    <div className="relative rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Briefcase size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Experience
          </span>
        </div>
        {!isFormOpen && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-full px-3 text-xs text-primary border-primary/20 hover:bg-primary/10"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Experience</span>
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-muted/50 p-4 sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="jobTitle"
                className="text-xs font-semibold text-muted-foreground"
              >
                Job Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Software Engineer"
                className="bg-card"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="company"
                className="text-xs font-semibold text-muted-foreground"
              >
                Company <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Tech Corp Inc."
                className="bg-card"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="startDate"
                className="text-xs font-semibold text-muted-foreground"
              >
                Start Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-card"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="endDate"
                className="text-xs font-semibold text-muted-foreground"
              >
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-card"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="description"
                className="text-xs font-semibold text-muted-foreground"
              >
                Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="skillsUsed"
                className="text-xs font-semibold text-muted-foreground"
              >
                Skills Used (comma separated)
              </Label>
              <Input
                id="skillsUsed"
                value={skillsUsed}
                onChange={(e) => setSkillsUsed(e.target.value)}
                placeholder="React, Next.js, TypeScript"
                className="bg-card"
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
              className="bg-primary hover:bg-primary/90 text-white min-w-[100px]"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Add Experience"
              )}
            </Button>
          </div>
        </form>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 py-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Briefcase size={20} />
          </div>
          <p className="mb-1 text-sm font-bold text-muted-foreground">
            No experiences listed
          </p>
          <p className="mb-4 max-w-[250px] text-center text-xs text-muted-foreground">
            Add your professional background to improve your career insights.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group relative flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors hover:border-border hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {exp.job_title}
                  </h4>
                  <p className="text-xs font-semibold text-primary mb-1">
                    {exp.company}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>
                      {exp.start_date
                        ? new Date(exp.start_date).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                            },
                          )
                        : ""}{" "}
                      -{" "}
                      {exp.end_date
                        ? new Date(exp.end_date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })
                        : "Present"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-primary"
                    onClick={() => handleEdit(exp)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                  >
                    {deletingId === exp.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                </div>
              </div>
              {exp.description && (
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                  {exp.description}
                </p>
              )}
              {exp.skills_used && exp.skills_used.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.skills_used.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-card border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
