"use client";

import React, { Suspense, useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, RefreshCw, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildAuthSessionData,
  getApiErrorMessage,
  loginUser,
  resendOtp,
  verifyEmail,
} from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const rawPassword = searchParams.get("p") ?? "";
  const password = rawPassword ? atob(rawPassword) : "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const setAuthData = useAppStore((state) => state.setAuthData);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only accept digits
      if (value && !/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setApiError(null);

      // Auto-advance to next field
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all digits filled
      const fullCode = newOtp.join("");
      if (fullCode.length === OTP_LENGTH && newOtp.every((d) => d !== "")) {
        handleVerify(fullCode);
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);
      if (!pasted) return;

      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      setApiError(null);

      // Focus the next empty field or the last field
      const nextEmpty = newOtp.findIndex((d) => d === "");
      inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();

      // Auto-submit if all filled
      if (pasted.length === OTP_LENGTH) {
        handleVerify(pasted);
      }
    },
    [otp],
  );

  async function handleVerify(code?: string) {
    const otpCode = code ?? otp.join("");
    if (otpCode.length !== OTP_LENGTH) {
      setApiError("Please enter the full 6-digit code.");
      return;
    }

    setApiError(null);
    setIsVerifying(true);

    try {
      await verifyEmail({ email, otp: otpCode });
      setSuccessMessage("Email verified successfully! Signing you in...");

      // Auto-login after verification
      if (password) {
        try {
          const loginResult = await loginUser({ email, password });
          const authSessionData = await buildAuthSessionData(loginResult);
          setAuthData(authSessionData);
          setTimeout(() => router.push("/"), 800);
        } catch {
          // Login failed — send them to sign-in page
          setTimeout(() => router.push("/sign-in"), 1500);
        }
      } else {
        // No password available (came from sign-in flow) — redirect to sign-in
        setTimeout(() => router.push("/sign-in"), 1500);
      }
    } catch (error) {
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || isResending) return;

    setApiError(null);
    setSuccessMessage(null);
    setIsResending(true);

    try {
      const result = await resendOtp({ email });
      setSuccessMessage(result.message);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }

  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + "•".repeat(b.length) + c)
    : "";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
        {/* LEFT SIDE - BRANDING */}
        <section className="relative hidden w-1/2 flex-col justify-between bg-[#1d59db] p-8 shrink-0 lg:flex">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 text-white">
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
              <h1 className="text-4xl font-bold leading-[1.1] text-white">
                One Last Step to Unlock Your Intelligence Dashboard.
              </h1>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                We&apos;ve sent a verification code to your email. Enter it
                below to activate your account and start making data-driven
                career decisions.
              </p>
            </div>
          </div>

          {/* Security Info Card */}
          <div className="rounded-xl bg-white/20 p-6 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Secure Verification
                </p>
                <p className="text-[11px] text-blue-100/80">
                  Your code expires in 10 minutes
                </p>
              </div>
            </div>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              We use one-time verification codes to protect your account. Never
              share your code with anyone — VentureScope will never ask for it
              outside of this page.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE - OTP FORM */}
        <section className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm sm:max-w-md space-y-6">
            {/* Back link */}
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to registration
            </Link>

            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 mb-2">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Check your email
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                We&apos;ve sent a 6-digit verification code to{" "}
                <span className="font-semibold text-slate-700">
                  {maskedEmail}
                </span>
              </p>
            </div>

            {/* OTP Input Grid */}
            <div className="flex justify-center gap-2.5 sm:gap-3">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isVerifying}
                  autoComplete="one-time-code"
                  className={`
                    h-13 w-11 sm:h-14 sm:w-12 rounded-xl border-2 bg-[#f0f4ff] text-center
                    text-xl sm:text-2xl font-bold text-slate-800
                    outline-none transition-all duration-200
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:bg-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${otp[index] ? "border-blue-400 bg-blue-50/50" : "border-transparent"}
                    ${apiError ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}
                  `}
                />
              ))}
            </div>

            {/* Error / Success Messages */}
            {apiError && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-center">
                <p className="text-xs font-medium text-red-600">{apiError}</p>
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-center">
                <p className="text-xs font-medium text-emerald-600">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Verify Button */}
            <Button
              onClick={() => handleVerify()}
              disabled={isVerifying || otp.join("").length !== OTP_LENGTH}
              className="h-11 w-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">
                Didn&apos;t receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className={`
                  inline-flex items-center gap-1.5 text-xs font-bold transition-colors
                  ${
                    cooldown > 0 || isResending
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-700 cursor-pointer"
                  }
                `}
              >
                <RefreshCw
                  size={12}
                  className={isResending ? "animate-spin" : ""}
                />
                {isResending
                  ? "Sending..."
                  : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend code"}
              </button>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Having trouble?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Try signing in
                </Link>{" "}
                or contact support.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
