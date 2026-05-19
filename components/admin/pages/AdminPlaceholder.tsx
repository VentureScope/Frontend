type Props = { title: string; description?: string };

export function AdminPlaceholder({
  title,
  description = "This module will connect to backend admin APIs when available.",
}: Props) {
  return (
    <div className="min-w-[1280px] space-y-3 border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="text-lg font-medium text-white">{title}</h1>
      <p className="max-w-xl text-sm text-zinc-500">{description}</p>
    </div>
  );
}
