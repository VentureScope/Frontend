import {
  DEFAULT_MEMBER_PATH,
  isSafeReturnPath,
} from "@/lib/auth-redirect";

export const ONBOARDING_PATH = "/onboarding";

const STORAGE_KEY = "venturescope_onboarding_v1";

type OnboardingStorage = {
  completedUserIds: string[];
  /** Set after email OTP verification; cleared when wizard finishes. */
  pendingOnboardingUserIds: string[];
  pendingReturnByUser: Record<string, string>;
};

function readStorage(): OnboardingStorage {
  if (typeof window === "undefined") {
    return {
      completedUserIds: [],
      pendingOnboardingUserIds: [],
      pendingReturnByUser: {},
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        completedUserIds: [],
        pendingOnboardingUserIds: [],
        pendingReturnByUser: {},
      };
    }
    const parsed = JSON.parse(raw) as Partial<OnboardingStorage>;
    return {
      completedUserIds: Array.isArray(parsed.completedUserIds)
        ? parsed.completedUserIds.filter((id) => typeof id === "string")
        : [],
      pendingOnboardingUserIds: Array.isArray(parsed.pendingOnboardingUserIds)
        ? parsed.pendingOnboardingUserIds.filter((id) => typeof id === "string")
        : [],
      pendingReturnByUser:
        parsed.pendingReturnByUser &&
        typeof parsed.pendingReturnByUser === "object"
          ? parsed.pendingReturnByUser
          : {},
    };
  } catch {
    return {
      completedUserIds: [],
      pendingOnboardingUserIds: [],
      pendingReturnByUser: {},
    };
  }
}

function writeStorage(data: OnboardingStorage): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function isOnboardingComplete(userId: string | undefined): boolean {
  if (!userId) {
    return true;
  }
  return readStorage().completedUserIds.includes(userId);
}

export function isOnboardingPending(userId: string | undefined): boolean {
  if (!userId) {
    return false;
  }
  return readStorage().pendingOnboardingUserIds.includes(userId);
}

/** True only after verify-email OTP and before the wizard is finished. */
export function shouldShowOnboarding(userId: string | undefined): boolean {
  if (!userId || isOnboardingComplete(userId)) {
    return false;
  }
  return isOnboardingPending(userId);
}

/** Call once after successful email OTP verification (before profile setup). */
export function markOnboardingPending(userId: string): void {
  const data = readStorage();
  if (!data.pendingOnboardingUserIds.includes(userId)) {
    data.pendingOnboardingUserIds.push(userId);
  }
  writeStorage(data);
}

export function markOnboardingComplete(userId: string): void {
  const data = readStorage();
  if (!data.completedUserIds.includes(userId)) {
    data.completedUserIds.push(userId);
  }
  data.pendingOnboardingUserIds = data.pendingOnboardingUserIds.filter(
    (id) => id !== userId,
  );
  writeStorage(data);
}

function setPendingReturnPath(userId: string, path: string): void {
  const data = readStorage();
  data.pendingReturnByUser[userId] = path;
  writeStorage(data);
}

export function getPostOnboardingPath(userId: string): string {
  const data = readStorage();
  const pending = data.pendingReturnByUser[userId];
  if (pending && isSafeReturnPath(pending) && pending !== ONBOARDING_PATH) {
    const next = { ...data.pendingReturnByUser };
    delete next[userId];
    writeStorage({ ...data, pendingReturnByUser: next });
    return pending;
  }
  return DEFAULT_MEMBER_PATH;
}

/**
 * Post-auth destination when onboarding may be required (after email OTP only).
 */
export function resolveMemberEntryPath(
  userId: string | undefined,
  intendedPath = DEFAULT_MEMBER_PATH,
): string {
  const safePath = isSafeReturnPath(intendedPath)
    ? intendedPath
    : DEFAULT_MEMBER_PATH;

  if (!userId || !shouldShowOnboarding(userId)) {
    return safePath;
  }

  if (
    isSafeReturnPath(intendedPath) &&
    intendedPath !== ONBOARDING_PATH &&
    intendedPath !== DEFAULT_MEMBER_PATH
  ) {
    setPendingReturnPath(userId, intendedPath);
  }

  return ONBOARDING_PATH;
}

export type OnboardingStepId =
  | "welcome"
  | "basics"
  | "photo"
  | "skills"
  | "experience"
  | "cv"
  | "finish";

export const ONBOARDING_STEPS: {
  id: OnboardingStepId;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "welcome",
    title: "Welcome",
    subtitle: "Set up your VentureScope profile in a few quick steps.",
  },
  {
    id: "basics",
    title: "About you",
    subtitle: "Name and career interests power recommendations and matching.",
  },
  {
    id: "photo",
    title: "Profile photo",
    subtitle: "Optional — helps teammates and advisors recognize you.",
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "Optional — list strengths for roadmaps, resumes, and job matches.",
  },
  {
    id: "experience",
    title: "Experience",
    subtitle:
      "Optional — document roles you've held to strengthen resumes and job matching.",
  },
  {
    id: "cv",
    title: "Résumé / CV",
    subtitle: "Optional — upload a CV for parsing and resume builder.",
  },
  {
    id: "finish",
    title: "You're set",
    subtitle: "Head to your dashboard — you can update profile anytime.",
  },
];
