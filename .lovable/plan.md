
## Goal

Three focused additions in one pass:

1. **Round out the Kali + Linux catalogs** so nothing common is missing.
2. **Harden search** so tool commands, distro commands, playbooks, and errors are all indexed and rank sensibly for typos, synonyms, and natural-language intent.
3. **Add a "Play-by-Play" walkthrough** on every playbook — a step-by-step, copy-pasteable, narrated dry-run with expected output at each stage.

No scope beyond the above. No backend, no AI, no cloud — everything stays as static TS data + client-side Fuse.js.

---

## 1. Catalog completion

### Kali tools (extend `src/data/kali-extra.ts`, plus new files where useful)

Add the still-missing entries so every menu in Kali's `kali-linux-large` metapackage has representation. Each entry keeps the existing `KaliTool` shape (commands + errors boxes generated per category pattern):

- **Info Gathering**: `fierce`, `dnsrecon`, `dnsenum`, `sublist3r`, `subfinder`, `assetfinder`, `httprobe`, `httpx`, `waybackurls`, `gau`, `hakrawler`, `whatweb`, `wafw00f`, `p0f`, `maltego` (ref), `spiderfoot`, `metagoofil`, `snmpwalk`, `snmp-check`, `onesixtyone`, `ike-scan` (already partial → enrich).
- **Vuln analysis**: `unix-privesc-check`, `linux-exploit-suggester`, `windows-exploit-suggester`, `pompem`, `searchsploit` (deep), `vulscan` NSE, `joomscan`, `droopescan`, `magescan`.
- **Web app**: `wfuzz`, `commix`, `arjun`, `paramspider`, `jaeles`, `dontgo403`, `hakrawler`, `photon`, `crlfuzz`, `sublert`, `getjs`, `linkfinder`, `secretfinder`, `retire.js`, `nuclei` (deep), `postman-cli` (newman).
- **DB assessment**: `sqlninja`, `sqlsus`, `bbqsql`, `hexorbase`, `oscanner`, `tnscmd10g`.
- **Passwords**: `medusa`, `patator`, `ncrack`, `crowbar`, `chntpw`, `mimikatz` (ref), `keimpx`, `crunch`, `cewl`, `cupp`, `mentalist`, `wordlistctl`.
- **Wireless**: `wifite2` (deep), `airodump-ng`, `aireplay-ng`, `airbase-ng`, `wash`, `pyrit` (ref), `mdk4`, `hcxdumptool` (deep), `hcxtools` (deep), `airgeddon` (deep), `linssid`, `horst`.
- **Reverse eng**: `apktool`, `dex2jar`, `jadx` (deep), `checksec`, `xxd`, `strings`, `nm`, `objdump`, `readelf`, `ltrace`, `strace`, `bytecode-viewer`, `edb-debugger`, `retdec`, `x64dbg` (ref).
- **Exploitation**: `searchsploit`, `exploitdb-papers`, `commix`, `getsploit`, `routersploit`, `zaproxy` (deep), `zap-cli`, `koadic`, `starkiller`, `havoc` (ref), `mythic` (ref), `merlin` (ref), `nishang`, `powersploit` (deep).
- **Sniff/spoof**: `mitmproxy` (deep), `mitmweb`, `mitmdump`, `bettercap` (deep), `ettercap-graphical`, `driftnet`, `urlsnarf`, `dsniff` (deep), `macchanger`, `netsniff-ng`, `hping3`, `scapy`, `yersinia`, `arp-scan`.
- **Post-exploit**: `linpeas` (deep), `winpeas` (deep), `linenum`, `pspy`, `chisel`, `sshuttle`, `ligolo-ng`, `proxychains-ng` (deep), `weevely` (deep), `webshells` pkg, `mimipenguin`, `laZagne`.
- **Forensics**: `sleuthkit`, `foremost`, `scalpel`, `ext4magic`, `extundelete`, `hashdeep`, `md5deep`, `dumpzilla`, `regripper`, `pdfid`, `pdf-parser`, `xplico`, `chkrootkit` (deep), `rkhunter` (deep).
- **Reporting**: `pipal`, `magictree`, `cutycapt`, `cherrytree`, `dradis` (ref), `faraday` (ref).
- **Social eng**: `set` (deep), `king-phisher` (ref), `evilginx2`, `gophish` (deep), `maskphish`, `zphisher`.

Where a tool has been called out as `deep`, replace the generated stub with hand-authored `commands` (5–15 real flags per tool) and 3–6 real `errors`. This is where the "add every command" ask lands.

### Linux distro commands (extend `src/data/distros.ts`)

For each distro already listed, top up `commands[]` so the coverage matches what real users actually type:

- **Package mgmt** (per-family variants): install / remove / search / show / update / upgrade / clean / reinstall / hold / list-installed / downgrade / autoremove / list-files / which-package-owns.
- **Systemd**: `systemctl {start,stop,restart,reload,enable,disable,mask,unmask,status,is-active,is-enabled,list-units,list-unit-files,daemon-reload}`, `journalctl -u/-f/-p/--since`, `loginctl`, `systemd-analyze blame|critical-chain`.
- **User/perm**: `useradd`, `usermod`, `passwd`, `groupadd`, `chage`, `sudo -l`, `visudo`, `getent`, `id`, `su`, `chmod`, `chown`, `chgrp`, `umask`, `getfacl`, `setfacl`, `chattr`, `lsattr`.
- **Network**: `ip {a,r,link,neigh}`, `nmcli`, `ss`, `resolvectl`, `firewall-cmd` / `ufw` / `iptables` / `nft`, `ping`, `traceroute`, `mtr`, `dig`, `nslookup`, `curl`, `wget`, `scp`, `rsync`, `ssh`, `ssh-keygen`, `ssh-copy-id`.
- **Disk/FS**: `lsblk`, `blkid`, `mount`, `umount`, `fdisk`, `parted`, `mkfs.*`, `fsck`, `tune2fs`, `e2label`, `df`, `du`, `dd`, `losetup`, LVM (`pv/vg/lvcreate|display|remove`), LUKS (`cryptsetup`).
- **Process/perf**: `ps`, `top`, `htop`, `free`, `uptime`, `vmstat`, `iostat`, `pidstat`, `strace`, `ltrace`, `lsof`, `nice`, `renice`, `kill`, `pkill`, `pgrep`.
- **Kernel/modules**: `uname`, `lsmod`, `modprobe`, `insmod`, `rmmod`, `sysctl`, `dmesg`.
- Distro-unique: NixOS (`nix-env`, `nixos-rebuild`, `nix flake`), Arch (`pacman`, `makepkg`, `paru`), Gentoo (`emerge`, `equery`, `eselect`), Alpine (`apk`, `rc-service`, `setup-alpine`), openSUSE (`zypper`, `snapper`, `transactional-update`), Fedora (`dnf`, `rpm-ostree`, `toolbox`).

Same schema as today — no route or component changes needed to render them.

---

## 2. Search hardening

Rework `src/routes/search.tsx` + `src/data/search-synonyms.ts` so one query hits every corpus and ranks meaningfully.

- **Expanded corpora**. Today Fuse indexes distros, tools, and playbooks at the "object" level. Add three more indices:
  - **Commands index**: every `Command` from every distro and Kali tool, with backlink `{kind, parentSlug, name, syntax, description, category}`.
  - **Errors index**: every `KnownError` with backlink `{kind, parentSlug, message, cause, fix}`.
  - **Playbook steps index**: each step title + narration + command lines, with `{playbookSlug, stepIndex}` for deep-linking.
- **Weights & thresholds**. Configure Fuse per-index with `threshold: 0.35`, `ignoreLocation: true`, `useExtendedSearch: true`, `minMatchCharLength: 2`, and explicit `weight` per key (name > syntax > description > examples). Cap results per bucket, then merge and re-sort by normalized score so no single bucket drowns the others.
- **Intent expansion 2.0** (`search-synonyms.ts`):
  - Grow `INTENTS` from ~30 to ~150 entries covering the most-asked phrasings across web, wifi, AD, cloud, mobile, IoT, forensics, and defensive testing.
  - Add `expandQuery()` post-processing: strip filler ("how do i", "can you show me"), lemmatize a small verb table (crack→cracking, enumerate→enum, bypass→bypassing), and inject official tool names when a well-known synonym is used (e.g. "wifi handshake" → adds `aircrack-ng hcxdumptool hashcat`).
  - Add `explainMatch(query, hit)` returning the token(s) that fired, so the results UI can show a "matched on: xss, dalfox" chip.
- **Results UI**: five collapsible sections — Playbooks, Tools, Commands, Errors, Distros — with counts. Each hit shows the matched tokens, a one-liner, and a `<Link>` to the right route (commands deep-link `/kali/$slug#cmd-<name>` and `/distro/$slug#cmd-<name>` via a small anchor added to the render).
- **No new deps** required — Fuse.js is already installed.

Every page keeps the existing `AuthorizedUseBanner`; no ethics/UX regression.

---

## 3. Play-by-Play walkthrough feature

Add a narrated, step-by-step "dry run" view on top of each playbook. Users pick a scenario, then walk through prompts with the exact command, expected output, what the tester should look for, and next-decision branches.

### Data model (new file `src/data/walkthroughs.ts`)

```ts
export type Walkthrough = {
  playbookSlug: string;         // links back to a Playbook
  scenario: string;             // e.g. "DVWA on localhost, medium security"
  environment: string[];        // preconditions + lab setup notes
  legalNote: string;            // required, mirrors playbook
  frames: WalkthroughFrame[];   // ordered
};

export type WalkthroughFrame = {
  title: string;
  narration: string;            // 2–4 sentences of "what & why"
  command: { code: string; note: string };
  expectedOutput: string;       // fenced block of realistic-looking output
  interpret: string;            // what to notice in the output
  branches?: { on: string; goto: string }[]; // "if you see X, jump to frame Y"
  troubleshoot?: KnownError[];  // per-frame errors
};
```

Ship an initial set of 12 walkthroughs mapped to the most-visited playbooks:
`sqli-sqlmap`, `xss-reflected`, `log4shell`, `business-logic-pricing`, `idor`, `wpa2-handshake`, `pmkid-attack`, `bloodhound-mapping`, `asrep-roast`, `smb-enum`, `linux-privesc`, `windows-privesc`. Each 8–15 frames.

### UI

New route: `src/routes/hacking.$slug.walkthrough.tsx` (child of the existing playbook detail).

- Renders one frame at a time with Prev / Next controls and a step counter.
- Left column: narration + "what to look for". Right column: `code-block` with the command, then a second `code-block` styled as terminal output with the expected result. Bottom: per-frame troubleshoot list.
- "Copy all commands" button dumps every frame's command as a shell script.
- Deep-link via `?frame=3` so users can share a specific step.
- Wrapped in the existing `AckGate`; footer keeps the authorised-use banner.

Add a "▶ Play-by-play walkthrough" button on `hacking.$slug.tsx` that appears only when a walkthrough exists for that playbook; falls back to a tasteful "walkthrough coming — use the steps above" note otherwise.

### Search integration

Walkthrough frames also feed the new commands + steps indices so a query like `"sqlmap dbs"` lands directly on the specific frame.

---

## Deliverables & files touched

- `src/data/kali-extra.ts` — expanded.
- `src/data/kali-deep.ts` — added deep entries for the tools flagged above.
- `src/data/distros.ts` — added ~40 commands per distro.
- `src/data/search-synonyms.ts` — expanded intents, `expandQuery`, `explainMatch`.
- `src/routes/search.tsx` — multi-index, weighted, sectioned results.
- `src/components/command-table.tsx` — add stable `id="cmd-<slug>"` anchors on rows.
- `src/data/walkthroughs.ts` — new.
- `src/routes/hacking.$slug.walkthrough.tsx` — new.
- `src/routes/hacking.$slug.tsx` — CTA button + walkthrough presence check.
- `src/data/index.ts` — export walkthroughs + selector `walkthroughByPlaybook(slug)`.

## Out of scope (explicit)

- No new frameworks, backend, AI, or auth.
- No visual redesign of existing pages beyond adding the walkthrough CTA and result sections.
- No changes to `AuthorizedUseBanner` / `AckGate` behavior.
