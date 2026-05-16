"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Copy,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  QrCode,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  mfaEnroll,
  mfaEnrollVerify,
  mfaSync,
  mfaGetAAL,
} from "@/lib/mfa-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { MFAEnrollResponse } from "@/types/mfa";

// ── OTP input ─────────────────────────────────────────────────────────────────

function OTPInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const digit = e.target.value.replace(/\D/, "").slice(-1);
    const chars = value.split("");
    chars[idx] = digit;
    const next = chars.join("").padEnd(6, "").slice(0, 6);
    onChange(next.trimEnd());
    if (digit && idx < 5) inputs.current[idx + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text) {
      onChange(text);
      inputs.current[Math.min(text.length, 5)]?.focus();
      e.preventDefault();
    }
  }

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          id={`enroll-digit-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          disabled={disabled}
          className="w-12 h-14 rounded-xl border-2 border-border bg-muted text-center text-xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-0 transition-colors disabled:opacity-40"
        />
      ))}
    </div>
  );
}

// ── QR code renderer (uses Google Charts API — no JS lib needed) ──────────────

function QRCodeImage({ uri }: { uri: string }) {
  const encoded = encodeURIComponent(uri);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;
  return (
    <div className="flex justify-center">
      <div className="rounded-2xl border-4 border-background shadow-lg overflow-hidden bg-card p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="TOTP QR Code" width={192} height={192} />
      </div>
    </div>
  );
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Scan QR", "Verify Code", "Done"];
  return (
    <div className="flex items-center gap-2 justify-center">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-primary text-white ring-4 ring-blue-100"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? "✓" : num}
            </div>
            <span
              className={`text-xs font-semibold ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < 2 && <div className="h-px w-8 bg-muted" />}
          </div>
        );
      })}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

type PageStep = "scan" | "verify" | "success" | "backup";

export default function MFAEnrollPage() {
  const router = useRouter();
  const [pageStep, setPageStep] = useState<PageStep>("scan");
  const [enrollData, setEnrollData] = useState<MFAEnrollResponse | null>(null);
  const [code, setCode] = useState("");
  const [secretVisible, setSecretVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [isBackup, setIsBackup] = useState(false);

  // Kick off enrollment on mount
  useEffect(() => {
    startEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-submit on 6th digit
  useEffect(() => {
    if (code.length === 6 && !verifying && pageStep === "verify") {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function startEnrollment() {
    setLoading(true);
    setError(null);
    setCode("");
    try {
      const data = await mfaEnroll();
      setEnrollData(data);
      setPageStep("scan");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!enrollData || code.length !== 6) return;
    setVerifying(true);
    setError(null);
    try {
      await mfaEnrollVerify({ factor_id: enrollData.factor_id, code });

      // Always sync to DB to ensure mfa_enabled is True.
      // The enroll/verify endpoint now promotes the session to AAL2, 
      // so this call will succeed even on the first factor.
      try {
        await mfaSync();
      } catch (err) {
        console.error("Sync failed", err);
      }
      
      setPageStep("success");
    } catch (e) {
      setError(getApiErrorMessage(e));
      setCode("");
    } finally {
      setVerifying(false);
    }
  }

  async function handleAddBackup() {
    setIsBackup(true);
    await startEnrollment();
  }

  function handleCopySecret() {
    if (!enrollData) return;
    navigator.clipboard.writeText(enrollData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const stepNum: 1 | 2 | 3 =
    pageStep === "scan" ? 1 : pageStep === "verify" ? 2 : 3;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl bg-card shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-8 py-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card/20 backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isBackup ? "Add Backup Factor" : "Set Up Two-Factor Auth"}
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Protect your account with Google Authenticator, Authy, or 1Password
              </p>
            </div>
            <Steps current={stepNum} />
          </div>

          <div className="px-8 py-10 space-y-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pageStep === "scan" && enrollData ? (
              <>
                {/* Step 1: Show QR */}
                <div className="space-y-2 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Step 1
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Open your authenticator app and scan the QR code below.
                  </p>
                </div>

                <QRCodeImage uri={enrollData.totp_uri} />

                {/* Collapsible secret */}
                <div className="rounded-2xl border border-border overflow-hidden">
                  <button
                    id="toggle-secret-btn"
                    onClick={() => setSecretVisible((v) => !v)}
                    className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                      Can&apos;t scan? Enter key manually
                    </span>
                    {secretVisible ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {secretVisible && (
                    <div className="border-t border-border bg-muted px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Secret Key
                      </p>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 break-all rounded-lg bg-card border border-border px-3 py-2 font-mono text-xs text-foreground select-all">
                          {enrollData.secret}
                        </code>
                        <button
                          id="copy-secret-btn"
                          onClick={handleCopySecret}
                          className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  id="continue-to-verify-btn"
                  onClick={() => setPageStep("verify")}
                  className="h-12 w-full bg-primary text-sm font-bold text-white hover:bg-primary/90 shadow-xl shadow-primary/20"
                >
                  I&apos;ve scanned it — Continue
                </Button>
              </>
            ) : pageStep === "verify" && enrollData ? (
              <>
                {/* Step 2: Enter code */}
                <div className="space-y-2 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Step 2
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code shown in your authenticator app.
                  </p>
                </div>

                <OTPInput value={code} onChange={setCode} disabled={verifying} />

                <Button
                  id="verify-enroll-btn"
                  onClick={handleVerify}
                  disabled={code.length !== 6 || verifying}
                  className="h-12 w-full bg-primary text-sm font-bold text-white hover:bg-primary/90 shadow-xl shadow-primary/20"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify & Activate"
                  )}
                </Button>

                <button
                  id="back-to-scan-btn"
                  onClick={() => setPageStep("scan")}
                  className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to QR code
                </button>
              </>
            ) : pageStep === "success" ? (
              <>
                {/* Step 3: Success */}
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {isBackup ? "Backup factor added!" : "2FA is now active!"}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                      {isBackup
                        ? "Your backup authenticator has been enrolled. You now have multiple recovery options."
                        : "Your account is now protected with two-factor authentication. We strongly recommend adding a backup factor."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {!isBackup && (
                    <Button
                      id="add-backup-btn"
                      variant="outline"
                      onClick={handleAddBackup}
                      className="h-12 w-full border-primary text-primary font-bold hover:bg-primary/10 flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Add a Backup Authenticator (Recommended)
                    </Button>
                  )}
                  <Button
                    id="done-enroll-btn"
                    onClick={() => router.push("/")}
                    className="h-12 w-full bg-primary font-bold text-white hover:bg-primary/90"
                  >
                    {isBackup ? "All done" : "Go to Dashboard"}
                  </Button>
                </div>
              </>
            ) : null}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="text-xs text-red-700">{error}</p>
                  {pageStep === "scan" && (
                    <button
                      onClick={startEnrollment}
                      className="mt-1 text-xs font-semibold text-red-600 hover:underline"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
