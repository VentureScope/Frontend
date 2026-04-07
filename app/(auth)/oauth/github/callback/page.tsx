"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  buildAuthSessionData,
  completeGithubOAuthCallback,
  getApiErrorMessage,
  syncGithubProfile,
} from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";

const GITHUB_OAUTH_SESSION_KEY = "github_oauth_tx";
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

interface GithubOAuthTransaction {
  state: string;
  createdAt: number;
  flow?: string;
  returnUrl?: string;
}

function GithubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthData = useAppStore((state) => state.setAuthData);

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    async function processCallback() {
      try {
        const code = searchParams.get("code");
        const stateUrl = searchParams.get("state");
        const errorFromUrl = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorFromUrl) {
          throw new Error(errorDescription || errorFromUrl);
        }

        if (!code || !stateUrl) {
          throw new Error("Missing required OAuth parameters (code or state).");
        }

        // Read stored transaction
        const storedJson = sessionStorage.getItem(GITHUB_OAUTH_SESSION_KEY);
        if (!storedJson) {
          throw new Error("No active GitHub login session found.");
        }

        let tx: GithubOAuthTransaction;
        try {
          tx = JSON.parse(storedJson);
        } catch {
          throw new Error("Invalid GitHub login session data.");
        }

        sessionStorage.removeItem(GITHUB_OAUTH_SESSION_KEY);

        // Verify state matches
        if (tx.state !== stateUrl) {
          throw new Error("State parameter mismatch. Security check failed.");
        }

        // Verify TTL
        if (Date.now() - tx.createdAt > OAUTH_STATE_TTL_MS) {
          throw new Error("Login session expired. Please try again.");
        }

        const isSyncFlow = tx.flow === "sync";

        if (isSyncFlow) {
          // Complete the OAuth handshake
          await completeGithubOAuthCallback(code, stateUrl);
          // Kickoff the sync profile step after receiving token
          await syncGithubProfile();
          
          setStatus("success");
          setTimeout(() => {
            const redirectUrl = tx.returnUrl || "/dashboard/settings";
            router.replace(redirectUrl);
          }, 1500);
        } else {
          // Standard login flow
          const res = await completeGithubOAuthCallback(code, stateUrl);
          const sessionData = await buildAuthSessionData(res);
          setAuthData(sessionData);

          setStatus("success");

          const isFullProfile =
            sessionData.user?.full_name && sessionData.user?.career_interest !== "undecided";
          const returnUrl = tx.returnUrl || "/dashboard";

          setTimeout(() => {
            if (!isFullProfile) {
              router.replace("/register/complete-profile");
            } else {
              router.replace(returnUrl);
            }
          }, 1500);
        }
      } catch (error) {
        console.error("Github OAuth callback error:", error);
        setStatus("error");
        setErrorMessage(getApiErrorMessage(error));
      }
    }

    processCallback();
  }, [router, searchParams, setAuthData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="glass-panel w-full max-w-md p-8 text-center pt-10 px-8 pb-10">
        <div className="mb-6 flex justify-center">
          {status === "processing" && (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50/50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          )}
          {status === "success" && (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <svg
                className="h-10 w-10 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === "error" && (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
              <svg
                className="h-10 w-10 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        <h2 className="mb-2 text-2xl font-black text-slate-900">
          {status === "processing" && "Connecting to GitHub..."}
          {status === "success" && "GitHub Connected!"}
          {status === "error" && "Connection Failed"}
        </h2>

        <p className="text-sm text-slate-500 font-medium">
          {status === "processing" && "Please wait while we verify your credentials."}
          {status === "success" && "Redirecting you back securely..."}
          {status === "error" && (errorMessage || "An unexpected error occurred during GitHub login.")}
        </p>

        {status === "error" && (
          <button
            onClick={() => router.push("/sign-in")}
            className="mt-8 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default function GithubOAuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    }>
      <GithubCallbackContent />
    </Suspense>
  );
}
