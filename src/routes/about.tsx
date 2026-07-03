import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — distro/ref" },
      { name: "description", content: "About distro/ref: a static, offline Linux distro and Kali tool reference. No AI, no cloud, no telemetry." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose prose-invert">
      <h1 className="text-3xl font-bold tracking-tight">About distro/ref</h1>
      <p className="mt-4 text-foreground/90">
        distro/ref is a static reference site covering every major Linux distribution and the tools bundled with Kali Linux.
      </p>

      <h2 className="mt-8 text-lg font-semibold">No AI. No cloud. No telemetry.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        All content is compiled directly into the app bundle at build time. No API keys, no backend, no database, no analytics.
        Open the network tab: nothing here talks to a server after the page loads.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Data sources</h2>
      <ul className="mt-2 list-disc pl-6 text-sm">
        <li>Official distribution documentation and wikis (Debian, Arch, Fedora, SUSE, Alpine, Gentoo, Slackware, NixOS, Kali).</li>
        <li>Upstream project homepages and READMEs for each Kali tool.</li>
        <li>Linux man pages for canonical command syntax.</li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        Every Kali tool page links to its authoritative upstream homepage. Always consult upstream for the most current details.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Legal notice</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The offensive-security tools cataloged here are documented for educational purposes and for use in authorized security testing only.
        Using these tools against systems you do not own, or without explicit written permission, may be illegal in your jurisdiction.
        You are responsible for your actions.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Scope</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Kali ships hundreds of tools, and each has its own flag surface. distro/ref documents the most-used tools deeply
        (with commands, examples, best scenarios, and error fixes) and catalogs the remainder shallowly.
        The data files are structured so more tools and more depth can be added incrementally.
      </p>
    </div>
  );
}
