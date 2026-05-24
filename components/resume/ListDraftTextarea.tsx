"use client";

import { useEffect, useRef, useState } from "react";

type ListDraftTextareaProps = {
  items: string[];
  toText: (items: string[]) => string;
  parse: (text: string) => string[];
  onCommit: (items: string[]) => void;
  disabled?: boolean;
  className?: string;
  rows?: number;
  placeholder?: string;
  "aria-label"?: string;
};

/**
 * Textarea for comma- or line-separated lists. Keeps raw draft while typing so
 * spaces and trailing punctuation are not stripped on every keystroke.
 */
export function ListDraftTextarea({
  items,
  toText,
  parse,
  onCommit,
  disabled,
  className,
  rows = 3,
  placeholder,
  "aria-label": ariaLabel,
}: ListDraftTextareaProps) {
  const serialized = toText(items);
  const [draft, setDraft] = useState(serialized);
  const draftRef = useRef(draft);
  const onCommitRef = useRef(onCommit);

  draftRef.current = draft;
  onCommitRef.current = onCommit;

  useEffect(() => {
    setDraft(serialized);
  }, [serialized]);

  useEffect(() => {
    return () => {
      onCommitRef.current(parse(draftRef.current));
    };
  }, [parse]);

  function commit() {
    const parsed = parse(draft);
    onCommit(parsed);
    setDraft(toText(parsed));
  }

  return (
    <textarea
      className={className}
      rows={rows}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
