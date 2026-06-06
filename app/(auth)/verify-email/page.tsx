"use client";

import React, {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, RefreshCw, ShieldCheck, Loader2 } from "lucide-react";
import { AuthMobileBrand } from "@/components/brand/AuthMobileBrand";
import { VentureScopeLogo } from "@/components/brand/VentureScopeLogo";
import { Button } from "@/components/ui/button";
import {
  buildAuthSessionData,
  getApiErrorMessage,
  loginUser,
  resendOtp,
  verifyEmail,
} from "@/lib/auth-api";
import { decodePasswordFromQuery } from "@/lib/auth-query-params";
import {
  buildRegisterUrl,
  buildSignInUrl,
  getReturnPathFromSearchParams,
  resolveAuthenticatedMemberPath,
  resolveReturnPath,
} from "@/lib/auth-redirect";
import {
  markOnboardingPending,
  resolveMemberEntryPath,
} from "@/lib/onboarding";
import { useAppStore } from "@/store/useAppStore";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
  const postAuthPath = resolveReturnPath(searchParams);
  const returnPathFromQuery = getReturnPathFromSearchParams(searchParams);
  const registerHref = buildRegisterUrl(returnPathFromQuery);
  const signInHref = buildSignInUrl(returnPathFromQuery);
  const email = searchParams.get("email") ?? "";
  const rawPassword = searchParams.get("p") ?? "";
  const password = rawPassword ? decodePasswordFromQuery(rawPassword) : "";

  const token = useAppStore((state) => state.authData.token);
  const setAuthData = useAppStore((state) => state.setAuthData);

  const [isHydrated, setIsHydrated] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const canShowForm = isHydrated && !token && Boolean(email);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !token) return;
    const userId = useAppStore.getState().authData.user?.id;
    router.replace(
      userId
        ? resolveMemberEntryPath(userId, postAuthPath)
        : resolveAuthenticatedMemberPath(postAuthPath),
    );
  }, [isHydrated, token, postAuthPath, router]);

  useEffect(() => {
    if (!isHydrated || token || email) return;
    router.replace(registerHref);
  }, [email, isHydrated, token, registerHref, router]);

  useEffect(() => {
    if (!canShowForm || cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [canShowForm, cooldown]);

  useEffect(() => {
    if (!canShowForm) return;
    inputRefs.current[0]?.focus();
  }, [canShowForm]);

  const handleVerify = useCallback(
    async (code?: string) => {
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

        if (password) {
          try {
            const loginResult = await loginUser({ email, password });
            const authSessionData = await buildAuthSessionData(loginResult);
            setAuthData(authSessionData);
            const userId = authSessionData.user?.id;
            if (userId) {
              markOnboardingPending(userId);
            }
            const entryPath = resolveMemberEntryPath(userId, postAuthPath);
            setTimeout(() => router.push(entryPath), 800);
          } catch {
            setTimeout(() => router.push(signInHref), 1500);
          }
        } else {
          setTimeout(() => router.push(signInHref), 1500);
        }
      } catch (error) {
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        setApiError(getApiErrorMessage(error));
      } finally {
        setIsVerifying(false);
      }
    },
    [email, otp, password, postAuthPath, router, setAuthData, signInHref],
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (value && !/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setApiError(null);

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      const fullCode = newOtp.join("");
      if (fullCode.length === OTP_LENGTH && newOtp.every((d) => d !== "")) {
        void handleVerify(fullCode);
      }
    },
    [otp, handleVerify],
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

      const nextEmpty = newOtp.findIndex((d) => d === "");
      inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();

      if (pasted.length === OTP_LENGTH) {
        void handleVerify(pasted);
      }
    },
    [otp, handleVerify],
  );

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

  if (!isHydrated || token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        {token ? "Redirecting…" : "Loading…"}
      </div>
    );
  }

  if (!email) {
    return null;
  }

  const maskedEmail = email.replace(
    /^(.{2})(.*)(@.*)$/,
    (_, a, b, c) => a + "•".repeat(b.length) + c,
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-primary/5 via-background to-background p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-xl sm:rounded-xl">
        {/* LEFT SIDE - BRANDING */}
        <section className="vs-band relative hidden w-1/2 shrink-0 flex-col justify-between overflow-hidden p-8 lg:flex lg:p-10">
          <div
            className="pointer-events-none absolute -right-16 top-8 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
            aria-hidden
          />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-inverse-foreground">
              <VentureScopeLogo
                size={32}
                accent={false}
                className="text-inverse-foreground"
              />
              <span className="text-xl font-bold tracking-tight">
                VentureScope
              </span>
            </div>

            <div className="max-w-md space-y-4">
              <p className="vs-accent-chip inline-flex rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                Account security
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] text-inverse-foreground">
                One Last Step to Unlock Your Intelligence Dashboard.
              </h1>
              <p className="text-sm leading-relaxed vs-band-muted">
                We&apos;ve sent a verification code to your email. Enter it
                below to activate your account and start making data-driven
                career decisions.
              </p>
            </div>
          </div>

          <div className="relative z-10 rounded-md border border-inverse-foreground/12 bg-inverse-foreground/8 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="vs-icon-tile-primary flex h-10 w-10 items-center justify-center rounded-md">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-inverse-foreground">
                  Secure Verification
                </p>
                <p className="text-[11px] vs-band-muted">
                  Your code expires in 10 minutes
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed vs-band-muted">
              We use one-time verification codes to protect your account. Never
              share your code with anyone — VentureScope will never ask for it
              outside of this page.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE - OTP FORM */}
        <section className="flex flex-1 flex-col items-center justify-center bg-card px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm sm:max-w-md space-y-6">
            <AuthMobileBrand />
            <Link
              href={registerHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              Back to registration
            </Link>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="vs-icon-tile-primary mb-2 flex h-12 w-12 items-center justify-center rounded-md">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Check your email
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We&apos;ve sent a 6-digit verification code to{" "}
                <span className="font-semibold text-muted-foreground">
                  {maskedEmail}
                </span>
              </p>
            </div>

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
                    h-13 w-11 sm:h-14 sm:w-12 rounded-xl border-2 bg-muted text-center
                    text-xl sm:text-2xl font-bold text-foreground
                    outline-none transition-all duration-200
                    focus:border-primary focus:ring-4 focus:ring-primary/20 focus:bg-card
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${otp[index] ? "border-primary bg-muted" : "border-transparent"}
                    ${apiError ? "border-destructive/40 focus:border-destructive focus:ring-destructive/20" : ""}
                  `}
                />
              ))}
            </div>

            {apiError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-center">
                <p className="text-xs font-medium text-destructive">{apiError}</p>
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-center">
                <p className="text-xs font-medium text-success">
                  {successMessage}
                </p>
              </div>
            )}

            <Button
              onClick={() => void handleVerify()}
              disabled={isVerifying || otp.join("").length !== OTP_LENGTH}
              className="h-11 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={cooldown > 0 || isResending}
                className={`
                  inline-flex items-center gap-1.5 text-xs font-bold transition-colors
                  ${
                    cooldown > 0 || isResending
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-primary hover:text-primary/90 cursor-pointer"
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

            <div className="pt-2 text-center">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Having trouble?{" "}
                <Link
                  href={signInHref}
                  className="font-semibold text-primary hover:underline"
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
