# Adding content

## A new Kali tool

1. Open `src/data/kali-extra3.ts`.
2. Call `tool(slug, name, category, package, invocation, summary, [extraCommands], [extraErrors], homepage)`.
3. Provide **real** commands and **real** error messages — copy from the tool's own `--help`
   or man page.
4. Cite the source in the PR description.

For a deep, hand-authored entry (10+ commands, 3+ errors), add directly to
`src/data/kali-deep.ts`.

## A new distro

Add an entry to the `DISTROS` array in `src/data/distros.ts` using the `distro()` helper.
Reuse one of the shared command sets (`APT`, `DNF`, `PACMAN`, `ZYPPER`, `APK`, `EMERGE`,
`SLACKPKG`, `NIX`) plus `CORE_COMMANDS` and `CORE_ERRORS`.

## A new playbook

Append to `EXTRA_PLAYBOOKS` in `src/data/playbooks-extra.ts`. Required fields:

- `slug`, `title`, `summary`
- `category` — one of the `PLAYBOOK_CATEGORIES` in `src/data/hacking.ts`
- `severity` — `"low" | "medium" | "high" | "critical"`
- `prerequisites` — bullet list
- `steps` — ordered
- `errors` — `KnownError[]`
- `detection`, `mitigation` — one paragraph each
- `legalNote` — copy the wording from a neighbouring entry
- `toolSlugs` — the Kali tools that appear as chips

Optional but encouraged: `cve[]`, `mitreAttack[]`.

## A new walkthrough

Append to `WALKTHROUGHS` in `src/data/walkthroughs.ts`. See `docs/walkthroughs.md` for the
frame-by-frame authoring guide.

## Search

Anything you add is automatically indexed by `src/routes/search.tsx` — no manual registration.
If your content introduces a new domain word (a technique name, a tool alias), add it to
`INTENTS` in `src/data/search-synonyms.ts` so intent search catches it.

## Structured community submissions

If you are not ready to edit TypeScript directly, start with the GitHub issue forms instead:

- `new_kali_command.yml`
- `new_playbook_or_walkthrough.yml`
- `new_error_or_fix.yml`
- `new_resource_link.yml`

Those forms capture the citation, ethical framing, and troubleshooting details maintainers need
to turn a submission into merged static content without introducing a backend or auto-publish
surface.
