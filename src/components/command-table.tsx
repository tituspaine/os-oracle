import { useMemo, useState } from "react";
import type { Command } from "@/data/types";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";

export function CommandTable({ commands }: { commands: Command[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const categories = useMemo(
    () => Array.from(new Set(commands.map((c) => c.category))).sort(),
    [commands],
  );
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return commands.filter((c) => {
      if (category && c.category !== category) return false;
      if (!needle) return true;
      return (
        c.name.toLowerCase().includes(needle) ||
        c.syntax.toLowerCase().includes(needle) ||
        c.description.toLowerCase().includes(needle)
      );
    });
  }, [commands, q, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder={`Search ${commands.length} commands…`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`rounded-full px-3 py-1 text-xs border ${category === "" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
          >All</button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs border ${category === cat ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
            >{cat}</button>
          ))}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div>
      <ul className="space-y-4">
        {filtered.map((c) => (
          <li key={c.name} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="mono text-base font-semibold text-primary">{c.name}</h3>
              <Badge variant="outline" className="text-xs">{c.category}</Badge>
            </div>
            <p className="mt-2 text-sm text-foreground/90">{c.description}</p>
            <div className="mt-3">
              <CodeBlock code={c.syntax} />
            </div>
            {c.examples.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Examples</div>
                {c.examples.map((ex, i) => (
                  <div key={i}>
                    <CodeBlock code={ex.code} />
                    {ex.note && <p className="mt-1 text-xs text-muted-foreground">{ex.note}</p>}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 text-xs">
              <span className="font-medium text-muted-foreground">Best scenario: </span>
              <span className="text-foreground/80">{c.bestScenario}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
