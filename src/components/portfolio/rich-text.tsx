import { cn } from "@/lib/utils";

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

/** Renders lightweight markdown (headings, bullets, bold) from editable content. */
export function RichText({
  text,
  className,
}: {
  text?: string | null | undefined;
  className?: string | undefined;
}) {
  if (!text) return null;
  const lines = text.split(/\r?\n/);
  const blocks: Array<{ kind: "p" | "h" | "ul"; items: string[] }> = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^#{1,6}\s/.test(line)) {
      blocks.push({ kind: "h", items: [line.replace(/^#{1,6}\s/, "")] });
      continue;
    }
    if (/^[*-]\s/.test(line)) {
      const last = blocks.at(-1);
      const item = line.replace(/^[*-]\s/, "");
      if (last?.kind === "ul") last.items.push(item);
      else blocks.push({ kind: "ul", items: [item] });
      continue;
    }
    blocks.push({ kind: "p", items: [line] });
  }

  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-muted-foreground", className)}>
      {blocks.map((block, index) => {
        if (block.kind === "h")
          return (
            <p key={index} className="font-display text-sm font-semibold text-foreground">
              {inline(block.items[0]!)}
            </p>
          );
        if (block.kind === "ul")
          return (
            <ul key={index} className="space-y-1.5">
              {block.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ul>
          );
        return <p key={index}>{inline(block.items[0]!)}</p>;
      })}
    </div>
  );
}
