import { createFileRoute } from "@tanstack/react-router";
import { Download, TerminalSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

const QUICK_START = [
  {
    title: "Search a tool",
    command: "os-oracle search nmap",
    output: "$ os-oracle search nmap\n1. nmap — Network discovery and port scanning\n   Category: Information Gathering\n   Invocation: nmap",
  },
  {
    title: "Open a playbook",
    command: "os-oracle hacking sqli-sqlmap",
    output: "$ os-oracle hacking sqli-sqlmap\nSQL Injection with sqlmap\nSeverity: critical\nSteps: capture request, test injection, enumerate DBs, dump rows",
  },
  {
    title: "List Kali tools by category",
    command: "os-oracle kali --category 'Wireless Attacks'",
    output: "$ os-oracle kali --category 'Wireless Attacks'\naircrack-ng\nreaver\nwifite\nhcxdumptool",
  },
  {
    title: "Bookmark a reference",
    command: "os-oracle bookmark add nmap",
    output: "$ os-oracle bookmark add nmap\nSaved bookmark: nmap\nUse 'os-oracle bookmark list' to review saved items.",
  },
];

const FEATURES = ["Offline-first reference", "100+ Kali tools", "500+ playbooks", "Fuzzy search", "Bookmarks"];

export const Route = createFileRoute("/cli")({
  head: () => ({
    meta: [
      { title: "CLI — distro/ref" },
      { name: "description", content: "Install and use the OS Oracle CLI for terminal-first ethical hacking reference workflows." },
    ],
  }),
  component: CliPage,
});

function CliPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-primary">
          <TerminalSquare className="h-5 w-5" />
          <span className="text-sm font-medium">Terminal workflow</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">OS Oracle CLI — Your terminal hacking reference</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Pull Kali tool notes, playbooks, and distro references directly into your shell without depending on a browser or network connection.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {FEATURES.map((feature) => (
            <Badge key={feature} variant="outline">
              {feature}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Install</CardTitle>
            <CardDescription>Choose the package manager that matches your workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock code="npm install -g os-oracle" />
            <CodeBlock code="bun install -g os-oracle" />
            <CodeBlock code="npx os-oracle search nmap" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System requirements</CardTitle>
            <CardDescription>Keep it lightweight and portable.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Node.js 18+ or Bun 1.x</li>
              <li>• macOS, Linux, or Windows terminal</li>
              <li>• UTF-8 capable shell for clean output</li>
              <li>• Internet only needed for install or updates</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Quick start examples</h2>
            <p className="mt-1 text-sm text-muted-foreground">A few terminal-first workflows you can expect on day one.</p>
          </div>
          <Button asChild>
            <a href="https://github.com/tituspaine/os-oracle/blob/main/CLI_GUIDE.md" target="_blank" rel="noreferrer">
              <Download className="h-4 w-4" />
              Open CLI guide
            </a>
          </Button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {QUICK_START.map((example) => (
            <Card key={example.title}>
              <CardHeader>
                <CardTitle className="text-base">{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CodeBlock code={example.command} />
                <CodeBlock code={example.output} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold tracking-tight">What you get</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map((feature) => (
            <div key={feature} className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{feature}</p>
              <p className="mt-1">
                {feature === "Offline-first reference" && "Browse bundled knowledge even when you are disconnected from the internet."}
                {feature === "100+ Kali tools" && "Jump to commands, categories, and summaries for common Kali workflows."}
                {feature === "500+ playbooks" && "Read repeatable procedures for common vulnerability classes and test paths."}
                {feature === "Fuzzy search" && "Find content by intent, package, command, or approximate wording."}
                {feature === "Bookmarks" && "Save the entries you revisit most often for rapid recall in the shell."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
