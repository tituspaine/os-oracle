import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KALI_TOOLS, KALI_CATEGORIES } from "@/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/kali/")({
  head: () => ({
    meta: [
      { title: `Kali Linux tools (${KALI_TOOLS.length}) — distro/ref` },
      { name: "description", content: "Full catalog of Kali Linux security tools by category, with usage details for the most-used tools." },
      { property: "og:title", content: "Kali Linux tools — distro/ref" },
      { property: "og:description", content: "Browse Kali's offensive-security toolkit. Every tool categorized, key tools deeply documented." },
    ],
  }),
  component: KaliIndex,
});

function KaliIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return KALI_TOOLS.filter((t) => {
      if (cat && t.category !== cat) return false;
      if (!needle) return true;
      return (
        t.name.toLowerCase().includes(needle) ||
        t.summary.toLowerCase().includes(needle) ||
        t.package.toLowerCase().includes(needle) ||
        t.invocation.toLowerCase().includes(needle)
      );
    });
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Kali Linux tools</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {KALI_TOOLS.length} security tools bundled with Kali, grouped by the same menu categories Kali uses.
          Tools marked <Badge variant="outline" className="mono ml-1">deep</Badge> include full command tables and error fixes.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tools…"
          className="max-w-md"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setCat("")}
          className={`rounded-full px-3 py-1 text-xs border ${cat === "" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
        >All</button>
        {KALI_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-xs border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
          >{c}</button>
        ))}
      </div>

      <div className="mb-3 text-xs text-muted-foreground">{filtered.length} tool{filtered.length === 1 ? "" : "s"}</div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <li key={tool.slug}>
            <Link
              to="/kali/$slug"
              params={{ slug: tool.slug }}
              className="block h-full rounded-lg border border-border bg-card p-4 transition hover:border-primary/60 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{tool.name}</h3>
                {tool.depth === "deep" && <Badge className="text-[10px]">deep</Badge>}
              </div>
              <div className="mono text-xs text-primary">{tool.invocation}</div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{tool.summary}</p>
              <div className="mt-3 text-[10px] text-muted-foreground">{tool.category}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
