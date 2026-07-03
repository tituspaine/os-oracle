import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { DISTROS, KALI_TOOLS, PLAYBOOKS, WALKTHROUGHS, expandQuery, nearestIntents } from "@/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, BookOpen } from "lucide-react";

type Hit =
  | { kind: "playbook"; slug: string; name: string; snippet: string; category: string; severity: string; score: number }
  | { kind: "walkthrough"; slug: string; name: string; snippet: string; difficulty: string; score: number }
  | { kind: "distro"; slug: string; name: string; snippet: string; score: number }
  | { kind: "tool"; slug: string; name: string; snippet: string; category: string; score: number }
  | { kind: "command"; distroSlug: string; distroName: string; name: string; syntax: string; description: string; score: number }
  | { kind: "toolcommand"; toolSlug: string; toolName: string; name: string; syntax: string; description: string; score: number }
  | { kind: "toolerror"; toolSlug: string; toolName: string; message: string; fix: string; score: number }
  | { kind: "error"; distroSlug: string; distroName: string; message: string; fix: string; score: number };

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Intent-based search — distro/ref" },
      { name: "description", content: "Describe what you want to do — 'crack wifi', 'escalate privileges', 'find open ports' — and get the right tools, commands, and playbooks." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [q, setQ] = useState(initial ?? "");

  // Reflect input into URL (debounced-ish via effect).
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ search: (prev: { q?: string }) => ({ ...prev, q: q || undefined }), replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [q, navigate]);

  const indexes = useMemo(() => {
    const playbooks = PLAYBOOKS.map((p) => ({
      _kind: "playbook" as const,
      slug: p.slug,
      name: p.title,
      snippet: p.summary,
      category: p.category,
      severity: p.severity,
      body: [
        p.title,
        p.summary,
        p.category,
        ...(p.cve ?? []),
        ...(p.mitreAttack ?? []),
        ...p.steps.map((s) => `${s.title} ${s.detail}`),
      ].join(" "),
    }));
    const walkthroughs = WALKTHROUGHS.map((w) => ({
      _kind: "walkthrough" as const,
      slug: w.slug,
      name: w.title,
      snippet: w.scenario,
      difficulty: w.difficulty,
      body: [
        w.title,
        w.scenario,
        w.labSetup,
        ...w.steps.map((s) => `${s.title} ${s.narration} ${s.command ?? ""}`),
      ].join(" "),
    }));
    const distros = DISTROS.map((d) => ({
      _kind: "distro" as const,
      slug: d.slug,
      name: d.name,
      snippet: d.summary,
      body: [d.name, d.summary, d.family, ...d.bestUseCases, ...d.whenToUse].join(" "),
    }));
    const tools = KALI_TOOLS.map((t) => ({
      _kind: "tool" as const,
      slug: t.slug,
      name: t.name,
      snippet: t.summary,
      category: t.category,
      body: [t.name, t.summary, t.category, t.invocation, t.package].join(" "),
    }));
    const distroCommands = DISTROS.flatMap((d) =>
      d.commands.map((c) => ({
        _kind: "command" as const,
        distroSlug: d.slug,
        distroName: d.name,
        name: c.name,
        syntax: c.syntax,
        description: c.description,
        body: [c.name, c.syntax, c.description, c.category, c.bestScenario].join(" "),
      })),
    );
    const toolCommands = KALI_TOOLS.flatMap((t) =>
      (t.commands ?? []).map((c) => ({
        _kind: "toolcommand" as const,
        toolSlug: t.slug,
        toolName: t.name,
        name: c.name,
        syntax: c.syntax,
        description: c.description,
        body: [c.name, c.syntax, c.description, t.name, c.category].join(" "),
      })),
    );
    const toolErrors = KALI_TOOLS.flatMap((t) =>
      (t.errors ?? []).map((e) => ({
        _kind: "toolerror" as const,
        toolSlug: t.slug,
        toolName: t.name,
        message: e.message,
        fix: e.fix,
        body: [e.message, e.cause, e.fix, t.name].join(" "),
      })),
    );
    const errors = DISTROS.flatMap((d) =>
      d.errors.map((e) => ({
        _kind: "error" as const,
        distroSlug: d.slug,
        distroName: d.name,
        message: e.message,
        fix: e.fix,
        body: [e.message, e.cause, e.fix, d.name].join(" "),
      })),
    );
    const baseOpts = { threshold: 0.35, ignoreLocation: true, includeScore: true };
    return {
      playbooks: new Fuse(playbooks, { ...baseOpts, keys: [{ name: "name", weight: 2 }, "body"] }),
      walkthroughs: new Fuse(walkthroughs, { ...baseOpts, keys: [{ name: "name", weight: 2 }, "body"] }),
      distros: new Fuse(distros, { ...baseOpts, keys: [{ name: "name", weight: 2 }, "body"] }),
      tools: new Fuse(tools, { ...baseOpts, keys: [{ name: "name", weight: 3 }, "body"] }),
      distroCommands: new Fuse(distroCommands, { ...baseOpts, keys: [{ name: "name", weight: 2 }, "syntax", "body"] }),
      toolCommands: new Fuse(toolCommands, { ...baseOpts, keys: [{ name: "name", weight: 2 }, "syntax", "body"] }),
      toolErrors: new Fuse(toolErrors, { ...baseOpts, keys: [{ name: "message", weight: 2 }, "body"] }),
      errors: new Fuse(errors, { ...baseOpts, keys: [{ name: "message", weight: 2 }, "body"] }),
    };
  }, []);

  const grouped = useMemo(() => {
    if (!q.trim()) return null;
    const terms = expandQuery(q);
    const collect = <T,>(fuse: Fuse<T>, mapper: (x: T, score: number) => Hit): Hit[] => {
      const seen = new Map<string, Hit>();
      for (const term of terms) {
        for (const r of fuse.search(term, { limit: 30 })) {
          const hit = mapper(r.item, r.score ?? 1);
          const key = hitKey(hit);
          const existing = seen.get(key);
          if (!existing || hit.score < existing.score) seen.set(key, hit);
        }
      }
      return [...seen.values()].sort((a, b) => a.score - b.score);
    };

    function hitKey(h: Hit): string {
      switch (h.kind) {
        case "playbook": return "p:" + h.slug;
        case "tool": return "t:" + h.slug;
        case "distro": return "d:" + h.slug;
        case "toolcommand": return "tc:" + h.toolSlug + ":" + h.name;
        case "command": return "dc:" + h.distroSlug + ":" + h.name;
        case "error": return "e:" + h.distroSlug + ":" + h.message;
      }
    }

    return {
      playbooks: collect(indexes.playbooks, (x, s) => ({ kind: "playbook", slug: x.slug, name: x.name, snippet: x.snippet, category: x.category, severity: x.severity, score: s })),
      tools: collect(indexes.tools, (x, s) => ({ kind: "tool", slug: x.slug, name: x.name, snippet: x.snippet, category: x.category, score: s })),
      distros: collect(indexes.distros, (x, s) => ({ kind: "distro", slug: x.slug, name: x.name, snippet: x.snippet, score: s })),
      toolCommands: collect(indexes.toolCommands, (x, s) => ({ kind: "toolcommand", toolSlug: x.toolSlug, toolName: x.toolName, name: x.name, syntax: x.syntax, description: x.description, score: s })),
      distroCommands: collect(indexes.distroCommands, (x, s) => ({ kind: "command", distroSlug: x.distroSlug, distroName: x.distroName, name: x.name, syntax: x.syntax, description: x.description, score: s })),
      errors: collect(indexes.errors, (x, s) => ({ kind: "error", distroSlug: x.distroSlug, distroName: x.distroName, message: x.message, fix: x.fix, score: s })),
    };
  }, [q, indexes]);

  const totalHits = grouped ? Object.values(grouped).reduce((a, arr) => a + arr.length, 0) : 0;
  const suggestions = grouped && totalHits === 0 ? nearestIntents(q) : [];
  const activeIntents = q.trim() ? expandQuery(q).filter((t) => t.length > 2 && t !== q.toLowerCase()) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Search</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe what you want to do — this understands intent, not just exact matches.
      </p>

      <div className="mt-4">
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. crack wifi, find open ports, escalate privileges linux, hack website login…"
        />
      </div>

      {activeIntents.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Lightbulb className="h-3 w-3" /> Also searching for:</span>
          {activeIntents.slice(0, 12).map((t) => (
            <span key={t} className="mono rounded-full border border-border bg-muted/40 px-2 py-0.5">{t}</span>
          ))}
        </div>
      )}

      {grouped && totalHits === 0 && (
        <div className="mt-6 rounded-md border border-border bg-card p-4 text-sm">
          <p>No direct matches.</p>
          {suggestions.length > 0 && (
            <>
              <p className="mt-2 text-muted-foreground">Try one of these intents:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs hover:bg-muted">{s}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {grouped && totalHits > 0 && (
        <div className="mt-6 space-y-6">
          <Group title="Playbooks" count={grouped.playbooks.length}>
            {grouped.playbooks.slice(0, 10).map((r, i) => r.kind === "playbook" && (
              <Link key={i} to="/hacking/$slug" params={{ slug: r.slug }} className="block rounded-md border border-border bg-card p-3 hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.name}</span>
                  <Badge variant="outline" className="text-[10px]">playbook · {r.category} · {r.severity}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.snippet}</p>
              </Link>
            ))}
          </Group>

          <Group title="Kali Tools" count={grouped.tools.length}>
            {grouped.tools.slice(0, 10).map((r, i) => r.kind === "tool" && (
              <Link key={i} to="/kali/$slug" params={{ slug: r.slug }} className="block rounded-md border border-border bg-card p-3 hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.name}</span>
                  <Badge variant="outline" className="text-[10px]">tool · {r.category}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.snippet}</p>
              </Link>
            ))}
          </Group>

          <Group title="Tool commands" count={grouped.toolCommands.length}>
            {grouped.toolCommands.slice(0, 10).map((r, i) => r.kind === "toolcommand" && (
              <Link key={i} to="/kali/$slug" params={{ slug: r.toolSlug }} className="block rounded-md border border-border bg-card p-3 hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <span className="mono font-semibold text-primary">{r.name}</span>
                  <Badge variant="outline" className="text-[10px]">{r.toolName}</Badge>
                </div>
                <code className="mono mt-1 block text-xs text-[var(--code-fg)]">{r.syntax}</code>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
              </Link>
            ))}
          </Group>

          <Group title="Distro commands" count={grouped.distroCommands.length}>
            {grouped.distroCommands.slice(0, 10).map((r, i) => r.kind === "command" && (
              <Link key={i} to="/distro/$slug" params={{ slug: r.distroSlug }} className="block rounded-md border border-border bg-card p-3 hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <span className="mono font-semibold text-primary">{r.name}</span>
                  <Badge variant="outline" className="text-[10px]">{r.distroName}</Badge>
                </div>
                <code className="mono mt-1 block text-xs text-[var(--code-fg)]">{r.syntax}</code>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
              </Link>
            ))}
          </Group>

          <Group title="Distros" count={grouped.distros.length}>
            {grouped.distros.slice(0, 10).map((r, i) => r.kind === "distro" && (
              <Link key={i} to="/distro/$slug" params={{ slug: r.slug }} className="block rounded-md border border-border bg-card p-3 hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.name}</span>
                  <Badge variant="outline" className="text-[10px]">distro</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.snippet}</p>
              </Link>
            ))}
          </Group>

          <Group title="Known errors" count={grouped.errors.length}>
            {grouped.errors.slice(0, 10).map((r, i) => r.kind === "error" && (
              <Link key={i} to="/distro/$slug" params={{ slug: r.distroSlug }} className="block rounded-md border border-border bg-card p-3 hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <span className="mono text-sm text-destructive">{r.message}</span>
                  <Badge variant="outline" className="text-[10px]">error · {r.distroName}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.fix}</p>
              </Link>
            ))}
          </Group>
        </div>
      )}
    </div>
  );
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title} <span className="ml-1 text-xs text-muted-foreground/70">({count})</span>
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
