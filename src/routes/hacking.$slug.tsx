import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { playbookBySlug, kaliToolBySlug, hasWalkthrough, type KaliTool } from "@/data";
import type { Playbook, PlaybookStep } from "@/data";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { ErrorList } from "@/components/error-list";
import { ArrowLeft, ShieldAlert, Eye, ShieldCheck, BookOpen } from "lucide-react";

export const Route = createFileRoute("/hacking/$slug")({
  loader: ({ params }): { pb: Playbook } => {
    const pb = playbookBySlug(params.slug);
    if (!pb) throw notFound();
    return { pb };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Playbook not found" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.pb;
    return {
      meta: [
        { title: `${p.title} — hacking playbook — distro/ref` },
        { name: "description", content: p.summary.slice(0, 155) },
        { property: "og:title", content: `${p.title} — playbook` },
        { property: "og:description", content: p.summary.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Playbook not found</h1>
      <Link to="/hacking" className="mt-4 inline-block text-primary hover:underline">← All playbooks</Link>
    </div>
  ),
  component: PlaybookPage,
});

const SEVERITY_COLOR: Record<string, string> = {
  low: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
};

function PlaybookPage() {
  const { pb } = Route.useLoaderData();
  const tools: KaliTool[] = pb.toolSlugs
    .map((s: string) => kaliToolBySlug(s))
    .filter((x: KaliTool | undefined): x is KaliTool => x !== undefined);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/hacking" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All playbooks
      </Link>

      <header className="mb-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{pb.title}</h1>
          <Badge className={`text-[10px] uppercase ${SEVERITY_COLOR[pb.severity]}`}>{pb.severity}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{pb.category}</Badge>
          {pb.cve?.map((c: string) => <span key={c} className="mono">{c}</span>)}
          {pb.mitreAttack?.map((m: string) => <span key={m} className="mono text-primary/80">MITRE {m}</span>)}
        </div>
        <p className="mt-4 max-w-3xl text-foreground/90">{pb.summary}</p>

        <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
          <p className="text-foreground/90">{pb.legalNote}</p>
        </div>

        {hasWalkthrough(pb.slug) && (
          <Link
            to="/hacking/$slug/walkthrough"
            params={{ slug: pb.slug }}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
          >
            <BookOpen className="h-4 w-4" />
            Open the full play-by-play walkthrough →
          </Link>
        )}
      </header>

      {pb.prerequisites.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Prerequisites</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {pb.prerequisites.map((p: string, i: number) => <li key={i}>{p}</li>)}
          </ul>
        </section>
      )}

      {tools.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tools used</h2>
          <div className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <Link
                key={t.slug}
                to="/kali/$slug"
                params={{ slug: t.slug }}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:border-primary/60"
              >
                <span className="mono text-primary">{t.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{t.category}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Steps</h2>
        <ol className="space-y-4">
          {pb.steps.map((s: PlaybookStep, i: number) => (
            <li key={i} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-baseline gap-3">
                <span className="mono text-2xl font-bold text-primary/70">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-semibold">{s.title}</h3>
              </div>
              {s.detail && <p className="mt-2 text-sm text-foreground/90">{s.detail}</p>}
              <div className="mt-3 space-y-2">
                {s.commands.map((c: { code: string; note: string }, j: number) => (
                  <div key={j}>
                    <CodeBlock code={c.code} />
                    {c.note && <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {pb.errors.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Error handling</h2>
          <ErrorList errors={pb.errors} />
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Eye className="h-4 w-4" /> Detection
          </div>
          <p className="text-sm text-foreground/90">{pb.detection}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-500">
            <ShieldCheck className="h-4 w-4" /> Mitigation
          </div>
          <p className="text-sm text-foreground/90">{pb.mitigation}</p>
        </div>
      </section>
    </div>
  );
}
