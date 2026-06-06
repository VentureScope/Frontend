import { buildAuthSessionData } from "@/lib/auth-api";
import { buildMfaChallengeUrl } from "@/lib/auth-redirect";
import { mfaGetAAL } from "@/lib/mfa-api";
import {
  type OAuthAuthFlow,
  resolveOAuthMemberEntryPath,
} from "@/lib/onboarding";
import type { AuthSessionData, LoginSuccessResponse } from "@/types/auth";

export type OAuthPostAuthResult = {
  sessionData: AuthSessionData;
  entryPath: string;
};

/**
 * Exchange OAuth tokens, decide onboarding vs dashboard, and honor MFA when enrolled.
 */
export async function finalizeOAuthLoginSession(params: {
  authResult: LoginSuccessResponse;
  returnPath: string;
  flow?: OAuthAuthFlow;
}): Promise<OAuthPostAuthResult> {
  const sessionData = await buildAuthSessionData(params.authResult);
  const userId = sessionData.user?.id;
  let entryPath = resolveOAuthMemberEntryPath(
    userId,
    sessionData.user,
    params.returnPath,
    {
      isNewUser: params.authResult.is_new_user,
      flow: params.flow,
    },
  );

  try {
    const aal = await mfaGetAAL();
    if (aal.current_level === "aal1" && aal.next_level === "aal2") {
      entryPath = buildMfaChallengeUrl(entryPath);
    }
  } catch {
    // Non-fatal — proceed with computed entry path.
  }

  return { sessionData, entryPath };
}
