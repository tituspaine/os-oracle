import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { walkthroughBySlug, playbookBySlug, kaliToolBySlug, type KaliTool } from "@/data";
import type { Walkthrough, WalkthroughStep } from "@/data";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import {
  ArrowLeft,
  ShieldAlert,
  BookOpen,
  Terminal,
  Eye,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/hacking/$slug/walkthrough")({
  loader: ({ params }): { wt: Walkthrough } => {
    const wt = walkthroughBySlug(params.slug);
    if (!wt) throw notFound();
    return { wt };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Walkthrough not found" },
          { name: "robots", content: "noindex" },
        ],
      };
    const w = loaderData.wt;
    return {
      meta: [
        { title: `${w.title} — play-by-play walkthrough — distro/ref` },
        { name: "description", content: w.scenario.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Walkthrough not found</h1>
      <p className="mt-2 text-muted-foreground">
        This playbook doesn't have a full play-by-play walkthrough yet.
      </p>
      <Link to="/hacking" className="mt-4 inline-block text-primary hover:underline">
        ← All playbooks
      </Link>
    </div>
  ),
  component: WalkthroughPage,
});

const DIFF_COLOR: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  intermediate: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  advanced: "bg-destructive/15 text-destructive border-destructive/30",
};

function WalkthroughPage() {
  const { wt } = Route.useLoaderData();
  const parent = playbookBySlug(wt.slug);
  const tools: KaliTool[] = (wt.toolSlugs ?? [])
    .map((s: string) => kaliToolBySlug(s))
    .filter((t: KaliTool | undefined): t is KaliTool => !!t);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/hacking/$slug"
        params={{ slug: wt.slug }}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to playbook
      </Link>

      <header className="mb-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Play-by-play
          </div>
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{wt.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge className={`text-[10px] uppercase ${DIFF_COLOR[wt.difficulty]}`}>
            {wt.difficulty}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            <Clock className="mr-1 h-3 w-3" /> {wt.duration}
          </Badge>
          <Badge variant="outline" className="text-[10px]">Lab: {wt.labSetup}</Badge>
        </div>
        <p className="mt-4 max-w-3xl text-foreground/90">{wt.scenario}</p>
        <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
          <p className="text-foreground/90">{wt.legalNote}</p>
        </div>
      </header>

      {tools.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tools you'll use
          </h2>
          <div className="flex flex-wrap gap-2">
            {tools.map((t: KaliTool) => (
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
        <h2 className="mb-4 text-lg font-semibold">The run, step by step</h2>
        <ol className="space-y-4">
          {wt.steps.map((s: WalkthroughStep, i: number) => (
            <li key={i} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-baseline gap-3">
                <span className="mono text-2xl font-bold text-primary/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-foreground/90">{s.narration}</p>
              {s.command && (
                <div className="mt-3">
                  <div className="mb-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Terminal className="h-3 w-3" /> command
                  </div>
                  <CodeBlock code={s.command} />
                </div>
              )}
              {s.expectedOutput && (
                <div className="mt-3">
                  <div className="mb-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Eye className="h-3 w-3" /> expected output (lab, simulated)
                  </div>
                  <pre className="mono overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs text-foreground/85">
{s.expectedOutput}
                  </pre>
                </div>
              )}
              {s.observation && (
                <div className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
                  <span className="mr-1 text-xs uppercase tracking-wider text-primary">
                    Read:
                  </span>
                  {s.observation}
                </div>
              )}
              {s.branches && s.branches.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <GitBranch className="h-3 w-3" /> if things go sideways
                  </div>
                  <ul className="space-y-2 text-sm">
                    {s.branches.map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/5 p-2"
                      >
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                        <div>
                          <p>
                            <span className="text-muted-foreground">When: </span>
                            {b.when}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Then: </span>
                            {b.then}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-500">
            <CheckCircle2 className="h-4 w-4" /> Success
          </div>
          <p className="text-sm text-foreground/90">{wt.successCriteria}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Eye className="h-4 w-4" /> Detection
          </div>
          <p className="text-sm text-foreground/90">{wt.detectionSummary}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-500">
            <ShieldCheck className="h-4 w-4" /> Mitigation
          </div>
          <p className="text-sm text-foreground/90">{wt.mitigationSummary}</p>
        </div>
      </section>

      {parent && (
        <div className="mt-8 rounded-md border border-border bg-muted/20 p-4 text-sm">
          <p className="text-muted-foreground">
            The concise reference for this scenario lives on the
            {" "}
            <Link
              to="/hacking/$slug"
              params={{ slug: wt.slug }}
              className="text-primary hover:underline"
            >
              {parent.title}
            </Link>{" "}
            playbook page.
          </p>
        </div>
      )}
    </div>
  );
}
