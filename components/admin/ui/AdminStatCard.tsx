type Props = {
  label: string;
  value: string;
  subtext?: string;
  valueClassName?: string;
  subtextClassName?: string;
};

export function AdminStatCard({
  label,
  value,
  subtext,
  valueClassName = "text-white",
  subtextClassName = "text-zinc-500",
}: Props) {
  return (
    <div className="border border-zinc-800 bg-zinc-900 p-4">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className={`text-2xl font-mono font-semibold ${valueClassName}`}>{value}</p>
      {subtext ? (
        <p className={`mt-1 text-xs ${subtextClassName}`}>{subtext}</p>
      ) : null}
    </div>
  );
}
