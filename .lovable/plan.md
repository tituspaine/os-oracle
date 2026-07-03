## Goal

Final completion pass — no new features, just fill in remaining depth and make the repo release-ready for GitHub.

Three tracks, all shipped in one build:

1. **Catalog completion** — add every missing tool and command.
2. **Scenario depth** — add many more walkthrough scenarios per playbook and per exploit.
3. **Open-source hardening** — repo hygiene, licensing, docs, CI, disclaimers.

Everything stays static TS + client-side Fuse.js. No backend, no AI, no cloud.

---

## 1. Catalog completion

### Kali tools — new file `src/data/kali-extra3.ts`

Add the last ~120 tools that still aren't in `kali-shallow`, `kali-deep`, `kali-extra`, or `kali-extra2`. Each entry gets the full `KaliTool` shape with hand-authored `commands[]` (5–12 real flags) and `errors[]` (3–5 real failures). Coverage checklist:

- **Info gathering**: `amass` (deep expand), `theharvester` (deep expand), `recon-ng` (deep expand), `shodan-cli`, `censys`, `dnstwist`, `urlcrazy`, `dmitry`, `netdiscover`, `masscan` (deep), `zmap`, `unicornscan`, `sslscan`, `sslyze`, `testssl.sh`, `nikto` (deep expand), `whois`, `host`, `ike-scan` (deep expand).
- **Vuln analysis**: `openvas`/`gvm-cli`, `nessus-cli` (ref), `lynis` (deep), `tiger`, `nikto` NSE, `wpscan` (deep expand), `davtest`, `cadaver`.
- **Web app**: `burpsuite` (deep expand — proxy CLI, extensions, macros), `zaproxy` (deep expand), `feroxbuster` (deep), `gobuster` (deep expand), `ffuf` (deep expand), `wfuzz` (deep expand), `dirb`, `dirbuster`, `whatweb` (deep), `wafw00f` (deep), `sqlmap` (deep expand — tamper scripts).
- **Passwords**: `hashcat` (deep expand — mode table, rules, masks), `john` (deep expand — formats, incremental), `hydra` (deep expand — every module), `medusa` (deep), `ncrack` (deep), `patator` (deep), `crackmapexec`/`nxc` (deep expand).
- **Wireless**: `aircrack-ng` (deep expand), `reaver` (deep expand), `bully`, `kismet` (deep), `fern-wifi-cracker`, `pixiewps`, `cowpatty`, `eaphammer`, `bettercap wifi module` (deep).
- **AD / Windows**: `impacket-*` full suite (secretsdump, GetNPUsers, GetUserSPNs, wmiexec, psexec, smbexec, atexec, dcomexec, ntlmrelayx, addcomputer, ticketer, kerbrute), `rubeus` (ref), `certipy`, `bloodhound-python`, `sharphound` (ref), `enum4linux-ng` (deep), `smbmap` (deep).
- **Cloud/K8s**: `pacu` (deep), `scoutsuite` (deep), `prowler` (deep), `cloudsploit`, `kube-hunter` (deep), `kube-bench` (deep), `kubectl` recon patterns, `peirates`, `trivy` (deep), `grype`, `syft`, `dockle`.
- **Mobile**: `mobsf` (deep), `frida` (deep), `objection` (deep), `apktool` (deep), `jadx` (deep), `drozer`.
- **Forensics**: `volatility3` (deep expand — every plugin group), `autopsy`, `bulk_extractor`, `binwalk` (deep expand), `foremost` (deep), `photorec`, `testdisk`.
- **C2 / post-ex**: `sliver` (deep), `mythic` client patterns, `covenant` (ref), `empire`/`starkiller` (deep), `merlin`, `chisel` (deep), `ligolo-ng` (deep), `sshuttle` (deep).

For tools already present as stubs, ship a `kali-overrides.ts` map keyed by slug that upgrades depth from `shallow` to `deep` and replaces the generated commands/errors. `src/data/index.ts` applies the override during merge so we don't duplicate entries.

### Linux distros — extend `src/data/distros.ts`

For every distro, top up `commands[]` to cover:

- Package manager: install, remove, search, show, update, upgrade, autoremove, clean, reinstall, hold, list-installed, downgrade, list-files, which-package-owns, add-repo, GPG key trust.
- systemd + journald + logind: full verb list, timers, targets, `systemd-analyze blame/critical-chain`.
- Users/permissions: useradd, usermod, passwd, chage, groupadd, sudo, visudo, PAM basics, getfacl/setfacl, chattr/lsattr.
- Networking: ip, nmcli, ss, resolvectl, nft, iptables, ufw, firewall-cmd, tcpdump, wireshark-cli.
- Storage: lsblk, blkid, parted, mkfs.*, fsck, LVM, LUKS, ZFS (where applicable), Btrfs snapshots (Fedora/openSUSE).
- Processes/perf: ps, top, htop, vmstat, iostat, pidstat, strace, ltrace, lsof, kill/pgrep family.
- Kernel/modules: uname, lsmod, modprobe, sysctl, dmesg, kernel-install.
- Distro-specific: NixOS (`nix flake`, `nixos-rebuild switch --flake`), Arch (`pacman`, `paru`, `makepkg -si`), Alpine (`apk`, `rc-service`, `setup-*`), Gentoo (`emerge`, `equery`, `eselect`), openSUSE (`zypper`, `snapper`, `transactional-update`), Fedora (`dnf`, `rpm-ostree`, `toolbox`), RHEL/Rocky (`subscription-manager`, `dnf module`), Void (`xbps-*`), Slackware (`slackpkg`, `installpkg`).

Also add 3–5 more real `errors[]` to each distro (dependency conflicts, held packages, dpkg locks, systemd start failures, SELinux denials, etc.).

---

## 2. Scenario depth

### Walkthroughs — extend `src/data/walkthroughs.ts`

Today: 10–12 walkthroughs. Target: every playbook gets at least one walkthrough, and the high-traffic ones get multiple variants (different targets / difficulty). Shape unchanged.

- Add 40+ new walkthroughs to reach ~55 total. Coverage: SQLi (union, blind boolean, blind time, second-order), XSS (reflected, stored, DOM, CSP bypass), SSRF (cloud metadata AWS/GCP/Azure, gopher, Redis), XXE (classic, blind OOB), SSTI (Jinja2, Twig, Freemarker), Deserialization (Java, .NET, Python pickle, PHP), IDOR, JWT (alg=none, weak secret, kid injection), OAuth (redirect_uri, PKCE downgrade), Log4Shell, Spring4Shell, ProxyShell, PrintNightmare, EternalBlue, Zerologon, PetitPotam, ADCS ESC1–ESC11, Kerberoast, AS-REP roast, DCSync, DCShadow, unconstrained delegation, RBCD, WPA2 handshake, WPA2 PMKID, WPS Pixie-Dust, Evil Twin, KRACK detection, Bluetooth BIAS (defensive), Linux privesc (SUID, sudo, cron, capabilities, LD_PRELOAD, PATH hijack, Docker group, GTFOBins routes), Windows privesc (AlwaysInstallElevated, UsoSvc, SeImpersonate/PrintSpoofer, unquoted service paths), container escape (docker.sock, CAP_SYS_ADMIN, kernel), K8s (exposed dashboard, ETCD, RBAC misconfig), AWS (SSRF→IMDSv1, Cognito misconfig, S3 acl), business logic (pricing race, coupon reuse, checkout skip, mass assignment), API (BOLA, BFLA, mass assignment, GraphQL introspection + batching).

### Per-scenario detail per frame

Each new walkthrough follows the existing `WalkthroughFrame` shape but now consistently ships:

- 10–20 frames.
- Per-frame `branches[]` (at least 2 for the tricky steps) so a user picking a different observation gets a different next step.
- Per-frame `troubleshoot[]` (2–4 `KnownError` entries) — real failure messages with cause + fix.
- Realistic `expectedOutput` blocks (not lorem — actual-looking tool output).

### Playbook cross-links

Update `src/routes/hacking.$slug.tsx` to list *all* walkthroughs available for the playbook (currently assumes one). `walkthroughBySlug` becomes `walkthroughsByPlaybook(slug): Walkthrough[]`; route params get a scenario id: `hacking.$slug.walkthrough.$scenario.tsx`. Old `hacking.$slug.walkthrough.tsx` becomes a redirect to the first scenario for that playbook.

### Search coverage

`src/routes/search.tsx` already indexes walkthrough frames — no changes needed beyond the new scenario id in the deep-link.

---

## 3. Open-source hardening

Everything in this section is repo hygiene — nothing changes the running app's UX.

### Legal & disclaimers

- Add `LICENSE` (MIT) at repo root.
- Add `NOTICE.md` — third-party attributions for Fuse.js, Radix, Tailwind, shadcn/ui, lucide-react.
- Add `DISCLAIMER.md` — long-form version of the in-app banner; explicit "no warranty, authorised testing only, list of jurisdictions" language.
- Add `SECURITY.md` — how to report vulnerabilities in *this repo* (not the tools it documents); reference to `security-memory`.
- Add `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1.
- Add `CONTRIBUTING.md` — how to add a tool / playbook / walkthrough (schema pointers, style rules, ethics requirement).

### GitHub metadata

- `.github/ISSUE_TEMPLATE/bug_report.yml`, `feature_request.yml`, `content_correction.yml`, `config.yml` (turns off blank issues, points at Discussions).
- `.github/PULL_REQUEST_TEMPLATE.md` — checklist including ethics attestation, source citation for any new command/exploit info.
- `.github/workflows/ci.yml` — Bun setup → `bun install --frozen-lockfile` → `bun run typecheck` → `bun run build`. Node LTS matrix.
- `.github/workflows/codeql.yml` — CodeQL JS/TS scan on PRs.
- `.github/dependabot.yml` — weekly npm updates, grouped.
- `.github/FUNDING.yml` — empty scaffold with commented options.

### README

Rewrite `README.md` to include: what this is (Linux + Kali reference + ethical security testing handbook, fully offline), the authorised-use disclaimer up top, screenshots (added as `docs/screenshots/*.png` placeholders), quickstart (`bun install`, `bun dev`), tech stack, data model overview, how search works, how to add content (link to `CONTRIBUTING.md`), license, acknowledgements.

### Repo hygiene

- Verify `.gitignore` covers `node_modules`, `.env*`, `dist`, `.wrangler`, `.vite`, `.turbo`, `.DS_Store`, `coverage`, `playwright-report`, `test-results`.
- Add `.editorconfig`.
- Add `.nvmrc` pinning Node LTS.
- Verify `package.json` has `name`, `description`, `license`, `repository`, `keywords`, `engines`, `scripts.typecheck`, `scripts.lint`, `scripts.format`.
- Add `docs/` folder with `data-model.md`, `search.md`, `walkthroughs.md`, `adding-content.md`.

### In-app polish (small)

- `src/routes/about.tsx`: link to GitHub repo, license, contributing, disclaimer, and per-source attributions.
- `src/routes/ethics.tsx`: append a "reporting misuse" section and a link to `DISCLAIMER.md` (rendered client-side from the same MD source via a tiny inlined string constant to avoid a build-time fs read).
- `AuthorizedUseBanner`: no text change — already covers scope.

### Verification

After the writes, run typecheck and build in the same batch. Fix any red squiggles from the extra command entries (mostly TS literal narrowing on `category`). No test suite is added — out of scope.

---

## Files touched

**Data**
- `src/data/kali-extra3.ts` (new, ~120 tools)
- `src/data/kali-overrides.ts` (new, upgrade table)
- `src/data/distros.ts` (extend)
- `src/data/walkthroughs.ts` (extend to ~55 scenarios)
- `src/data/index.ts` (merge override, new selector `walkthroughsByPlaybook`)

**Routes**
- `src/routes/hacking.$slug.tsx` (list all walkthroughs)
- `src/routes/hacking.$slug.walkthrough.$scenario.tsx` (new)
- `src/routes/hacking.$slug.walkthrough.tsx` (redirect shim)
- `src/routes/about.tsx` (repo/license links)
- `src/routes/ethics.tsx` (misuse reporting section)

**Repo**
- `LICENSE`, `NOTICE.md`, `DISCLAIMER.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `README.md`
- `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/ci.yml`, `.github/workflows/codeql.yml`, `.github/dependabot.yml`, `.github/FUNDING.yml`
- `.editorconfig`, `.nvmrc`, `.gitignore` (top-up)
- `docs/data-model.md`, `docs/search.md`, `docs/walkthroughs.md`, `docs/adding-content.md`
- `package.json` (metadata + scripts)

## Out of scope

- No new UI redesign, no new pages beyond the walkthrough scenario route.
- No backend, no auth, no analytics, no AI.
- No test suite.
- No changes to `AuthorizedUseBanner` / `AckGate` behaviour.
