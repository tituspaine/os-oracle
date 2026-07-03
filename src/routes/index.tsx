import { createFileRoute, Link } from "@tanstack/react-router";
import { DISTROS, KALI_TOOLS, PLAYBOOKS } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Skull, Terminal, Package, Users, DownloadCloud } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OS Oracle — Offline Ethical Hacking & Linux Reference" },
      {
        name: "description",
        content:
          "OS Oracle: browse every major Linux distribution, 100+ Kali tools, hacking playbooks, step-by-step walkthroughs, and a global community forum. All data bundled — works completely offline.",
      },
      { property: "og:title", content: "OS Oracle — Offline Ethical Hacking & Linux Reference" },
      {
        property: "og:description",
        content:
          "Every major Linux distribution, the full Kali toolset, hacking playbooks, walkthroughs, and a global forum — all offline-first.",
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
          OS Oracle — Complete Ethical Hacking &amp; Linux Reference
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          The ultimate offline-first reference for ethical hackers, pentesters, and Linux power
          users worldwide. Every major Linux distribution, 100+ Kali tools, hacking playbooks,
          step-by-step walkthroughs, and a global community forum — all bundled.{" "}
          <span className="text-primary font-medium">No internet required for core features.</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{DISTROS.length} distributions</Badge>
          <Badge variant="outline">{KALI_TOOLS.length} Kali tools</Badge>
          <Badge variant="outline">{PLAYBOOKS.length} hacking playbooks</Badge>
          <Badge variant="outline">Offline-first</Badge>
          <Badge variant="outline">100% open source</Badge>
        </div>
      </section>

      <section className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/kali"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Terminal className="h-4 w-4 text-primary" />
            Kali Tools
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Every Kali tool categorised with commands, examples, and error fixes.
          </p>
        </Link>
        <Link
          to="/hacking"
          className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 hover:border-destructive"
        >
          <div className="flex items-center gap-2 font-semibold text-destructive">
            <Skull className="h-4 w-4" />
            Hacking Playbooks
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Top vulnerabilities &amp; exploits with step-by-step commands and error handling.
          </p>
        </Link>
        <Link
          to="/search"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Package className="h-4 w-4 text-primary" />
            Intent Search
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what you want — "crack wifi", "escalate privileges" — get the right tool
            instantly.
          </p>
        </Link>
        <Link
          to="/forum"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Users className="h-4 w-4 text-primary" />
            Community Forum
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Global forum for hackers worldwide. Post in any language — auto-translated to English.
          </p>
        </Link>
        <Link
          to="/cli"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-semibold">
            <DownloadCloud className="h-4 w-4 text-primary" />
            CLI Tool
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Standalone binary for your Linux terminal. Search everything offline with one command.
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
