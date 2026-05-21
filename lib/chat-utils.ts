const PLACEHOLDER_TITLES = new Set([
  "",
  "new chat",
  "new conversation",
  "untitled",
  "untitled conversation",
]);

/** Titles that should be replaced once the user sends a first message. */
export function isPlaceholderChatTitle(title: string | null | undefined): boolean {
  if (!title) return true;
  return PLACEHOLDER_TITLES.has(title.trim().toLowerCase());
}

const DEFAULT_CHAT_TITLE = "Untitled conversation";

/** User-facing title from modal input or fallback. */
export function normalizeChatTitle(
  title: string,
  fallback = DEFAULT_CHAT_TITLE,
): string {
  const normalized = title.trim().replace(/\s+/g, " ");
  if (!normalized) return fallback;
  return normalized.length > 255 ? `${normalized.slice(0, 252)}…` : normalized;
}

/** Sidebar/list title from the first user message when no title was set. */
export function deriveChatTitle(content: string): string {
  const normalized = content.trim().replace(/\s+/g, " ");
  if (!normalized) return DEFAULT_CHAT_TITLE;
  return normalized.length > 48 ? `${normalized.slice(0, 45)}…` : normalized;
}
