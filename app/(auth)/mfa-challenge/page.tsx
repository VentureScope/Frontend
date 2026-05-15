"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Smartphone, AlertCircle, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  mfaListFactors,
  mfaChallenge,
  mfaVerify,
  mfaGetAAL,
} from "@/lib/mfa-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { MFAFactor } from "@/types/mfa";

// ── OTP input (6 boxes) ───────────────────────────────────────────────────────

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

  function handleKey(
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) {
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
          id={`mfa-digit-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          disabled={disabled}
          className="w-12 h-14 rounded-xl border-2 border-slate-200 bg-[#f0f4ff] text-center text-xl font-bold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-0 transition-colors disabled:opacity-40"
        />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function MFAChallengeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [selectedFactor, setSelectedFactor] = useState<MFAFactor | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState<"select" | "enter">("select");

  // Load factors on mount
  useEffect(() => {
    async function init() {
      try {
        // First check if already at aal2
        const aal = await mfaGetAAL();
        if (aal.current_level === "aal2") {
          router.replace(redirectTo);
          return;
        }

        const data = await mfaListFactors();
        if (data.factors.length === 0) {
          // No factors — user shouldn't be here; go to dashboard
          router.replace(redirectTo);
          return;
        }
        setFactors(data.factors);
        if (data.factors.length === 1) {
          // Auto-select the only factor
          await selectFactor(data.factors[0]);
        } else {
          setStep("select");
        }
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-submit when 6th digit entered
  useEffect(() => {
    if (code.length === 6 && challengeId && !verifying) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function selectFactor(factor: MFAFactor) {
    setLoading(true);
    setError(null);
    try {
      const ch = await mfaChallenge({ factor_id: factor.factor_id });
      setChallengeId(ch.challenge_id);
      setSelectedFactor(factor);
      setStep("enter");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!selectedFactor || !challengeId || code.length !== 6) return;
    setVerifying(true);
    setError(null);
    try {
      await mfaVerify({
        factor_id: selectedFactor.factor_id,
        challenge_id: challengeId,
        code,
      });
      router.replace(redirectTo);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setCode("");
      // Refresh challenge
      try {
        const ch = await mfaChallenge({ factor_id: selectedFactor.factor_id });
        setChallengeId(ch.challenge_id);
      } catch {}
    } finally {
      setVerifying(false);
    }
  }

  function switchFactor() {
    setStep("select");
    setCode("");
    setError(null);
    setChallengeId(null);
    setSelectedFactor(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden">
          {/* Header band */}
          <div className="bg-[#1d59db] px-8 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Two-Factor Verification
            </h1>
            <p className="mt-1 text-sm text-blue-100/80">
              {step === "select"
                ? "Choose an authenticator to continue"
                : "Enter the 6-digit code from your authenticator app"}
            </p>
          </div>

          <div className="px-8 py-10 space-y-6">
            {/* Factor selection */}
            {step === "select" && (
              <div className="space-y-3">
                {factors.map((f, i) => (
                  <button
                    key={f.factor_id}
                    id={`factor-${i}`}
                    onClick={() => selectFactor(f)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        {f.friendly_name ?? `Authenticator ${i + 1}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        Added {new Date(f.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Code entry */}
            {step === "enter" && (
              <div className="space-y-6">
                <OTPInput
                  value={code}
                  onChange={setCode}
                  disabled={verifying}
                />

                <Button
                  id="mfa-verify-btn"
                  onClick={handleVerify}
                  disabled={code.length !== 6 || verifying}
                  className="h-12 w-full bg-[#1d59db] text-sm font-bold text-white hover:bg-[#1748b3] shadow-xl shadow-blue-500/20"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                {factors.length > 1 && (
                  <button
                    id="switch-factor-btn"
                    onClick={switchFactor}
                    className="w-full text-center text-xs text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    Can&apos;t access your authenticator? Use a backup factor
                  </button>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MFAChallengePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <MFAChallengeContent />
    </Suspense>
  );
}
