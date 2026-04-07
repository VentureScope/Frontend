"use client";

import { useEffect, useRef, useState } from "react";
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
  returnTo?: string;
}

function readStoredOAuthState(): GithubOAuthTransaction | null {
  const raw = sessionStorage.getItem(GITHUB_OAUTH_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      state?: unknown;
      createdAt?: unknown;
      flow?: unknown;
      returnTo?: unknown;
    };

    if (typeof parsed.state !== "string") {
      return null;
    }

    if (typeof parsed.createdAt !== "number") {
      return null;
    }

    return {
      state: parsed.state,
      createdAt: parsed.createdAt,
      flow: typeof parsed.flow === "string" ? parsed.flow : undefined,
      returnTo:
        typeof parsed.returnTo === "string" ? parsed.returnTo : undefined,
    };
  } catch {
    return null;
  }
}

export default function GithubOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthData = useAppStore((state) => state.setAuthData);
  const hasProcessedCallbackRef = useRef(false);
  const [statusMessage, setStatusMessage] = useState(
    "Completing GitHub sign in...",
  );

  useEffect(() => {
    if (hasProcessedCallbackRef.current) {
      return;
    }

    hasProcessedCallbackRef.current = true;
    console.log("[oauth] Handling GitHub callback");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (error) {
      console.log("[oauth] Callback contains provider error", {
        error,
        errorDescription,
      });
      setStatusMessage(
        errorDescription || "GitHub sign in was canceled or failed.",
      );
      return;
    }

    if (!code || !state) {
      setStatusMessage(
        "Missing OAuth parameters. Please try signing in again.",
      );
      return;
    }

    const oauthCode = code;
    const oauthState = state;

    const storedTransaction = readStoredOAuthState();
    if (!storedTransaction || storedTransaction.state !== state) {
      sessionStorage.removeItem(GITHUB_OAUTH_SESSION_KEY);
      console.log("[oauth] State validation failed", {
        hasStoredState: Boolean(storedTransaction),
      });
      setStatusMessage("State validation failed. Please try signing in again.");
      return;
    }

    const now = Date.now();
    if (now - storedTransaction.createdAt > OAUTH_STATE_TTL_MS) {
      console.log("[oauth] Stored OAuth state has expired");
      sessionStorage.removeItem(GITHUB_OAUTH_SESSION_KEY);
      setStatusMessage("Your sign-in session expired. Please try again.");
      return;
    }

    const isGithubSyncFlow = storedTransaction.flow === "github-sync";
    const isGithubSignInFlow = storedTransaction.flow === "sign-in";
    const returnToPath =
      typeof storedTransaction.returnTo === "string" &&
      storedTransaction.returnTo.trim().length > 0
        ? storedTransaction.returnTo
        : "/dashboard/data-hub";

    sessionStorage.removeItem(GITHUB_OAUTH_SESSION_KEY);

    async function exchangeCode() {
      try {
        console.log("[oauth] Requesting token exchange", {
          endpoint: "/api/auth/oauth/github/callback",
        });
        const authResult = await completeGithubOAuthCallback(
          oauthCode,
          oauthState,
        );
        const authSessionData = await buildAuthSessionData(authResult);
        setAuthData(authSessionData);

        if (isGithubSyncFlow) {
          console.log("[oauth] Completing GitHub profile sync after callback");
          await syncGithubProfile();
          router.replace(returnToPath);
          return;
        }

        if (isGithubSignInFlow) {
          try {
            console.log("[oauth] Running post-login GitHub profile sync");
            await syncGithubProfile();
          } catch (syncError) {
            // Sign-in succeeded; keep login flow non-blocking if sync fails.
            console.log("[oauth] Post-login GitHub sync failed", { syncError });
          }
        }

        console.log("[oauth] GitHub sign-in completed");
        router.replace("/");
      } catch (exchangeError) {
        console.log("[oauth] Token exchange failed", { exchangeError });
        setStatusMessage(getApiErrorMessage(exchangeError));
      }
    }

    exchangeCode();
  }, [router, searchParams, setAuthData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">GitHub Sign-In</h1>
        <p className="mt-3 text-sm text-slate-600">{statusMessage}</p>
      </div>
    </div>
  );
}
