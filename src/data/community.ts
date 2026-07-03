import { z } from "zod";

export const CONTRIBUTION_PATHS = [
  {
    slug: "kali-command",
    title: "New Kali tool command",
    summary:
      "Submit one real command with syntax, flags, examples, known errors, and a source citation.",
    fields: ["tool slug or name", "command syntax", "real examples", "known errors", "source URL"],
  },
  {
    slug: "playbook",
    title: "New playbook or walkthrough",
    summary:
      "Propose a lab-safe scenario with prerequisites, ordered steps, troubleshooting, detection, and mitigation.",
    fields: ["scenario summary", "lab target", "ordered steps", "tool slugs", "citations"],
  },
  {
    slug: "error-fix",
    title: "Error message + fix",
    summary:
      "Capture the exact error text, root cause, and the remediation that fixed it in practice.",
    fields: ["page or tool", "exact error", "root cause", "fix", "source URL"],
  },
  {
    slug: "resource",
    title: "Resource or reference link",
    summary:
      "Add a high-signal public reference that helps keep commands, mitigations, and guidance accurate.",
    fields: ["resource title", "URL", "why it matters", "category tags"],
  },
] as const;

export const COMMUNITY_PIPELINE = [
  {
    title: "Submit",
    description:
      "Use a GitHub issue form or PR with citations, ethical framing, and enough detail for maintainers to reproduce the result.",
  },
  {
    title: "Validate",
    description:
      "Check structure, required fields, safe-target framing, and whether the submission duplicates content already in the catalog.",
  },
  {
    title: "Review",
    description:
      "Confirm technical accuracy, map related tools or ATT&CK/CVE references when relevant, and request revisions when evidence is thin.",
  },
  {
    title: "Approve",
    description:
      "Merge only when the content remains static, lab-safe, source-backed, and aligned with the repo’s no-malware / no-weaponisation rules.",
  },
  {
    title: "Publish",
    description:
      "Approved content becomes part of the static bundle, so every user gets it offline with no backend migration or runtime sync step.",
  },
] as const;

export const SECURITY_GUARDRAILS = [
  "No malware, ransomware, credential-harvesting kits, destructive one-liners, or unauthorised-access tooling.",
  "No live target assumptions: walkthroughs must stay anchored to labs, owned systems, or explicit written authorisation.",
  "No runtime upload or auto-execution path: this project stays static so submissions cannot become an app-layer attack surface.",
  "No unsourced claims: every command, error, or scenario needs an upstream doc, man page, CVE record, or equivalent public reference.",
] as const;

export const SCALE_TRACKS = [
  {
    title: "Content depth",
    items: [
      "Broaden command coverage for high-use Kali tools, distro administration workflows, and troubleshooting paths.",
      "Expand walkthrough density around safe lab environments, defensive verification, and detection/mitigation guidance.",
      "Add more curated resource links for standards, blue-team playbooks, disclosure programs, and upstream tool docs.",
    ],
  },
  {
    title: "User experience",
    items: [
      "Improve browse flows with more faceted filters, related-content links, and better chunking for very large indexes.",
      "Expose contribution guidance in-app so first-time open-source contributors know exactly what high-value work looks like.",
      "Strengthen offline navigation patterns before introducing any separate terminal or packaging surface.",
    ],
  },
  {
    title: "Operational hardening",
    items: [
      "Keep validation at build time and code review time instead of adding a live ingestion service prematurely.",
      "Use issue forms, labels, and CI checks to triage volume before considering richer moderation tooling.",
      "Preserve the static architecture unless a future backend can be justified without weakening security or maintainability.",
    ],
  },
] as const;

export const CommunitySubmissionBlueprintSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(CONTRIBUTION_PATHS.map((path) => path.slug) as [string, ...string[]]),
  submittedBy: z.string().min(1),
  createdAt: z.string().min(1),
  status: z.enum(["draft", "pending-review", "needs-revision", "approved", "rejected"]),
  summary: z.string().min(20),
  sourceUrls: z.array(z.string().url()).min(1),
  ethicsAttested: z.literal(true),
  tags: z.array(z.string().min(1)).min(1),
});

export type CommunitySubmissionBlueprint = z.infer<typeof CommunitySubmissionBlueprintSchema>;

export const COMMUNITY_SUBMISSION_BLUEPRINT: CommunitySubmissionBlueprint =
  CommunitySubmissionBlueprintSchema.parse({
    id: "example-sqlmap-command",
    kind: "kali-command",
    submittedBy: "community-member",
    createdAt: "2026-07-03T00:00:00Z",
    status: "pending-review",
    summary:
      "Document a safe sqlmap enumeration command, why it is used in a lab, and how to recover from common target or authentication errors.",
    sourceUrls: ["https://github.com/sqlmapproject/sqlmap/wiki"],
    ethicsAttested: true,
    tags: ["sqlmap", "web-app-analysis", "authorised-testing"],
  });
