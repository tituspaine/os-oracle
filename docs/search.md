# Search

The search route (`src/routes/search.tsx`) is a client-side, weighted, multi-index Fuse.js
setup. There is no server.

## Indices

- **Playbooks** — title, summary, category, CVE, MITRE codes, tool slugs.
- **Kali tools** — name, category, summary, invocation, command names, error messages.
- **Distros** — name, family, summary, package manager, command names.
- **Commands** — every `Command` across every parent, with a backlink.
- **Errors** — every `KnownError` across every parent, with a backlink.
- **Walkthroughs** — walkthrough title, scenario, step titles, step narration, expected output.

Each index has its own Fuse config with per-key `weight` — tool name > invocation > summary >
command syntax > error message.

## Intent expansion (`src/data/search-synonyms.ts`)

Before Fuse runs, the query passes through `expandQuery()`:

1. Filler words are stripped (`how do i`, `can you show me`, `please`, etc.).
2. Verb variants are normalised (`crack`/`cracking`, `enumerate`/`enum`).
3. If the query matches a known **intent**, official tool names and technique keywords are
   appended so the fuzzy match has more surface.

Intents map natural-language phrasings to concrete tools + playbooks:

```ts
{
  match: /wi[- ]?fi (crack|handshake|password)/i,
  add:  ["aircrack-ng", "hcxdumptool", "hashcat", "wpa2-handshake"],
}
```

Add new intents whenever you introduce a domain word (a technique name, a tool alias) that
wouldn't otherwise be caught by fuzzy matching.

## Results UI

Results are grouped into collapsible sections (Playbooks, Tools, Commands, Errors, Distros,
Walkthroughs) with counts and matched-token chips. Each hit deep-links to the right route.

## Adding a new corpus

If you introduce a new content file, wire it into `search.tsx` by:

1. Building a flat array of `{kind, parentSlug, ...displayFields}` records.
2. Constructing a Fuse instance with per-key weights.
3. Adding a section to the results UI.
