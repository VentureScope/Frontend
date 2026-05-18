"use client";

type ChatPromptChipsProps = {
  prompts: { label: string; onClick: () => void }[];
  disabled?: boolean;
};

export function ChatPromptChips({ prompts, disabled }: ChatPromptChipsProps) {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {prompts.map((p) => (
        <button
          key={p.label}
          type="button"
          disabled={disabled}
          onClick={p.onClick}
          className="rounded-full border border-border bg-card px-3.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
