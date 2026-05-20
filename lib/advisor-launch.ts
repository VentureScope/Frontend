/** Set from dashboard overview before navigating to AI Advisor */
export const ADVISOR_PENDING_MESSAGE_KEY = "venturescope-advisor-pending-message";

export function setAdvisorPendingMessage(message: string): void {
  const trimmed = message.trim();
  if (!trimmed || typeof window === "undefined") return;
  sessionStorage.setItem(ADVISOR_PENDING_MESSAGE_KEY, trimmed);
}

export function consumeAdvisorPendingMessage(): string | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ADVISOR_PENDING_MESSAGE_KEY);
  sessionStorage.removeItem(ADVISOR_PENDING_MESSAGE_KEY);
  const trimmed = raw?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}
