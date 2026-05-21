"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  User,
  ShieldCheck,
  Database,
  Sparkles,
  CreditCard,
  EyeOff,
  Eye,
  Camera,
  ShieldAlert,
  AlertTriangle,
  X,
  Smartphone,
  Trash2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { getUserProfileView } from "@/lib/user-profile";
import {
  updateCurrentUserProfile,
  changeCurrentUserPassword,
  deleteCurrentUserAccount,
  getApiErrorMessage,
  reauthenticate,
  verifyReauthenticate,
  uploadProfilePicture,
} from "@/lib/auth-api";
import { useSettingsPageData } from "@/hooks/useSettingsPageData";
import { SettingsAccountInfo } from "@/components/settings/SettingsAccountInfo";
import { SettingsIntelligenceTab } from "@/components/settings/SettingsIntelligenceTab";
import { SettingsPremiumPanel } from "@/components/settings/SettingsPremiumPanel";
import { SettingsCareerInterestsField } from "@/components/settings/SettingsCareerInterestsField";
import {
  SettingsMfaBadgeSkeleton,
  SettingsMfaFactorsSkeleton,
  SettingsMfaToggleSkeleton,
} from "@/components/settings/SettingsMfaSkeleton";
import { mfaGetAAL, mfaDisable } from "@/lib/mfa-api";
import { useRouter } from "next/navigation";
import { MFAEnrollModal } from "@/components/mfa/mfa-enroll-modal";
import {
  SettingsSidebar,
  type SettingsSidebarItem,
  type SettingsTabId,
} from "@/components/settings/SettingsSidebar";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  careerInterest: z.string().optional(),
});

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaFactors, setMfaFactors] = useState<any[]>([]);
  const [mfaMode, setMfaMode] = useState<"disable" | "unenroll">("disable");
  const [removingFactorId, setRemovingFactorId] = useState<string | null>(null);
  const [isMfaLoading, setIsMfaLoading] = useState(true);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [showMfaEnrollModal, setShowMfaEnrollModal] = useState(false);
  const [mfaReauthStep, setMfaReauthStep] = useState<"init" | "otp">("init");

  const refreshMfaData = useCallback(async () => {
    setIsMfaLoading(true);
    try {
      const aal = await mfaGetAAL();
      setMfaEnabled(aal.mfa_enabled);
      if (aal.mfa_enabled) {
        const { mfaListFactors } = await import("@/lib/mfa-api");
        const res = await mfaListFactors();
        setMfaFactors(res.factors);
      } else {
        setMfaFactors([]);
      }
    } catch (err) {
      console.error("Failed to load MFA status", err);
    } finally {
      setIsMfaLoading(false);
    }
  }, []);
  const [mfaPassword, setMfaPassword] = useState("");
  const [mfaOtp, setMfaOtp] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [isMfaProcessing, setIsMfaProcessing] = useState(false);

  const user = useAppStore((state) => state.authData.user);
  const setAuthData = useAppStore((state) => state.setAuthData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const {
    loading: intelligenceLoading,
    profile: apiProfile,
    github,
    transcript,
    sources,
    completionPercent,
    reload: reloadIntelligence,
    retryEmbedding,
    embeddingLoading,
  } = useSettingsPageData();

  const displayUser = apiProfile ?? user;

  // Determine if user needs a password for sensitive actions.
  // Fallback to checking oauth_provider if has_password is missing from an old session.
  const needsPassword = useMemo(() => {
    if (user?.has_password !== undefined) return user.has_password;
    // If has_password is unknown, only require it if they don't have an OAuth provider
    return !user?.oauth_provider;
  }, [user?.has_password, user?.oauth_provider]);

  const profile = getUserProfileView(displayUser);
  const profileDefaults = useMemo(
    () => ({
      fullName: displayUser?.full_name?.trim() || profile.fullName,
      careerInterest:
        typeof displayUser?.career_interest === "string"
          ? displayUser.career_interest
          : "",
    }),
    [displayUser?.full_name, displayUser?.career_interest, profile.fullName],
  );

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaults,
  });

  useEffect(() => {
    form.reset(profileDefaults);
  }, [form, profileDefaults]);

  useEffect(() => {
    refreshMfaData();
  }, [refreshMfaData]);

  async function handleMfaToggle(checked: boolean) {
    if (checked) {
      setShowMfaEnrollModal(true);
    } else {
      // Start disable flow — open re-auth modal
      setMfaMode("disable");
      setRemovingFactorId(null);
      setMfaError("");
      setMfaPassword("");
      setMfaOtp("");
      setMfaReauthStep("init");
      setShowMfaModal(true);
    }
  }

  async function onUnenrollClick(factorId: string) {
    if (mfaFactors.length === 1) {
      // Last factor — disable MFA entirely
      handleMfaToggle(false);
    } else {
      // Multiple factors — just remove this one
      setMfaMode("unenroll");
      setRemovingFactorId(factorId);
      setMfaError("");
      setMfaPassword("");
      setMfaOtp("");
      setMfaReauthStep("init");
      setShowMfaModal(true);
    }
  }

  async function onMfaActionConfirm() {
    setIsMfaProcessing(true);
    setMfaError("");
    try {
      const { mfaDisable, mfaUnenroll } = await import("@/lib/mfa-api");

      // 1. Re-authenticate if not already aal2
      if (mfaReauthStep === "init") {
        const res = await reauthenticate(needsPassword ? mfaPassword : undefined);
        if (res.status === "otp_sent") {
          setMfaReauthStep("otp");
          setIsMfaProcessing(false);
          return;
        }
      } else {
        await verifyReauthenticate(mfaOtp);
      }

      // 2. Perform Action
      if (mfaMode === "disable") {
        await mfaDisable();
        toast.success("MFA Disabled", {
          description: "Two-factor authentication has been removed from your account.",
        });
      } else if (mfaMode === "unenroll" && removingFactorId) {
        await mfaUnenroll({ factor_id: removingFactorId });
        toast.success("Authenticator Removed", {
          description: "The selected device has been unenrolled.",
        });
      }

      // 3. Sync & Close
      await refreshMfaData();
      setShowMfaModal(false);
    } catch (err: any) {
      setMfaError(getApiErrorMessage(err));
    } finally {
      setIsMfaProcessing(false);
    }
  }

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    try {
      const trimmedInterest = values.careerInterest?.trim() ?? "";
      const updatedUser = await updateCurrentUserProfile({
        full_name: values.fullName,
        career_interest: trimmedInterest.length > 0 ? trimmedInterest : null,
      });
      setAuthData({ ...useAppStore.getState().authData, user: updatedUser });
      void reloadIntelligence();
      toast.success("Profile Updated", {
        description: "Your details have been saved.",
      });
    } catch (error: any) {
      toast.error("Update Failed", {
        description: error?.message || "Failed to update profile.",
      });
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Allowed: JPG, PNG, WEBP");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const res = await uploadProfilePicture(file);
      const current = useAppStore.getState().authData;
      if (current.user) {
        setAuthData({
          ...current,
          user: {
            ...current.user,
            profile_picture_url: res.profile_picture_url,
          },
        });
      }
      void reloadIntelligence();
      toast.success(res.message || "Profile picture updated");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function onPasswordSubmit() {
    if (!currPassword || !newPassword) {
      setPasswordError("Both current and new passwords are required");
      return;
    }
    setPasswordError("");
    try {
      await changeCurrentUserPassword({
        current_password: currPassword,
        new_password: newPassword,
      });
      setIsChangingPassword(false);
      setCurrPassword("");
      setNewPassword("");
      toast.success("Security Update", {
        description: "Password changed successfully.",
      });
    } catch (error: any) {
      setPasswordError(error?.message || "Failed to change password.");
      toast.error("Password Rest Failed", {
        description: error?.message || "Failed to change password.",
      });
    }
  }

  async function onDeleteAccount() {
    if (!deleteConfirmed) return;
    if (needsPassword && !deletePassword) {
      setDeleteError("Please enter your password to confirm.");
      return;
    }
    setDeleteError("");
    setIsDeletingAccount(true);
    try {
      await deleteCurrentUserAccount(
        needsPassword ? { password: deletePassword } : {},
      );
      setAuthData({ token: null, tokenType: null, user: null });
      router.push("/sign-in");
    } catch (error: any) {
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setIsDeletingAccount(false);
    }
  }

  function openDeleteModal() {
    setDeletePassword("");
    setDeleteConfirmed(false);
    setDeleteError("");
    setShowDeleteModal(true);
  }

  const sidebarItems: SettingsSidebarItem[] = [
    { id: "profile", label: "Profile Identity", icon: User },
    { id: "intelligence", label: "Intelligence Sources", icon: Database },
    { id: "ai-advisor", label: "AI Advisor Tuning", icon: Sparkles },
    { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
    { id: "billing", label: "Subscription", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10 xl:px-12">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-10 lg:space-y-12">
        {/* --- GLOBAL HEADER --- */}
        <header className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-label text-primary">Command Center</p>
            <h1 className="text-h1 text-foreground">Settings</h1>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              onClick={() => form.reset(profileDefaults)}
              disabled={activeTab !== "profile" || form.formState.isSubmitting}
              variant="outline"
              className="h-12 w-full rounded-lg border-border bg-card px-6 font-bold text-muted-foreground hover:bg-muted sm:h-14 sm:w-auto sm:px-10"
            >
              Discard
            </Button>
            <Button
              onClick={form.handleSubmit(onProfileSubmit)}
              disabled={activeTab !== "profile" || form.formState.isSubmitting}
              className="h-12 w-full rounded-lg bg-primary px-6 font-medium text-primary-foreground  transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-auto sm:px-12"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <SettingsSidebar
            items={sidebarItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <main className="min-w-0 flex-1">
            {/* 1. PROFILE IDENTITY */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:rounded-xl lg:p-10">
                  <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:gap-8 md:flex-row md:items-center lg:mb-12 lg:gap-10">
                    <div className="relative group">
                      <div className="relative h-28 w-28 overflow-hidden rounded-full border-[6px] border-background bg-muted shadow-2xl ring-1 ring-border sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="h-full w-full object-cover"
                        />
                        {isUploadingAvatar ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : null}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => void handleAvatarChange(e)}
                      />
                      <button
                        type="button"
                        disabled={isUploadingAvatar}
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 hover:bg-primary/90 disabled:opacity-60 sm:h-11 sm:w-11"
                      >
                        <Camera size={18} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
                        Public Identity
                      </h3>
                      <p className="text-muted-foreground max-w-sm leading-relaxed">
                        This data informs your market alignment scores and
                        career-fit recommendations.
                      </p>
                    </div>
                  </div>

                  <form
                    className="grid grid-cols-1 gap-x-8 gap-y-7 sm:gap-y-8 md:grid-cols-2 md:gap-y-10"
                    onSubmit={form.handleSubmit(onProfileSubmit)}
                  >
                    <Field>
                      <FieldLabel className="w-full">
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Full Name
                        </FieldTitle>
                        <Input
                          {...form.register("fullName")}
                          className="h-14 rounded-lg bg-muted border-none font-bold px-6 text-foreground"
                        />
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.fullName]} />
                    </Field>

                    <Field>
                      <FieldLabel className="w-full">
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Email
                        </FieldTitle>
                        <Input
                          value={displayUser?.email ?? ""}
                          readOnly
                          className="h-14 cursor-not-allowed rounded-lg border-none bg-muted/80 font-bold px-6 text-muted-foreground"
                        />
                      </FieldLabel>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Email is managed by your sign-in provider and cannot be changed here.
                      </p>
                    </Field>

                    <SettingsCareerInterestsField
                      value={form.watch("careerInterest") ?? ""}
                      onChange={(v) =>
                        form.setValue("careerInterest", v, { shouldDirty: true })
                      }
                      disabled={form.formState.isSubmitting}
                    />
                  </form>
                </div>

                <SettingsAccountInfo user={displayUser} />

                <div className="divide-y divide-border rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:rounded-xl lg:p-10">
                  <div className="py-6 sm:py-8">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          Account Password
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Keep your credentials up to date.
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          setIsChangingPassword(!isChangingPassword)
                        }
                        variant="outline"
                        className="h-11 w-full rounded-xl px-4 font-bold sm:h-12 sm:w-auto sm:px-8"
                      >
                        {isChangingPassword ? "Cancel" : "Change Password"}
                      </Button>
                    </div>

                    {isChangingPassword && (
                      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-muted p-4 sm:p-6">
                        {passwordError && (
                          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                            {passwordError}
                          </div>
                        )}
                        <Field>
                          <FieldLabel className="w-full">
                            <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                              Current Password
                            </FieldTitle>
                            <Input
                              type="password"
                              value={currPassword}
                              onChange={(e) => setCurrPassword(e.target.value)}
                              className="h-12 rounded-xl bg-card border border-border font-bold px-4"
                            />
                          </FieldLabel>
                        </Field>

                        <Field>
                          <FieldLabel className="w-full">
                            <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                              New Password
                            </FieldTitle>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="h-12 rounded-xl bg-card border border-border font-bold px-4"
                            />
                          </FieldLabel>
                        </Field>

                        <Button
                          onClick={onPasswordSubmit}
                          className="h-12 mt-2 w-full md:w-auto rounded-xl bg-primary font-bold"
                        >
                          Confirm Password Change
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold text-foreground">
                          Two-Factor Authentication
                        </p>
                        {isMfaLoading ? (
                          <SettingsMfaBadgeSkeleton />
                        ) : mfaEnabled ? (
                          <Badge className="border-none bg-success/15 text-success text-label py-1 px-3">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground border-none font-bold text-[10px] uppercase py-1 px-3">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Protects your intelligence assets with secondary
                        validation.
                      </p>
                    </div>
                    {isMfaLoading ? (
                      <SettingsMfaToggleSkeleton />
                    ) : (
                      <Switch
                        id="mfa-toggle"
                        checked={mfaEnabled}
                        onCheckedChange={handleMfaToggle}
                      />
                    )}
                  </div>

                  {isMfaLoading && mfaEnabled ? (
                    <SettingsMfaFactorsSkeleton />
                  ) : (
                    mfaEnabled &&
                    mfaFactors.length > 0 && (
                      <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Registered Devices
                          </h4>
                          <button
                            onClick={() => setShowMfaEnrollModal(true)}
                            disabled={mfaFactors.length >= 3}
                            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline disabled:text-muted-foreground/50 disabled:no-underline"
                          >
                            {mfaFactors.length >= 3
                              ? "Limit Reached (Max 3)"
                              : "+ Add Backup Authenticator"}
                          </button>
                        </div>
                        <div className="grid gap-3">
                          {mfaFactors.map((f, i) => (
                            <div
                              key={f.factor_id}
                              className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm text-muted-foreground">
                                  <Smartphone size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground">
                                    {f.friendly_name ||
                                      `Authenticator ${i + 1}`}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground font-medium">
                                    Added{" "}
                                    {new Date(
                                      f.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {mfaFactors.length > 1 && (
                                  <Badge className="bg-card text-muted-foreground border border-border font-bold text-[9px] uppercase px-2 py-0.5">
                                    Active
                                  </Badge>
                                )}
                                <button
                                  onClick={() => onUnenrollClick(f.factor_id)}
                                  className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                                  title="Remove Authenticator"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* 2. INTELLIGENCE SOURCES */}
            {activeTab === "intelligence" && (
              <SettingsIntelligenceTab
                loading={intelligenceLoading}
                completionPercent={completionPercent}
                sources={sources}
                github={github}
                transcript={transcript}
                hasCv={Boolean(displayUser?.cv_url)}
                onRefresh={reloadIntelligence}
                onRetryEmbedding={retryEmbedding}
                embeddingLoading={embeddingLoading}
              />
            )}


            {/* 3. AI ADVISOR TUNING */}
            {activeTab === "ai-advisor" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SettingsPremiumPanel
                  title="AI Advisor tuning"
                  description="Personality sliders, tone presets, and market benchmarking are not available via the API yet. Your advisor already uses profile data, skills, and connected intelligence sources."
                  features={[
                    "Career goal aggression and risk appetite",
                    "Tone presets (direct vs. coaching)",
                    "Regional market benchmarking",
                  ]}
                />
              </div>
            )}

            {/* 4. PRIVACY & SECURITY */}
            {activeTab === "privacy" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SettingsPremiumPanel
                  title="Privacy Shield and anonymization"
                  description="Global anonymization and recruitment-pool visibility controls are not exposed in the API. Account deletion below is fully supported."
                  features={[
                    "PII scrubbing before trend analysis",
                    "Hide identity from recruitment pools",
                  ]}
                />

                <div className="space-y-8 rounded-xl border border-border bg-card p-5 sm:p-8 lg:rounded-xl lg:p-12 lg:space-y-10">
                  <h4 className="text-lg font-semibold text-foreground sm:text-xl">
                    Data Management
                  </h4>
                  <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div className="flex items-center gap-4 text-rose-600 sm:gap-6">
                      <ShieldAlert size={28} />
                      <div>
                        <p className="font-semibold">Delete account</p>
                        <p className="text-sm text-rose-400 font-medium italic">
                          Permanently removes your account via DELETE /api/users/me.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={openDeleteModal}
                      variant="ghost"
                      className="text-rose-600 font-bold hover:bg-rose-100 hover:text-rose-700"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SUBSCRIPTION & BILLING */}
            {activeTab === "billing" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SettingsPremiumPanel
                  title="Subscription and billing"
                  description="There are no subscription or invoice endpoints in the current API. Plans, payment methods, and usage quotas will appear here when billing is available."
                  features={[
                    "Tier management and upgrades",
                    "Payment methods and invoices",
                    "Advisor usage quotas",
                  ]}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── DELETE ACCOUNT MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl bg-card p-8 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute right-5 top-5 rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-muted-foreground"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                <AlertTriangle className="text-rose-600" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete Account
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your account will be deactivated. All synced data and AI
                intelligence history will be removed. Contact support within
                30 days to restore your account.
              </p>

              {/* Password field — only for email/password accounts */}
              {needsPassword && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Confirm with your password
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-border bg-muted px-4 pr-12 text-sm font-medium text-foreground outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                    >
                      {showDeletePassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirmation checkbox */}
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <input
                  type="checkbox"
                  checked={deleteConfirmed}
                  onChange={(e) => setDeleteConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-rose-600"
                />
                <span className="text-xs font-semibold leading-relaxed text-rose-700">
                  I understand this will permanently delete my account and all
                  associated data.
                </span>
              </label>

              {/* Error */}
              {deleteError && (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
                  {deleteError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onDeleteAccount}
                  disabled={
                    !deleteConfirmed ||
                    isDeletingAccount ||
                    (needsPassword && !deletePassword)
                  }
                  className="flex-1 rounded-xl bg-destructive font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                >
                  {isDeletingAccount ? "Deleting..." : "Delete My Account"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── MFA DISABLE MODAL ── */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl bg-card p-8 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowMfaModal(false)}
              className="absolute right-5 top-5 rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-muted-foreground"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {mfaMode === "disable" ? "Confirm MFA Disable" : "Confirm Removal"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {mfaReauthStep === "init"
                    ? "Verify your identity to proceed."
                    : "Enter the code sent to your email."}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-5">
              {mfaReauthStep === "init" ? (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mfaMode === "disable" 
                      ? "Disabling two-factor authentication makes your account less secure." 
                      : "Removing this authenticator device will restrict your backup options."}
                    {needsPassword
                      ? " Please enter your password to confirm this change."
                      : " We will send a verification code to your email to confirm this change."}
                  </p>

                  {needsPassword && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Confirm with your password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={mfaPassword}
                        onChange={(e) => setMfaPassword(e.target.value)}
                        className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring/20"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    A 6-digit code has been sent to your registered email.
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={mfaOtp}
                    onChange={(e) => setMfaOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-14 w-full rounded-xl border-2 border-border bg-muted text-center text-2xl font-bold tracking-[0.5em] text-foreground focus:border-primary outline-none"
                  />
                </div>
              )}

              {/* Error */}
              {mfaError && (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
                  {mfaError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMfaModal(false)}
                  className="flex-1 rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onMfaActionConfirm}
                  disabled={isMfaProcessing || (mfaReauthStep === "init" && needsPassword && !mfaPassword) || (mfaReauthStep === "otp" && mfaOtp.length !== 6)}
                  className="flex-1 rounded-xl bg-primary font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isMfaProcessing ? "Processing..." : mfaReauthStep === "init" && !needsPassword ? "Send Code" : mfaMode === "disable" ? "Confirm Disable" : "Confirm Removal"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MFAEnrollModal
        isOpen={showMfaEnrollModal}
        onClose={() => setShowMfaEnrollModal(false)}
        onSuccess={refreshMfaData}
      />
    </div>

  );
}
