# Advanced Contributing Guide

> OS Oracle is an **offline-first ethical hacking knowledge platform**. Every contribution must support **authorized security testing, defensive education, or lab use only**. Do not add malware, weaponized payloads, credential harvesting content, or guidance for unauthorized access.

This guide goes deeper than [`CONTRIBUTING.md`](./CONTRIBUTING.md). Use it when you are adding new data entries, changing search behavior, or touching the app structure.

## 1. Repository setup

```bash
git clone https://github.com/tituspaine/os-oracle.git
cd os-oracle
bun install
bun run dev
```

Recommended follow-up checks:

```bash
bun run build
bun run lint
```

Notes:

- CI uses **Bun** and runs on **Node 20.x and 22.x**.
- `bun run dev` should always run the current development entrypoint configured in `package.json`.
- If you use `nvm`, align with `.nvmrc` before installing dependencies.

## 2. Codebase walkthrough

The repository is split into **content**, **presentation**, and **build/publishing** layers.

### Root files

| Path | Purpose |
| --- | --- |
| `README.md` | Project overview and user-facing entrypoint. |
| `CONTRIBUTING.md` | Basic contribution rules and ethics gate. |
| `CONTRIBUTING_ADVANCED.md` | This deep contributor guide. |
| `CODE_OF_CONDUCT.md` | Community behavior expectations. |
| `SECURITY.md` | Private security reporting path. |
| `DISCLAIMER.md` | Authorized-use and legal framing. |
| `PROJECT_ROADMAP.md` | Existing roadmap summary. |
| `ROADMAP_DETAILED.md` | Expanded milestone plan. |
| `package.json` | Scripts, package metadata, runtime dependencies. |
| `bun.lock` | Bun lockfile used by CI. |
| `bunfig.toml` | Bun configuration. |
| `tsconfig.json` | TypeScript compiler rules (`strict: true`). |
| `eslint.config.js` | Lint rules for `src/`. |
| `vite.config.ts` | Vite/TanStack Start build configuration. |
| `components.json` | UI/component generator configuration. |
| `.commitlintrc.json` | Conventional commit enforcement. |
| `scripts/build.js` | Copies CLI and JSON data into `dist/`. |

### GitHub automation

| Path | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | Install, lint, and build in CI. |
| `.github/workflows/docs.yml` | Build and publish docs/pages artifacts. |
| `.github/workflows/codeql.yml` | Security analysis workflow. |
| `.github/workflows/security.yml` | Security-specific automation. |
| `.github/workflows/release.yml` | Release pipeline. |
| `.github/CODEOWNERS` | Review ownership; `@tituspaine` is requested automatically. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Required PR structure and ethics checklist. |

### Application shell (`src/`)

| Path | Purpose |
| --- | --- |
| `src/router.tsx` | Creates the TanStack Router instance. |
| `src/routeTree.gen.ts` | Auto-generated route tree. Do not edit manually. |
| `src/server.ts` | Server entry and catastrophic SSR error normalization. |
| `src/start.ts` | TanStack Start bootstrap and middleware wiring. |
| `src/styles.css` | Global styles. |

### Content model (`src/data/`)

| Path | Purpose |
| --- | --- |
| `src/data/types.ts` | Core shared types: `Command`, `KnownError`, `KaliTool`, `Distro`. |
| `src/data/common-commands.ts` | Reusable Linux command and error sets shared by distros. |
| `src/data/distros.ts` | Distro catalog plus distro factory/helper. |
| `src/data/kali-deep.ts` | Hand-authored, richer Kali tool entries. |
| `src/data/kali-shallow.ts` | Shallow baseline Kali entries. |
| `src/data/kali-extra.ts` | Additional Kali tool catalog expansion. |
| `src/data/kali-extra2.ts` | Additional Kali tool catalog expansion. |
| `src/data/kali-extra3.ts` | Factory-driven shallow tool entries using `tool()`. |
| `src/data/hacking.ts` | Core playbooks and `Playbook` types/categories. |
| `src/data/playbooks-extra.ts` | Additional playbook entries. |
| `src/data/walkthroughs.ts` | Long-form narrated walkthroughs and walkthrough types. |
| `src/data/search-synonyms.ts` | Intent phrases, synonym expansion, and search helper functions. |
| `src/data/index.ts` | Merges/export hub for tools, playbooks, distros, walkthroughs, and search helpers. |
| `src/data/*.json` | Static JSON payloads used by the CLI/runtime bundle. |

### Routes (`src/routes/`)

| Path | Purpose |
| --- | --- |
| `src/routes/__root.tsx` | Global app shell. |
| `src/routes/index.tsx` | Homepage. |
| `src/routes/about.tsx` | About page. |
| `src/routes/ethics.tsx` | Ethics/authorized-use route. |
| `src/routes/search.tsx` | Intent-aware search UI backed by Fuse + synonym expansion. |
| `src/routes/kali.index.tsx` | Kali tools listing page. |
| `src/routes/kali.$slug.tsx` | Individual Kali tool detail page. |
| `src/routes/hacking.index.tsx` | Playbook listing page. |
| `src/routes/hacking.$slug.tsx` | Individual playbook detail page. |
| `src/routes/hacking.$slug.walkthrough.tsx` | Step-by-step walkthrough page tied to a playbook slug. |
| `src/routes/distro.$slug.tsx` | Individual distro detail page. |
| `src/routes/README.md` | TanStack file-routing conventions. |

### Components and utilities

| Path | Purpose |
| --- | --- |
| `src/components/authorized-use-banner.tsx` | Repeats the project's legal framing in UI. |
| `src/components/ack-gate.tsx` | Acknowledgement gate for sensitive content. |
| `src/components/command-table.tsx` | Renders `Command[]`. |
| `src/components/error-list.tsx` | Renders `KnownError[]`. |
| `src/components/code-block.tsx` | Displays formatted code snippets. |
| `src/components/site-chrome.tsx` | Shared site chrome/layout pieces. |
| `src/components/ui/*` | Reusable UI primitives. Treat as presentation-only unless needed. |
| `src/lib/error-capture.ts` | Error buffering/capture helpers. |
| `src/lib/error-page.ts` | Fallback HTML error page renderer. |
| `src/lib/lovable-error-reporting.ts` | Lovable integration/error reporting hooks. |
| `src/lib/utils.ts` | Shared helpers. |
| `src/hooks/use-mobile.tsx` | Device/responsive hook. |
| `src/cli/index.js` | CLI entrypoint reading bundled JSON from `dist/data/`. |

### Generated output

| Path | Purpose |
| --- | --- |
| `dist/cli.js` | Built CLI entrypoint. |
| `dist/data/*.json` | Bundled data copied by the build script. |
| `docs/` | Published docs/site assets. |

## 3. Data architecture deep-dive

The project is a **static knowledge base**. Content is authored as TypeScript objects, merged in `src/data/index.ts`, then surfaced through routes and the CLI.

### `KaliTool`

Defined in `src/data/types.ts`.

Key fields:

- `slug`: stable kebab-case identifier used in URLs and lookup maps.
- `name`: human label.
- `category`: one of the curated Kali categories.
- `package`: installable package name.
- `homepage`: upstream documentation URL.
- `depth`: `"deep"` or `"shallow"`.
- `invocation`: canonical executable or subcommand.
- `summary`: concise description.
- `commands[]`: real commands with syntax and examples.
- `errors[]`: real user-visible errors and fixes.

Use `deep` when the tool deserves hand-authored coverage and multiple commands/errors. Use `shallow` when the factory pattern is enough.

### `Playbook`

Defined in `src/data/hacking.ts`.

A playbook is an **ethical testing reference** that ties together technique metadata, prerequisites, ordered steps, common errors, and the defensive side.

Important fields:

- `slug`, `title`, `category`
- `severity`
- `cve[]`
- `mitreAttack[]`
- `summary`
- `prerequisites[]`
- `toolSlugs[]`
- `legalNote`
- `steps[]`
- `errors[]`
- `detection`
- `mitigation`

Every playbook must explain both **how defenders notice the activity** and **how to stop it**.

### `Distro`

Defined in `src/data/types.ts` and assembled in `src/data/distros.ts`.

A distro entry provides orientation plus shared commands and common failure recovery:

- identity: `slug`, `name`, `family`, `developer`, `firstReleased`
- editorial context: `summary`, `bestUseCases[]`, `whenToUse[]`, `whenNotToUse[]`
- operational context: `packageManager`, `defaultShell`, `init`
- practical reference: `commands[]`, `errors[]`

The helper in `distros.ts` merges distro-specific commands with `CORE_COMMANDS` and `CORE_ERRORS`.

### `Walkthrough`

Defined in `src/data/walkthroughs.ts`.

A walkthrough is a **lab-only narrated dry run**. It is intentionally more verbose than a playbook.

Important fields:

- `slug`, `title`
- `scenario`
- `labSetup`
- `duration`
- `difficulty`
- `legalNote`
- `toolSlugs[]`
- `steps[]`
- `successCriteria`
- `detectionSummary`
- `mitigationSummary`

Walkthrough steps can include:

- `title`
- `narration`
- `command`
- `expectedOutput`
- `observation`
- `branches[]`
- `toolSlugs[]`

## 4. Adding a Kali tool (deep entry)

Add hand-authored deep entries to `src/data/kali-deep.ts`.

```ts
import type { KaliTool } from "./types";

export const EXAMPLE_DEEP_TOOL: KaliTool = {
  slug: "amass",
  name: "OWASP Amass",
  category: "Information Gathering",
  package: "amass",
  homepage: "https://github.com/owasp-amass/amass",
  depth: "deep",
  invocation: "amass",
  summary:
    "In-scope attack-surface mapping for domains, subdomains, ASN data, and related infrastructure.",
  commands: [
    {
      name: "Passive enumeration",
      syntax: "amass enum -passive -d example.com",
      description:
        "Collect subdomains from passive sources without directly touching the target infrastructure.",
      examples: [
        {
          code: "amass enum -passive -d example.com -o subdomains.txt",
          note: "Best first step during an authorized recon phase.",
        },
      ],
      bestScenario: "Early reconnaissance when stealth and source coverage matter.",
      category: "Enumeration",
    },
    {
      name: "Active enumeration",
      syntax: "amass enum -active -brute -d example.com",
      description:
        "Performs active checks and brute forcing after scope approval.",
      examples: [
        {
          code: "amass enum -active -brute -d example.com -src",
          note: "Shows which sources and validations produced each result.",
        },
      ],
      bestScenario: "Later-stage in-scope recon when direct interaction is approved.",
      category: "Enumeration",
    },
    {
      name: "Intel collection",
      syntax: "amass intel -org 'Example Corp'",
      description:
        "Find ASN, netblocks, and domains associated with an organization.",
      examples: [
        {
          code: "amass intel -org 'Example Corp' -whois",
          note: "Useful for pre-engagement scoping and asset discovery.",
        },
      ],
      bestScenario: "Building a broader map of approved assets before deeper testing.",
      category: "Intelligence",
    },
  ],
  errors: [
    {
      message: "failed to acquire system resources",
      cause: "The host hit ulimit, resolver, or concurrency constraints during enumeration.",
      fix: "Reduce concurrency, verify DNS/network access, and rerun from a system with sufficient file descriptor limits.",
    },
    {
      message: "no data sources configured for the requested operation",
      cause: "API-backed sources were requested but no provider configuration exists.",
      fix: "Create the provider config expected by Amass, add only approved API keys, and retry in the lab or authorized environment.",
    },
  ],
};
```

Deep-entry expectations:

- Prefer **3+ commands** and **2+ real errors**.
- Use real tool terminology from upstream docs or `--help`.
- Keep summaries short; put nuance in `description`, `bestScenario`, and `note`.
- Do not include exploit payloads or unsafe defaults outside explicit lab framing.

## 5. Adding a Kali tool (shallow/factory)

Use `src/data/kali-extra3.ts` when the `tool()` helper is sufficient.

```ts
tool(
  "assetfinder",
  "assetfinder",
  "Information Gathering",
  "assetfinder",
  "assetfinder",
  "One-shot passive subdomain lister for approved attack-surface discovery.",
  [
    cmd(
      "List subdomains",
      "assetfinder --subs-only example.com",
      "Print discovered subdomains, one per line.",
      "assetfinder --subs-only example.com | sort -u",
      "Pipe into validation tools such as httpx after confirming scope.",
      "Quick passive recon of an authorized target.",
    ),
  ],
  [
    err(
      "assetfinder: command not found",
      "The package is not installed or not in PATH.",
      "Install the package and reopen the shell before retrying.",
    ),
  ],
  "https://github.com/tomnomnom/assetfinder",
)
```

Factory behavior to remember:

- `tool()` automatically sets `depth: "shallow"`.
- `help(invocation)` appends built-in help/man-page reference commands.
- `notFound(invocation)` appends a standard install/PATH recovery error.
- Add at least one **real command** and one **real error** beyond the generated defaults.

## 6. Adding a playbook

Add new playbooks in `src/data/playbooks-extra.ts` unless they are core primitives better suited to `src/data/hacking.ts`.

```ts
import type { Playbook } from "./hacking";

const LEGAL =
  "Use only against systems you own or have explicit written authorization to test. Unauthorized use is illegal and out of scope for this project.";

export const EXAMPLE_PLAYBOOK: Playbook = {
  slug: "open-redirect-review",
  title: "Open redirect validation",
  category: "Web",
  severity: "low",
  cve: ["CWE-601"],
  mitreAttack: ["T1190"],
  prerequisites: [
    "A documented test target with a redirect parameter in scope",
    "Burp Suite or curl for replaying requests",
  ],
  summary:
    "Validate whether a redirect parameter accepts external destinations and document impact under an authorized testing scope.",
  toolSlugs: ["burpsuite", "ffuf"],
  steps: [
    {
      title: "Probe the redirect parameter",
      detail:
        "Send a harmless external URL to the redirect parameter and observe the Location header.",
      commands: [
        {
          code: "curl -I 'https://target.example/login?next=https://example.org'",
          note: "A 302 to the external host confirms the finding.",
        },
      ],
    },
    {
      title: "Test parser variations",
      detail:
        "Try scheme-relative and encoded variants to see whether validation is superficial.",
      commands: [
        {
          code: "curl -I 'https://target.example/login?next=%2F%2Fevil.example'",
          note: "Useful when the filter only checks for literal http/https prefixes.",
        },
      ],
    },
  ],
  errors: [
    {
      message: "302 always points to /home",
      cause: "The application ignores unknown destinations and falls back safely.",
      fix: "Record the protective behavior and test only other in-scope redirect handlers.",
    },
  ],
  detection:
    "Watch authentication and application logs for redirects to external hosts, especially after login or password-reset flows.",
  mitigation:
    "Allow-list exact redirect destinations or restrict the parameter to relative paths only; never trust a client-supplied absolute URL.",
  legalNote: LEGAL,
};
```

Playbook expectations:

- `cve[]` and `mitreAttack[]` should be present whenever they are defensible.
- `steps` should be actionable but concise.
- `errors[]` should document realistic operator mistakes or safe failure states.
- `detection` and `mitigation` are mandatory.
- `legalNote` is mandatory and should mirror nearby authorized-use wording.

## 7. Adding a walkthrough

Add walkthroughs to `src/data/walkthroughs.ts`.

```ts
import type { Walkthrough } from "./walkthroughs";

export const EXAMPLE_WALKTHROUGH: Walkthrough = {
  slug: "open-redirect-review",
  title: "Open redirect review in a lab app",
  scenario:
    "You are reviewing a lab login flow that accepts a next= parameter and need to determine whether it can redirect users off-site.",
  labSetup: "A deliberately vulnerable training app, local VM, or other authorized lab target.",
  duration: "10-15 minutes",
  difficulty: "beginner",
  legalNote: "Perform only in an authorized lab or engagement.",
  toolSlugs: ["burpsuite"],
  steps: [
    {
      title: "Capture the login redirect",
      narration:
        "Intercept the request that sends the user to the login page and identify the parameter that controls the post-login destination.",
      command: "curl -I 'https://target.example/login?next=/dashboard'",
      expectedOutput: "HTTP/2 302\nlocation: /dashboard",
      observation:
        "A relative path is normal; the goal is to see whether the server also accepts external destinations.",
    },
    {
      title: "Try an external host",
      narration:
        "Replace the relative path with a harmless external URL you control for testing.",
      command: "curl -I 'https://target.example/login?next=https://example.org'",
      expectedOutput: "HTTP/2 302\nlocation: https://example.org",
      observation:
        "If the Location header reflects the off-site URL, the redirect is open.",
    },
  ],
  successCriteria:
    "You can state clearly whether the app restricts redirects to internal paths or permits external destinations.",
  detectionSummary:
    "Application telemetry can flag authentication flows that redirect to unapproved domains.",
  mitigationSummary:
    "Use exact allow-lists or internal path-only redirects.",
};
```

Walkthrough expectations:

- `expectedOutput` should be **realistic, redacted, and lab-only**.
- `observation` should teach the reader what matters in the output.
- `branches` are encouraged when failure handling is educational.

## 8. Adding a distro

Add distro entries to `src/data/distros.ts` using the local helper, or author the fully-expanded shape when documenting a new pattern.

```ts
import type { Distro } from "./types";

export const EXAMPLE_DISTRO: Distro = {
  slug: "parrot",
  name: "Parrot OS",
  family: "debian",
  developer: "Parrot Security",
  firstReleased: "2013-06-10",
  summary:
    "A Debian-based security and privacy distribution aimed at labs, training, and general-purpose secure desktop use.",
  bestUseCases: [
    "Security training labs",
    "Privacy-focused desktop usage",
    "Portable offensive-security learning environments",
  ],
  whenToUse: [
    "You want a Debian-family environment with many security tools preinstalled.",
    "You need a learner-friendly security distro for offline reference and labs.",
  ],
  whenNotToUse: [
    "You need enterprise vendor support and long-term certification targets.",
    "You want the smallest possible minimal container image.",
  ],
  packageManager: "apt",
  defaultShell: "bash",
  init: "systemd",
  commands: [
    {
      name: "apt update",
      syntax: "sudo apt update",
      description: "Refresh package metadata from configured repositories.",
      examples: [{ code: "sudo apt update", note: "Run before new installs." }],
      bestScenario: "Routine package maintenance.",
      category: "Package Manager",
    },
  ],
  errors: [
    {
      message: "E: Could not get lock /var/lib/dpkg/lock-frontend",
      cause: "Another package-management process is already running.",
      fix: "Wait for the active process to finish, then retry; only remove the lock after verifying the owning process safely.",
    },
  ],
};
```

## 9. Adding error messages

Error entries must match the `KnownError` shape:

```ts
{
  message: "literal error text",
  cause: "why the tool or system produced it",
  fix: "specific, safe, actionable recovery guidance",
}
```

Expectations:

- `message` should match what a user actually sees.
- `cause` should describe the most likely root cause, not a guessy essay.
- `fix` should be concrete and safe.
- Prefer troubleshooting steps the reader can execute immediately.
- Avoid empty filler like "reinstall everything" unless that is truly the right remediation.
- Keep the tone neutral and instructional.

## 10. Search synonym system

Search intent logic lives in `src/data/search-synonyms.ts`.

There are two layers:

1. **`INTENTS`** (primary): structured phrase → tool/playbook mappings.
2. **`SYNONYMS`** (derived/legacy): generated from `INTENTS`, plus a few hard-coded shorthand aliases.

When adding a new synonym:

1. Find the nearest existing intent cluster.
2. Add new wording to `phrases` if users are likely to type it.
3. Add related tool slugs to `tools` and related playbook slugs to `playbooks`.
4. Keep `guidance` short and helpful.
5. Only add a direct `SYNONYMS` alias when it is a true legacy shorthand or special-case phrase.

Example:

```ts
{
  id: "tls-review",
  phrases: [
    "check tls config",
    "review ssl ciphers",
    "find weak https setup",
  ],
  domain: "defensive",
  playbooks: [],
  tools: ["sslscan", "sslyze", "testssl"],
  guidance: "Start with TLS scanners that report protocol, cipher, and certificate posture.",
}
```

How search uses it:

- `expandQuery()` broadens the raw query with mapped terms.
- `matchIntents()` scores phrase overlap.
- `nearestIntents()` suggests fallback phrasings when no direct hits appear.

## 11. TypeScript conventions

Project expectations:

- **Strict mode is on** (`tsconfig.json`).
- **No `any`** in new code.
- Prefer explicit unions and shared types over inline loose objects.
- Prefer **one primary export per file/collection** for new authored data modules; helpers are fine when they make the collection readable.
- Keep slugs **stable**, **lowercase**, and **kebab-case**.
- Do not edit generated files such as `src/routeTree.gen.ts` manually.

Practical guidance:

- Reuse `Command`, `KnownError`, `KaliTool`, `Distro`, `Playbook`, and `Walkthrough` types.
- Keep prose concise; the UI already renders a lot of detail.
- If a field is optional in the type but required by quality expectations, still populate it.

## 12. Testing approach

Before opening a PR:

```bash
bun run build
bun run lint
```

Definition of done:

- Build completes successfully.
- Lint completes successfully.
- New slugs resolve correctly in the UI/CLI paths they affect.
- Added content is internally consistent (tool slug references exist, walkthrough slug matches playbook slug where appropriate, examples are realistic).

If you changed search or routing logic, manually smoke-test the affected route as well.

## 13. PR workflow

### Branch naming

Use descriptive, scoped branch names:

- `docs/advanced-contributor-guides`
- `content/add-sslscan-tool`
- `content/add-open-redirect-playbook`
- `fix/search-intent-regression`
- `feat/cli-search-polish`

### Commit message format

The repo uses **Conventional Commits** via `.commitlintrc.json`.

Allowed types include:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `build`
- `ci`
- `chore`
- `content`

Recommended examples:

```text
docs(docs): add advanced contributor guide
content(kali): add sslscan shallow entry
content(playbooks): add open redirect validation playbook
fix(search): tighten intent expansion scoring
```

Keep the header under 100 characters.

### PR contents

Your PR should include:

- a clear summary of the change
- why the change is needed
- source citations for security content
- ethics attestation for content PRs
- confirmation that `bun run build` and `bun run lint` passed

## 14. Review process

Reviews follow a maintainer-first workflow:

1. Open a PR using the repository template.
2. CODEOWNERS requests review automatically.
3. Maintainers check ethics framing, accuracy, schema fit, and source quality.
4. CI should pass before merge.
5. Content that changes security-sensitive framing may be asked to revise wording before approval.

Reviewers usually look for:

- **authorized-use framing** is explicit
- examples are **realistic but non-weaponized**
- schema fields are complete and typed correctly
- slug references and cross-links are valid
- search additions improve discoverability without polluting results
- docs do not contradict the current implementation

## 15. Final checklist

Before you open a PR, verify:

- [ ] The contribution is for authorized, educational, or defensive use only.
- [ ] The file was added in the correct content module.
- [ ] Slugs are stable and kebab-case.
- [ ] Commands and errors are realistic.
- [ ] Detection and mitigation are present where required.
- [ ] `bun run build` passes.
- [ ] `bun run lint` passes.
- [ ] Sources are ready for the PR description.

When in doubt, favor **safety, clarity, and maintainability** over volume.
