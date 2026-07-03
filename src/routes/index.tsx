import { createFileRoute, Link } from "@tanstack/react-router";
import { DISTROS, KALI_TOOLS, PLAYBOOKS } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Skull, Terminal, Package, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linux distros — distro/ref" },
      {
        name: "description",
        content:
          "Browse every major Linux distribution: purpose, best use cases, package manager, and full command reference with error fixes.",
      },
      { property: "og:title", content: "Linux distros — distro/ref" },
      {
        property: "og:description",
        content: "Every major Linux distribution with commands, use cases, and troubleshooting.",
      },
    ],
  }),
  component: Index,
});

const FAMILY_LABELS: Record<string, string> = {
  debian: "Debian family",
  rhel: "RHEL family",
  arch: "Arch family",
  suse: "SUSE family",
  alpine: "Alpine",
  gentoo: "Gentoo",
  slackware: "Slackware",
  nixos: "NixOS",
  kali: "Kali",
};

function Index() {
  const grouped = DISTROS.reduce<Record<string, typeof DISTROS>>((acc, d) => {
    (acc[d.family] ||= []).push(d);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Linux distributions &amp; the complete Kali toolset
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          A local, static reference for every major Linux distribution and the tools shipped with
          Kali Linux. Each entry lists what the system is for, when to use it, its commands, and how
          to solve common errors. Nothing here calls out to the cloud — the data ships with the app.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{DISTROS.length} distributions</Badge>
          <Badge variant="outline">{KALI_TOOLS.length} Kali tools</Badge>
          <Badge variant="outline">{PLAYBOOKS.length} hacking playbooks</Badge>
        </div>
      </section>

      <section className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          to="/kali"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Terminal className="h-4 w-4 text-primary" />
            Kali tools
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Every tool, categorised, with commands and errors.
          </p>
        </Link>
        <Link
          to="/hacking"
          className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 hover:border-destructive"
        >
          <div className="flex items-center gap-2 font-semibold text-destructive">
            <Skull className="h-4 w-4" />
            Hacking playbooks
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Top vulnerabilities & exploits with step-by-step commands and error handling.
          </p>
        </Link>
        <Link
          to="/search"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Package className="h-4 w-4 text-primary" />
            Intent search
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what you want — "crack wifi", "escalate privileges" — get the right tool.
          </p>
        </Link>
        <Link
          to="/community"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Users className="h-4 w-4 text-primary" />
            Community scaling
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured contribution paths, secure review gates, and the roadmap for expanding
            coverage safely.
          </p>
        </Link>
      </section>

      {Object.entries(grouped).map(([family, list]) => (
        <section key={family} className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {FAMILY_LABELS[family] ?? family}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => (
              <Link
                key={d.slug}
                to="/distro/$slug"
                params={{ slug: d.slug }}
                className="group rounded-lg border border-border bg-card p-4 transition hover:border-primary/60 hover:bg-accent/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold group-hover:text-primary">{d.name}</h3>
                  <span className="mono text-xs text-muted-foreground">{d.packageManager}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{d.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                  <span>{d.commands.length} commands</span>
                  <span>·</span>
                  <span>{d.errors.length} errors</span>
                  <span>·</span>
                  <span>{d.init}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
