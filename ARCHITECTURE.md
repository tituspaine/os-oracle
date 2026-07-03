# Architecture

> **Authorised use only:** OS Oracle is a reference platform for legal, ethical security testing, training, and lab work. Use only against systems you own or are explicitly authorised to assess.

## Overview

OS Oracle is an **offline-first ethical hacking knowledge platform** with two delivery surfaces:

- a **Node.js CLI** for fast terminal lookup during assessments, labs, and training
- a **TypeScript web app** for structured browsing, guided reading, and search-driven discovery

The project is designed around a simple idea: ship all reference content **with the application**, keep the stack **static and local**, and avoid runtime dependence on cloud APIs or remote services. The result is a portable knowledge base for penetration testers, defenders, red-teamers, students, and lab operators who need trustworthy reference material even in restricted or disconnected environments.

Core technology choices:

- **TypeScript** for data modeling and web application code
- **TanStack Router / TanStack Start** for route-driven React navigation
- **Vite-based build tooling** via the TanStack/Lovable integration
- **Bun** as the preferred local development runtime and package manager
- **Node.js** for the published CLI entry point and packaging flow

## System goals

OS Oracle is intentionally optimized for the ethical hacking / penetration testing use case:

- **Offline-first:** search, browsing, and reference access must work without internet
- **Static and inspectable:** content lives in source control as plain data and TypeScript objects
- **Fast lookup:** common tools, commands, errors, and playbooks must be reachable in seconds
- **Low operational risk:** no hosted backend, no authentication surface, no cloud storage
- **Educational framing:** content emphasizes authorised testing, lab usage, detection, and mitigation

## High-level architecture

```text
+--------------------+        +--------------------+
|  src/data/*.ts     |        |  src/data/*.json   |
|  canonical content |        |  packaged CLI data |
+---------+----------+        +---------+----------+
          |                             |
          |                             |
          v                             v
+--------------------+        +--------------------+
| Web app            |        | Node CLI           |
| React + TanStack   |        | commander + chalk  |
| src/routes/*       |        | fuse.js            |
+---------+----------+        +---------+----------+
          |                             |
          +-------------+---------------+
                        |
                        v
              Offline reference UX
       tools, commands, errors, playbooks,
         distros, walkthroughs, bookmarks
```

## Directory structure

The repository centers around the following directories:

```text
.
├── .github/                 # CI, release, docs, and security workflows
├── docs/                    # Authoring and project documentation
├── scripts/                 # Build and data-generation utilities
├── src/
│   ├── cli/                 # Published Node.js CLI entry point
│   ├── components/          # Shared React UI components
│   ├── data/                # Canonical knowledge corpus + packaged JSON
│   ├── routes/              # TanStack file-based routes
│   ├── hooks/               # React hooks
│   ├── lib/                 # Error handling and utility helpers
│   ├── router.tsx           # Router creation
│   ├── server.ts            # SSR/runtime wrapper
│   └── start.ts             # TanStack Start bootstrap
├── dist/                    # Build output used for publishing/deploys
├── public/                  # Static assets
└── package.json             # Scripts, package metadata, CLI bin mapping
```

Key directories requested for contributor orientation:

- `src/cli` — terminal interface for offline lookup
- `src/data` — data model, merge logic, search synonyms, and packaged JSON
- `src/routes` — web application route tree
- `src/components` — shared presentation components such as banners, tables, and shells
- `docs` — internal authoring guides like `search.md`, `data-model.md`, and `walkthroughs.md`
- `.github` — automation for CI, releases, docs deploy, and security scanning

## Data layer

The data layer is the heart of OS Oracle. It combines **plain JSON runtime payloads** for the CLI with **strongly typed TypeScript source modules** for authoring and the web app.

### Runtime JSON files

The CLI loads prebuilt JSON assets from `src/data/` (and later from `dist/data/` after packaging):

- `commands.json`
- `playbooks.json`
- `errors.json`
- `distros.json`
- `walkthroughs.json`

These files allow the CLI to run directly under Node.js without requiring a TypeScript runtime.

### Canonical TypeScript modules

The web/data model is authored in TypeScript modules under `src/data/`:

- `kali-deep.ts`
- `kali-shallow.ts`
- `kali-extra.ts`
- `kali-extra2.ts`
- `kali-extra3.ts`
- `hacking.ts`
- `playbooks-extra.ts`
- `distros.ts`
- `walkthroughs.ts`
- `search-synonyms.ts`
- `types.ts`
- `index.ts`

Supporting files such as `common-commands.ts` are used to reuse repeated distro command sets.

### Data model responsibilities

- `types.ts` defines shared domain types such as `Command`, `KnownError`, `Distro`, and `KaliTool`
- `distros.ts` defines Linux distribution reference entries and their command/error sets
- `kali-*.ts` files define the Kali tool corpus at varying depth levels
- `hacking.ts` and `playbooks-extra.ts` define attack playbooks with legal notes, steps, detection, and mitigation
- `walkthroughs.ts` provides narrated lab-only walkthroughs
- `search-synonyms.ts` maps natural-language intent to useful search expansions
- `index.ts` acts as the aggregation boundary exported to the rest of the app

### Data merge pipeline (`src/data/index.ts`)

`src/data/index.ts` is the merge point for the knowledge corpus.

#### Kali tools merge

Kali tool entries are imported from:

1. `kali-shallow.ts`
2. `kali-deep.ts`
3. `kali-extra.ts`
4. `kali-extra2.ts`
5. `kali-extra3.ts`

These arrays are merged into a **`Map<string, KaliTool>` keyed by slug**:

- insertion order follows the source list above
- later entries with the same slug **overwrite earlier entries**
- the final array is produced from `Map.values()` and sorted alphabetically by tool name

This gives the project a clean override model:

- broad stub data can land early in shallow files
- richer or corrected entries can be layered later in extra/deep files
- deduplication stays deterministic and inexpensive

#### Playbooks merge

Playbooks are merged similarly:

- core playbooks come from `hacking.ts`
- extension content comes from `playbooks-extra.ts`
- a `Map<string, Playbook>` deduplicates by slug
- **later sources win**, allowing extra content to replace or refine earlier stubs

This pattern keeps the data pipeline simple, reviewable, and source-control friendly.

## Search architecture

OS Oracle search is designed for real-world use during labs, assessments, and study sessions where the operator may remember only:

- a vague goal (`find open ports`)
- a tool family (`sqlmap`, `nmap`, `metasploit`)
- an error message (`command not found`)
- a technique (`wifi crack`, `privilege escalation`)

### Core search engine

The platform uses **Fuse.js fuzzy search** as its main local search primitive.

#### CLI search

`src/cli/index.js` builds Fuse indexes for:

- commands
- playbooks
- errors

It searches across fields like tool names, syntax, descriptions, playbook titles, summaries, and error causes. Optional filters narrow the result set to:

- `command`
- `playbook`
- `error`

#### Web search

`src/routes/search.tsx` builds multiple client-side Fuse indexes for:

- playbooks
- walkthroughs
- distros
- tools
- distro commands
- tool commands
- distro errors
- tool errors

The route uses weighted keys so important fields such as names and message text rank more strongly than long-form bodies.

### Synonym and intent expansion

The web layer expands natural-language queries through `src/data/search-synonyms.ts` before fuzzy matching runs.

Examples of the expansion strategy:

- filler words are removed
- common phrasing is normalized
- user intent is mapped to related tools and techniques
- adjacent domain terms are appended to increase discoverability

That means a query like `crack wifi` can expand toward terms such as `aircrack-ng`, `hashcat`, or WPA/WPA2-related concepts before Fuse performs ranking.

### Result grouping

Search results are grouped by content type so operators can quickly jump to the right artifact:

- tool pages
- tool commands
- distro commands
- playbooks
- walkthroughs
- errors
- distros

This is especially useful in pen testing workflows where the user may need both:

- the tactical command to run now
- the higher-level playbook or walkthrough to understand sequence, constraints, and remediation

## CLI layer

The CLI entry point lives at **`src/cli/index.js`**.

### Main libraries

- **commander** — argument parsing and command registration
- **chalk** — colored terminal output
- **fuse.js** — offline fuzzy search over bundled JSON content

### CLI responsibilities

The CLI is intentionally lightweight and local:

- loads JSON content from the packaged `data` directory
- creates local search indexes at startup
- exposes commands for search, browsing, bookmarks, and history
- stores user state in `~/.os-oracle/`
- performs no network requests

### Local state

The CLI creates a config directory at:

```text
~/.os-oracle/
```

Expected files include:

- `bookmarks.json`
- `history.json`

This keeps personalized state separate from the bundled corpus.

## Web layer

The web application is built with **React + TanStack Router / TanStack Start**.

### Router architecture

- `src/router.tsx` creates the application router and query client
- `src/routes/__root.tsx` provides the root shell, metadata, error handling, and global layout
- `src/routes/` contains file-based routes for major reference surfaces

Important route files include:

- `index.tsx` — landing page
- `search.tsx` — intent-based search UI
- `kali.index.tsx` and `kali.$slug.tsx` — Kali tool browsing and detail
- `hacking.index.tsx`, `hacking.$slug.tsx`, and `hacking.$slug.walkthrough.tsx` — playbooks and walkthroughs
- `distro.$slug.tsx` — distro-specific reference pages
- `about.tsx` and `ethics.tsx` — project and usage framing

### UI composition

`src/components/` contains shared UI building blocks used across routes, including:

- site chrome and layout components
- the authorised-use banner
- command tables and error lists
- reusable UI primitives under `src/components/ui/`

The web app is also offline-first in practice because it renders entirely from bundled local data.

## Build pipeline

### CLI packaging

`scripts/build.js` is the current packaging script for the published CLI.

Its responsibilities are intentionally narrow:

1. remove the existing `dist/` directory
2. copy `src/cli/index.js` to `dist/cli.js`
3. copy JSON data assets from `src/data/` to `dist/data/`
4. produce a package layout suitable for npm publishing and `npx os-oracle`

This design keeps the published CLI runtime simple:

- no TypeScript compilation step is required for the CLI entry point
- no remote asset fetch is required at install or runtime
- the CLI can execute directly against packaged static JSON files

### Web build/deploy relationship

The repository also contains Vite/TanStack web application code and GitHub Pages automation. In practice, the web surface is expected to be produced from the same static corpus and deployed without a backend.

## Offline-first design

Offline-first is a core architectural constraint, not a marketing add-on.

### What it means here

- **No runtime API calls** are required to search or browse content
- the corpus is **embedded in the repository and build artifacts**
- bookmarks/history are stored **locally on the operator machine**
- the web app reads from bundled TypeScript data, not remote endpoints
- the CLI reads from packaged JSON files, not SaaS backends

### Why it matters for pen testing

This design supports common field conditions:

- isolated lab environments
- restricted client networks
- travel environments with poor connectivity
- security teams that disallow cloud tooling during assessments
- training rooms and classrooms with no outbound access

## Security design

OS Oracle is intentionally conservative from a platform-security perspective.

### Security properties

- **No cloud dependencies at runtime**
- **No backend service** to compromise or harden
- **No user authentication** or token storage
- **No telemetry requirement** for core functionality
- **Static-only deployment model** for the web app
- **Local filesystem state only** for bookmarks/history in the CLI

### Reduced attack surface

Because the project is a static reference platform:

- there is no database server
- there are no session cookies
- there is no server-side business logic for search or content rendering
- there is no remote admin panel or CMS
- there is no runtime ingestion of untrusted third-party content

### Ethical-content boundaries

The repository consistently frames content around:

- authorised security testing only
- lab and classroom environments
- detection and mitigation alongside technique descriptions
- no dependence on cloud-hosted offensive infrastructure

## CI/CD and operational automation

OS Oracle uses GitHub Actions for automation under `.github/workflows/`:

- `ci.yml` — installs dependencies, runs lint, and runs the build on pushes/PRs
- `release.yml` — publishes to npm and creates GitHub Releases when `v*.*.*` tags are pushed
- `docs.yml` — builds and deploys `dist/` to GitHub Pages
- `security.yml` — runs CodeQL, dependency review, and OSV scanning

This workflow layout matches the project's static and supply-chain-conscious approach.

## Design trade-offs

### Advantages

- extremely portable
- easy to review and audit
- predictable offline behavior
- low hosting complexity
- low privacy risk
- contributor-friendly content model

### Trade-offs

- content updates require a new package/release/build rather than live syncing
- JSON/TS duplication exists to support both CLI packaging and typed authoring
- search quality depends on careful synonym curation and corpus structure
- no online enrichment or real-time feeds are available by design

## Summary

OS Oracle uses a deliberately simple architecture:

- **TypeScript-authored content**
- **Map-based merge pipelines**
- **Fuse.js local search** with synonym expansion
- **Node.js CLI packaging**
- **TanStack Router web navigation**
- **static, offline-first delivery**

That simplicity is a feature. For ethical hacking teams working in authorised, high-trust, or disconnected environments, OS Oracle favors local availability, legal clarity, and low operational risk over dynamic cloud features.
