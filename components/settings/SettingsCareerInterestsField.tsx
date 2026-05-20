"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseCareerInterests } from "@/lib/settings-utils";

type SettingsCareerInterestsFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function SettingsCareerInterestsField({
  value,
  onChange,
  disabled,
}: SettingsCareerInterestsFieldProps) {
  const [tags, setTags] = useState<string[]>(() => parseCareerInterests(value));
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setTags(parseCareerInterests(value));
  }, [value]);

  function commitTags(next: string[]) {
    setTags(next);
    onChange(next.join(", "));
  }

  function addTag() {
    const normalized = draft.trim();
    if (!normalized) return;
    if (tags.some((t) => t.toLowerCase() === normalized.toLowerCase())) {
      setDraft("");
      return;
    }
    commitTags([...tags, normalized]);
    setDraft("");
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Career interests
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-foreground"
          >
            {tag}
            <button
              type="button"
              disabled={disabled}
              onClick={() => commitTags(tags.filter((t) => t !== tag))}
              className="rounded-full p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="e.g. Product management, Fintech"
          className="h-12 flex-1 rounded-lg border-none bg-muted font-medium"
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !draft.trim()}
          onClick={addTag}
          className="h-12 shrink-0 gap-1 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Saved to your profile via the API. Used to personalize advisor recommendations.
      </p>
    </div>
  );
}
