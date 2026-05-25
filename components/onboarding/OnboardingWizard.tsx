"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Check,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createExperience,
  getApiErrorMessage,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateCurrentUserSkills,
  uploadCurrentUserCv,
  uploadProfilePicture,
} from "@/lib/auth-api";
import {
  getPostOnboardingPath,
  markOnboardingComplete,
  ONBOARDING_STEPS,
} from "@/lib/onboarding";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function parseInterestTags(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const authData = useAppStore((state) => state.authData);
  const setAuthData = useAppStore((state) => state.setAuthData);
  const user = authData.user;
  const userId = user?.id;
  const profile = getUserProfileView(user);

  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(user?.full_name?.trim() ?? "");
  const [interestInput, setInterestInput] = useState("");
  const [interestTags, setInterestTags] = useState<string[]>(() =>
    parseInterestTags(
      typeof user?.career_interest === "string" ? user.career_interest : "",
    ),
  );

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(() => {
    if (Array.isArray(user?.skills)) {
      return user.skills.filter((s): s is string => typeof s === "string");
    }
    return [];
  });

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [cvUploaded, setCvUploaded] = useState(Boolean(user?.cv_url));

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profile_picture_url ?? null,
  );
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const step = ONBOARDING_STEPS[stepIndex];
  const stepId = step?.id ?? "welcome";
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;

  const progressPct = useMemo(
    () => Math.round(((stepIndex + 1) / ONBOARDING_STEPS.length) * 100),
    [stepIndex],
  );

  const refreshUser = useCallback(async () => {
    const refreshed = await getCurrentUserProfile();
    setAuthData({ ...authData, user: refreshed });
    setCvUploaded(Boolean(refreshed.cv_url));
    if (refreshed.profile_picture_url) {
      setAvatarPreview(refreshed.profile_picture_url);
    }
    return refreshed;
  }, [authData, setAuthData]);

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, ONBOARDING_STEPS.length - 1));
  }, []);

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const finishOnboarding = () => {
    if (!userId) {
      router.replace("/dashboard");
      return;
    }
    markOnboardingComplete(userId);
    router.replace(getPostOnboardingPath(userId));
  };

  const skipAll = () => {
    finishOnboarding();
  };

  const saveBasics = async (): Promise<boolean> => {
    const name = fullName.trim();
    if (name.length < 2) {
      toast.error("Please enter your full name (at least 2 characters).");
      return false;
    }
    setSaving(true);
    try {
      const updated = await updateCurrentUserProfile({
        full_name: name,
        career_interest:
          interestTags.length > 0 ? interestTags.join(", ") : null,
      });
      setAuthData({ ...authData, user: updated });
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveSkills = async (): Promise<boolean> => {
    if (skills.length === 0) {
      return true;
    }
    setSaving(true);
    try {
      await updateCurrentUserSkills({ skills });
      await refreshUser();
      toast.success("Skills saved.");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveExperience = async (): Promise<boolean> => {
    if (!jobTitle.trim() && !company.trim()) {
      return true;
    }
    if (!jobTitle.trim() || !company.trim() || !startDate) {
      toast.error("Job title, company, and start date are required to save.");
      return false;
    }
    setSaving(true);
    try {
      await createExperience({
        job_title: jobTitle.trim(),
        company: company.trim(),
        start_date: new Date(startDate).toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : null,
        description: "",
        skills_used: [],
      });
      toast.success("Experience added.");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }
    const valid = ["image/jpeg", "image/png", "image/webp"];
    if (!valid.includes(file.type)) {
      toast.error("Use JPG, PNG, or WEBP.");
      return;
    }
    setSaving(true);
    try {
      const res = await uploadProfilePicture(file);
      setAvatarPreview(res.profile_picture_url);
      if (user) {
        setAuthData({
          ...authData,
          user: { ...user, profile_picture_url: res.profile_picture_url },
        });
      }
      toast.success("Photo uploaded.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleCvUpload = async (file: File) => {
    setSaving(true);
    try {
      await uploadCurrentUserCv(file);
      setCvUploaded(true);
      await refreshUser();
      toast.success("CV uploaded.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const addInterestTag = () => {
    const tag = interestInput.trim();
    if (!tag) return;
    if (interestTags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      toast.info("That interest is already listed.");
      return;
    }
    setInterestTags((prev) => [...prev, tag]);
    setInterestInput("");
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      toast.info("That skill is already listed.");
      return;
    }
    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  };

  async function handleContinue() {
    if (stepId === "basics") {
      const ok = await saveBasics();
      if (!ok) return;
    } else if (stepId === "skills") {
      const ok = await saveSkills();
      if (!ok) return;
    } else if (stepId === "experience") {
      const ok = await saveExperience();
      if (!ok) return;
    } else if (stepId === "finish") {
      finishOnboarding();
      return;
    }
    goNext();
  }

  function handleSkipStep() {
    if (stepId === "finish") {
      finishOnboarding();
      return;
    }
    goNext();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
          <span>
            Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ONBOARDING_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                i <= stepIndex ? "bg-primary" : "bg-muted",
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-label text-primary">{step.title}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {step.subtitle}
        </h1>

        <div className="mt-8 min-h-[200px]">
          {stepId === "welcome" && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Hi{profile.firstName ? ` ${profile.firstName}` : ""}! VentureScope
                    uses your profile to personalize market insights, learning
                    roadmaps, job matches, and AI career guidance.
                  </p>
                  <p>
                    Each step mirrors a section on your profile page. Everything
                    is optional—you can skip any step or exit setup anytime.
                  </p>
                </div>
              </div>
              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {[
                  "About you & interests",
                  "Profile photo",
                  "Skills & experience",
                  "CV upload",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stepId === "basics" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="onb-email">Email</Label>
                <Input
                  id="onb-email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Verified at sign-up. Change in Settings if needed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="onb-name">Full name</Label>
                <Input
                  id="onb-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Career interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interestTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setInterestTags((t) => t.filter((x) => x !== tag))
                        }
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="e.g. Data Science, Product"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterestTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addInterestTag}
                    aria-label="Add interest"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {stepId === "photo" && (
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-lg">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Same as the photo on your profile header. JPG, PNG, or WEBP up
                  to 5MB.
                </p>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handlePhotoUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  disabled={saving}
                  onClick={() => photoInputRef.current?.click()}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  Upload photo
                </Button>
              </div>
            </div>
          )}

          {stepId === "skills" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Matches the Skills section on your profile. Add languages,
                frameworks, or tools you use.
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        setSkills((s) => s.filter((x) => x !== skill))
                      }
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. Python, React"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {stepId === "experience" && (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                This matches the Experience section on your profile. Add internships,
                full-time roles, or freelance work with a job title, company, and dates.
                You can add more roles later from Profile, or skip this step if you are
                just getting started.
              </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="onb-title">Job title</Label>
                <Input
                  id="onb-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="onb-company">Company</Label>
                <Input
                  id="onb-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="onb-start">Start date</Label>
                <Input
                  id="onb-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="onb-end">End date (optional)</Label>
                <Input
                  id="onb-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            </div>
          )}

          {stepId === "cv" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Powers CV Manager on your profile and resume builder suggestions.
              </p>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleCvUpload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={saving}
                onClick={() => cvInputRef.current?.click()}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {cvUploaded ? "Replace CV" : "Upload CV"}
              </Button>
              {cvUploaded ? (
                <p className="text-xs font-semibold text-success">
                  CV on file — you can manage it from your profile.
                </p>
              ) : null}
            </div>
          )}

          {stepId === "finish" && (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Your profile is ready. Visit{" "}
                <Link
                  href="/dashboard/profile"
                  className="font-semibold text-primary hover:underline"
                >
                  Profile
                </Link>{" "}
                anytime to edit personal details, skills, and experience.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Market trends", href: "/dashboard/market-trends" },
                  { label: "Learning path", href: "/dashboard/learning-path" },
                  { label: "My Advisor", href: "/dashboard/ai-advisor" },
                  { label: "Resume builder", href: "/dashboard/resume-builder" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {!isFirst ? (
              <Button type="button" variant="ghost" onClick={goBack} disabled={saving}>
                Back
              </Button>
            ) : null}
            {stepId === "welcome" ? (
              <Button type="button" variant="ghost" onClick={skipAll}>
                Skip setup for now
              </Button>
            ) : !isLast ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkipStep}
                disabled={saving}
              >
                Skip this step
              </Button>
            ) : null}
          </div>
          <Button
            type="button"
            className="gap-2 sm:min-w-[140px]"
            disabled={saving}
            onClick={() => void handleContinue()}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isLast ? (
              <>
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            ) : stepId === "welcome" ? (
              <>
                Get started
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <Image
          src="/logo.png"
          alt=""
          width={16}
          height={16}
          className="mr-1 inline-block h-4 w-4 opacity-60"
        />
        You can complete or change profile sections later under Profile.
      </p>
    </div>
  );
}
