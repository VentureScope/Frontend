"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Smartphone, 
  X, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldTitle } from "@/components/ui/field";
import { mfaEnroll, mfaEnrollVerify, mfaSync } from "@/lib/mfa-api";
import { MFAEnrollResponse } from "@/types/mfa";
import { getApiErrorMessage } from "@/lib/auth-api";
import { toast } from "sonner";

interface MFAEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MFAEnrollModal({ isOpen, onClose, onSuccess }: MFAEnrollModalProps) {
  const [step, setStep] = useState<"name" | "qr" | "verify" | "success">("name");
  const [friendlyName, setFriendlyName] = useState("");
  const [enrollData, setEnrollData] = useState<MFAEnrollResponse | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("name");
      setFriendlyName("");
      setEnrollData(null);
      setOtpCode("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function startEnrollment() {
    if (!friendlyName.trim()) {
      setError("Please provide a name for this authenticator.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await mfaEnroll();
      setEnrollData(data);
      setStep("qr");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    if (!enrollData || otpCode.length !== 6) return;
    setIsLoading(true);
    setError(null);
    try {
      await mfaEnrollVerify({
        factor_id: enrollData.factor_id,
        code: otpCode,
        friendly_name: friendlyName.trim()
      });
      
      // Sync with DB to enable MFA
      await mfaSync();
      
      setStep("success");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  function copySecret() {
    if (!enrollData) return;
    navigator.clipboard.writeText(enrollData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-card shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-muted-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-primary px-8 py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card/20 backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Secure Your Account
          </h2>
          <p className="mt-1 text-sm text-blue-100/80 px-4">
            {step === "name" && "Give your authenticator a name to get started."}
            {step === "qr" && "Scan the QR code with your authenticator app."}
            {step === "verify" && "Enter the 6-digit code to complete setup."}
            {step === "success" && "Your account is now protected with 2FA."}
          </p>
        </div>

        <div className="p-8">
          {/* STEP 1: NAME */}
          {step === "name" && (
            <div className="space-y-6">
              <Field>
                <FieldLabel className="w-full">
                  <FieldTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Authenticator Name
                  </FieldTitle>
                  <Input 
                    placeholder="e.g. My iPhone, Google Auth"
                    value={friendlyName}
                    onChange={(e) => setFriendlyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && friendlyName.trim() && !isLoading) {
                        startEnrollment();
                      }
                    }}
                    className="h-12 rounded-xl bg-muted border-none font-bold px-4 text-foreground"
                    autoFocus
                  />
                </FieldLabel>
              </Field>
              <Button 
                onClick={startEnrollment}
                disabled={isLoading || !friendlyName.trim()}
                className="h-12 w-full rounded-xl bg-primary font-bold text-white shadow-lg hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue Setup"}
              </Button>
            </div>
          )}

          {/* STEP 2: QR CODE */}
          {step === "qr" && enrollData && (
            <div className="flex flex-col items-center space-y-6">
              <div className="rounded-2xl border-2 border-border p-4 bg-card shadow-inner">
                <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(enrollData.totp_uri)}`}
                  alt="MFA QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              
              <div className="w-full space-y-3">
                <p className="text-center text-xs font-medium text-muted-foreground">
                  Can&apos;t scan? Enter the secret manually:
                </p>
                <div className="flex items-center gap-2 rounded-xl bg-muted p-2 border border-border">
                  <code className="flex-1 px-3 text-sm font-mono font-bold text-muted-foreground overflow-hidden text-ellipsis">
                    {enrollData.secret}
                  </code>
                  <button 
                    onClick={copySecret}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-card shadow-sm border border-border text-muted-foreground hover:text-primary"
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <Button 
                onClick={() => setStep("verify")}
                className="h-12 w-full rounded-xl bg-primary font-bold text-white shadow-lg hover:bg-primary/90"
              >
                I&apos;ve Scanned the Code
              </Button>
            </div>
          )}

          {/* STEP 3: VERIFY */}
          {step === "verify" && (
            <div className="space-y-6">
              <div className="text-center">
                <Smartphone className="mx-auto mb-4 h-12 w-12 text-blue-100" />
                <p className="text-sm font-medium text-muted-foreground">
                  Enter the 6-digit code from your app
                </p>
              </div>

              <Input 
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtpCode(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otpCode.length === 6 && !isLoading) {
                    handleVerify();
                  }
                }}
                className="h-14 rounded-xl border-2 border-primary/20 bg-muted text-center text-2xl font-bold tracking-[0.5em] text-foreground focus:border-primary focus:bg-card transition-all"
                autoFocus
              />

              <Button 
                onClick={handleVerify}
                disabled={isLoading || otpCode.length !== 6}
                className="h-12 w-full rounded-xl bg-primary font-bold text-white shadow-lg hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Enable"}
              </Button>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <div className="flex flex-col items-center py-4 space-y-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">MFA is Active</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  Your account security has been upgraded. You will be asked for a code on your next sign-in.
                </p>
              </div>
              <Button 
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="h-12 w-full rounded-xl bg-slate-900 font-bold text-white shadow-lg hover:bg-black"
              >
                Done
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="mt-4 text-center text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
