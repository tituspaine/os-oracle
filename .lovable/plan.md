## Goal

Turn the current reference into a definitive, self-contained ethical security-testing handbook: every remaining Kali tool documented in depth, an exhaustive playbook catalog covering all major system classes, an intent-based natural-language search inside the playbook, and unmissable authorized-use signage site-wide.

## Ethics & signage (baked into every page)

- Add an `AuthorizedUseBanner` component rendered in `__root.tsx` (above `<main>`) so **every route** shows:
  > "All information is provided for authorized security testing, education, and defensive purposes only. Unauthorized use against systems you do not own or have explicit permission to test is illegal and unethical."
- Add a stronger inline warning block on `hacking.index`, `hacking.$slug`, and every Kali tool page.
- Add a one-time "I understand — this is for authorized testing only" dismissible acknowledgement stored in `localStorage` (no cloud), gating entry to `/hacking`.
- Add a `/ethics` route describing scope-of-authorization, rules of engagement, responsible disclosure, and relevant laws (CFAA, CMA, GDPR Art. 32, DMCA §1201, etc.) at a general educational level.
- Every playbook entry includes a `defensive` section (detections, mitigations, hardening) — the tool teaches defense as strongly as offense.

## Kali tool catalog — full depth for every tool

Restructure `src/data/kali-shallow.ts` → split into per-category files under `src/data/kali/` so files stay maintainable:

```text
src/data/kali/
  information-gathering.ts
  vulnerability-analysis.ts
  web-application-analysis.ts
  database-assessment.ts
  password-attacks.ts
  wireless-attacks.ts
  reverse-engineering.ts
  exploitation-tools.ts
  sniffing-spoofing.ts
  post-exploitation.ts
  forensics.ts
  reporting-tools.ts
  social-engineering.ts
  system-services.ts
  hardware-hacking.ts
  cryptography.ts
  index.ts   // aggregates + re-exports
```

Add remaining tools from the official Kali metapackages to reach the full documented set (~600 entries). For every tool, upgrade the schema to require:

- `name`, `slug`, `category`, `homepage`, `packages`
- `purpose` — what it does, in plain language
- `authorizedUseCases` — legitimate scenarios (pentest scope, CTF, lab)
- `commands[]` — every documented subcommand/flag, each with:
  - `syntax` (canonical form)
  - `meaning` (what the flag/subcommand does)
  - `purpose` (why you'd reach for it)
  - `example` (concrete, lab-safe target like `scanme.nmap.org`, `127.0.0.1`, `testphp.vulnweb.com`)
  - `notes` (permissions, noisy vs stealthy, IPv4/6, etc.)
- `commonMistakes[]` — misuse patterns
- `errors[]` — `{ message, cause, resolution, steps[] }`
- `defensive` — how blue teams detect/mitigate what this tool does
- `related` — links to sibling tools and playbooks

Where a tool has hundreds of flags (nmap, metasploit, hydra, hashcat, sqlmap, aircrack-ng, john, wireshark/tshark, burp CLI, ffuf, gobuster, wfuzz, nikto, wpscan, enum4linux-ng, impacket suite, bloodhound, crackmapexec/netexec, responder, mimikatz-lite refs, volatility3, radare2, ghidra headless, binwalk, foremost, autopsy, tcpdump, ettercap, bettercap, kismet, reaver, bully, hcxdumptool, hcxtools, openvas/gvm, nuclei, katana, subfinder, amass, theHarvester, spiderfoot, maltego, recon-ng, dnsrecon, dnsenum, fierce, masscan, zmap, hping3, netcat, socat, proxychains, chisel, ligolo-ng, sliver, empire, covenant refs, evil-winrm, kerbrute, rubeus refs, certipy, adcs tooling, ldapdomaindump, smbmap, smbclient, rpcclient, snmpwalk, snmp-check, onesixtyone, ike-scan, sslscan, sslyze, testssl.sh, mitmproxy, zaproxy, arjun, paramspider, dalfox, xsstrike, commix, tplmap, jwt_tool, kiterunner, feroxbuster, dirb, dirbuster, whatweb, wafw00f, cewl, crunch, cupp, medusa, patator, ncrack, chntpw, ophcrack, samdump2, pdfcrack, fcrackzip, rsmangler, exif tools, steghide, stegseek, outguess, pngcheck, foremost, scalpel, bulk_extractor, plaso, log2timeline, sleuthkit, dc3dd, dcfldd, guymager, chkrootkit, rkhunter, lynis, unhide, tiger, aide, tripwire, ossec refs, snort, suricata refs, zeek refs, yara, capa, floss, die, upx, strace, ltrace, gdb-peda/gef/pwndbg, ropper, one_gadget, angr, unicorn, qemu-user, retdec, r2ghidra, cutter, jadx, apktool, dex2jar, frida, objection, mobsf, drozer, needle, ios-triage refs, blueranger, spooftooph, redfang, btscanner, bluesnarfer, hackrf tooling, gqrx, rtl-sdr, gnuradio, wifite, fluxion, airgeddon, kismet, horst, wavemon, hostapd-wpe, freeradius-wpe, eaphammer, wifiphisher, mana-toolkit, mdk4, cowpatty, pyrit-lite refs, macchanger, arpspoof, dnsspoof, sslsplit, dsniff, driftnet, tcpxtract, netdiscover, arping, fping, and dozens more) — enumerate the entire flag surface grouped logically (targeting, scan type, timing/perf, output, evasion, scripting, host discovery, etc.), with meaning and one lab-safe example each. Files can grow large; that's expected.

Tools already in `kali-deep.ts` remain the canonical "deep" entries; we merge their schema with the new required fields where missing, then move category-appropriate ones into the split files so there's a single unified store.

## Security-testing playbook catalog

Split `src/data/hacking.ts` → `src/data/playbooks/` by domain, with an index that aggregates:

```text
src/data/playbooks/
  web/            (OWASP Top 10 + API Top 10: SQLi, XSS, CSRF, SSRF, XXE,
                   IDOR, broken auth, JWT flaws, GraphQL abuse, prototype
                   pollution, deserialization, SSTI, path traversal,
                   business-logic — e.g. auditing pricing/coupon logic —,
                   race conditions, cache poisoning, HTTP request smuggling,
                   open redirect, CORS misconfig, file upload, WebSocket auth)
  network/        (SMB relay, LLMNR/NBT-NS poisoning, ARP/DNS spoofing,
                   IPv6 mitm, DHCP starvation, VLAN hopping, STP attacks,
                   BGP hijack theory, port scanning methodology, service
                   enumeration, banner-based CVE mapping, EternalBlue,
                   BlueKeep, PrintNightmare, SMBGhost, Zerologon)
  active-directory/ (Kerberoasting, AS-REP roasting, unconstrained/
                   constrained/RBCD delegation, ACL abuse, DCSync, DCShadow,
                   GPO abuse, ADCS ESC1–ESC15, LAPS misconfig,
                   golden/silver/diamond tickets, shadow credentials)
  wireless/       (WPA2-PSK capture + offline crack, PMKID, WPA3
                   Dragonblood theory, WPS Pixie Dust, evil twin,
                   deauth-driven captive-portal tests, Bluetooth/BLE
                   sniffing and pairing weaknesses, Zigbee, Z-Wave, LoRa,
                   NFC/RFID cloning in scope)
  cloud/          (AWS IAM misconfig, S3 exposure, SSRF-to-metadata
                   (v1 vs v2), assume-role chaining, GCP metadata,
                   Azure AAD device code phishing, storage account
                   misconfig, Kubernetes RBAC, exposed kubelet/etcd,
                   container escapes, Docker socket abuse)
  mobile/         (Android APK static/dynamic analysis, insecure storage,
                   SSL pinning bypass in a controlled lab, deep-link abuse,
                   iOS IPA analysis, jailbreak-only techniques flagged as
                   lab-only)
  iot-embedded/   (firmware extraction with binwalk, UART/JTAG discovery,
                   default-cred audits, MQTT/CoAP testing, UPnP/SSDP
                   exposure, ICS/SCADA — Modbus/DNP3 lab enumeration only)
  os-privesc/     (Linux: SUID, capabilities, sudo misconfig, cron, PATH,
                   kernel — DirtyPipe, DirtyCow, PwnKit, OverlayFS;
                   Windows: unquoted service paths, weak service perms,
                   token impersonation, UAC bypass theory, AlwaysInstall-
                   Elevated, autoruns; macOS: TCC abuse concepts)
  passwords/      (hashcat/john modes, rule design, mask attacks, wordlist
                   engineering, credential stuffing detection, MFA fatigue
                   awareness)
  social-eng/     (phishing infra in a lab, gophish setups, pretexting
                   frameworks, physical-security assessment methodology)
  post-exploit/   (living-off-the-land, persistence categories, C2 comms
                   patterns, data-staging concepts, cleanup / evidence
                   preservation for reports)
  hardware/       (side-channel intros, glitching concepts, chip-off basics
                   — theory-level with lab references)
  defensive/      (blue-team counterparts for every offensive category:
                   detection queries, sigma rules pointers, hardening
                   checklists)
```

Each playbook entry uses this schema (extends current `Playbook`):

- `title`, `slug`, `category`, `subcategory`
- `severity`, `cwe`, `cve[]`, `mitreAttack[]` (technique IDs)
- `targets[]` — system/device/platform classes affected
- `principle` — the underlying weakness in plain language
- `impact` — what an attacker with authorization is demonstrating
- `prerequisites` — required scope, access, tooling
- `authorization` — explicit statement of what written authorization must cover before running this
- `steps[]` — each: `goal`, `tool` (link to Kali tool page), `command`, `expectedOutput`, `notes`, `safetyNotes`
- `errors[]` — errors and resolutions
- `detection` — how a defender sees this
- `mitigation` — how to fix/harden
- `references[]` — vendor advisories, RFCs, OWASP pages

Include a **business-logic** section covering the pricing/coupon/checkout style tests the user asked about — negative quantities, integer overflow on totals, race conditions on coupon redemption, IDOR on cart/order IDs, tampered client-side price fields, currency/rounding, promo-code brute force with rate-limit checks — described as authorized QA/security testing against your own app or an in-scope target.

## Intent-based natural-language search (in-handbook)

New route `/hacking/search` plus an inline search box at the top of `/hacking`:

- Data:
  - Expand `src/data/search-synonyms.ts` into `src/data/intent-map.ts` with hundreds of intents. Each intent entry:
    - `phrases[]` — natural-language variants ("audit wifi security", "test wpa2", "check wireless network", "how do I audit a wi-fi network")
    - `domain` — web / wireless / ad / cloud / mobile / …
    - `playbooks[]` — slugs to surface
    - `tools[]` — slugs to surface
    - `commands[]` — canonical starting commands
    - `guidance` — short ethical framing shown above the results
  - Include the "pricing logic" style intents mapping to business-logic web playbooks.
- Engine: extend the current Fuse.js multi-index setup with:
  - phrase-level index over `phrases[]`
  - query expansion via intent match → union of playbook/tool/command hits
  - fuzzy fallback across playbook titles/principles/steps
  - question-word normalization ("how do I …", "how can I test …", "what is the safest way to …")
- Every result page prepends the guidance line and the authorized-use banner.
- Zero cloud calls: 100% client-side Fuse.js over bundled JSON.

## Homepage & navigation

- Rename UI copy from "Hacking" → "Security Testing" everywhere (route slug `/hacking` kept for URL stability, or redirected — I'll keep `/hacking` and update labels only, to avoid breaking existing links).
- Home page: prominent ethics banner, three cards (Distros, Kali tool reference, Security testing handbook), plus a large intent-search input that submits to `/hacking/search?q=…`.
- Header: keep global intent search; add "Ethics" link.

## Technical details

- All data stays static TypeScript bundled at build — no AI, no cloud, no runtime fetches.
- Types updated in `src/data/types.ts`; `KaliCommand`, `KaliError`, `Playbook`, `PlaybookStep`, `Intent` extended per above.
- `src/data/index.ts` re-exports the aggregated `KALI_TOOLS`, `PLAYBOOKS`, `INTENTS`.
- Route additions: `src/routes/ethics.tsx`, `src/routes/hacking.search.tsx`.
- Component additions: `src/components/authorized-use-banner.tsx`, `src/components/ack-gate.tsx` (localStorage acknowledgement for `/hacking`), `src/components/defensive-block.tsx`.
- Search page reused for global search; handbook search is a dedicated route tuned to intents and only searches playbooks + related tools.
- Every new list uses `as const satisfies readonly Playbook[]` patterns so TS catches missing fields.

## Scope of tool coverage in this pass

I'll aim for exhaustive coverage of the standard Kali metapackages (`kali-linux-default`, `kali-tools-*`). For extremely large flag surfaces (nmap, metasploit console commands, hashcat modes, sqlmap options, aircrack-ng suite), I'll enumerate every documented flag from the current man pages / official docs, grouped by function, with a concrete example each. Files will be long by design.

## Deliverables checklist

- [ ] `AuthorizedUseBanner` + `AckGate` + `/ethics` route
- [ ] Split `src/data/kali/` with every remaining tool documented at full depth
- [ ] Split `src/data/playbooks/` covering web, network, AD, wireless, cloud, mobile, IoT/embedded, OS privesc, passwords, social eng, post-exploit, hardware, defensive
- [ ] Business-logic web section (incl. pricing/coupon testing) with clear authorization framing
- [ ] `intent-map.ts` with hundreds of natural-language intents
- [ ] `/hacking/search` intent search + inline handbook search bar
- [ ] Global copy shift to "Security Testing"; ethics link in header
- [ ] Every playbook has `detection` + `mitigation`
- [ ] Type-check passes; all routes render 200

## Realistic note

The Kali catalog and playbook expansion will produce very large data files (tens of thousands of lines total). I will build them methodically in a single build pass and only stop when the checklist above is complete.
