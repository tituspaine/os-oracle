import { createFileRoute } from "@tanstack/react-router";
import { DISTROS, KALI_TOOLS, PLAYBOOKS } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CONTENT_GUIDELINES = [
  "Cite upstream or canonical sources whenever possible.",
  "Keep entries reproducible in a lab or authorized assessment.",
  "Avoid secrets, payload dumps, or target-specific sensitive data.",
  "Write summaries for defenders and learners, not for misuse.",
  "Include legal or ethical framing when documenting offensive workflows.",
];

const ETHICS_REVIEW = [
  "Does the content clearly require authorization and scope?",
  "Would a newcomer understand the defensive or educational purpose?",
  "Are exploit steps balanced with mitigations or detection guidance?",
  "Have risky details been limited to lab-safe, documented scenarios?",
  "Is the source reputable, current, and attributable?",
];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin info — distro/ref" },
      { name: "description", content: "Static moderation and content administration guidance for the OS Oracle project." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 rounded-xl border border-border bg-card p-6">
        <h1 className="text-3xl font-bold tracking-tight">Content moderation &amp; admin info</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          This is a static documentation page, not a live admin panel. Use it as a quick reference for review standards, contribution rules, and project scope.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Kali tools" value={KALI_TOOLS.length} />
        <StatCard label="Playbooks" value={PLAYBOOKS.length} />
        <StatCard label="Distros" value={DISTROS.length} />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content guidelines</CardTitle>
            <CardDescription>Checklist for maintainers and contributors reviewing new material.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {CONTENT_GUIDELINES.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href="https://github.com/tituspaine/os-oracle/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">Open CONTRIBUTING.md</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ethics review checklist</CardTitle>
            <CardDescription>Quick test for whether a submission fits the project's mission.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 pb-4 text-xs">
              <Badge variant="outline">offline-first</Badge>
              <Badge variant="outline">authorized use</Badge>
              <Badge variant="outline">educational</Badge>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {ETHICS_REVIEW.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Moderation queue</CardTitle>
            <CardDescription>There is no private queue in the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Use GitHub Issues for content corrections, route bugs, and moderation requests. Discussions are better for proposals, roadmap questions, and broad feedback.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href="https://github.com/tituspaine/os-oracle/issues" target="_blank" rel="noreferrer">Review GitHub Issues</a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://github.com/tituspaine/os-oracle/discussions" target="_blank" rel="noreferrer">Open Discussions</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
