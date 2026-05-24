import type {
  OrgChatMessageOutApi,
  OrgChatSessionOutApi,
  OrgChatSessionWithMessagesApi,
} from "@/types/organization-api";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asChatRole(value: unknown): OrgChatMessageOutApi["role"] {
  const role = asString(value).toLowerCase();
  if (role === "user" || role === "assistant" || role === "system") {
    return role;
  }
  return "assistant";
}

export function parseOrgChatMessageOutApi(
  raw: unknown,
): OrgChatMessageOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const session_id = asString(row.session_id);
  const content = asString(row.content);
  const created_at = asString(row.created_at);

  if (!id || !session_id || !content) return null;

  return {
    id,
    session_id,
    content,
    created_at,
    role: asChatRole(row.role),
    user_id:
      row.user_id === null || typeof row.user_id === "string"
        ? (row.user_id as string | null)
        : undefined,
  };
}

export function parseOrgChatSessionOutApi(
  raw: unknown,
): OrgChatSessionOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const org_id = asString(row.org_id);
  const created_by = asString(row.created_by);
  const title = asString(row.title);
  const created_at = asString(row.created_at);
  const updated_at = asString(row.updated_at);

  if (!id || !org_id || !created_by || !title) return null;

  return {
    id,
    org_id,
    created_by,
    title,
    created_at: created_at || new Date().toISOString(),
    updated_at: updated_at || created_at || new Date().toISOString(),
  };
}

export function parseOrgChatSessionList(
  raw: unknown,
): OrgChatSessionOutApi[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => parseOrgChatSessionOutApi(item))
    .filter((item): item is OrgChatSessionOutApi => item !== null);
}

export function parseOrgChatSessionWithMessagesApi(
  raw: unknown,
): OrgChatSessionWithMessagesApi | null {
  const base = parseOrgChatSessionOutApi(raw);
  if (!base) return null;

  const row = asRecord(raw);
  const messagesRaw = row?.messages;
  const messages = Array.isArray(messagesRaw)
    ? messagesRaw
        .map((item) => parseOrgChatMessageOutApi(item))
        .filter((item): item is OrgChatMessageOutApi => item !== null)
    : [];

  return { ...base, messages };
}
