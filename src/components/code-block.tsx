import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };
  return (
    <div
      className={cn(
        "group relative rounded-md border border-border bg-[var(--code-bg)] text-[var(--code-fg)]",
        className,
      )}
    >
      <pre className="overflow-x-auto p-3 text-sm leading-relaxed mono">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy to clipboard"
        className="absolute right-2 top-2 rounded border border-border bg-secondary/60 p-1.5 text-secondary-foreground opacity-0 transition group-hover:opacity-100 hover:bg-secondary"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
