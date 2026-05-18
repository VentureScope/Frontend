"use client";

import { useMemo, useRef } from "react";
import {
  Bold,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
} from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  DESCRIPTION_WORD_LIMIT,
  DESCRIPTION_WORD_MIN_RECOMMENDED,
} from "@/lib/organization-create-constants";
import type { OrganizationCreateForm } from "@/types/organization-create";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import { cn } from "@/lib/utils";

type StepDescriptionProps = {
  form: OrganizationCreateForm;
  onChange: (patch: Partial<OrganizationCreateForm>) => void;
};

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function StepDescription({ form, onChange }: StepDescriptionProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const wordCount = useMemo(() => countWords(form.description), [form.description]);

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    const text = editorRef.current?.innerText ?? "";
    onChange({ description: text });
  }

  function handleInput() {
    onChange({ description: editorRef.current?.innerText ?? "" });
  }

  return (
    <div className="space-y-6">
      <WizardStepIntro
        title="Organization description"
        description="Provide a comprehensive overview of your organization. This intelligence will be used by our analytics engine to contextualize workforce data."
      />

      <Field>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <FieldLabel className="text-sm font-semibold text-foreground">
            Comprehensive description
          </FieldLabel>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            Minimum {DESCRIPTION_WORD_MIN_RECOMMENDED} words recommended
          </span>
        </div>

        <div className="overflow-hidden rounded-md border border-border bg-muted/30">
          <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
            {[
              { icon: Bold, cmd: "bold", label: "Bold" },
              { icon: Italic, cmd: "italic", label: "Italic" },
              { icon: List, cmd: "insertUnorderedList", label: "Bullet list" },
              { icon: ListOrdered, cmd: "insertOrderedList", label: "Numbered list" },
            ].map(({ icon: Icon, cmd, label }) => (
              <button
                key={cmd}
                type="button"
                aria-label={label}
                onClick={() => exec(cmd)}
                className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
            <button
              type="button"
              aria-label="Insert link"
              onClick={() => {
                const url = window.prompt("Enter URL");
                if (url) exec("createLink", url);
              }}
              className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className={cn(
              "min-h-[220px] px-4 py-3 text-sm leading-relaxed text-foreground outline-none",
              !form.description &&
                "before:pointer-events-none before:text-muted-foreground before:content-[attr(data-placeholder)]",
            )}
            data-placeholder="Start detailing your organization's mission, structure, and market position here..."
          />
          <div className="border-t border-border px-4 py-2 text-right">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                wordCount > DESCRIPTION_WORD_LIMIT
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {wordCount} / {DESCRIPTION_WORD_LIMIT} words
            </span>
          </div>
        </div>
      </Field>
    </div>
  );
}
