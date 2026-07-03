import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { kaliToolBySlug } from "@/data";
import { Badge } from "@/components/ui/badge";
import { CommandTable } from "@/components/command-table";
import { ErrorList } from "@/components/error-list";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/kali/$slug")({
  loader: ({ params }) => {
    const tool = kaliToolBySlug(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tool not found" }, { name: "robots", content: "noindex" }] };
    const t = loaderData.tool;
    return {
      meta: [
        { title: `${t.name} — ${t.category} — Kali tool reference` },
        { name: "description", content: `${t.name}: ${t.summary}` },
        { property: "og:title", content: `${t.name} — Kali tool` },
        { property: "og:description", content: t.summary },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Tool not found</h1>
      <Link to="/kali" className="mt-4 inline-block text-primary hover:underline">← Back to Kali tools</Link>
    </div>
  ),
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/kali" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All Kali tools
      </Link>

      <header className="mb-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
          {tool.depth === "deep" && <Badge>deep</Badge>}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{tool.category}</Badge>
          <span>·</span>
          <span className="mono">apt install {tool.package}</span>
          <span>·</span>
          <a href={tool.homepage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
            homepage <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="mt-4 max-w-3xl text-foreground/90">{tool.summary}</p>
        <div className="mt-3 rounded-md border border-border bg-[var(--code-bg)] p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Invocation</div>
          <code className="mono text-sm text-[var(--code-fg)]">{tool.invocation}</code>
        </div>
      </header>

      {tool.commands && tool.commands.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Commands</h2>
          <CommandTable commands={tool.commands} />
        </section>
      )}

      {tool.errors && tool.errors.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Common errors</h2>
          <ErrorList errors={tool.errors} />
        </section>
      )}

      {tool.depth === "shallow" && (
        <section className="mt-8 rounded-lg border border-border bg-card p-4 text-sm">
          <p className="text-muted-foreground">
            This tool is listed in the shallow catalog. For full flags and behavior, consult{" "}
            <a href={tool.homepage} target="_blank" rel="noreferrer" className="text-primary hover:underline">its homepage</a>{" "}
            or run <code className="mono">man {tool.invocation.split(" ")[0]}</code> on Kali.
          </p>
        </section>
      )}
    </div>
  );
}
