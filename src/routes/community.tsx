import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  COMMUNITY_PIPELINE,
  COMMUNITY_SUBMISSION_BLUEPRINT,
  CONTRIBUTION_PATHS,
  SCALE_TRACKS,
  SECURITY_GUARDRAILS,
} from "@/data/community";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community contributions — distro/ref" },
      {
        name: "description",
        content:
          "How to scale distro/ref safely: structured submission paths, review gates, and the highest-value expansion tracks for open-source contributors.",
      },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">
          Community contributions &amp; safe scaling
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          distro/ref can grow fast without turning into a live upload surface. The current model
          keeps the app static, requires citations, rejects weaponised material, and gives
          contributors clear paths for adding commands, walkthroughs, fixes, and high-signal
          references.
        </p>
      </header>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-xl font-semibold">Submission paths</h2>
          <Badge variant="outline">{CONTRIBUTION_PATHS.length} structured entry points</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {CONTRIBUTION_PATHS.map((path) => (
            <article key={path.slug} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold">{path.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{path.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {path.fields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Approval pipeline</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {COMMUNITY_PIPELINE.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-border bg-card p-4">
              <div className="mono text-xs text-primary">0{index + 1}</div>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="rounded-lg border border-primary/30 bg-primary/5 p-5">
          <h2 className="text-xl font-semibold text-primary">Validated submission blueprint</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Future automation should preserve this minimum review shape: one submission kind, one
            summary, at least one public source, explicit ethics attestation, and searchable tags.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Detail label="Kind" value={COMMUNITY_SUBMISSION_BLUEPRINT.kind} />
            <Detail label="Status" value={COMMUNITY_SUBMISSION_BLUEPRINT.status} />
            <Detail label="Submitted by" value={COMMUNITY_SUBMISSION_BLUEPRINT.submittedBy} />
            <Detail label="Tags" value={COMMUNITY_SUBMISSION_BLUEPRINT.tags.join(", ")} />
          </div>
          <p className="mt-4 text-sm text-foreground/90">
            {COMMUNITY_SUBMISSION_BLUEPRINT.summary}
          </p>
        </article>

        <article className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <h2 className="text-xl font-semibold text-destructive">Security guardrails</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/90">
            {SECURITY_GUARDRAILS.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Highest-value next additions</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {SCALE_TRACKS.map((track) => (
            <article key={track.title} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold">{track.title}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {track.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
