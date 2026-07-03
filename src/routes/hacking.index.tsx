import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PLAYBOOKS,
  PLAYBOOK_CATEGORIES,
  WALKTHROUGHS,
  hasWalkthrough,
  expandQuery,
  nearestIntents,
} from "@/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, BookOpen } from "lucide-react";
import { AckGate } from "@/components/ack-gate";

export const Route = createFileRoute("/hacking/")({
  head: () => ({
    meta: [
      { title: "Hacking playbooks — top vulnerabilities & exploits — distro/ref" },
      {
        name: "description",
        content:
          "Step-by-step playbooks for the most common hacks: SQLi, XSS, Log4Shell, EternalBlue, Kerberoasting, WPA2 cracking, privilege escalation, and more. Each step links to the Kali tool it uses.",
      },
      { property: "og:title", content: "Hacking playbooks — distro/ref" },
      {
        property: "og:description",
        content:
          "Popular vulnerabilities and exploits with commands, tool links, and error handling.",
      },
    ],
  }),
  component: HackingIndex,
});

const SEVERITY_COLOR: Record<string, string> = {
  low: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
};

function HackingIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  // Intent-based search: natural-language queries ("how do I audit a Wi-Fi
  // network's security?") expand into tool/technique keywords via
  // expandQuery(), then we score each playbook by how many expanded terms
  // hit its title/summary/tools/CVE.
  const { filtered, intentHints } = useMemo(() => {
    const raw = q.trim().toLowerCase();
    if (!raw && !cat) return { filtered: PLAYBOOKS, intentHints: [] as string[] };
    const expanded = raw ? expandQuery(raw) : [raw];
    const terms = Array.from(new Set(expanded.flatMap((s) => s.toLowerCase().split(/\s+/)))).filter(
      (t) => t.length > 2,
    );
    const scored = PLAYBOOKS.filter((p) => !cat || p.category === cat)
      .map((p) => {
        if (!raw) return { p, score: 1 };
        const hay = [
          p.title,
          p.summary,
          p.category,
          ...(p.cve ?? []),
          ...(p.toolSlugs ?? []),
          ...(p.mitreAttack ?? []),
        ]
          .join(" ")
          .toLowerCase();
        const score = terms.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return {
      filtered: scored.map((s) => s.p),
      intentHints: raw ? nearestIntents(raw, 4) : [],
    };
  }, [q, cat]);

  return (
    <AckGate>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Security Testing Playbooks</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Step-by-step walkthroughs for the most-searched vulnerabilities and exploits — each step
            shows the exact command and links directly to the Kali tool page. All content is for
            authorised testing only.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <ShieldAlert className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
            <p className="text-foreground/90">
              <strong>Authorised testing only.</strong> Running these techniques against systems
              without written permission is illegal (CFAA in the US, Computer Misuse Act in the UK,
              and similar laws elsewhere).
            </p>
          </div>
        </header>

        <section className="mb-8 rounded-lg border border-primary/40 bg-primary/5 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-primary">
              <BookOpen className="h-5 w-5" /> Play-by-play walkthroughs
            </h2>
            <span className="text-xs text-muted-foreground">{WALKTHROUGHS.length} available</span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Narrated end-to-end runs with real commands, expected terminal output, and branching
            troubleshooting — perfect for your first authorised lab attempt.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {WALKTHROUGHS.map((w) => (
              <li key={w.slug}>
                <Link
                  to="/hacking/$slug/walkthrough"
                  params={{ slug: w.slug }}
                  className="block rounded-md border border-border bg-card p-3 hover:border-primary/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{w.title}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {w.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{w.scenario}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mb-6 flex flex-col gap-2">
          <Input
            placeholder='Try: "how do I audit a Wi-Fi network" or "test website pricing logic"'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-2xl"
          />
          {intentHints.length > 0 && (
            <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
              <span className="mr-1">Related intents:</span>
              {intentHints.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setQ(h)}
                  className="rounded-full border border-border px-2 py-0.5 hover:bg-muted"
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setCat("")}
              className={`rounded-full px-3 py-1 text-xs border ${cat === "" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
            >
              All
            </button>
            {PLAYBOOK_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1 text-xs border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.slug}>
              <Link
                to="/hacking/$slug"
                params={{ slug: p.slug }}
                className="block h-full rounded-lg border border-border bg-card p-4 hover:border-primary/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <Badge className={`text-[10px] uppercase ${SEVERITY_COLOR[p.severity]}`}>
                    {p.severity}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <Badge variant="outline">{p.category}</Badge>
                  {p.cve?.map((c) => (
                    <span key={c} className="mono">
                      {c}
                    </span>
                  ))}
                  {p.mitreAttack?.map((m) => (
                    <span key={m} className="mono text-primary/80">
                      {m}
                    </span>
                  ))}
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.summary}</p>
                {hasWalkthrough(p.slug) && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <BookOpen className="h-3 w-3" /> Play-by-play available
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No playbooks match.</p>
        )}
      </div>
    </AckGate>
  );
}
