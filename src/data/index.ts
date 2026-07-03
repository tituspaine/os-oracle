import { DISTROS, distroBySlug } from "./distros";
import { KALI_DEEP_TOOLS } from "./kali-deep";
import { KALI_SHALLOW_TOOLS } from "./kali-shallow";
import { KALI_EXTRA_TOOLS } from "./kali-extra";
import { KALI_EXTRA2_TOOLS } from "./kali-extra2";
import { PLAYBOOKS as CORE_PLAYBOOKS, PLAYBOOK_CATEGORIES, playbookBySlug as _pbs } from "./hacking";
import { EXTRA_PLAYBOOKS } from "./playbooks-extra";
import type { KaliTool } from "./types";
import type { Playbook } from "./hacking";

export { DISTROS, distroBySlug };
export type * from "./types";
export { PLAYBOOK_CATEGORIES };
export type { Playbook, PlaybookCategory, PlaybookStep } from "./hacking";
export { SYNONYMS, expandQuery, nearestIntents } from "./search-synonyms";
export { WALKTHROUGHS, walkthroughBySlug, hasWalkthrough } from "./walkthroughs";
export type { Walkthrough, WalkthroughStep } from "./walkthroughs";

// Merge tools, de-duplicate by slug (later sources win — extras override earlier stubs).
const _merged = new Map<string, KaliTool>();
for (const t of [
  ...KALI_SHALLOW_TOOLS,
  ...KALI_DEEP_TOOLS,
  ...KALI_EXTRA_TOOLS,
  ...KALI_EXTRA2_TOOLS,
]) {
  _merged.set(t.slug, t);
}
export const KALI_TOOLS: KaliTool[] = Array.from(_merged.values()).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const kaliToolBySlug = (slug: string) => KALI_TOOLS.find((t) => t.slug === slug);

// Merge playbooks the same way.
const _pb = new Map<string, Playbook>();
for (const p of [...CORE_PLAYBOOKS, ...EXTRA_PLAYBOOKS]) _pb.set(p.slug, p);
export const PLAYBOOKS: Playbook[] = Array.from(_pb.values()).sort((a, b) =>
  a.title.localeCompare(b.title),
);
export const playbookBySlug = (slug: string) => _pb.get(slug) ?? _pbs(slug);

export const KALI_CATEGORIES = [
  "Information Gathering",
  "Vulnerability Analysis",
  "Web Application Analysis",
  "Database Assessment",
  "Password Attacks",
  "Wireless Attacks",
  "Reverse Engineering",
  "Exploitation Tools",
  "Sniffing & Spoofing",
  "Post Exploitation",
  "Forensics",
  "Reporting Tools",
  "Social Engineering Tools",
] as const;
