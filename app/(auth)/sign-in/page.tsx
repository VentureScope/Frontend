"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight, TrendingUp, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  buildAuthSessionData,
  getApiErrorMessage,
  getGithubOAuthLoginUrl,
  getGoogleOAuthLoginUrl,
  loginUser,
} from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";
import { SignInPayload } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid work email"),
  password: z.string().min(1, "Password is required"),
});

const GOOGLE_OAUTH_SESSION_KEY = "google_oauth_tx";
const GITHUB_OAUTH_SESSION_KEY = "github_oauth_tx";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isGithubSubmitting, setIsGithubSubmitting] = useState(false);
  const setAuthData = useAppStore((state) => state.setAuthData);
  const router = useRouter();

  const form = useForm<SignInPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInPayload) {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const authResult = await loginUser(values);
      const authSessionData = await buildAuthSessionData(authResult);
      setAuthData(authSessionData);
      router.push("/");
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onGoogleSignIn() {
    setApiError(null);
    setIsGoogleSubmitting(true);
    console.log("[oauth] Requesting Google login URL");

    try {
      const { authorization_url, state } = await getGoogleOAuthLoginUrl();
      const parsedAuthorizationUrl = new URL(authorization_url);
      const clientId = parsedAuthorizationUrl.searchParams.get("client_id");

      if (!clientId) {
        setApiError(
          "Google OAuth is not configured on the server (missing client_id). Please contact support or try again later.",
        );
        setIsGoogleSubmitting(false);
        return;
      }

      sessionStorage.setItem(
        GOOGLE_OAUTH_SESSION_KEY,
        JSON.stringify({
          state,
          createdAt: Date.now(),
        }),
      );
      console.log("[oauth] Redirecting to Google authorization URL", {
        authorizationHost: parsedAuthorizationUrl.host,
      });
      window.location.href = authorization_url;
    } catch (error) {
      setApiError(getApiErrorMessage(error));
      setIsGoogleSubmitting(false);
      console.log("[oauth] Failed to start Google OAuth", { error });
    }
  }

  async function onGithubSignIn() {
    setApiError(null);
    setIsGithubSubmitting(true);
    console.log("[oauth] Requesting GitHub login URL");

    try {
      const { authorization_url, state } = await getGithubOAuthLoginUrl();
      const parsedAuthorizationUrl = new URL(authorization_url);

      sessionStorage.setItem(
        GITHUB_OAUTH_SESSION_KEY,
        JSON.stringify({
          state,
          createdAt: Date.now(),
          flow: "sign-in",
        }),
      );

      console.log("[oauth] Redirecting to GitHub authorization URL", {
        authorizationHost: parsedAuthorizationUrl.host,
      });
      window.location.href = authorization_url;
    } catch (error) {
      setApiError(getApiErrorMessage(error));
      setIsGithubSubmitting(false);
      console.log("[oauth] Failed to start GitHub OAuth", { error });
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden bg-white shadow-2xl">
        {/* --- LEFT SIDE: BRANDING & VISUALS (Hidden on mobile/tablet for focus) --- */}
        <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#020817] p-10 shrink-0 lg:flex">
          {/* Background Image Effect */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/aesthetic.png"
              alt="Aesthetic Background"
              fill
              className="object-cover opacity-80"
              priority
            />
            {/* Subtle Gradient to ensure text always pops! */}
            <div className="absolute inset-0 bg-linear-to-br from-[#020817]/60 via-transparent to-[#020817]/80" />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl font-bold tracking-tight">
                VentureScope
              </span>
            </div>

            {/* Hero Content */}
            <div className="max-w-xl space-y-4">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white">
                The Intelligence Layer for Your Career Journey.
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                Join thousands of professionals using data-driven insights to
                navigate the next chapter of their careers.
              </p>
            </div>
          </div>

          {/* Data Card (The Progress Visual) */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Market Insights
                  </p>
                  <p className="font-bold text-slate-100">
                    Role Alignment Score
                  </p>
                </div>
              </div>
              <span className="text-3xl font-bold text-blue-500">94%</span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[94%] bg-blue-600" />
            </div>
          </div>

          <div className="relative z-10 text-sm text-slate-500">
            © 2026 VentureScope Intelligence. All rights reserved.
          </div>
        </section>

        {/* --- RIGHT SIDE: LOGIN FORM (Centered in its container) --- */}
        <section className="flex flex-1 items-center justify-center bg-white px-6 py-10 sm:px-10">
          <div className="w-full max-w-105 space-y-6 bg-transparent">
            <div className="space-y-1.5">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="text-slate-500 text-[15px]">
                Enter your credentials to access your intelligence dashboard.
              </p>
            </div>

            {/* Social Logins */}
            <div className="flex w-full flex-col gap-3 sm:flex-row text-sm">
              <Button
                type="button"
                variant="outline"
                onClick={onGoogleSignIn}
                disabled={
                  isGoogleSubmitting || isGithubSubmitting || isSubmitting
                }
                className="flex-1 h-11 gap-2 border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                <span className="font-semibold">
                  {isGoogleSubmitting ? "Connecting..." : "Google"}
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onGithubSignIn}
                disabled={
                  isGoogleSubmitting || isGithubSubmitting || isSubmitting
                }
                className="flex-1 h-11 gap-2 border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Github className="h-4 w-4 text-slate-800" />
                <span className="font-semibold">
                  {isGithubSubmitting ? "Connecting..." : "GitHub"}
                </span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="grow border-t border-slate-200"></div>
              <span className="mx-4 shrink text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Or continue with email
              </span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Field>
                <FieldLabel className="text-[13px] font-bold text-slate-800">
                  Work Email
                </FieldLabel>
                <Input
                  placeholder="name@company.com"
                  {...form.register("email")}
                  className="h-11 border-none bg-[#f0f4ff] px-4 ring-offset-0 focus-visible:ring-2 focus-visible:ring-blue-600"
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-[13px] font-bold text-slate-800">
                    Password
                  </FieldLabel>
                  <Link
                    href="#"
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="h-11 border-none bg-[#f0f4ff] px-4 pr-12 ring-offset-0 focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <FieldError>
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full bg-[#1d59db] text-base font-semibold text-white shadow-xl shadow-blue-500/20 hover:bg-[#1748b3]"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {apiError && (
                <p className="text-center text-xs text-red-600">{apiError}</p>
              )}
            </form>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:underline"
              >
                Start for free
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
