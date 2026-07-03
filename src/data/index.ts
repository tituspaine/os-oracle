import { DISTROS, distroBySlug } from "./distros";
import { KALI_DEEP_TOOLS } from "./kali-deep";
import { KALI_SHALLOW_TOOLS } from "./kali-shallow";
import type { KaliTool } from "./types";

export { DISTROS, distroBySlug };
export type * from "./types";

export const KALI_TOOLS: KaliTool[] = [...KALI_DEEP_TOOLS, ...KALI_SHALLOW_TOOLS].sort(
  (a, b) => a.name.localeCompare(b.name),
);

export const kaliToolBySlug = (slug: string) => KALI_TOOLS.find((t) => t.slug === slug);

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
