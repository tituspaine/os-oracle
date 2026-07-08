# Data Schema Reference

> This repository documents **authorized security testing knowledge only**. Schema examples below are for offline reference content, not for exploit hosting, malware delivery, or unauthorized operations.

## Source of truth

Current compile-time schema definitions live in:

- `src/data/types.ts`
- `src/data/hacking.ts`
- `src/data/walkthroughs.ts`

Planned runtime-validation entrypoint:

- `src/data/schema.ts` — this is the intended canonical location for future **Zod** schemas so runtime validation can mirror the TypeScript shapes documented here.

## 1. `KaliTool` schema

Defined in `src/data/types.ts`.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | Stable kebab-case identifier. |
| `name` | `string` | Human-readable tool name. |
| `category` | `KaliCategory` | Curated Kali category union. |
| `package` | `string` | Installable package name. |
| `homepage` | `string` | Upstream documentation URL. |
| `depth` | `"deep" \| "shallow"` | Coverage depth. |
| `invocation` | `string` | Canonical executable/subcommand. |
| `summary` | `string` | Concise editorial summary. |
| `commands` | `Command[]` | Usually present for published entries. |
| `errors` | `KnownError[]` | Usually present for published entries. |

### JSON example

```json
{
  "slug": "sslscan",
  "name": "sslscan",
  "category": "Information Gathering",
  "package": "sslscan",
  "homepage": "https://github.com/rbsec/sslscan",
  "depth": "shallow",
  "invocation": "sslscan",
  "summary": "Enumerate supported TLS protocols, ciphers, and certificate details for an authorized target.",
  "commands": [
    {
      "name": "Scan host",
      "syntax": "sslscan target.example:443",
      "description": "Enumerate supported protocols and ciphers on the remote endpoint.",
      "examples": [
        {
          "code": "sslscan target.example:443",
          "note": "Baseline TLS review during an approved assessment."
        }
      ],
      "bestScenario": "Quick TLS posture review.",
      "category": "Usage"
    }
  ],
  "errors": [
    {
      "message": "Connection refused",
      "cause": "TLS is not listening on the specified host or port.",
      "fix": "Confirm the port and service reachability before retrying."
    }
  ]
}
```

## 2. `Command` schema

Defined in `src/data/types.ts`.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `string` | Short display name. |
| `syntax` | `string` | Canonical usage line. |
| `description` | `string` | One-sentence explanation. |
| `examples` | `CommandExample[]` | Real examples with context. |
| `bestScenario` | `string` | When this command is the right choice. |
| `category` | `string` | Presentation grouping label. |

### JSON example

```json
{
  "name": "apt update",
  "syntax": "sudo apt update",
  "description": "Refresh package metadata from configured repositories.",
  "examples": [
    {
      "code": "sudo apt update",
      "note": "Run before package installation or upgrade."
    }
  ],
  "bestScenario": "Routine package maintenance on Debian-family systems.",
  "category": "Package Manager"
}
```

## 3. `CommandExample` schema

Defined in `src/data/types.ts`.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `code` | `string` | Copy-pasteable example snippet. |
| `note` | `string` | Why or when to use the example. |

### JSON example

```json
{
  "code": "sqlmap -r request.txt --batch --dbs",
  "note": "Enumerate databases after confirming a lab SQL injection finding."
}
```

## 4. `KnownError` schema

Defined in `src/data/types.ts`.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `message` | `string` | Literal or near-literal error text. |
| `cause` | `string` | Root cause summary. |
| `fix` | `string` | Safe, actionable remediation. |

### JSON example

```json
{
  "message": "E: Could not get lock /var/lib/dpkg/lock-frontend",
  "cause": "Another apt or unattended-upgrades process is already running.",
  "fix": "Wait for the active package-management process to finish, then retry safely."
}
```

## 5. `Playbook` schema

Defined in `src/data/hacking.ts`.

### Fields requested by the content model

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | Stable kebab-case identifier. |
| `title` | `string` | Human-readable playbook title. |
| `category` | `PlaybookCategory` | Curated category union. |
| `cve` | `string[]` | CVE/CWE references when applicable. |
| `mitreAttack` | `string[]` | MITRE ATT&CK mappings when applicable. |
| `prerequisites` | `string[]` | Required setup, scope, or access. |
| `summary` | `string` | Concise description. |
| `steps` | `PlaybookStep[]` | Ordered testing sequence. |
| `errors` | `KnownError[]` | Common operator or environment failures. |
| `detection` | `string` | How defenders spot the activity. |
| `mitigation` | `string` | How defenders stop the issue. |
| `legalNote` | `string` | Authorized-use disclaimer. |

### Current implementation additions

The current runtime shape in `src/data/hacking.ts` also includes:

- `severity`
- `toolSlugs`

### JSON example

```json
{
  "slug": "open-redirect-review",
  "title": "Open redirect validation",
  "category": "Web",
  "severity": "low",
  "cve": ["CWE-601"],
  "mitreAttack": ["T1190"],
  "prerequisites": [
    "A documented in-scope target with a redirect parameter",
    "Burp Suite or curl"
  ],
  "summary": "Validate whether a redirect parameter accepts external destinations under an authorized test scope.",
  "toolSlugs": ["burpsuite", "ffuf"],
  "steps": [
    {
      "title": "Probe the parameter",
      "detail": "Send a harmless external URL in the redirect parameter and inspect the Location header.",
      "commands": [
        {
          "code": "curl -I 'https://target.example/login?next=https://example.org'",
          "note": "A 302 to the external host confirms the redirect."
        }
      ]
    }
  ],
  "errors": [
    {
      "message": "302 always points to /home",
      "cause": "The server safely ignores unapproved redirect targets.",
      "fix": "Record the defensive behavior and continue only with other in-scope handlers."
    }
  ],
  "detection": "Monitor authentication flows that redirect to external domains.",
  "mitigation": "Restrict redirects to internal paths or an exact allow-list.",
  "legalNote": "Use only against systems you own or have explicit written authorization to test."
}
```

## 6. `PlaybookStep` schema

Defined in `src/data/hacking.ts`.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Step label. |
| `detail` | `string` | What to do and why. |
| `commands` | `{ code: string; note: string }[]` | Real commands or replay notes. |

### JSON example

```json
{
  "title": "Probe the redirect parameter",
  "detail": "Send a harmless external URL and inspect the response headers.",
  "commands": [
    {
      "code": "curl -I 'https://target.example/login?next=https://example.org'",
      "note": "Location should remain internal on a secure implementation."
    }
  ]
}
```

## 7. `Distro` schema

Defined in `src/data/types.ts`.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | Stable distro identifier. |
| `name` | `string` | Human-readable distro name. |
| `family` | `DistroFamily` | Family union such as `debian`, `rhel`, `arch`, `kali`. |
| `developer` | `string` | Maintainer or organization. |
| `firstReleased` | `string` | Date string. |
| `summary` | `string` | Editorial overview. |
| `bestUseCases` | `string[]` | Best-fit scenarios. |
| `whenToUse` | `string[]` | Positive selection guidance. |
| `whenNotToUse` | `string[]` | Trade-off guidance. |
| `packageManager` | `string` | Canonical package manager. |
| `defaultShell` | `string` | Default user shell. |
| `init` | `string` | Init/service manager. |
| `commands` | `Command[]` | Shared and distro-specific commands. |
| `errors` | `KnownError[]` | Common distro/operator issues. |

### JSON example

```json
{
  "slug": "ubuntu",
  "name": "Ubuntu",
  "family": "debian",
  "developer": "Canonical",
  "firstReleased": "2004-10-20",
  "summary": "A Debian-based Linux distribution widely used on servers, desktops, and cloud platforms.",
  "bestUseCases": ["Cloud servers", "Developer laptops", "CI runners"],
  "whenToUse": [
    "You want broad software support.",
    "You need long-term support releases."
  ],
  "whenNotToUse": [
    "You require the smallest minimal container image.",
    "You need a vendor-neutral source-based distro."
  ],
  "packageManager": "apt",
  "defaultShell": "bash",
  "init": "systemd",
  "commands": [
    {
      "name": "apt update",
      "syntax": "sudo apt update",
      "description": "Refresh package indexes.",
      "examples": [
        {
          "code": "sudo apt update",
          "note": "Run before installing packages."
        }
      ],
      "bestScenario": "Routine package maintenance.",
      "category": "Package Manager"
    }
  ],
  "errors": [
    {
      "message": "The following packages have unmet dependencies",
      "cause": "A required dependency is unavailable or version-constrained.",
      "fix": "Repair broken packages, refresh repositories, and retry with an available version set."
    }
  ]
}
```

## 8. `Walkthrough` schema

Contributor-facing minimal model:

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | Stable walkthrough identifier. |
| `title` | `string` | Human-readable title. |
| `target` | `string` | The subject/target being explored in the lab scenario. |
| `environment` | `string` | Lab or training environment context. |
| `steps` | `WalkthroughStep[]` | Ordered narrated steps. |
| `expectedOutcome` | `string` | What success looks like at the end. |

### Current implementation mapping

The actual runtime type in `src/data/walkthroughs.ts` expands this model into:

- `scenario` (broader than `target`)
- `labSetup` (maps to `environment`)
- `duration`
- `difficulty`
- `legalNote`
- `toolSlugs`
- `successCriteria` (maps to `expectedOutcome`)
- `detectionSummary`
- `mitigationSummary`

### JSON example

```json
{
  "slug": "open-redirect-review",
  "title": "Open redirect review in a lab app",
  "scenario": "Review a lab login flow that accepts a next= parameter.",
  "labSetup": "A deliberately vulnerable training app or other authorized lab target.",
  "duration": "10-15 minutes",
  "difficulty": "beginner",
  "legalNote": "Perform only in an authorized lab or engagement.",
  "toolSlugs": ["burpsuite"],
  "steps": [
    {
      "title": "Capture the redirect",
      "narration": "Inspect the request and note how the next= value is handled.",
      "command": "curl -I 'https://target.example/login?next=/dashboard'",
      "expectedOutput": "HTTP/2 302\nlocation: /dashboard",
      "observation": "Internal-only redirects are expected on a safe implementation."
    }
  ],
  "successCriteria": "You can state clearly whether external redirects are allowed.",
  "detectionSummary": "Telemetry can flag login flows that redirect to off-site domains.",
  "mitigationSummary": "Restrict redirects to internal paths or allow-listed hosts."
}
```

## 9. `WalkthroughStep` schema

Defined in `src/data/walkthroughs.ts`.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Step title. |
| `narration` | `string` | Longer explanation. |
| `command` | `string` | Exact command or action. |
| `expectedOutput` | `string` | Realistic, lab-only output. |
| `observation` | `string` | What the reader should notice. |
| `branches` | `{ when: string; then: string }[]` | Failure branches and recoveries. |
| `toolSlugs` | `string[]` | Optional related tool references. |

### JSON example

```json
{
  "title": "Try an external destination",
  "narration": "Replace the relative redirect path with a harmless external URL you control for testing.",
  "command": "curl -I 'https://target.example/login?next=https://example.org'",
  "expectedOutput": "HTTP/2 302\nlocation: https://example.org",
  "observation": "If the external URL is reflected into the Location header, the redirect is open.",
  "branches": [
    {
      "when": "The server always redirects to /home",
      "then": "Record the protective behavior and test only other in-scope handlers."
    }
  ],
  "toolSlugs": ["burpsuite"]
}
```

## Validation expectations

Regardless of schema type:

- Slugs should be lowercase kebab-case.
- Commands and errors should be realistic and user-actionable.
- Walkthrough outputs must be safe, redacted, and lab-only.
- Playbooks and walkthroughs must preserve the project's legal and ethical framing.
- Future Zod schemas in `src/data/schema.ts` should reject incomplete or malformed content before publication.
