# LEARNING_PATHS

> ⚠️ All resources and techniques are for authorized, legal security testing only.
>
> Every path below assumes lab work, sanctioned environments, and defensive understanding alongside offensive technique.

Use this guide to map your next 6-24 months of study. Pair the paths below with the references in [RESOURCES.md](./RESOURCES.md) and the certification guide in [CERTIFICATIONS.md](./CERTIFICATIONS.md).

## Beginner Path (0-6 months)

- **Goal:** Build safe, durable foundations in systems, networking, scripting, and basic security workflow.
- **Prerequisites:** Curiosity, willingness to use Linux daily, and basic command-line comfort.
- **Core topics:** Linux fundamentals, filesystems, processes, permissions, TCP/IP, DNS, HTTP, Python basics, Git hygiene, note-taking, and writing short findings.
- **Primary resources:** [Practice Platforms](./RESOURCES.md#practice-platforms), [Documentation & Reference](./RESOURCES.md#documentation--reference), [OverTheWire](./RESOURCES.md#practice-platforms), [Kali Linux Documentation](./RESOURCES.md#documentation--reference), [Nmap](./RESOURCES.md#tools-official-sites), [Wireshark](./RESOURCES.md#tools-official-sites).
- **Labs to practice on:** OverTheWire Bandit, picoCTF, beginner TryHackMe rooms, PortSwigger Academy beginner labs.
- **Certifications to target:** CompTIA Security+, eJPT.
- **Time estimate:** 5-8 hours/week for 4-6 months, or 10-15 hours/week for 2-4 months.
- **Milestones:**
  1. Navigate Linux without a GUI crutch.
  2. Explain what happens in a basic HTTP request.
  3. Write small Python scripts for parsing, requests, or automation.
  4. Complete easy CTF and web labs without blindly following writeups.

## Intermediate Path (6-18 months)

- **Goal:** Move from basic challenge solving into repeatable testing methodology.
- **Prerequisites:** Beginner path outcomes, comfort with Bash/Python, and confidence using Burp, Nmap, and common lab tooling.
- **Core topics:** Web app testing, authentication flaws, IDOR, SQLi, XSS, SSRF, directory discovery, SMB/LDAP basics, AD abuse fundamentals, privilege escalation, recon, and structured reporting.
- **Primary resources:** [PortSwigger Academy](./RESOURCES.md#practice-platforms), [Hack The Box](./RESOURCES.md#practice-platforms), [TryHackMe](./RESOURCES.md#practice-platforms), [HackTricks](./RESOURCES.md#documentation--reference), [PayloadsAllTheThings](./RESOURCES.md#documentation--reference), [BloodHound](./RESOURCES.md#tools-official-sites), [Impacket](./RESOURCES.md#tools-official-sites).
- **Labs to practice on:** Medium HTB retired boxes, PentesterLab tracks, WebGoat/DVWA, AD-focused TryHackMe or HTB labs.
- **Certifications to target:** PenTest+, PNPT, eCPPT, eWPT, OSCP.
- **Time estimate:** 6-12 hours/week for 6-12 months.
- **Milestones:**
  1. Run a clean web test workflow from recon to report.
  2. Identify and exploit common AD misconfigurations in labs.
  3. Produce concise evidence-backed findings with remediation notes.
  4. Reproduce techniques from trusted research and adapt them to new labs.

## Advanced Path (18+ months)

- **Goal:** Specialize in hard technical domains and operate with less scaffolding.
- **Prerequisites:** Intermediate-level testing success, strong scripting, troubleshooting discipline, and comfort reading source code.
- **Core topics:** Exploit development, custom tooling, reverse engineering, OPSEC, adversary emulation, cloud exploitation, detection-aware operations, and original research habits.
- **Primary resources:** [OpenSecurityTraining2](./RESOURCES.md#reverse-engineering--exploit-development), [ROP Emporium](./RESOURCES.md#reverse-engineering--exploit-development), [MITRE ATT&CK](./RESOURCES.md#documentation--reference), [Google Project Zero](./RESOURCES.md#news--research), [Ghidra](./RESOURCES.md#reverse-engineering--exploit-development), [CloudGoat](./RESOURCES.md#cloud-security).
- **Labs to practice on:** pwn.college, ROP Emporium, advanced HTB labs, CloudGoat/flAWS, malware analysis sandboxes, reverse engineering crackmes.
- **Certifications to target:** OSEP, OSWE, OSED, GXPN, GREM, BTL2.
- **Time estimate:** 8-15 hours/week for 12+ months.
- **Milestones:**
  1. Develop or modify exploit chains rather than just replaying public steps.
  2. Explain how detections would catch your tradecraft and how defenders should improve.
  3. Read source or assembly to locate vulnerability root cause.
  4. Run small self-directed research projects and write clean notes.

## Web Application Security Path

- **Goal:** Become effective at manual web application assessment.
- **Prerequisites:** HTTP fundamentals, browser/devtools familiarity, and beginner scripting.
- **Resources:** [PortSwigger Academy](./RESOURCES.md#practice-platforms), [OWASP Top 10](./RESOURCES.md#documentation--reference), [OWASP WSTG](./RESOURCES.md#standards--compliance), [HackTricks](./RESOURCES.md#documentation--reference), [PayloadsAllTheThings](./RESOURCES.md#documentation--reference), [Burp Suite](./RESOURCES.md#tools-official-sites).
- **Labs to practice on:** PortSwigger labs, PentesterLab, DVWA, WebGoat, Root-Me web challenges.
- **Certifications to target:** eWPT, GWAPT, OSWE.
- **Time estimate:** 4-9 months focused study.
- **What “done” looks like:** You can manually test auth, sessions, access control, input handling, business logic, and common API patterns while writing defensible findings.

## Network Penetration Testing Path

- **Goal:** Build a repeatable workflow for external/internal infrastructure assessment.
- **Prerequisites:** Linux, networking, service fundamentals, and basic scripting.
- **Resources:** [Nmap](./RESOURCES.md#tools-official-sites), [Wireshark](./RESOURCES.md#tools-official-sites), [Metasploit](./RESOURCES.md#tools-official-sites), [Hack The Box](./RESOURCES.md#practice-platforms), [TryHackMe](./RESOURCES.md#practice-platforms), [NIST SP 800-115](./RESOURCES.md#documentation--reference).
- **Labs to practice on:** VulnHub VMs, HTB retired boxes, internal network lab ranges, TryHackMe offensive paths.
- **Certifications to target:** PenTest+, PNPT, eCPPT, OSCP, GPEN.
- **Time estimate:** 6-12 months.
- **What “done” looks like:** You can scope, enumerate, validate, exploit, escalate, and report without needing a walkthrough for every service.

## Active Directory / Windows Path

- **Goal:** Understand common enterprise Windows attack paths and associated defensive controls.
- **Prerequisites:** Networking, Windows admin basics, PowerShell exposure, and intermediate enumeration skills.
- **Resources:** [BloodHound](./RESOURCES.md#tools-official-sites), [Impacket](./RESOURCES.md#tools-official-sites), [Responder](./RESOURCES.md#tools-official-sites), [HackTricks](./RESOURCES.md#documentation--reference), [Hacking Articles](./RESOURCES.md#ctf-writeups-walkthroughs--study-media), [MITRE ATT&CK](./RESOURCES.md#documentation--reference).
- **Labs to practice on:** HTB AD labs, TryHackMe AD rooms, self-built Windows domain lab, PNPT-style scenarios.
- **Certifications to target:** PNPT, OSCP, OSEP.
- **Time estimate:** 4-10 months after solid fundamentals.
- **What “done” looks like:** You can enumerate AD, map trust/privilege relationships, abuse common misconfigurations, and recommend realistic hardening steps.

## Mobile Security Path

- **Goal:** Learn Android/iOS assessment workflow from package inspection to runtime analysis.
- **Prerequisites:** Web/API basics, comfortable with Linux, and willingness to learn app packaging/signing concepts.
- **Resources:** [OWASP MASVS](./RESOURCES.md#mobile-security), [OWASP MASTG](./RESOURCES.md#mobile-security), [MobSF](./RESOURCES.md#mobile-security), [Frida](./RESOURCES.md#mobile-security), [Objection](./RESOURCES.md#mobile-security), [JADX](./RESOURCES.md#mobile-security).
- **Labs to practice on:** OWASP MSTG crackmes, deliberately insecure Android apps, local API backends, emulator-based testing.
- **Certifications to target:** eWPT as a foundation, then vendor- or role-specific mobile tracks if needed.
- **Time estimate:** 4-8 months for strong Android fundamentals; longer for iOS depth.
- **What “done” looks like:** You can unpack apps, inspect code/resources, hook runtime behavior, and connect mobile findings back to backend/API risk.

## Cloud Security Path

- **Goal:** Assess IAM, storage, identity trust, and cloud-native attack paths responsibly.
- **Prerequisites:** Intermediate Linux/networking, basic identity concepts, and comfort reading provider docs.
- **Resources:** [AWS Security Documentation](./RESOURCES.md#cloud-security), [Microsoft Azure Security Documentation](./RESOURCES.md#cloud-security), [Google Cloud Security Documentation](./RESOURCES.md#cloud-security), [CloudGoat](./RESOURCES.md#cloud-security), [flAWS](./RESOURCES.md#cloud-security), [Pacu](./RESOURCES.md#cloud-security), [ScoutSuite](./RESOURCES.md#cloud-security).
- **Labs to practice on:** CloudGoat scenarios, flAWS/flAWS2, personal lab accounts with strict spend controls, IaC review exercises.
- **Certifications to target:** Security+, CySA+, role-specific cloud security certs, then OSEP/GXPN-style advanced offensive work if red-team oriented.
- **Time estimate:** 4-9 months for one major provider.
- **What “done” looks like:** You can explain IAM abuse paths, risky trust relationships, data exposure issues, and practical mitigation patterns.

## Malware Analysis / DFIR Path

- **Goal:** Build the ability to investigate compromise and understand attacker tooling.
- **Prerequisites:** Operating system basics, networking, and strong curiosity about host/process behavior.
- **Resources:** [Autopsy](./RESOURCES.md#forensics--dfir), [Volatility](./RESOURCES.md#forensics--dfir), [Velociraptor](./RESOURCES.md#forensics--dfir), [YARA](./RESOURCES.md#forensics--dfir), [Malware Traffic Analysis](./RESOURCES.md#forensics--dfir), [The DFIR Report](./RESOURCES.md#forensics--dfir), [Ghidra](./RESOURCES.md#reverse-engineering--exploit-development).
- **Labs to practice on:** CyberDefenders, Blue Team Labs Online, public PCAP/memory-image exercises, malware traffic analysis scenarios.
- **Certifications to target:** CySA+, BTL1, BTL2, GREM.
- **Time estimate:** 5-10 months depending on how much reverse engineering depth you want.
- **What “done” looks like:** You can triage alerts, investigate host/network artifacts, extract indicators responsibly, and explain attacker behavior clearly.

## How to Use These Paths Well

- **Stay hands-on.** Reading alone is not enough; labs are where concepts become durable.
- **Keep a report habit early.** Write short findings and mitigations even for lab work.
- **Cycle between offense and defense.** Understanding detections makes offensive technique sharper and more ethical.
- **Avoid random tool collecting.** Learn what problem each tool solves, not just its flags.
- **Pick one primary path at a time.** Depth beats scattered progress.
