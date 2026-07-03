# OS Oracle scaling roadmap

This document turns the broad “build everything” vision into a realistic, open-source-first roadmap
for this repository.

## Current baseline

Today the project is strongest as:

- a static TanStack Start site
- TypeScript-authored content in `src/data/*`
- a client-side Fuse.js search experience
- an ethics-first reference for authorised security testing

That architecture is a feature, not a bug. It keeps contributions easy to review, cheap to host,
and safe to mirror. The best path to global scale is to preserve that static core and add new
systems in layers.

## Guiding principles

1. **Static-first by default** — keep the knowledge base browsable offline and hostable anywhere.
2. **Ethics-first content** — authorised testing, lab framing, mitigation, and sources are mandatory.
3. **Schema-driven contributions** — make it easy for contributors to add content without learning the
   whole app.
4. **Reviewable growth** — prefer generated indexes, validators, and templates over manual curation
   bottlenecks.
5. **Separation of concerns** — keep the public reference site independent from any future API,
   moderation, or sync service.

## Phase 0 — completed in this PR

- Remove remaining proprietary bootstrap config, files, and runtime hooks.
- Restore a standard TanStack Start Vite configuration.
- Document the scaling plan in-repo.
- Add contributor intake scaffolding for content proposals.

## Phase 1 — make open-source contribution scale easy

### Content structure

- Split large data files further by domain so contributors edit smaller files:
  - `src/data/kali/recon/*.ts`
  - `src/data/kali/web/*.ts`
  - `src/data/distros/debian.ts`, `fedora.ts`, etc.
  - `src/data/playbooks/web/*.ts`, `cloud/*.ts`, `wireless/*.ts`
- Add machine-readable source metadata per entry:
  - `sources`
  - `lastVerified`
  - `reviewStatus`
  - `contributor`
- Add stable slugs and aliases for renamed tools/commands.

### Validation tooling

- Add schema validation for every content file during CI.
- Add duplicate/near-duplicate detection for tool names, commands, and playbooks.
- Add link validation for official documentation, CVEs, and references.
- Add a content coverage report that shows:
  - tools with too few commands
  - tools missing errors
  - playbooks missing mitigation/detection
  - walkthroughs missing expected output

### Contributor experience

- Add GitHub issue templates for:
  - command/tool submissions
  - playbook submissions
  - walkthrough proposals
  - error-database additions
- Add a `docs/content-style-guide.md` with copy-pasteable examples.
- Add generator scripts for new content files so authors can scaffold correct shapes quickly.
- Add labels such as `content:kali`, `content:distro`, `content:playbook`, `good first issue`,
  `needs source`, and `needs expert review`.

## Phase 2 — data completeness without losing quality

### Commands database

- Expand command coverage by priority, not by raw volume:
  1. most-used Kali tools
  2. mainstream distro package/system/network commands
  3. top playbook-linked tools
- Define minimum quality gates per tool:
  - summary
  - install package
  - invocation
  - 10+ real commands for “deep” entries
  - 3+ common errors
  - official docs link
  - cross-links to relevant playbooks/walkthroughs
- Track completeness in a generated matrix so contributors can claim missing areas without overlap.

### Error database

- Normalize error entries to include:
  - exact message
  - cause
  - fix
  - prevention
  - related commands/tools
- Store reusable cross-tool errors separately where appropriate.
- Generate “top missing errors” reports from GitHub issues and community submissions.

### Search quality

- Expand `src/data/search-synonyms.ts` with:
  - aliases
  - OS/package-manager phrasing
  - ATT&CK/CVE/OWASP vocabulary
  - “how do I…” user-intent phrasing
- Add generated search fixtures to catch regressions for common queries.

## Phase 3 — safer automation for content intake

Keep the public site static. Build automation around it.

### Repository-native approach first

Before adding a backend, implement:

- JSON/TS content validators in CI
- source-link checks
- prohibited-content regex checks
- secret scanning for submitted examples
- generated previews in pull requests

### Optional future service

If a submission backend becomes necessary, build it as a separate service with:

- PostgreSQL for submissions/reviews
- object storage only for attachments
- queue-based scanning pipeline
- strict allowlist validation
- human approval before publication to this repo

Do **not** couple the main site to that service for read-path availability.

## Phase 4 — CLI and offline terminal experience

The CLI should be a separate package, not bolted into the web app.

### Recommended architecture

- Create `packages/cli` or a sibling repository later.
- Use a generated JSON export from `src/data/*` as the CLI data source.
- Keep the canonical content authored in this repo.
- Use a TUI library with strong Linux terminal support and keyboard navigation.

### First CLI milestone

- `os-oracle search <query>`
- `os-oracle tool <slug>`
- `os-oracle distro <slug>`
- `os-oracle playbook <slug>`
- `os-oracle walkthrough <slug>`
- local bookmarks/history in `~/.os-oracle/`
- offline bundled dataset

### Second CLI milestone

- interactive TUI navigation
- filter chips
- export to markdown/json
- update command for refreshed datasets
- optional local-only HTTP preview for terminal-hosted browsing

## Phase 5 — web UX improvements

- Add content-status badges: reviewed, sourced, updated recently, needs expansion.
- Add “related tools / related playbooks / related walkthroughs” panels.
- Add contributor attribution and last-reviewed timestamps.
- Add advanced filters on search pages.
- Add printable/export-friendly views for commands and playbooks.
- Add route-level code splitting for the heaviest data surfaces.

## Phase 6 — performance and maintainability

- Precompute search indexes at build time instead of constructing everything at runtime.
- Split very large content bundles by section to reduce the main search chunk.
- Measure bundle size in CI and fail on large regressions.
- Add route-level performance budgets.
- Consider shipping compressed prebuilt indexes for offline use.

## Phase 7 — trust, review, and governance

- Create reviewer guides by domain:
  - Kali tooling
  - Linux distros
  - web security
  - AD/internal
  - cloud/container
- Require source citations for every new entry.
- Require mitigation/detection for all offensive technique content.
- Add a documented appeals/revision flow for rejected contributions.
- Publish an editorial policy covering:
  - allowed content
  - disallowed content
  - source standards
  - legal/ethical framing

## Phase 8 — testing roadmap

### Near-term

- schema tests for `src/data/*`
- search fixture tests
- route smoke tests for major pages
- build verification in CI

### Mid-term

- snapshot tests for generated content views
- broken-link checks
- data completeness assertions
- accessibility checks on major routes

### Long-term

- CLI integration tests
- generated content diff review tooling
- benchmark tests for search on large datasets

## Phase 9 — release and community operations

- Publish a release cadence for content updates.
- Generate changelogs grouped by:
  - tools added
  - commands expanded
  - playbooks updated
  - walkthroughs added
- Add a maintainer dashboard or generated report for:
  - stale entries
  - orphaned slugs
  - missing sources
  - search gaps
- Use Discussions for content requests and expert review calls.

## Suggested next implementation order

1. Add content schemas + validation scripts.
2. Break large data files into smaller domain files.
3. Add issue templates and contributor scaffolds for each content type.
4. Add generated completeness/coverage reports.
5. Precompute search indexes and improve bundle splitting.
6. Export canonical JSON for a future CLI.
7. Build the CLI as a separate package against that export.
8. Only then evaluate whether a separate submission/review backend is still necessary.

## What not to do

- Do not replace the static site with a mandatory backend.
- Do not accept unsourced bulk-generated command dumps.
- Do not ship offensive automation, malware, credential theft kits, or production-target guidance.
- Do not tie core browsing/search to third-party SaaS availability.
- Do not optimize for raw command count at the expense of correctness and ethics.
