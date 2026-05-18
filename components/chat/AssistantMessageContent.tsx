"use client";

/** Lightweight markdown-ish formatting for assistant replies */
export function AssistantMessageContent({ content }: { content: string }) {
  const blocks = content.split("\n\n");

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-foreground">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList =
          lines.length > 0 &&
          lines.every(
            (l) =>
              l.trim().startsWith("-") ||
              l.trim().startsWith("*") ||
              /^\d+\./.test(l.trim()),
          );

        if (isList) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-4">
              {lines.map((line, j) => (
                <li key={j}>
                  <InlineFormat text={line.replace(/^[-*]\s*|\d+\.\s*/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        if (block.startsWith("**") && block.includes("**")) {
          return (
            <p key={i} className="font-medium text-foreground">
              <InlineFormat text={block} />
            </p>
          );
        }

        return (
          <p key={i}>
            <InlineFormat text={block} />
          </p>
        );
      })}
    </div>
  );
}

function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
