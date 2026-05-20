type Props = {
  title: string;
  description?: string;
  /** When true, shows that no OpenAPI admin endpoint exists yet. */
  noApi?: boolean;
};

export function AdminPlaceholder({
  title,
  description = "This module will connect to backend admin APIs when available.",
  noApi = false,
}: Props) {
  return (
    <div className="min-w-[1280px] space-y-3 border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="text-lg font-medium text-white">{title}</h1>
      <p className="max-w-xl text-sm text-zinc-500">{description}</p>
      {noApi ? (
        <div className="max-w-xl rounded-md border border-amber-900/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-200/90">
          <span className="font-medium text-amber-300">Not in API yet.</span>{" "}
          There is no <span className="font-mono text-amber-400">/api/admin/…</span>{" "}
          endpoint for this screen in the current OpenAPI spec. Navigation is kept for
          product planning; data shown elsewhere on the admin console uses live APIs.
        </div>
      ) : null}
    </div>
  );
}
