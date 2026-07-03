import { createFileRoute, Link } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { DISTROS, KALI_TOOLS } from "@/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Hit =
  | { kind: "distro"; slug: string; name: string; snippet: string }
  | { kind: "tool"; slug: string; name: string; snippet: string; category: string }
  | { kind: "command"; distroSlug: string; distroName: string; name: string; syntax: string; description: string };

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — distro/ref" },
      { name: "description", content: "Search Linux distros, Kali tools, and every documented command." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");

  const items = useMemo<Hit[]>(() => {
    const arr: Hit[] = [];
    for (const d of DISTROS) {
      arr.push({ kind: "distro", slug: d.slug, name: d.name, snippet: d.summary });
      for (const c of d.commands) {
        arr.push({ kind: "command", distroSlug: d.slug, distroName: d.name, name: c.name, syntax: c.syntax, description: c.description });
      }
    }
    for (const t of KALI_TOOLS) {
      arr.push({ kind: "tool", slug: t.slug, name: t.name, snippet: t.summary, category: t.category });
    }
    return arr;
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["name", "snippet", "syntax", "description", "distroName", "category"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [items],
  );

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return fuse.search(q, { limit: 80 }).map((r) => r.item);
  }, [q, fuse]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Search</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fuzzy search across distros, Kali tools, and every documented command.</p>

      <div className="mt-4">
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. iptables, nmap, apt install, kerberoast…"
        />
      </div>

      <div className="mt-6 space-y-2">
        {q.trim() && results.length === 0 && (
          <p className="text-sm text-muted-foreground">No matches.</p>
        )}
        {results.map((r, i) => {
          if (r.kind === "distro") {
            return (
              <Link
                key={i}
                to="/distro/$slug"
                params={{ slug: r.slug }}
                className="block rounded-md border border-border bg-card p-3 hover:border-primary/60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.name}</span>
                  <Badge variant="outline" className="text-[10px]">distro</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.snippet}</p>
              </Link>
            );
          }
          if (r.kind === "tool") {
            return (
              <Link
                key={i}
                to="/kali/$slug"
                params={{ slug: r.slug }}
                className="block rounded-md border border-border bg-card p-3 hover:border-primary/60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.name}</span>
                  <Badge variant="outline" className="text-[10px]">kali · {r.category}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.snippet}</p>
              </Link>
            );
          }
          return (
            <Link
              key={i}
              to="/distro/$slug"
              params={{ slug: r.distroSlug }}
              className="block rounded-md border border-border bg-card p-3 hover:border-primary/60"
            >
              <div className="flex items-center justify-between">
                <span className="mono font-semibold text-primary">{r.name}</span>
                <Badge variant="outline" className="text-[10px]">command · {r.distroName}</Badge>
              </div>
              <code className="mono mt-1 block text-xs text-[var(--code-fg)]">{r.syntax}</code>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
