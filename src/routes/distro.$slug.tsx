import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { distroBySlug, DISTROS } from "@/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CommandTable } from "@/components/command-table";
import { ErrorList } from "@/components/error-list";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/distro/$slug")({
  loader: ({ params }) => {
    const distro = distroBySlug(params.slug);
    if (!distro) throw notFound();
    return { distro };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Distro not found" }, { name: "robots", content: "noindex" }] };
    const d = loaderData.distro;
    return {
      meta: [
        { title: `${d.name} — commands, use cases & errors — distro/ref` },
        { name: "description", content: `${d.name}: ${d.summary}` },
        { property: "og:title", content: `${d.name} — distro/ref` },
        { property: "og:description", content: d.summary },
      ],
    };
  },
  component: DistroPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Distro not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary hover:underline">
        ← Back to distros
      </Link>
    </div>
  ),
});

function DistroPage() {
  const { distro: d } = Route.useLoaderData();
  const related = DISTROS.filter((x) => x.family === d.family && x.slug !== d.slug).slice(0, 4);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All distros
      </Link>
      <header className="mb-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{d.name}</h1>
          <Badge variant="outline" className="mono">
            {d.packageManager}
          </Badge>
          <Badge variant="outline">{d.init}</Badge>
          <Badge variant="outline">{d.defaultShell}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {d.developer} · First released {d.firstReleased}
        </p>
        <p className="mt-4 max-w-3xl text-foreground/90">{d.summary}</p>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commands">Commands ({d.commands.length})</TabsTrigger>
          <TabsTrigger value="errors">Errors ({d.errors.length})</TabsTrigger>
          {d.slug === "kali" && <TabsTrigger value="tools">Tools</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Section title="Best use cases">
            <ul className="list-disc pl-6 text-sm space-y-1">
              {d.bestUseCases.map((x: string) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Section>
          <Section title="When to use">
            <ul className="list-disc pl-6 text-sm space-y-1">
              {d.whenToUse.map((x: string) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Section>
          <Section title="When not to use">
            <ul className="list-disc pl-6 text-sm space-y-1">
              {d.whenNotToUse.map((x: string) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Section>
          {related.length > 0 && (
            <Section title="Related distros">
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/distro/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary/60 hover:text-primary"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </TabsContent>

        <TabsContent value="commands" className="mt-6">
          <CommandTable commands={d.commands} />
        </TabsContent>

        <TabsContent value="errors" className="mt-6">
          <ErrorList errors={d.errors} />
        </TabsContent>

        {d.slug === "kali" && (
          <TabsContent value="tools" className="mt-6">
            <p className="text-sm text-muted-foreground">
              Kali bundles hundreds of offensive-security tools. Browse the full catalog:
            </p>
            <Link
              to="/kali"
              className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Open Kali tool catalog →
            </Link>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
