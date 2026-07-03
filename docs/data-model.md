# Data model

All content in this project is authored as plain TypeScript objects under `src/data/`.
No runtime data fetching, no CMS, no backend.

## Core types (`src/data/types.ts`)

### `Command`

```ts
type Command = {
  name: string;             // Short display name, e.g. "apt install"
  syntax: string;           // Canonical usage line
  description: string;      // What it does — one sentence
  examples: {               // 1+ real, copy-pasteable examples
    code: string;
    note: string;           // What the example shows / when to use it
  }[];
  bestScenario: string;     // When this is the right tool for the job
  category: string;         // Grouping label, free-form per parent
};
```

### `KnownError`

```ts
type KnownError = {
  message: string;          // The literal error text a user will see
  cause: string;            // Why it happens
  fix: string;              // How to fix it (one paragraph, no fluff)
};
```

### `Distro` and `KaliTool`

See `src/data/types.ts` — both are containers around `Command[]` and `KnownError[]` with
additional metadata (family, package manager, homepage, invocation, etc.).

## Playbook types (`src/data/hacking.ts`)

A `Playbook` groups an attack technique into ordered `steps`, plus prerequisites, detection,
and mitigation. Every playbook must set `legalNote` to the shared "authorised testing only"
wording used by neighbouring entries. CVE and MITRE ATT&CK identifiers are optional but
strongly encouraged.

## Walkthroughs (`src/data/walkthroughs.ts`)

A `Walkthrough` is a narrated, step-by-step **lab-only** dry run for a playbook (or a
free-standing scenario). Each step ships a title, narration, optional command, realistic
expected output, observations, branches, and cross-linked tool slugs.

## Slugs

Slugs are the primary key everywhere. They must be:

- Lowercase
- Kebab-case (`-` separator)
- Stable — once published, do not rename (add an alias in the search synonyms if needed).
