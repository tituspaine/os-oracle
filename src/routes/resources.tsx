import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ExternalLink,
  Award,
  BookOpen,
  Map,
  Database,
  Bug,
  Search,
  Scale,
  Users,
  Flag,
} from "lucide-react";
import { GLOBAL_RESOURCES, type ResourceSection } from "@/data/resources";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Global Resources — OS Oracle" },
      {
        name: "description",
        content:
          "Curated global resources for ethical hackers: certifications, learning platforms, frameworks, CVE databases, bug bounty programs, communities, and legal guidance.",
      },
    ],
  }),
  component: Resources,
});

const SECTION_ICONS: Record<string, React.ElementType> = {
  certifications: Award,
  "learning-platforms": BookOpen,
  frameworks: Map,
  "vulnerability-databases": Database,
  "bug-bounty": Bug,
  "threat-intel": Search,
  "tools-references": BookOpen,
  "legal-ethics": Scale,
  communities: Users,
  ctf: Flag,
};

function Resources() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Global Ethical Hacking Resources</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          A curated collection of legitimate resources for security researchers, pentesters, and
          defenders — certifications, hands-on labs, threat frameworks, vulnerability databases, bug
          bounty platforms, and community hubs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {GLOBAL_RESOURCES.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              {s.icon} {s.title}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-14">
        {GLOBAL_RESOURCES.map((section) => (
          <ResourceSectionCard key={section.id} section={section} />
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-amber-800/40 bg-amber-950/20 p-5">
        <h2 className="font-semibold text-amber-400">⚠️ Authorized Use Only</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All resources, tools, and techniques referenced here are for authorized security testing,
          education, and defence only. Accessing systems without explicit written permission is
          illegal in most jurisdictions. Always obtain written authorization before any testing.{" "}
          <Link to="/ethics" className="text-primary hover:underline">
            Read the full ethics & authorization guide →
          </Link>
        </p>
      </div>
    </div>
  );
}

function ResourceSectionCard({ section }: { section: ResourceSection }) {
  const Icon = SECTION_ICONS[section.id] ?? BookOpen;
  const freeCount = section.items.filter((i) => i.free).length;

  return (
    <section id={section.id}>
      <div className="mb-4 flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{section.icon}</span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
          {freeCount > 0 && (
            <p className="mt-1 text-xs text-green-400/80">
              {freeCount} of {section.items.length} resources are free
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {section.items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-sm leading-snug group-hover:text-primary transition-colors pr-4">
                {item.name}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.free === true && (
                  <span className="rounded-full bg-green-900/40 border border-green-700/30 px-1.5 py-0.5 text-[10px] text-green-400 font-medium">
                    FREE
                  </span>
                )}
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
