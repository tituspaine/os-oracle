
# Phase: Complete Kali coverage + Hacking playbooks + Intent search

## 1. Kali tools — fill out every tool with its own commands

Goal: every tool in the catalog has its own boxed command list, examples, best scenario, and common errors — no more "shallow, see man page" stubs.

- Expand `src/data/kali-shallow.ts` into per-category data files under `src/data/kali/` (one file per Kali menu category: info-gathering, vuln-analysis, web, database, password, wireless, reversing, exploitation, sniffing-spoofing, post-exploitation, forensics, reporting, social-engineering). Each file exports an array of fully populated `KaliTool` objects — `depth: "deep"` for all — with `commands[]` (name, syntax, description, 1–3 examples, bestScenario, category) and `errors[]`.
- Coverage target: the full `kali-linux-default` metapackage set (~150 tools) plus the most-requested tools from `-large` (bringing total to ~300). Every tool gets ≥ 4 commands and ≥ 2 known errors. This is the realistic ceiling for accurate, hand-authored content in one pass — documenting all ~600 `-everything` tools at this depth is not honest to promise; the remaining long-tail tools stay listed with an upstream link and are clearly marked.
- Drop the "shallow catalog" fallback UI in `src/routes/kali.$slug.tsx` for anything we've populated; keep it only for the long-tail remainder.
- Update `src/data/index.ts` to merge all category files.

## 2. Linux distro commands — round out to full working sets

- Grow each distro in `src/data/distros.ts` to ~120 commands covering: coreutils, filesystem, permissions, users/groups, processes, systemd (or the distro's init), networking (ip/ss/nmcli/iptables/nftables), package management (family-specific), disks/LVM, archives, text processing, SSH, cron/timers, logs (journalctl/syslog), kernel modules, firewall.
- Expand each distro's `errors[]` to ≥ 10 common real-world errors with cause + fix.
- Split `src/data/distros.ts` into `src/data/distros/<slug>.ts` files re-exported from an index — the single file is getting unwieldy.

## 3. New "Hacking" tab — playbooks, vulns, exploits

New route `src/routes/hacking.index.tsx` (index of playbooks) and `src/routes/hacking.$slug.tsx` (detail). Add nav link in `site-chrome`.

Data model in `src/data/hacking.ts`:

```ts
type Playbook = {
  slug; title; category: 'Web'|'Network'|'AD'|'Wireless'|'Password'|'Privilege Escalation'|'Post-Exploitation'|'Social';
  severity: 'low'|'medium'|'high'|'critical';
  cve?: string[]; mitreAttack?: string[];
  summary; prerequisites[]; legalNote;
  toolSlugs: string[];             // link into /kali/$slug
  steps: { title; detail; commands: { code; note }[] }[];
  errors: KnownError[];
  detection; mitigation;
};
```

Initial content (~40 playbooks) covering the classics people actually search for:

- Web: SQLi (sqlmap), XSS reflected/stored/DOM, SSRF, LFI/RFI, XXE, SSTI, IDOR, JWT none/alg confusion, deserialization, file-upload bypass, path traversal, CORS misconfig, subdomain takeover, open redirect, prototype pollution.
- Network / infra: Nmap recon workflow, SMB null-session enum, EternalBlue (MS17-010), Log4Shell (CVE-2021-44228), Shellshock, Heartbleed, PrintNightmare, BlueKeep, ProxyShell, Spring4Shell.
- AD: Kerberoasting, AS-REP roasting, DCSync, Pass-the-Hash, Pass-the-Ticket, Golden/Silver ticket, NTLM relay (Responder + ntlmrelayx), BloodHound path finding, ADCS ESC1/ESC8.
- Wireless: WPA2 handshake capture + hashcat, PMKID attack, Evil twin / rogue AP, WPS Pixie Dust.
- Password: hydra brute (SSH/HTTP/RDP/FTP), hashcat modes for common hashes, John workflow.
- Privesc: LinPEAS/WinPEAS, sudo misconfigs, SUID abuse, cron abuse, capabilities, kernel exploits (DirtyPipe, PwnKit).
- Post: Mimikatz, LSASS dump + pypykatz, persistence (systemd/scheduled task/registry run keys), lateral movement (PsExec, WMI, WinRM).
- Social: Gophish phishing campaign, evilginx2 MFA relay, SET.

Each step has a copy-boxed command; each command's `toolSlug` links to that Kali tool's page. Every playbook has a prominent legal/authorized-testing banner.

## 4. Intent-based search overhaul

Replace `src/routes/search.tsx`'s current single-Fuse call with a small intent layer:

- **Synonym / alias map** (`src/data/search-synonyms.ts`): maps user intent phrases to canonical terms.
  - "crack wifi" → wpa2, handshake, hashcat, aircrack, pmkid
  - "hack website login" → hydra, wfuzz, ffuf, sqlmap, jwt
  - "find open ports" → nmap, masscan, rustscan
  - "escalate privileges linux" → linpeas, sudo, suid, pwnkit, dirtypipe
  - "dump password hashes windows" → mimikatz, secretsdump, lsass
  - ~150 mappings total.
- **Query expansion**: tokenise the query, expand tokens via the synonym map, and search each expanded term with Fuse; merge with score boosting when a token hits a synonym.
- **Multi-index Fuse**: build separate weighted indexes for distros, tools (name/summary/category/commands), commands (name/syntax/description), errors (message/cause), and playbooks (title/summary/steps/CVE). Aggregate results and rank by:
  1. exact name / CVE / command match
  2. synonym-expanded hit
  3. fuzzy body hit
- **Result grouping**: results grouped by kind (Playbooks, Tools, Commands, Distros, Errors) with counts; each result shows why it matched (the matched field + snippet with highlight).
- **Suggested intents**: when the query matches nothing directly, show 3–5 nearest synonym keys as clickable suggestions ("Did you mean: crack WPA2 handshake?").
- Add a global search input to `site-chrome` header (currently only on `/search`) that navigates to `/search?q=...`; support `?q=` on the search route.

## 5. Housekeeping

- Update home (`src/routes/index.tsx`) with a section linking to Hacking playbooks.
- Update About page to describe the new Hacking section with a stronger legal disclaimer (authorized testing only, no CFAA / Computer Misuse Act violations).
- Update per-route `head()` for `/hacking`, `/hacking/$slug`, and refresh `/search`.

## Technical notes

- No new runtime deps beyond `fuse.js` (already installed). Highlighting uses Fuse's `includeMatches`.
- Everything remains fully static; no cloud, no AI, no network calls.
- Playbook step commands reference existing tool slugs via a typed helper so a broken link fails typecheck.
- Files split per-category to keep any single file under ~1500 lines for editor sanity.

## Honest scope caveat

Documenting literally every tool in `kali-linux-everything` (~600) at command-box depth, plus every CVE ever, is not realistic in a single build without hand-waved filler. This plan delivers ~300 fully-detailed tools + ~40 hand-written playbooks + intent search, and marks the long-tail remainder as "listed, see upstream" rather than pretending to document it. Say the word if you want me to keep going after this pass to grind through the remaining ~300 long-tail tools in follow-up phases.
