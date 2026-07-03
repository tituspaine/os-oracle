import { createFileRoute } from "@tanstack/react-router";
import { DownloadCloud, Terminal, Wifi, Package, CheckCircle2, BookOpen, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export const Route = createFileRoute("/cli")({
  head: () => ({
    meta: [
      { title: "CLI Tool — OS Oracle" },
      {
        name: "description",
        content:
          "Download and install the OS Oracle standalone CLI. Search 100K+ commands, tools, and playbooks completely offline from your Linux terminal. Zero dependencies.",
      },
      { property: "og:title", content: "OS Oracle CLI — Offline Ethical Hacking Reference" },
    ],
  }),
  component: CliPage,
});

const INSTALL_METHODS = [
  {
    id: "npm",
    label: "npm (recommended)",
    badge: "easiest",
    steps: [
      { title: "Install globally", code: "npm install -g os-oracle" },
      { title: "Verify install", code: "os-oracle --version" },
      { title: "Run your first search", code: 'os-oracle search "sql injection"' },
    ],
  },
  {
    id: "binary",
    label: "Standalone binary",
    badge: "no Node.js needed",
    steps: [
      {
        title: "Download (Linux x86_64)",
        code: "wget https://github.com/tituspaine/os-oracle/releases/latest/download/os-oracle-linux-x64\nchmod +x os-oracle-linux-x64\nsudo mv os-oracle-linux-x64 /usr/local/bin/os-oracle",
      },
      { title: "Verify", code: "os-oracle --version" },
    ],
  },
  {
    id: "brew",
    label: "Homebrew / Linuxbrew",
    badge: "macOS / Linux",
    steps: [
      { title: "Tap and install", code: "brew tap tituspaine/os-oracle\nbrew install os-oracle" },
    ],
  },
  {
    id: "aur",
    label: "AUR (Arch Linux)",
    badge: "arch",
    steps: [{ title: "Install with yay", code: "yay -S os-oracle-bin" }],
  },
  {
    id: "docker",
    label: "Docker",
    badge: "any OS",
    steps: [
      {
        title: "Run once",
        code: 'docker run --rm ghcr.io/tituspaine/os-oracle search "privilege escalation"',
      },
      {
        title: "Alias for convenience",
        code: "echo \"alias os-oracle='docker run --rm ghcr.io/tituspaine/os-oracle'\" >> ~/.bashrc\nsource ~/.bashrc",
      },
    ],
  },
];

const OFFLINE_COMMANDS = [
  {
    cmd: 'os-oracle search "sql injection"',
    description: "Full-text search across all tools, playbooks, and commands",
  },
  {
    cmd: "os-oracle tool nmap",
    description: "View all nmap commands, flags, examples, and error fixes",
  },
  {
    cmd: "os-oracle tool nmap --commands",
    description: "List just the commands for a tool",
  },
  {
    cmd: "os-oracle playbook sql-injection",
    description: "Step-by-step playbook with full context",
  },
  {
    cmd: "os-oracle playbooks",
    description: "List all available playbooks",
  },
  {
    cmd: "os-oracle distro ubuntu",
    description: "Ubuntu commands, package management, and error solutions",
  },
  {
    cmd: "os-oracle distros",
    description: "List all supported distributions",
  },
  {
    cmd: "os-oracle walkthrough sql-injection",
    description: "Interactive step-by-step walkthrough",
  },
  {
    cmd: "os-oracle errors 'permission denied'",
    description: "Look up an error message across all tools",
  },
  {
    cmd: "os-oracle bookmark add nmap",
    description: "Save a tool or playbook to your local bookmarks",
  },
  {
    cmd: "os-oracle bookmarks",
    description: "List your saved bookmarks (stored locally)",
  },
  {
    cmd: "os-oracle history",
    description: "View your recent search history (local only)",
  },
  {
    cmd: "os-oracle export playbook sql-injection > guide.md",
    description: "Export a playbook as Markdown",
  },
  {
    cmd: "os-oracle update",
    description: "Download the latest command database (requires internet once)",
  },
];

function CliPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">OS Oracle CLI</h1>
          <Badge variant="outline">v1.0 · Offline-first</Badge>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          A standalone command-line tool that bundles the entire OS Oracle database — every Kali
          tool, distro command, playbook, walkthrough, and error fix — directly inside the binary.{" "}
          <span className="text-primary font-medium">No internet. No server. No dependencies.</span>{" "}
          Just install once and search everything offline, forever.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Wifi,
              label: "100% Offline",
              text: "All data bundled in the binary. Core features need zero network.",
            },
            {
              icon: Cpu,
              label: "Zero Dependencies",
              text: "Single executable. Runs on any Linux system immediately.",
            },
            {
              icon: Package,
              label: "100K+ Commands",
              text: "Every Kali tool, every distro, all playbooks — always growing.",
            },
          ].map(({ icon: Icon, label, text }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Quick Start</h2>
        <div className="rounded-lg border border-primary/30 bg-card p-5">
          <CodeBlock
            code={`# Install in one line (npm)
npm install -g os-oracle

# Immediate offline use — no setup
os-oracle search "privilege escalation"
os-oracle tool nmap
os-oracle playbook sql-injection
os-oracle distro ubuntu`}
          />
        </div>
      </section>

      {/* Installation methods */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <DownloadCloud className="h-5 w-5 text-primary" />
          Installation Methods
        </h2>
        <div className="space-y-6">
          {INSTALL_METHODS.map((method) => (
            <div key={method.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold">{method.label}</h3>
                <Badge variant="outline" className="text-xs">
                  {method.badge}
                </Badge>
              </div>
              <div className="space-y-3">
                {method.steps.map((step, i) => (
                  <div key={i}>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">{i + 1}.</span> {step.title}
                    </p>
                    <CodeBlock code={step.code} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All offline commands */}
      <section className="mb-10">
        <h2 className="mb-1 text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          All Commands (Offline)
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Every command below works without an internet connection. All data is bundled inside the
          binary.
        </p>
        <div className="space-y-2">
          {OFFLINE_COMMANDS.map(({ cmd, description }) => (
            <div
              key={cmd}
              className="grid grid-cols-1 gap-1 rounded-md border border-border bg-card p-3 sm:grid-cols-2 sm:gap-4"
            >
              <code className="font-mono text-sm text-primary">{cmd}</code>
              <span className="text-sm text-muted-foreground">{description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Online-only features */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Online-Only Features</h2>
        <p className="text-sm text-muted-foreground mb-4">
          These features require an internet connection, but are completely optional. Core search is
          always offline.
        </p>
        <div className="space-y-2">
          {[
            {
              cmd: "os-oracle update",
              description: "Pull latest command database from GitHub (requires internet)",
            },
            { cmd: "os-oracle forum", description: "Open the community forum in your browser" },
            {
              cmd: "os-oracle submit tool nmap --correction",
              description: "Submit a correction or new command (requires account)",
            },
            {
              cmd: "os-oracle sync bookmarks",
              description: "Sync bookmarks across devices (requires account)",
            },
          ].map(({ cmd, description }) => (
            <div
              key={cmd}
              className="grid grid-cols-1 gap-1 rounded-md border border-dashed border-border bg-muted/30 p-3 sm:grid-cols-2 sm:gap-4"
            >
              <code className="font-mono text-sm text-muted-foreground">{cmd}</code>
              <span className="text-sm text-muted-foreground">{description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Config */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Configuration</h2>
        <CodeBlock
          code={`# Config stored at ~/.config/os-oracle/config.json
os-oracle config set theme dark        # dark | light | auto
os-oracle config set pager less        # pager for long output
os-oracle config set output json       # json | pretty | minimal
os-oracle config set lang en           # ui language (en default)
os-oracle config list                  # show all settings`}
        />
      </section>

      {/* Self-host / contribute */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Open Source &amp; Self-Hosting</h2>
        <p className="text-sm text-muted-foreground mb-4">
          OS Oracle is fully open source. You can self-host the entire platform, contribute new
          commands, or fork for your own use. The CLI binary and all data are free forever.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/tituspaine/os-oracle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/60 transition"
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            GitHub Repository
          </a>
          <a
            href="https://github.com/tituspaine/os-oracle/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/60 transition"
          >
            <DownloadCloud className="h-4 w-4 text-primary" />
            All Releases
          </a>
          <a
            href="https://github.com/tituspaine/os-oracle/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/60 transition"
          >
            <BookOpen className="h-4 w-4 text-primary" />
            Contributing Guide
          </a>
        </div>
      </section>
    </div>
  );
}
