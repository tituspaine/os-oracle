import type { Command, Distro, DistroFamily, KaliCategory, KaliTool, KnownError } from "./types";
import type { Playbook, PlaybookCategory } from "./hacking";
import type { Walkthrough } from "./walkthroughs";

export type ValidationResult = { valid: boolean; errors: string[] };

const DISTRO_FAMILIES: DistroFamily[] = [
  "debian",
  "rhel",
  "arch",
  "suse",
  "alpine",
  "gentoo",
  "slackware",
  "nixos",
  "kali",
];

const KALI_CATEGORIES: KaliCategory[] = [
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
];

const PLAYBOOK_CATEGORIES: PlaybookCategory[] = [
  "Web",
  "Network",
  "Active Directory",
  "Wireless",
  "Password",
  "Privilege Escalation",
  "Post-Exploitation",
  "Social",
];

const PLAYBOOK_SEVERITIES = ["low", "medium", "high", "critical"] as const;
const WALKTHROUGH_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

const isRecord = (obj: unknown): obj is Record<string, unknown> => typeof obj === "object" && obj !== null;
const isString = (value: unknown): value is string => typeof value === "string";
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString);
const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function isCommandExample(obj: unknown): obj is Command["examples"][number] {
  return isRecord(obj) && hasText(obj.code) && hasText(obj.note);
}

export function isCommand(obj: unknown): obj is Command {
  return (
    isRecord(obj) &&
    hasText(obj.name) &&
    hasText(obj.syntax) &&
    hasText(obj.description) &&
    Array.isArray(obj.examples) &&
    obj.examples.every(isCommandExample) &&
    hasText(obj.bestScenario) &&
    hasText(obj.category)
  );
}

export function isKnownError(obj: unknown): obj is KnownError {
  return isRecord(obj) && hasText(obj.message) && hasText(obj.cause) && hasText(obj.fix);
}

export function isKaliTool(obj: unknown): obj is KaliTool {
  return (
    isRecord(obj) &&
    hasText(obj.slug) &&
    hasText(obj.name) &&
    isString(obj.category) &&
    KALI_CATEGORIES.includes(obj.category as KaliCategory) &&
    hasText(obj.package) &&
    hasText(obj.homepage) &&
    hasText(obj.summary) &&
    (obj.depth === "deep" || obj.depth === "shallow") &&
    hasText(obj.invocation) &&
    (obj.commands === undefined || (Array.isArray(obj.commands) && obj.commands.every(isCommand))) &&
    (obj.errors === undefined || (Array.isArray(obj.errors) && obj.errors.every(isKnownError)))
  );
}

export function isPlaybook(obj: unknown): obj is Playbook {
  return (
    isRecord(obj) &&
    hasText(obj.slug) &&
    hasText(obj.title) &&
    isString(obj.category) &&
    PLAYBOOK_CATEGORIES.includes(obj.category as PlaybookCategory) &&
    isString(obj.severity) &&
    PLAYBOOK_SEVERITIES.includes(obj.severity as (typeof PLAYBOOK_SEVERITIES)[number]) &&
    (obj.cve === undefined || isStringArray(obj.cve)) &&
    (obj.mitreAttack === undefined || isStringArray(obj.mitreAttack)) &&
    hasText(obj.summary) &&
    isStringArray(obj.prerequisites) &&
    isStringArray(obj.toolSlugs) &&
    hasText(obj.legalNote) &&
    Array.isArray(obj.steps) &&
    obj.steps.every(
      (step) =>
        isRecord(step) &&
        hasText(step.title) &&
        hasText(step.detail) &&
        Array.isArray(step.commands) &&
        step.commands.every(isCommandExample),
    ) &&
    Array.isArray(obj.errors) &&
    obj.errors.every(isKnownError) &&
    hasText(obj.detection) &&
    hasText(obj.mitigation)
  );
}

export function isDistro(obj: unknown): obj is Distro {
  return (
    isRecord(obj) &&
    hasText(obj.slug) &&
    hasText(obj.name) &&
    isString(obj.family) &&
    DISTRO_FAMILIES.includes(obj.family as DistroFamily) &&
    hasText(obj.developer) &&
    hasText(obj.firstReleased) &&
    hasText(obj.summary) &&
    isStringArray(obj.bestUseCases) &&
    isStringArray(obj.whenToUse) &&
    isStringArray(obj.whenNotToUse) &&
    hasText(obj.packageManager) &&
    hasText(obj.defaultShell) &&
    hasText(obj.init) &&
    Array.isArray(obj.commands) &&
    obj.commands.every(isCommand) &&
    Array.isArray(obj.errors) &&
    obj.errors.every(isKnownError)
  );
}

export function isWalkthrough(obj: unknown): obj is Walkthrough {
  return (
    isRecord(obj) &&
    hasText(obj.slug) &&
    hasText(obj.title) &&
    hasText(obj.scenario) &&
    hasText(obj.labSetup) &&
    hasText(obj.duration) &&
    isString(obj.difficulty) &&
    WALKTHROUGH_DIFFICULTIES.includes(obj.difficulty as (typeof WALKTHROUGH_DIFFICULTIES)[number]) &&
    hasText(obj.legalNote) &&
    (obj.toolSlugs === undefined || isStringArray(obj.toolSlugs)) &&
    Array.isArray(obj.steps) &&
    obj.steps.every(
      (step) =>
        isRecord(step) &&
        hasText(step.title) &&
        (step.narration === undefined || hasText(step.narration)) &&
        (step.command === undefined || hasText(step.command)) &&
        (step.expectedOutput === undefined || hasText(step.expectedOutput)) &&
        (step.observation === undefined || hasText(step.observation)) &&
        (step.branches === undefined ||
          (Array.isArray(step.branches) &&
            step.branches.every(
              (branch) => isRecord(branch) && hasText(branch.when) && hasText(branch.then),
            ))) &&
        (step.toolSlugs === undefined || isStringArray(step.toolSlugs)),
    ) &&
    hasText(obj.successCriteria) &&
    hasText(obj.detectionSummary) &&
    hasText(obj.mitigationSummary)
  );
}

function pushRequiredStringError(record: Record<string, unknown>, field: string, errors: string[]) {
  if (!hasText(record[field])) errors.push(`${field} must be a non-empty string`);
}

export function validateKaliTool(tool: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(tool)) {
    return { valid: false, errors: ["tool must be an object"] };
  }

  pushRequiredStringError(tool, "slug", errors);
  pushRequiredStringError(tool, "name", errors);
  pushRequiredStringError(tool, "package", errors);
  pushRequiredStringError(tool, "homepage", errors);
  pushRequiredStringError(tool, "summary", errors);
  pushRequiredStringError(tool, "invocation", errors);

  if (!isString(tool.category) || !KALI_CATEGORIES.includes(tool.category as KaliCategory)) {
    errors.push(`category must be one of: ${KALI_CATEGORIES.join(", ")}`);
  }

  if (tool.depth !== "deep" && tool.depth !== "shallow") {
    errors.push('depth must be either "deep" or "shallow"');
  }

  if (tool.commands !== undefined) {
    if (!Array.isArray(tool.commands)) {
      errors.push("commands must be an array when provided");
    } else {
      tool.commands.forEach((command, index) => {
        if (!isCommand(command)) errors.push(`commands[${index}] is not a valid Command`);
      });
    }
  }

  if (tool.errors !== undefined) {
    if (!Array.isArray(tool.errors)) {
      errors.push("errors must be an array when provided");
    } else {
      tool.errors.forEach((error, index) => {
        if (!isKnownError(error)) errors.push(`errors[${index}] is not a valid KnownError`);
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validatePlaybook(playbook: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(playbook)) {
    return { valid: false, errors: ["playbook must be an object"] };
  }

  pushRequiredStringError(playbook, "slug", errors);
  pushRequiredStringError(playbook, "title", errors);
  pushRequiredStringError(playbook, "summary", errors);
  pushRequiredStringError(playbook, "legalNote", errors);
  pushRequiredStringError(playbook, "detection", errors);
  pushRequiredStringError(playbook, "mitigation", errors);

  if (!isString(playbook.category) || !PLAYBOOK_CATEGORIES.includes(playbook.category as PlaybookCategory)) {
    errors.push(`category must be one of: ${PLAYBOOK_CATEGORIES.join(", ")}`);
  }

  if (
    !isString(playbook.severity) ||
    !PLAYBOOK_SEVERITIES.includes(playbook.severity as (typeof PLAYBOOK_SEVERITIES)[number])
  ) {
    errors.push(`severity must be one of: ${PLAYBOOK_SEVERITIES.join(", ")}`);
  }

  if (!isStringArray(playbook.prerequisites)) {
    errors.push("prerequisites must be an array of strings");
  }

  if (!isStringArray(playbook.toolSlugs)) {
    errors.push("toolSlugs must be an array of strings");
  }

  if (playbook.cve !== undefined && !isStringArray(playbook.cve)) {
    errors.push("cve must be an array of strings when provided");
  }

  if (playbook.mitreAttack !== undefined && !isStringArray(playbook.mitreAttack)) {
    errors.push("mitreAttack must be an array of strings when provided");
  }

  if (!Array.isArray(playbook.steps) || playbook.steps.length === 0) {
    errors.push("steps must be a non-empty array");
  } else {
    playbook.steps.forEach((step, index) => {
      if (!isRecord(step)) {
        errors.push(`steps[${index}] must be an object`);
        return;
      }
      if (!hasText(step.title)) errors.push(`steps[${index}].title must be a non-empty string`);
      if (!hasText(step.detail)) errors.push(`steps[${index}].detail must be a non-empty string`);
      if (!Array.isArray(step.commands) || step.commands.some((command) => !isCommandExample(command))) {
        errors.push(`steps[${index}].commands must be an array of command examples`);
      }
    });
  }

  if (!Array.isArray(playbook.errors)) {
    errors.push("errors must be an array");
  } else {
    playbook.errors.forEach((error, index) => {
      if (!isKnownError(error)) errors.push(`errors[${index}] is not a valid KnownError`);
    });
  }

  return { valid: errors.length === 0, errors };
}
