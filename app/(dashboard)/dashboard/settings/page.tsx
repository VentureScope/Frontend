"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Camera,
  MapPin,
  Briefcase,
  ExternalLink,
  Download,
  CreditCard as CardIcon,
  ShieldAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  location: z.string().min(2, "Location is required"),
  portfolio: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useAppStore((state) => state.authData.user);
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

  const sidebarItems = [
    { id: "profile", label: "Profile Identity", icon: User },
    { id: "intelligence", label: "Intelligence Sources", icon: Database },
    { id: "ai-advisor", label: "AI Advisor Tuning", icon: Sparkles },
    { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
    { id: "billing", label: "Subscription", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* --- GLOBAL HEADER --- */}
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1d59db]">
              Command Center
            </p>
            <h1 className="text-5xl font-black tracking-tight text-[#0f172a]">
              Settings
            </h1>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="h-14 rounded-2xl border-slate-200 bg-white font-bold text-slate-500 hover:bg-slate-50 px-10"
            >
              Discard
            </Button>
            <Button className="h-14 rounded-2xl bg-[#1d59db] font-bold text-white shadow-xl shadow-blue-500/20 px-12 hover:bg-blue-700 transition-all">
              Save Changes
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* --- SIDEBAR NAVIGATION --- */}
          <nav className="space-y-3 lg:col-span-3">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-sm font-bold transition-all border border-transparent",
                  activeTab === item.id
                    ? "bg-white text-[#1d59db] shadow-sm border-slate-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                )}
              >
                <item.icon
                  size={22}
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
                <div className="rounded-[40px] bg-white p-10 shadow-sm border border-slate-100">
                  <div className="flex flex-col gap-10 md:flex-row md:items-center mb-12">
                    <div className="relative group">
                      <div className="h-36 w-36 rounded-full border-[6px] border-white shadow-2xl bg-slate-100 overflow-hidden ring-1 ring-slate-100">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button className="absolute bottom-1 right-1 h-11 w-11 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-transform hover:scale-110">
                        <Camera size={20} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-[#0f172a]">
                        Public Identity
                      </h3>
                      <p className="text-slate-400 max-w-sm leading-relaxed">
                        This data informs your market alignment scores and
                        career-fit recommendations.
                      </p>
                    </div>
                  </div>

                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10"
                    onSubmit={form.handleSubmit(console.log)}
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

                <div className="rounded-[40px] bg-white p-10 shadow-sm border border-slate-100 divide-y divide-slate-50">
                  <div className="flex items-center justify-between py-8">
                    <div>
                      <p className="text-lg font-black text-slate-900">
                        Account Password
                      </p>
                      <p className="text-sm text-slate-400">
                        Last changed: 4 months ago
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl font-bold px-8"
                    >
                      Change Password
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-8">
                    <div>
                      <p className="text-lg font-black text-slate-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-slate-400">
                        Protects your intelligence assets with secondary
                        validation.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {/* 2. INTELLIGENCE SOURCES */}
            {activeTab === "intelligence" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[40px] bg-white p-12 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="h-20 w-20 rounded-full border-[6px] border-emerald-50 flex items-center justify-center text-emerald-500 text-2xl font-black">
                      98%
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#0f172a]">
                        Intelligence Sync Health
                      </h3>
                      <p className="text-slate-400 font-medium">
                        All data hooks are currently optimized and active.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-blue-100 text-blue-600 font-bold gap-3 px-8"
                  >
                    <RefreshCw size={18} /> Force Data Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="rounded-[40px] border-2 border-blue-100 bg-white p-10 flex flex-col justify-between h-72">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-16 rounded-[20px] bg-slate-900 flex items-center justify-center text-white">
                        <Github size={32} />
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 font-black tracking-widest uppercase border-none py-1.5 px-4 text-[10px]">
                        Connected
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-[#0f172a]">
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

                  <div className="rounded-[40px] border border-slate-100 border-dashed bg-white p-10 flex flex-col justify-between h-72 opacity-60 transition-opacity hover:opacity-100">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-16 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-300">
                        <GraduationCap size={32} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Available
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-slate-400">
                        University Transcript Hub
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Authorized academic portals to verify degrees and GPA
                        scores.
                      </p>
                      <Button className="w-full h-12 rounded-xl bg-[#1d59db] font-bold">
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
                <div className="rounded-[40px] bg-white p-12 shadow-sm border border-slate-100 space-y-12">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-[#0f172a]">
                      Advisor Personality
                    </h3>
                    <p className="text-slate-400 text-lg">
                      Calibrate the intelligence engine to your specific
                      professional appetite.
                    </p>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-8 p-10 rounded-[32px] bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-end">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
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
                      <div className="flex items-center justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
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
                <div className="rounded-[40px] bg-[#020617] p-16 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-blue-600/10 blur-[100px]" />
                  <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-4xl font-black tracking-tight">
                        Intelligence Anonymization
                      </h3>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                        When enabled, your data is scrubbed of all PII
                        (Personally Identifiable Information) before being
                        mapped to global trend analysis.
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-8">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                          <EyeOff size={32} />
                        </div>
                        <div>
                          <p className="font-black text-xl">
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

                <div className="rounded-[40px] bg-white p-12 border border-slate-100 space-y-10">
                  <h4 className="text-xl font-black text-slate-900">
                    Data Management
                  </h4>
                  <div className="flex items-center justify-between p-8 rounded-3xl bg-rose-50/50 border border-rose-100">
                    <div className="flex items-center gap-6 text-rose-600">
                      <ShieldAlert size={28} />
                      <div>
                        <p className="font-black">Purge Personal History</p>
                        <p className="text-sm text-rose-400 font-medium italic">
                          Permanently delete all synced intelligence sources.
                        </p>
                      </div>
                    </div>
                    <Button
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
                <div className="rounded-[40px] bg-[#1d59db] p-12 text-white shadow-2xl relative overflow-hidden group">
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
                      <h3 className="text-5xl font-black tracking-tighter">
                        Intelligence Pro
                      </h3>
                      <p className="text-blue-100/80 text-lg leading-relaxed max-w-sm">
                        Unlimited AI Advisor access, real-time Ethiopia market
                        maps, and automated career pathing.
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-7xl font-black tracking-tighter">
                        $29
                        <span className="text-2xl text-blue-200/50">/mo</span>
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100/60">
                        Next: Feb 12, 2024
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="rounded-[40px] bg-white p-12 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <h4 className="font-black text-slate-900 text-xl mb-10">
                      Payment Method
                    </h4>
                    <div className="flex items-center gap-6 p-6 rounded-[24px] bg-slate-50 border border-slate-100">
                      <div className="h-12 w-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <CardIcon size={28} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-lg">
                          •••• 4242
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Expires 12/26
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-[#1d59db] font-bold text-xs mt-10 justify-start uppercase tracking-widest"
                    >
                      Update Billing Data
                    </Button>
                  </div>

                  <div className="rounded-[40px] bg-white p-12 shadow-sm border border-slate-100 space-y-10">
                    <h4 className="font-black text-slate-900 text-xl">
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

                <div className="rounded-[40px] bg-white p-12 shadow-sm border border-slate-100">
                  <h4 className="font-black text-slate-900 text-xl mb-12">
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
                        className="flex items-center justify-between py-6 border-b border-slate-50 last:border-none group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-[18px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1d59db] group-hover:text-white transition-colors">
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
                        <div className="flex items-center gap-10">
                          <span className="text-lg font-black text-slate-900">
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
    </div>
  );
}
