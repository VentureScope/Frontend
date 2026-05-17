"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  User,
  ShieldCheck,
  Database,
  Sparkles,
  CreditCard,
  Github,
  GraduationCap,
  RefreshCw,
  EyeOff,
  Eye,
  Camera,
  MapPin,
  Briefcase,
  ExternalLink,
  Download,
  CreditCard as CardIcon,
  ShieldAlert,
  AlertTriangle,
  X,
  Smartphone,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
} from "@/lib/auth-api";
import { mfaGetAAL, mfaDisable } from "@/lib/mfa-api";
import { useRouter } from "next/navigation";
import { MFAEnrollModal } from "@/components/mfa/mfa-enroll-modal";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  location: z.string().min(2, "Location is required"),
  portfolio: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

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

  // Determine if user needs a password for sensitive actions.
  // Fallback to checking oauth_provider if has_password is missing from an old session.
  const needsPassword = useMemo(() => {
    if (user?.has_password !== undefined) return user.has_password;
    // If has_password is unknown, only require it if they don't have an OAuth provider
    return !user?.oauth_provider;
  }, [user?.has_password, user?.oauth_provider]);

  const profile = getUserProfileView(user);
  const profileDefaults = useMemo(
    () => ({
      fullName: profile.fullName,
      role: profile.role,
      location: profile.location,
      portfolio: "",
    }),
    [profile.fullName, profile.role, profile.location],
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
      const updatedUser = await updateCurrentUserProfile({
        full_name: values.fullName,
      });
      // Optionally sync role/location back to backend if backend supported them later
      setAuthData({ ...useAppStore.getState().authData, user: updatedUser });
      toast.success("Profile Updated", {
        description: "Your details have been saved.",
      });
    } catch (error: any) {
      toast.error("Update Failed", {
        description: error?.message || "Failed to update profile.",
      });
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

  const sidebarItems = [
    { id: "profile", label: "Profile Identity", icon: User },
    {
      id: "intelligence",
      label: "Intelligence Sources",
      icon: Database,
    },
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* --- SIDEBAR NAVIGATION --- */}
          <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:col-span-3 lg:grid-cols-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-r-xl border-l-2 px-4 py-3 text-left text-btn transition-all sm:px-5 sm:py-4 lg:gap-4 lg:pl-5 lg:pr-6 lg:py-4",
                  activeTab === item.id
                    ? "vs-nav-active border-l-2 font-medium"
                    : "border-transparent text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                )}
              >
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id ? "text-primary" : "text-muted-foreground/50"
                  }
                />
                {item.label}
              </button>
            ))}
          </nav>

          {/* --- MAIN CONTENT SECTIONS --- */}
          <main className="lg:col-span-9">
            {/* 1. PROFILE IDENTITY */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:rounded-xl lg:p-10">
                  <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:gap-8 md:flex-row md:items-center lg:mb-12 lg:gap-10">
                    <div className="relative group">
                      <div className="h-28 w-28 overflow-hidden rounded-full border-[6px] border-background bg-muted shadow-2xl ring-1 ring-border sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 hover:bg-primary/90 sm:h-11 sm:w-11">
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
                          Current Role
                        </FieldTitle>
                        <div className="relative">
                          <Briefcase
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                          />
                          <Input
                            {...form.register("role")}
                            className="h-14 w-full rounded-lg bg-muted border-none font-bold pl-14 pr-6 text-foreground"
                          />
                        </div>
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.role]} />
                    </Field>

                    <Field>
                      <FieldLabel className="w-full">
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Location / Timezone
                        </FieldTitle>
                        <div className="relative">
                          <MapPin
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                          />
                          <Input
                            {...form.register("location")}
                            className="h-14 w-full rounded-lg bg-muted border-none font-bold pl-14 pr-6 text-foreground"
                          />
                        </div>
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.location]} />
                    </Field>

                    <Field>
                      <FieldLabel className="w-full">
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Portfolio URL
                        </FieldTitle>
                        <div className="relative">
                          <ExternalLink
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                          />
                          <Input
                            {...form.register("portfolio")}
                            className="h-14 w-full rounded-lg bg-muted border-none font-bold pl-14 pr-6 text-foreground"
                          />
                        </div>
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.portfolio]} />
                    </Field>
                  </form>
                </div>

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
                        {mfaEnabled ? (
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
                      <Skeleton className="h-6 w-12 rounded-full" />
                    ) : (
                      <Switch
                        id="mfa-toggle"
                        checked={mfaEnabled}
                        onCheckedChange={handleMfaToggle}
                      />
                    )}
                  </div>

                  {/* Factor List */}
                  {mfaEnabled && mfaFactors.length > 0 && (
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
                          {mfaFactors.length >= 3 ? "Limit Reached (Max 3)" : "+ Add Backup Authenticator"}
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
                                  {f.friendly_name || `Authenticator ${i + 1}`}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-medium">
                                  Added {new Date(f.created_at).toLocaleDateString()}
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
                  )}
                </div>
              </div>
            )}

            {/* 2. INTELLIGENCE SOURCES */}
            {activeTab === "intelligence" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:rounded-xl lg:p-12 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-success/20 text-xl font-semibold text-success sm:h-20 sm:w-20 sm:text-2xl">
                      98%
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                        Intelligence Sync Health
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        All data hooks are currently optimized and active.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-11 w-full gap-3 rounded-xl border-border px-5 font-bold text-primary sm:h-12 sm:w-auto sm:px-8"
                  >
                    <RefreshCw size={18} /> Force Data Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                  <div className="flex min-h-64 flex-col justify-between rounded-xl border-2 border-border bg-card p-5 sm:p-8 lg:rounded-xl lg:p-10">
                    <div className="flex items-start justify-between">
                      <div className="vs-icon-tile vs-icon-tile-primary flex h-16 w-16 rounded-[20px]">
                        <Github size={32} />
                      </div>
                      <Badge className="bg-success/15 text-success font-semibold tracking-widest uppercase border-none py-1.5 px-4 text-[10px]">
                        Connected
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-foreground sm:text-xl">
                        GitHub Contributions
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Mapping repositories and commit patterns to technical
                        benchmarks.
                      </p>
                      <button className="text-label pt-2 text-destructive hover:underline">
                        Disconnect Source
                      </button>
                    </div>
                  </div>

                  <div className="flex min-h-64 flex-col justify-between rounded-xl border border-dashed border-border bg-card p-5 opacity-60 transition-opacity hover:opacity-100 sm:p-8 lg:rounded-xl lg:p-10">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-16 rounded-[20px] bg-muted flex items-center justify-center text-muted-foreground/50">
                        <GraduationCap size={32} />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        Available
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-muted-foreground sm:text-xl">
                        University Transcript Hub
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Authorized academic portals to verify degrees and GPA
                        scores.
                      </p>
                      <Button className="h-11 w-full rounded-xl bg-primary font-bold sm:h-12">
                        Connect Portal
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. AI ADVISOR TUNING */}
            {activeTab === "ai-advisor" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:space-y-10 sm:p-8 lg:rounded-xl lg:space-y-12 lg:p-12">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
                      Advisor Personality
                    </h3>
                    <p className="text-base text-muted-foreground sm:text-lg">
                      Calibrate the intelligence engine to your specific
                      professional appetite.
                    </p>
                  </div>

                  <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                    <div className="space-y-6 rounded-xl border border-border bg-muted p-5 sm:space-y-8 sm:p-8 lg:rounded-xl lg:p-10">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                            Career Goal Aggression
                          </p>
                          <p className="text-sm text-muted-foreground max-w-sm">
                            How aggressive should AI be in suggesting high-risk
                            pivots?
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-foreground">
                          High Growth
                        </span>
                      </div>
                      <Slider
                        defaultValue={[75]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground">
                            Direct & Analytical Tone
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Focus on data points over encouragement.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground">
                            Global Benchmarking
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Compare against US/EU markets.
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PRIVACY & SECURITY */}
            {activeTab === "privacy" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="vs-band relative overflow-hidden rounded-xl p-5 sm:p-8 lg:p-12 xl:p-16">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-primary/15 blur-[100px]" />
                  <div className="relative z-10 space-y-7 sm:space-y-8 lg:space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                        Intelligence Anonymization
                      </h3>
                      <p className="vs-band-muted max-w-2xl text-base leading-relaxed sm:text-lg">
                        When enabled, your data is scrubbed of all PII
                        (Personally Identifiable Information) before being
                        mapped to global trend analysis.
                      </p>
                    </div>
                    <div className="flex flex-col gap-5 rounded-xl border border-inverse-foreground/15 bg-inverse-foreground/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10">
                      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                        <div className="vs-icon-tile vs-icon-tile-primary flex h-14 w-14 sm:h-16 sm:w-16">
                          <EyeOff size={32} />
                        </div>
                        <div>
                          <p className="text-lg font-semibold sm:text-xl">
                            Privacy Shield Mode
                          </p>
                          <p className="vs-band-muted text-sm font-medium">
                            Hide identity from global recruitment pools.
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 rounded-xl border border-border bg-card p-5 sm:p-8 lg:rounded-xl lg:p-12 lg:space-y-10">
                  <h4 className="text-lg font-semibold text-foreground sm:text-xl">
                    Data Management
                  </h4>
                  <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div className="flex items-center gap-4 text-rose-600 sm:gap-6">
                      <ShieldAlert size={28} />
                      <div>
                        <p className="font-semibold">Purge Personal History</p>
                        <p className="text-sm text-rose-400 font-medium italic">
                          Permanently delete all synced intelligence sources.
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="group relative overflow-hidden rounded-xl bg-primary p-5 text-primary-foreground shadow-2xl sm:p-8 lg:rounded-xl lg:p-12">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-card/10 blur-[100px] transition-all group-hover:scale-125" />
                  <div className="relative z-10 flex flex-col justify-between gap-12 md:flex-row md:items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-card/20 border-white/30 font-semibold tracking-[0.2em] uppercase text-[10px] py-2 px-4 backdrop-blur-md">
                          Gold Tier
                        </Badge>
                        <p className="text-label text-primary-foreground/70">
                          Active Member
                        </p>
                      </div>
                      <h3 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
                        Intelligence Pro
                      </h3>
                      <p className="max-w-sm text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
                        Unlimited AI Advisor access, real-time Ethiopia market
                        maps, and automated career pathing.
                      </p>
                    </div>
                    <div className="space-y-2 text-left md:text-right">
                      <p className="text-5xl font-semibold tracking-tighter sm:text-6xl lg:text-7xl">
                        $29
                        <span className="text-2xl text-primary-foreground/50">/mo</span>
                      </p>
                      <p className="text-label text-primary-foreground/70">
                        Next: Feb 12, 2024
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                  <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:rounded-xl lg:p-12">
                    <h4 className="mb-7 text-lg font-semibold text-foreground sm:mb-10 sm:text-xl">
                      Payment Method
                    </h4>
                    <div className="flex items-center gap-4 rounded-[24px] border border-border bg-muted p-4 sm:gap-6 sm:p-6">
                      <div className="flex h-12 w-14 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground sm:w-16">
                        <CardIcon size={28} />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground sm:text-lg">
                          •••• 4242
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          Expires 12/26
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="mt-7 h-auto justify-start p-0 text-xs font-bold uppercase tracking-widest text-primary sm:mt-10"
                    >
                      Update Billing Data
                    </Button>
                  </div>

                  <div className="space-y-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:rounded-xl lg:p-12 lg:space-y-10">
                    <h4 className="text-lg font-semibold text-foreground sm:text-xl">
                      Allocation Stats
                    </h4>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          <span>AI Advisor Usage</span>
                          <span className="text-foreground">85% Used</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-[85%] rounded-lg bg-primary shadow-[0_0_12px] " />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          <span>Market Syncs</span>
                          <span className="text-foreground">Unlimited</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-full rounded-full bg-success" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:rounded-xl lg:p-12">
                  <h4 className="mb-7 text-lg font-semibold text-foreground sm:mb-10 sm:text-xl lg:mb-12">
                    Invoice History
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        date: "Jan 12, 2024",
                        amt: "$29.00",
                        status: "Paid",
                        id: "#INV-42901",
                      },
                      {
                        date: "Dec 12, 2023",
                        amt: "$29.00",
                        status: "Paid",
                        id: "#INV-38102",
                      },
                      {
                        date: "Nov 12, 2023",
                        amt: "$29.00",
                        status: "Paid",
                        id: "#INV-29004",
                      },
                    ].map((inv, idx) => (
                      <div
                        key={idx}
                        className="group flex flex-col gap-4 border-b border-border py-5 last:border-none sm:flex-row sm:items-center sm:justify-between sm:py-6"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
                            <Download size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {inv.date}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {inv.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-10">
                          <span className="text-base font-semibold text-foreground sm:text-lg">
                            {inv.amt}
                          </span>
                          <Badge className="bg-success/15 text-success border-none font-bold text-[10px] uppercase py-1.5 px-4 rounded-lg">
                            Success
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
