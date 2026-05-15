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
    <div className="min-h-screen bg-[#f8fafc] px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10 xl:px-12">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-10 lg:space-y-12">
        {/* --- GLOBAL HEADER --- */}
        <header className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1d59db]">
              Command Center
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
              Settings
            </h1>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              onClick={() => form.reset(profileDefaults)}
              disabled={activeTab !== "profile" || form.formState.isSubmitting}
              variant="outline"
              className="h-12 w-full rounded-2xl border-slate-200 bg-white px-6 font-bold text-slate-500 hover:bg-slate-50 sm:h-14 sm:w-auto sm:px-10"
            >
              Discard
            </Button>
            <Button
              onClick={form.handleSubmit(onProfileSubmit)}
              disabled={activeTab !== "profile" || form.formState.isSubmitting}
              className="h-12 w-full rounded-2xl bg-[#1d59db] px-6 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-auto sm:px-12"
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
                  "flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-left text-sm font-bold transition-all sm:px-5 sm:py-4 lg:gap-4 lg:px-6 lg:py-5",
                  activeTab === item.id
                    ? "bg-white text-[#1d59db] shadow-sm border-slate-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                )}
              >
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id ? "text-[#1d59db]" : "text-slate-300"
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
                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 lg:rounded-[40px] lg:p-10">
                  <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:gap-8 md:flex-row md:items-center lg:mb-12 lg:gap-10">
                    <div className="relative group">
                      <div className="h-28 w-28 overflow-hidden rounded-full border-[6px] border-white bg-slate-100 shadow-2xl ring-1 ring-slate-100 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-blue-700 sm:h-11 sm:w-11">
                        <Camera size={18} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-[#0f172a] sm:text-3xl">
                        Public Identity
                      </h3>
                      <p className="text-slate-400 max-w-sm leading-relaxed">
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
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Full Name
                        </FieldTitle>
                        <Input
                          {...form.register("fullName")}
                          className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-6 text-slate-900"
                        />
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.fullName]} />
                    </Field>

                    <Field>
                      <FieldLabel className="w-full">
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Current Role
                        </FieldTitle>
                        <div className="relative">
                          <Briefcase
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                          />
                          <Input
                            {...form.register("role")}
                            className="h-14 w-full rounded-2xl bg-slate-50 border-none font-bold pl-14 pr-6 text-slate-900"
                          />
                        </div>
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.role]} />
                    </Field>

                    <Field>
                      <FieldLabel className="w-full">
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Location / Timezone
                        </FieldTitle>
                        <div className="relative">
                          <MapPin
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                          />
                          <Input
                            {...form.register("location")}
                            className="h-14 w-full rounded-2xl bg-slate-50 border-none font-bold pl-14 pr-6 text-slate-900"
                          />
                        </div>
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.location]} />
                    </Field>

                    <Field>
                      <FieldLabel className="w-full">
                        <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Portfolio URL
                        </FieldTitle>
                        <div className="relative">
                          <ExternalLink
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                          />
                          <Input
                            {...form.register("portfolio")}
                            className="h-14 w-full rounded-2xl bg-slate-50 border-none font-bold pl-14 pr-6 text-slate-900"
                          />
                        </div>
                      </FieldLabel>
                      <FieldError errors={[form.formState.errors.portfolio]} />
                    </Field>
                  </form>
                </div>

                <div className="divide-y divide-slate-50 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 lg:rounded-[40px] lg:p-10">
                  <div className="py-6 sm:py-8">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-black text-slate-900">
                          Account Password
                        </p>
                        <p className="text-sm text-slate-400">
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
                      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-6">
                        {passwordError && (
                          <div className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-lg">
                            {passwordError}
                          </div>
                        )}
                        <Field>
                          <FieldLabel className="w-full">
                            <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                              Current Password
                            </FieldTitle>
                            <Input
                              type="password"
                              value={currPassword}
                              onChange={(e) => setCurrPassword(e.target.value)}
                              className="h-12 rounded-xl bg-white border border-slate-200 font-bold px-4"
                            />
                          </FieldLabel>
                        </Field>

                        <Field>
                          <FieldLabel className="w-full">
                            <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                              New Password
                            </FieldTitle>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="h-12 rounded-xl bg-white border border-slate-200 font-bold px-4"
                            />
                          </FieldLabel>
                        </Field>

                        <Button
                          onClick={onPasswordSubmit}
                          className="h-12 mt-2 w-full md:w-auto rounded-xl bg-[#1d59db] font-bold"
                        >
                          Confirm Password Change
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-black text-slate-900">
                          Two-Factor Authentication
                        </p>
                        {mfaEnabled ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase py-1 px-3">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-400 border-none font-bold text-[10px] uppercase py-1 px-3">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">
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
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                          Registered Devices
                        </h4>
                        <button 
                          onClick={() => setShowMfaEnrollModal(true)}
                          disabled={mfaFactors.length >= 3}
                          className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline disabled:text-slate-300 disabled:no-underline"
                        >
                          {mfaFactors.length >= 3 ? "Limit Reached (Max 3)" : "+ Add Backup Authenticator"}
                        </button>
                      </div>
                      <div className="grid gap-3">
                        {mfaFactors.map((f, i) => (
                          <div 
                            key={f.factor_id}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-slate-400">
                                <Smartphone size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {f.friendly_name || `Authenticator ${i + 1}`}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  Added {new Date(f.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {mfaFactors.length > 1 && (
                                <Badge className="bg-white text-slate-400 border border-slate-200 font-bold text-[9px] uppercase px-2 py-0.5">
                                  Active
                                </Badge>
                              )}
                              <button 
                                onClick={() => onUnenrollClick(f.factor_id)}
                                className="rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors"
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
                <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 lg:rounded-[40px] lg:p-12 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-emerald-50 text-xl font-black text-emerald-500 sm:h-20 sm:w-20 sm:text-2xl">
                      98%
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#0f172a] sm:text-2xl">
                        Intelligence Sync Health
                      </h3>
                      <p className="text-slate-400 font-medium">
                        All data hooks are currently optimized and active.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-11 w-full gap-3 rounded-xl border-blue-100 px-5 font-bold text-blue-600 sm:h-12 sm:w-auto sm:px-8"
                  >
                    <RefreshCw size={18} /> Force Data Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                  <div className="flex min-h-64 flex-col justify-between rounded-3xl border-2 border-blue-100 bg-white p-5 sm:p-8 lg:rounded-[40px] lg:p-10">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-16 rounded-[20px] bg-slate-900 flex items-center justify-center text-white">
                        <Github size={32} />
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 font-black tracking-widest uppercase border-none py-1.5 px-4 text-[10px]">
                        Connected
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-[#0f172a] sm:text-xl">
                        GitHub Contributions
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Mapping repositories and commit patterns to technical
                        benchmarks.
                      </p>
                      <button className="text-xs font-bold text-rose-500 uppercase tracking-widest hover:underline pt-2">
                        Disconnect Source
                      </button>
                    </div>
                  </div>

                  <div className="flex min-h-64 flex-col justify-between rounded-3xl border border-dashed border-slate-100 bg-white p-5 opacity-60 transition-opacity hover:opacity-100 sm:p-8 lg:rounded-[40px] lg:p-10">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-16 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-300">
                        <GraduationCap size={32} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Available
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-black text-slate-400 sm:text-xl">
                        University Transcript Hub
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Authorized academic portals to verify degrees and GPA
                        scores.
                      </p>
                      <Button className="h-11 w-full rounded-xl bg-[#1d59db] font-bold sm:h-12">
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
                <div className="space-y-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:space-y-10 sm:p-8 lg:rounded-[40px] lg:space-y-12 lg:p-12">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-[#0f172a] sm:text-3xl">
                      Advisor Personality
                    </h3>
                    <p className="text-base text-slate-400 sm:text-lg">
                      Calibrate the intelligence engine to your specific
                      professional appetite.
                    </p>
                  </div>

                  <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                    <div className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:space-y-8 sm:p-8 lg:rounded-[32px] lg:p-10">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-[#1d59db] mb-2">
                            Career Goal Aggression
                          </p>
                          <p className="text-sm text-slate-400 max-w-sm">
                            How aggressive should AI be in suggesting high-risk
                            pivots?
                          </p>
                        </div>
                        <span className="text-lg font-black text-[#0f172a]">
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
                      <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                        <div className="space-y-1">
                          <p className="font-bold text-[#0f172a]">
                            Direct & Analytical Tone
                          </p>
                          <p className="text-xs text-slate-400">
                            Focus on data points over encouragement.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                        <div className="space-y-1">
                          <p className="font-bold text-[#0f172a]">
                            Global Benchmarking
                          </p>
                          <p className="text-xs text-slate-400">
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
                <div className="relative overflow-hidden rounded-3xl bg-[#020617] p-5 text-white shadow-2xl sm:p-8 lg:rounded-[40px] lg:p-12 xl:p-16">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-blue-600/10 blur-[100px]" />
                  <div className="relative z-10 space-y-7 sm:space-y-8 lg:space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                        Intelligence Anonymization
                      </h3>
                      <p className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                        When enabled, your data is scrubbed of all PII
                        (Personally Identifiable Information) before being
                        mapped to global trend analysis.
                      </p>
                    </div>
                    <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:rounded-[32px] lg:p-10">
                      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 sm:h-16 sm:w-16">
                          <EyeOff size={32} />
                        </div>
                        <div>
                          <p className="text-lg font-black sm:text-xl">
                            Privacy Shield Mode
                          </p>
                          <p className="text-sm text-slate-400 font-medium">
                            Hide identity from global recruitment pools.
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 rounded-3xl border border-slate-100 bg-white p-5 sm:p-8 lg:rounded-[40px] lg:p-12 lg:space-y-10">
                  <h4 className="text-lg font-black text-slate-900 sm:text-xl">
                    Data Management
                  </h4>
                  <div className="flex flex-col gap-4 rounded-3xl border border-rose-100 bg-rose-50/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div className="flex items-center gap-4 text-rose-600 sm:gap-6">
                      <ShieldAlert size={28} />
                      <div>
                        <p className="font-black">Purge Personal History</p>
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
                <div className="group relative overflow-hidden rounded-3xl bg-[#1d59db] p-5 text-white shadow-2xl sm:p-8 lg:rounded-[40px] lg:p-12">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 blur-[100px] transition-all group-hover:scale-125" />
                  <div className="relative z-10 flex flex-col justify-between gap-12 md:flex-row md:items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-white/20 border-white/30 font-black tracking-[0.2em] uppercase text-[10px] py-2 px-4 backdrop-blur-md">
                          Gold Tier
                        </Badge>
                        <p className="text-xs font-bold text-blue-100/60 uppercase tracking-widest">
                          Active Member
                        </p>
                      </div>
                      <h3 className="text-3xl font-black tracking-tighter sm:text-4xl lg:text-5xl">
                        Intelligence Pro
                      </h3>
                      <p className="max-w-sm text-base leading-relaxed text-blue-100/80 sm:text-lg">
                        Unlimited AI Advisor access, real-time Ethiopia market
                        maps, and automated career pathing.
                      </p>
                    </div>
                    <div className="space-y-2 text-left md:text-right">
                      <p className="text-5xl font-black tracking-tighter sm:text-6xl lg:text-7xl">
                        $29
                        <span className="text-2xl text-blue-200/50">/mo</span>
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100/60">
                        Next: Feb 12, 2024
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                  <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 lg:rounded-[40px] lg:p-12">
                    <h4 className="mb-7 text-lg font-black text-slate-900 sm:mb-10 sm:text-xl">
                      Payment Method
                    </h4>
                    <div className="flex items-center gap-4 rounded-[24px] border border-slate-100 bg-slate-50 p-4 sm:gap-6 sm:p-6">
                      <div className="flex h-12 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 sm:w-16">
                        <CardIcon size={28} />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800 sm:text-lg">
                          •••• 4242
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Expires 12/26
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="mt-7 h-auto justify-start p-0 text-xs font-bold uppercase tracking-widest text-[#1d59db] sm:mt-10"
                    >
                      Update Billing Data
                    </Button>
                  </div>

                  <div className="space-y-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 lg:rounded-[40px] lg:p-12 lg:space-y-10">
                    <h4 className="text-lg font-black text-slate-900 sm:text-xl">
                      Allocation Stats
                    </h4>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          <span>AI Advisor Usage</span>
                          <span className="text-slate-900">85% Used</span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full w-[85%] bg-[#1d59db] rounded-full shadow-[0_0_12px_rgba(29,89,219,0.3)]" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          <span>Market Syncs</span>
                          <span className="text-slate-900">Unlimited</span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 lg:rounded-[40px] lg:p-12">
                  <h4 className="mb-7 text-lg font-black text-slate-900 sm:mb-10 sm:text-xl lg:mb-12">
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
                        className="group flex flex-col gap-4 border-b border-slate-50 py-5 last:border-none sm:flex-row sm:items-center sm:justify-between sm:py-6"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#1d59db] group-hover:text-white sm:h-12 sm:w-12">
                            <Download size={20} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900">
                              {inv.date}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {inv.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-10">
                          <span className="text-base font-black text-slate-900 sm:text-lg">
                            {inv.amt}
                          </span>
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase py-1.5 px-4 rounded-lg">
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
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
                <AlertTriangle className="text-rose-600" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Delete Account
                </h3>
                <p className="text-xs text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                Your account will be deactivated. All synced data and AI
                intelligence history will be removed. Contact support within
                30 days to restore your account.
              </p>

              {/* Password field — only for email/password accounts */}
              {needsPassword && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Confirm with your password
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm font-medium text-slate-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
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
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
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
                  className="flex-1 rounded-xl bg-rose-600 font-bold text-white hover:bg-rose-700 disabled:opacity-50"
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
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowMfaModal(false)}
              className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                <ShieldCheck className="text-blue-600" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {mfaMode === "disable" ? "Confirm MFA Disable" : "Confirm Removal"}
                </h3>
                <p className="text-xs text-slate-400">
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
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {mfaMode === "disable" 
                      ? "Disabling two-factor authentication makes your account less secure." 
                      : "Removing this authenticator device will restrict your backup options."}
                    {needsPassword
                      ? " Please enter your password to confirm this change."
                      : " We will send a verification code to your email to confirm this change."}
                  </p>

                  {needsPassword && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Confirm with your password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={mfaPassword}
                        onChange={(e) => setMfaPassword(e.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-slate-600">
                    A 6-digit code has been sent to your registered email.
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={mfaOtp}
                    onChange={(e) => setMfaOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-14 w-full rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 focus:border-blue-600 outline-none"
                  />
                </div>
              )}

              {/* Error */}
              {mfaError && (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
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
                  className="flex-1 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
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
