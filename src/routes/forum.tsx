import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "Community — distro/ref" },
      { name: "description", content: "Find OS Oracle discussions, issues, contribution docs, and community support guidance." },
    ],
  }),
  component: ForumPage,
});

function ForumPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-primary">
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">Community on GitHub</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Community discussions</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          OS Oracle keeps its public forum on GitHub so questions, fixes, and content proposals stay searchable and transparent.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Join the discussion</CardTitle>
            <CardDescription>Ask questions, share workflows, or propose content improvements.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <a href="https://github.com/tituspaine/os-oracle/discussions" target="_blank" rel="noreferrer">GitHub Discussions</a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://github.com/tituspaine/os-oracle/issues" target="_blank" rel="noreferrer">GitHub Issues</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project rules</CardTitle>
            <CardDescription>Read the docs before posting or contributing.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <a href="https://github.com/tituspaine/os-oracle/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">CONTRIBUTING.md</a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://github.com/tituspaine/os-oracle/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noreferrer">CODE_OF_CONDUCT.md</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Community guidelines</CardTitle>
            <CardDescription>Keep the project useful, respectful, and safe.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Stay focused on defense, labs, research, and authorized testing.</li>
              <li>• Share reproducible details, versions, and exact scope when asking for help.</li>
              <li>• Do not post credentials, secrets, private targets, or real victim data.</li>
              <li>• Be respectful to maintainers and contributors during review.</li>
              <li>• Prefer upstream sources when suggesting corrections or new entries.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to get help</CardTitle>
            <CardDescription>Fastest ways to get a useful answer from the community.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Search existing issues and discussions before opening a new thread.</li>
              <li>2. Include the page, slug, command, or data source involved.</li>
              <li>3. For content changes, link the upstream documentation you used.</li>
              <li>4. For bugs, include screenshots, console output, and local reproduction steps.</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Actual conversation lives on GitHub, not inside this static page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
              Placeholder only: browse the live Discussions and Issues pages for the latest activity, accepted ideas, and open moderation tasks.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4" />
              <CardTitle className="text-base">Ethical disclosure</CardTitle>
            </div>
            <CardDescription>Handle sensitive findings responsibly.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use GitHub Issues only for non-sensitive bugs and content corrections.</li>
              <li>• For security-sensitive findings, follow the repository security policy first.</li>
              <li>• Do not request help targeting systems you do not own or control.</li>
            </ul>
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href="https://github.com/tituspaine/os-oracle/blob/main/SECURITY.md" target="_blank" rel="noreferrer">Read SECURITY.md</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
