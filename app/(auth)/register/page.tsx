"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Star, Check, X, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  getApiErrorMessage,
  registerUser,
  getGoogleOAuthLoginUrl,
  getGithubOAuthLoginUrl,
} from "@/lib/auth-api";
import { RegisterPayload } from "@/types/auth";

// ─── Password Strength ────────────────────────────────────────────────────────

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter (A–Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a–z)", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number (0–9)", test: (pw) => /\d/.test(pw) },
  {
    label: "One special character (!@#…)",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

interface StrengthInfo {
  level: StrengthLevel;
  label: string;
  color: string; // Tailwind bg class
  textColor: string; // Tailwind text class
}

function getStrength(password: string): StrengthInfo {
  const passed = PASSWORD_REQUIREMENTS.filter((r) => r.test(password)).length;

  if (password.length === 0) {
    return { level: 0, label: "", color: "bg-muted", textColor: "text-muted-foreground" };
  }
  if (passed <= 1) {
    return { level: 1, label: "Weak", color: "bg-destructive", textColor: "text-destructive" };
  }
  if (passed === 2) {
    return { level: 2, label: "Fair", color: "bg-muted-foreground/40", textColor: "text-secondary" };
  }
  if (passed === 3 || passed === 4) {
    return { level: 3, label: "Good", color: "bg-muted0", textColor: "text-primary" };
  }
  return { level: 4, label: "Strong", color: "bg-success", textColor: "text-success" };
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const formSchema = z
  .object({
    role: z.literal("professional"),
    email: z.string().email("Please enter a valid work email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/\d/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    full_name: z.string().min(2, "Full name is required"),
    career_interest: z.string().min(2, "Career interest is required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;
const GOOGLE_OAUTH_SESSION_KEY = "google_oauth_tx";
const GITHUB_OAUTH_SESSION_KEY = "github_oauth_tx";

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isGithubSubmitting, setIsGithubSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      career_interest: "",
      role: "professional",
    },
    mode: "onChange",
  });

  // Watch password live for the strength indicator
  const passwordValue = form.watch("password");
  const strength = useMemo(() => getStrength(passwordValue ?? ""), [passwordValue]);

  async function onGoogleSignIn() {
    setApiError(null);
    setIsGoogleSubmitting(true);
    try {
      const { authorization_url, state } = await getGoogleOAuthLoginUrl();
      sessionStorage.setItem(
        GOOGLE_OAUTH_SESSION_KEY,
        JSON.stringify({ state, createdAt: Date.now() }),
      );
      window.location.href = authorization_url;
    } catch (error) {
      setApiError(getApiErrorMessage(error));
      setIsGoogleSubmitting(false);
    }
  }

  async function onGithubSignIn() {
    setApiError(null);
    setIsGithubSubmitting(true);
    try {
      const { authorization_url, state } = await getGithubOAuthLoginUrl();
      sessionStorage.setItem(
        GITHUB_OAUTH_SESSION_KEY,
        JSON.stringify({ state, createdAt: Date.now(), flow: "register" }),
      );
      window.location.href = authorization_url;
    } catch (error) {
      setApiError(getApiErrorMessage(error));
      setIsGithubSubmitting(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const payload: RegisterPayload = {
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        career_interest: values.career_interest,
        role: values.role,
      };
      await registerUser(payload);
      // Registration triggers an OTP email — redirect to verification page.
      const params = new URLSearchParams({
        email: values.email,
        p: btoa(values.password),
      });
      router.push(`/verify-email?${params.toString()}`);
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-lg sm:rounded-xl bg-card shadow-2xl">
        {/* ── LEFT SIDE ── */}
        <section className="relative hidden w-1/2 shrink-0 flex-col justify-between border-r border-border bg-muted p-8 lg:flex">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 text-foreground">
              <Image
                src="/logo.png"
                alt="VentureScope Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight">
                VentureScope
              </span>
            </div>

            {/* Headline */}
            <div className="max-w-md space-y-4">
              <h1 className="text-4xl font-bold leading-[1.1] text-foreground">
                The Intelligence Layer for Your Next Move.
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Join 20,000+ professionals and HR leaders using data-driven
                insights to navigate career transitions with absolute clarity.
              </p>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="rounded-md border border-border bg-card p-6">
            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-warning/60 text-warning"
                />
              ))}
            </div>
            <p className="mb-4 text-sm font-medium leading-relaxed text-foreground">
              &quot;VentureScope transformed our recruitment strategy from
              guesswork to a precision science. The AI advisor is truly
              elite.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-background/50">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                  alt="Sarah Jenkins"
                  className="h-full w-full object-cover bg-primary/30"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Sarah Jenkins
                </p>
                <p className="text-[10px] text-primary-foreground/80 uppercase tracking-widest opacity-80">
                  Director of Talent, Innovate Corp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT SIDE ── */}
        <section className="flex flex-1 flex-col items-center justify-center bg-card px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm sm:max-w-md space-y-5">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Create your account
              </h2>
              <p className="text-sm text-muted-foreground">
                Start your intelligence-led career journey today.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <input
                type="hidden"
                {...form.register("role")}
                value="professional"
              />

              {/* Full Name */}
              <Field>
                <FieldLabel className="text-xs font-bold text-foreground">
                  Full Name
                </FieldLabel>
                <Input
                  placeholder="Enter your full name"
                  {...form.register("full_name")}
                  className="h-10 text-sm border-none bg-muted px-3 focus-visible:ring-2 focus-visible:ring-primary"
                />
                {form.formState.errors.full_name && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.full_name.message}
                  </FieldError>
                )}
              </Field>

              {/* Career Interest */}
              <Field>
                <FieldLabel className="text-xs font-bold text-foreground">
                  Career Interest
                </FieldLabel>
                <Input
                  placeholder="e.g. Data Science, Product Management"
                  {...form.register("career_interest")}
                  className="h-10 text-sm border-none bg-muted px-3 focus-visible:ring-2 focus-visible:ring-primary"
                />
                {form.formState.errors.career_interest && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.career_interest.message}
                  </FieldError>
                )}
              </Field>

              {/* Work Email */}
              <Field>
                <FieldLabel className="text-xs font-bold text-foreground">
                  Work Email
                </FieldLabel>
                <Input
                  placeholder="name@company.com"
                  {...form.register("email")}
                  className="h-10 text-sm border-none bg-muted px-3 focus-visible:ring-2 focus-visible:ring-primary"
                />
                {form.formState.errors.email && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.email.message}
                  </FieldError>
                )}
              </Field>

              {/* Password + Strength */}
              <Field>
                <FieldLabel className="text-xs font-bold text-foreground">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="h-10 text-sm border-none bg-muted px-3 pr-10 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength bar — only shown when typing */}
                {passwordValue && passwordValue.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {/* Segmented bar */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4].map((seg) => (
                        <div
                          key={seg}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            strength.level >= seg
                              ? strength.color
                              : "bg-muted"
                          }`}
                        />
                      ))}
                      {strength.label && (
                        <span
                          className={`ml-1 shrink-0 text-[10px] font-bold transition-colors ${strength.textColor}`}
                        >
                          {strength.label}
                        </span>
                      )}
                    </div>

                    {/* Requirements checklist */}
                    <ul className="grid grid-cols-1 gap-y-0.5">
                      {PASSWORD_REQUIREMENTS.map((req) => {
                        const met = req.test(passwordValue);
                        return (
                          <li
                            key={req.label}
                            className={`flex items-center gap-1.5 text-[10px] transition-colors ${
                              met ? "text-success" : "text-muted-foreground"
                            }`}
                          >
                            {met ? (
                              <Check size={10} className="shrink-0" />
                            ) : (
                              <X size={10} className="shrink-0" />
                            )}
                            {req.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {form.formState.errors.password && !passwordValue && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel className="text-xs font-bold text-foreground">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("confirmPassword")}
                    className="h-10 text-sm border-none bg-muted px-3 pr-10 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.confirmPassword.message}
                  </FieldError>
                )}
              </Field>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              {apiError && (
                <p className="text-center text-xs text-destructive">{apiError}</p>
              )}

              {/* Divider */}
              <div className="relative py-2 flex items-center">
                <div className="grow border-t border-border"></div>
                <span className="mx-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-card px-1">
                  Or continue with
                </span>
                <div className="grow border-t border-border"></div>
              </div>

              {/* Social Options */}
              <div className="flex w-full gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onGoogleSignIn}
                  disabled={isGoogleSubmitting || isGithubSubmitting || isSubmitting}
                  className="h-10 flex-1 border-border bg-card text-xs font-bold text-muted-foreground shadow-sm hover:bg-muted gap-2"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {isGoogleSubmitting ? "Connecting..." : "Google"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onGithubSignIn}
                  disabled={isGoogleSubmitting || isGithubSubmitting || isSubmitting}
                  className="h-10 flex-1 border-border bg-card text-xs font-bold text-muted-foreground shadow-sm hover:bg-muted gap-2"
                >
                  <Github className="h-3.5 w-3.5 text-foreground" />
                  {isGithubSubmitting ? "Connecting..." : "GitHub"}
                </Button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="space-y-3 text-center text-[11px]">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign In to Workspace
                </Link>
              </p>
              <p className="leading-relaxed text-muted-foreground px-6">
                By signing up, you agree to our{" "}
                <Link href="#" className="underline decoration-border">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline decoration-border">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
