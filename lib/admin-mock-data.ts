/** Placeholder data for admin UI until backend / Supabase hooks are wired. */

export type DagStatus = "success" | "failed" | "running";

export type AdminDagRow = {
  name: string;
  lastRun: string;
  status: DagStatus;
  duration: string;
  airflowUrl: string;
};

export type ActivityRow = {
  id: string;
  time: string;
  badge: string;
  badgeTone: "emerald" | "red" | "amber";
  actor: string;
  target: string;
};

export type DirectoryUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  verified: boolean;
  joined: string;
  lastActive: string;
};

export type EmbeddingRow = {
  id: string;
  user: string;
  status: "failed" | "pending";
  lastAttempted: string;
  error: string;
};

export type KnowledgeChunk = {
  id: string;
  userId: string;
  userName: string;
  index: number;
  preview: string;
  content: string;
  embeddingStatus: "synced" | "pending";
  syncedAt: string;
  tokens: number;
};

export type BroadcastRow = {
  id: string;
  subject: string;
  sentTo: string;
  sentAt: string;
  status: string;
};

export const ADMIN_OVERVIEW_STATS = {
  activeUsers: { value: "2,847", delta: "+12 this week" },
  failedEmbeddings: { value: "12", hint: "Retry All →" },
  pendingTranscripts: { value: "34", hint: "Processing..." },
  aiChatsToday: { value: "1,204", delta: "↑ 8% vs yesterday" },
};

export const PIPELINE_DONUT = [
  { name: "Success", value: 2813, color: "#34d399" },
  { name: "Pending", value: 34, color: "#fbbf24" },
  { name: "Failed", value: 12, color: "#f87171" },
];

export const ADMIN_ACTIVITY: ActivityRow[] = [
  {
    id: "1",
    time: "14:32",
    badge: "ROLE",
    badgeTone: "emerald",
    actor: "jordan@acme.example",
    target: "promoted to Admin",
  },
  {
    id: "2",
    time: "14:18",
    badge: "EMBED",
    badgeTone: "amber",
    actor: "system",
    target: "retried embedding for user_8f2a",
  },
  {
    id: "3",
    time: "13:55",
    badge: "AUTH",
    badgeTone: "red",
    actor: "admin",
    target: "revoked session sk_live_…4a2",
  },
  {
    id: "4",
    time: "13:41",
    badge: "DAG",
    badgeTone: "emerald",
    actor: "airflow",
    target: "embedding_jobs completed",
  },
  {
    id: "5",
    time: "12:09",
    badge: "USER",
    badgeTone: "emerald",
    actor: "ava.k@acme.example",
    target: "verified email",
  },
];

export const ADMIN_DAGS: AdminDagRow[] = [
  {
    name: "github_sync",
    lastRun: "2026-05-19 11:00",
    status: "success",
    duration: "4m 12s",
    airflowUrl: "https://airflow.internal/dags/github_sync",
  },
  {
    name: "embedding_jobs",
    lastRun: "2026-05-19 11:15",
    status: "running",
    duration: "—",
    airflowUrl: "https://airflow.internal/dags/embedding_jobs",
  },
  {
    name: "transcript_parse",
    lastRun: "2026-05-19 10:30",
    status: "success",
    duration: "2m 08s",
    airflowUrl: "https://airflow.internal/dags/transcript_parse",
  },
  {
    name: "knowledge_refresh",
    lastRun: "2026-05-19 09:00",
    status: "failed",
    duration: "1m 44s",
    airflowUrl: "https://airflow.internal/dags/knowledge_refresh",
  },
];

export const DIRECTORY_USERS: DirectoryUser[] = [
  {
    id: "usr_001",
    name: "Jordan Davis",
    email: "jordan.d@acme.example",
    role: "Professional",
    status: "active",
    verified: true,
    joined: "2024-06-01",
    lastActive: "2m ago",
  },
  {
    id: "usr_002",
    name: "Ava Kim",
    email: "ava.k@acme.example",
    role: "Student",
    status: "active",
    verified: true,
    joined: "2024-08-22",
    lastActive: "1h ago",
  },
  {
    id: "usr_003",
    name: "Sam Morgan",
    email: "sam.m@acme.example",
    role: "B2B Client",
    status: "inactive",
    verified: false,
    joined: "2025-01-10",
    lastActive: "14d ago",
  },
  {
    id: "usr_004",
    name: "Priya Lal",
    email: "priya.l@globex.example",
    role: "Admin",
    status: "active",
    verified: true,
    joined: "2022-11-20",
    lastActive: "5m ago",
  },
];

export const EMBEDDING_ROWS: EmbeddingRow[] = [
  {
    id: "emb_1",
    user: "sam.m@acme.example",
    status: "failed",
    lastAttempted: "2026-05-19 11:02",
    error: "OpenAI rate limit exceeded (429)",
  },
  {
    id: "emb_2",
    user: "user_8f2a",
    status: "pending",
    lastAttempted: "2026-05-19 11:14",
    error: "—",
  },
  {
    id: "emb_3",
    user: "riley.c@globex.example",
    status: "failed",
    lastAttempted: "2026-05-19 10:58",
    error: "pgvector dimension mismatch (expected 1536)",
  },
];

export const EMBEDDING_ERROR_FREQ = [
  { type: "rate_limit_exceeded", count: 7, pct: 58 },
  { type: "dimension_mismatch", count: 3, pct: 25 },
  { type: "timeout", count: 2, pct: 17 },
];

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  {
    id: "chk_1",
    userId: "usr_001",
    userName: "Jordan Davis",
    index: 1,
    preview: "Platform engineering lead with focus on Kubern…",
    content:
      "Platform engineering lead with focus on Kubernetes, Terraform, and internal developer platforms. Primary stack: Go, Python, AWS.",
    embeddingStatus: "synced",
    syncedAt: "2026-05-18 22:10",
    tokens: 128,
  },
  {
    id: "chk_2",
    userId: "usr_001",
    userName: "Jordan Davis",
    index: 2,
    preview: "Career goal: staff engineer within 18 months…",
    content:
      "Career goal: staff engineer within 18 months. Interested in platform reliability and cost optimization playbooks.",
    embeddingStatus: "pending",
    syncedAt: "—",
    tokens: 96,
  },
  {
    id: "chk_3",
    userId: "usr_002",
    userName: "Ava Kim",
    index: 1,
    preview: "Frontend engineer specializing in React and a11y…",
    content:
      "Frontend engineer specializing in React and accessibility. Portfolio includes design-system contributions.",
    embeddingStatus: "synced",
    syncedAt: "2026-05-19 08:44",
    tokens: 112,
  },
];

export const BROADCAST_HISTORY: BroadcastRow[] = [
  {
    id: "bc_1",
    subject: "Scheduled maintenance — May 20",
    sentTo: "All Users",
    sentAt: "2026-05-18 16:00",
    status: "✓ sent 2,847",
  },
  {
    id: "bc_2",
    subject: "New Org Advisor features",
    sentTo: "B2B Clients",
    sentAt: "2026-05-15 09:30",
    status: "✓ sent 412",
  },
];

export const WORKER_ROWS = [
  {
    worker: "celery@worker-1",
    status: "online" as const,
    queueDepth: 3,
    heartbeat: "12s ago",
    tasksPerMin: 24,
  },
  {
    worker: "celery@worker-2",
    status: "online" as const,
    queueDepth: 0,
    heartbeat: "8s ago",
    tasksPerMin: 18,
  },
  {
    worker: "celery@worker-3",
    status: "offline" as const,
    queueDepth: 0,
    heartbeat: "—",
    tasksPerMin: "—" as const,
  },
];

export const STORAGE_FILES = [
  { name: "profile_usr_001.json", size: "24 KB", modified: "2026-05-19 10:12" },
  { name: "cv_sam_morgan.pdf", size: "312 KB", modified: "2026-05-18 14:02" },
  { name: "transcript_batch_42.zip", size: "4.1 MB", modified: "2026-05-17 09:00" },
];

export const SENTRY_ISSUES = [
  {
    title: "TimeoutError in embedding_jobs task",
    service: "venturescope-airflow",
    timesSeen: 47,
    lastSeen: "12m ago",
    url: "https://sentry.io/issues/example-1",
  },
  {
    title: "401 on /api/admin/ml/runs",
    service: "venturescope-backend",
    timesSeen: 12,
    lastSeen: "1h ago",
    url: "https://sentry.io/issues/example-2",
  },
];

export const SENTRY_SPARKLINE = [
  { day: "Mon", backend: 4, airflow: 2, frontend: 1 },
  { day: "Tue", backend: 3, airflow: 5, frontend: 0 },
  { day: "Wed", backend: 6, airflow: 1, frontend: 2 },
  { day: "Thu", backend: 2, airflow: 3, frontend: 1 },
  { day: "Fri", backend: 5, airflow: 4, frontend: 0 },
  { day: "Sat", backend: 1, airflow: 0, frontend: 1 },
  { day: "Sun", backend: 3, airflow: 2, frontend: 1 },
];
