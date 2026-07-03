
# Linux OS + Kali Tools Reference — Build Plan

Static, client-only reference site. No AI, no cloud, no backend. All data in typed TS files bundled with the app.

## Scope

- All major Linux distributions, each with: purpose, best use cases, when to use / not to use, package manager, core commands, and common errors + fixes.
- Kali Linux gets extended treatment: every tool in the Kali metapackages, each tool's purpose, category, key commands/flags, example usage, best scenario, and common errors.

## Realistic scope note

Kali ships ~600+ tools across its metapackages (`kali-linux-default`, `-large`, `-everything`), and each tool can have dozens of flags. A single build that documents "every command of every tool" exhaustively is not realistic to keep accurate in one pass. This plan delivers:

- **All ~600 Kali tools** listed and categorized (name, category, one-line purpose, package, homepage).
- **Deep entries for the ~150 most-used tools** (nmap, metasploit, burpsuite, sqlmap, hydra, john, hashcat, aircrack-ng suite, wireshark, tcpdump, gobuster, ffuf, wpscan, nikto, responder, impacket suite, bloodhound, mimikatz-via-wine notes, etc.) with full command syntax, flags, examples, best scenario, and common errors.
- **Shallow entries for the rest** — name, category, purpose, invocation, man-page pointer.
- **~15 Linux distros** with core command sets (~80–120 commands each covering coreutils, package mgmt, systemd, networking, users, permissions, processes, disks).

If you want every flag of every tool fully documented, that's a multi-phase effort and I'll flag it — say the word and I'll re-plan.

## Distros covered

Ubuntu, Debian, Fedora, RHEL, Rocky, AlmaLinux, CentOS Stream, Arch, Manjaro, openSUSE (Leap + Tumbleweed), Alpine, Gentoo, Slackware, NixOS, Kali.

## Kali tool categories (Kali's official menu structure)

1. Information Gathering
2. Vulnerability Analysis
3. Web Application Analysis
4. Database Assessment
5. Password Attacks
6. Wireless Attacks
7. Reverse Engineering
8. Exploitation Tools
9. Sniffing & Spoofing
10. Post Exploitation
11. Forensics
12. Reporting Tools
13. Social Engineering Tools

## Data model

`src/data/types.ts`:
```ts
type Distro = {
  slug; name; family: 'debian'|'rhel'|'arch'|'suse'|'alpine'|'gentoo'|'slackware'|'nixos'|'kali';
  summary; bestUseCases[]; whenToUse[]; whenNotToUse[];
  packageManager; defaultShell; init;
  commands: Command[]; errors: KnownError[];
};
type Command = { name; syntax; description; examples: {code; note}[]; bestScenario; category };
type KnownError = { message; cause; fix };
type KaliTool = {
  slug; name; category; package; homepage; summary;
  depth: 'deep'|'shallow';
  invocation; commands?: Command[]; errors?: KnownError[];
};
```

Files:
- `src/data/distros/*.ts` — one per distro
- `src/data/kali/tools/*.ts` — deep tools (one per tool)
- `src/data/kali/tools-index.ts` — the full ~600 shallow catalog (bulk array)
- `src/data/index.ts` — re-exports

## Routes

```
src/routes/
  __root.tsx           header + global search
  index.tsx            distro directory grid
  distro.$slug.tsx     distro detail (tabs: Overview, Commands, Errors)
  kali.index.tsx       Kali tools browser (category filter + search + pagination)
  kali.$slug.tsx       tool detail (purpose, commands, examples, errors)
  search.tsx           global search across distros + tools + commands
  about.tsx            what this is, sources, disclaimer
```

Each route defines its own `head()` metadata.

## Components

- `distro-card`, `tool-card`
- `command-table` — sortable, filterable, copy-to-clipboard on syntax
- `error-accordion`
- `category-filter` (Kali categories)
- `search-bar` (Fuse.js, local)
- Reuses existing shadcn: tabs, accordion, table, input, badge, card, scroll-area.

## Design

Technical-reference aesthetic. Neutral slate palette with a single accent (Kali-inspired teal/blue for interactive elements — not a purple/indigo cliché). Monospace for commands (JetBrains Mono via `<link>` in root head). Dense but scannable. All colors via semantic tokens in `src/styles.css`.

## Dependencies

- `fuse.js` — client-side fuzzy search.

Nothing else. No Lovable Cloud, no external APIs.

## Legal / accuracy note surfaced in the About page

Offensive security tools are for authorized testing only. Content is educational, sourced from public docs/man pages; each tool card links to its upstream homepage / man page for the authoritative reference.

## Deliverables in this single phase

1. Data for 15 distros (core commands + errors).
2. Kali full catalog (~600 tools shallow) + ~150 deep tool entries with commands, examples, errors.
3. Routes and components above, fully wired.
4. Global Fuse-based search.
5. Design tokens, monospace command rendering, copy buttons.
6. Real per-route head metadata.

## Out of scope

- Any backend, database, auth, telemetry.
- Live man-page ingestion.
- Exhaustive documentation of every flag of every tool.
- Non-Linux OSes.

Confirm and I'll build it in one pass.
