"use client";

import React, { Suspense, useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  KeyRound,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  getApiErrorMessage,
  requestPasswordReset,
  resetPassword,
} from "@/lib/auth-api";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

// ---------- Step 1 schema ----------
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// ---------- Step 3 schema ----------
const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  // Steps: "email" → "otp" → "password" → "success"
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">(
    initialEmail ? "email" : "email",
  );
  const [email, setEmail] = useState(initialEmail);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ──────────────────────────── STEP 1: Email ────────────────────────────
  const [isRequesting, setIsRequesting] = useState(false);

  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initialEmail },
  });

  async function onEmailSubmit(values: { email: string }) {
    setApiError(null);
    setIsRequesting(true);
    try {
      await requestPasswordReset({ email: values.email });
      setEmail(values.email);
      setStep("otp");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsRequesting(false);
    }
  }

  // ──────────────────────────── STEP 2: OTP ────────────────────────────
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first OTP input when entering step 2
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

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

      // When all digits filled, move to password step
      if (newOtp.every((d) => d !== "") && newOtp.join("").length === OTP_LENGTH) {
        // We don't auto-submit here — user still needs to set a new password
        setStep("password");
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

      const nextEmpty = newOtp.findIndex((d) => d === "");
      inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();

      if (pasted.length === OTP_LENGTH) {
        setStep("password");
      }
    },
    [otp],
  );

  function handleOtpContinue() {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setApiError("Please enter the full 6-digit code.");
      return;
    }
    setApiError(null);
    setStep("password");
  }

  async function handleResend() {
    if (cooldown > 0 || isResending) return;
    setApiError(null);
    setSuccessMessage(null);
    setIsResending(true);

    try {
      await requestPasswordReset({ email });
      setSuccessMessage("A new reset code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }

  // ──────────────────────────── STEP 3: New Password ────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordForm = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onPasswordSubmit(values: {
    password: string;
    confirmPassword: string;
  }) {
    setApiError(null);
    setIsVerifying(true);

    try {
      await resetPassword({
        email,
        otp: otp.join(""),
        new_password: values.password,
      });
      setStep("success");
    } catch (error) {
      const msg = getApiErrorMessage(error);
      // If OTP is invalid/expired, send user back to OTP step
      if (
        msg.toLowerCase().includes("expired") ||
        msg.toLowerCase().includes("invalid")
      ) {
        setOtp(Array(OTP_LENGTH).fill(""));
        setStep("otp");
      }
      setApiError(msg);
    } finally {
      setIsVerifying(false);
    }
  }

  // ──────────────────────────── Shared ────────────────────────────
  const maskedEmail = email
    ? email.replace(
        /^(.{2})(.*)(@.*)$/,
        (_, a, b, c) => a + "•".repeat(b.length) + c,
      )
    : "";

  // ──────────────────────────── Render ────────────────────────────
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-lg sm:rounded-xl bg-card shadow-2xl">
        {/* LEFT SIDE – BRANDING */}
        <section className="relative hidden w-1/2 flex-col justify-between bg-foreground p-8 shrink-0 lg:flex overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/aesthetic.png"
              alt="Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/70 via-transparent to-foreground/90" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 text-background">
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
              <h1 className="text-4xl font-bold leading-[1.1] text-background">
                {step === "success"
                  ? "You're All Set."
                  : "Reset Your Password."}
              </h1>
              <p className="text-sm text-muted-foreground/50 leading-relaxed">
                {step === "success"
                  ? "Your password has been updated. You can now sign in with your new credentials."
                  : "Don't worry — it happens to the best of us. We'll send you a code to verify your identity and set a new password."}
              </p>
            </div>
          </div>

          {/* Security card */}
          <div className="relative z-10 rounded-xl bg-card/10 p-6 backdrop-blur-md border border-background/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card/20">
                <ShieldCheck className="h-5 w-5 text-background" />
              </div>
              <div>
                <p className="text-sm font-bold text-background">
                  Secure Reset
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Your code expires in 10 minutes
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use one-time codes to verify your identity. Never share your
              code with anyone — VentureScope will never ask for it outside
              of this page.
            </p>
          </div>

          <div className="relative z-10 text-sm text-muted-foreground">
            © 2026 VentureScope Intelligence. All rights reserved.
          </div>
        </section>

        {/* RIGHT SIDE – FORM */}
        <section className="flex flex-1 flex-col items-center justify-center bg-card px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm sm:max-w-md space-y-6">
            {/* Back link */}
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>

            {/* ───── STEP 1: EMAIL ───── */}
            {step === "email" && (
              <>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-2">
                      <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Forgot your password?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Enter the email address associated with your account and
                    we&apos;ll send you a 6-digit code to reset your password.
                  </p>
                </div>

                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-4"
                >
                  <Field>
                    <FieldLabel className="text-[13px] font-bold text-foreground">
                      Email Address
                    </FieldLabel>
                    <Input
                      placeholder="name@company.com"
                      {...emailForm.register("email")}
                      className="h-11 border-none bg-muted px-4 ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {emailForm.formState.errors.email && (
                      <FieldError>
                        {emailForm.formState.errors.email.message}
                      </FieldError>
                    )}
                  </Field>

                  <Button
                    type="submit"
                    disabled={isRequesting}
                    className="h-11 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isRequesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      <>
                        Send Reset Code
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {apiError && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-center">
                      <p className="text-xs font-medium text-destructive">
                        {apiError}
                      </p>
                    </div>
                  )}
                </form>
              </>
            )}

            {/* ───── STEP 2: OTP ───── */}
            {step === "otp" && (
              <>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-2">
                      <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Enter reset code
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We&apos;ve sent a 6-digit code to{" "}
                    <span className="font-semibold text-muted-foreground">
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

                {/* Messages */}
                {apiError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-center">
                    <p className="text-xs font-medium text-destructive">
                      {apiError}
                    </p>
                  </div>
                )}
                {successMessage && (
                  <div className="rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-center">
                    <p className="text-xs font-medium text-success">
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* Continue Button */}
                <Button
                  onClick={handleOtpContinue}
                  disabled={otp.join("").length !== OTP_LENGTH}
                  className="h-11 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Resend */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Didn&apos;t receive the code?
                  </p>
                  <button
                    onClick={handleResend}
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
              </>
            )}

            {/* ───── STEP 3: NEW PASSWORD ───── */}
            {step === "password" && (
              <>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-2">
                      <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Set a new password
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Choose a strong password that you haven&apos;t used before.
                    Must be at least 8 characters.
                  </p>
                </div>

                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <Field>
                    <FieldLabel className="text-[13px] font-bold text-foreground">
                      New Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...passwordForm.register("password")}
                        className="h-11 border-none bg-muted px-4 pr-12 ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.password && (
                      <FieldError>
                        {passwordForm.formState.errors.password.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="text-[13px] font-bold text-foreground">
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        {...passwordForm.register("confirmPassword")}
                        className="h-11 border-none bg-muted px-4 pr-12 ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                      >
                        {showConfirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <FieldError>
                        {passwordForm.formState.errors.confirmPassword.message}
                      </FieldError>
                    )}
                  </Field>

                  <Button
                    type="submit"
                    disabled={isVerifying}
                    className="h-11 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  {apiError && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-center">
                      <p className="text-xs font-medium text-destructive">
                        {apiError}
                      </p>
                    </div>
                  )}
                </form>
              </>
            )}

            {/* ───── STEP 4: SUCCESS ───── */}
            {step === "success" && (
              <>
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Password updated!
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your password has been reset successfully. You can now
                    sign in with your new password.
                  </p>
                </div>

                <Button
                  onClick={() => router.push("/sign-in")}
                  className="h-11 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {/* Footer */}
            {step !== "success" && (
              <div className="pt-2 text-center">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Remember your password?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign in instead
                  </Link>
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
