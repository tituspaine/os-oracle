# FAQ

> **Disclaimer:** OS Oracle is for **authorised security testing, defensive validation, education, and lab use only**. Do not use any referenced tool, technique, or workflow against systems, applications, networks, or accounts without explicit prior permission.

## 1. What is OS Oracle?

OS Oracle is an offline-first ethical hacking knowledge platform that combines a CLI and a web app. It helps authorised practitioners quickly look up tools, commands, playbooks, distro-specific guidance, and common error fixes.

## 2. Is OS Oracle legal to use?

Yes—**when used legally and within scope**. The software is intended for authorised penetration tests, red-team exercises with approval, defensive validation, labs, classrooms, and CTF-style environments.

## 3. Is unauthorised use allowed if I am "just learning"?

No. Learning does not override the law or someone else's consent. If you want to practice, use your own lab, intentionally vulnerable apps, retired challenge boxes, or training platforms where the activity is explicitly permitted.

## 4. Does OS Oracle need internet access?

No for core usage. The platform is designed to work offline, with data embedded locally so you can search and browse without a network connection.

## 5. Can I use it fully offline?

Yes. That is one of its main design goals. It is useful in restricted client environments, air-gapped labs, travel situations, and classrooms with unreliable connectivity.

## 6. What does “offline-first” mean here?

It means the reference corpus ships with the project. Search, browsing, command lookup, and playbook review do not depend on cloud APIs or a remote backend.

## 7. How do I install OS Oracle?

Common options are:

```bash
npm install -g os-oracle
# or
bun install -g os-oracle
# or
npx os-oracle --help
```

## 8. How do I verify the installation?

Run:

```bash
os-oracle version
os-oracle offline
```

That confirms the CLI is available and reminds you of the offline model.

## 9. Is there a web version?

Yes. The repository contains a TypeScript web app built with React and TanStack Router/TanStack Start, alongside the CLI. The web layer provides richer browsing and grouped search results.

## 10. Does OS Oracle support Windows?

Yes, with the usual caveat that many security workflows are most comfortable on Linux-like environments. Windows users commonly run the CLI via WSL, terminals with Node/Bun installed, or containerized environments.

## 11. Does it support Linux and macOS?

Yes. Linux is a natural fit, especially for Kali and lab workflows, and macOS works well for local study and browser-based use.

## 12. What data is included?

The project includes offline reference data for:

- Kali tools
- Linux distributions
- commands and examples
- common error messages and fixes
- attack playbooks
- walkthroughs
- search synonyms / intent expansion

## 13. What kinds of Kali tools are covered?

Typical coverage includes tools like `nmap`, `sqlmap`, `metasploit`, `nikto`, `gobuster`, and other categories relevant to authorised recon, web testing, exploitation labs, password attacks, wireless labs, post-exploitation study, and reporting.

## 14. How does search work?

The platform uses local Fuse.js fuzzy search. In the web layer, query expansion and synonym handling help map natural language such as `find open ports` or `crack wifi` to the right tools and playbooks.

## 15. Does search send my queries anywhere?

Core search is local/offline by design. The platform is structured to avoid runtime dependency on cloud search services for normal operation.

## 16. Can I bookmark commands or topics?

Yes. The CLI supports bookmarks:

```bash
os-oracle bookmark add nmap
os-oracle bookmark list
```

Bookmarks are stored locally under `~/.os-oracle/`.

## 17. Where is my CLI history stored?

Search history is stored locally in:

```text
~/.os-oracle/history.json
```

## 18. How do I clear my history?

Run:

```bash
os-oracle history --clear
```

This is useful on shared training machines or demo systems.

## 19. How do I update OS Oracle?

If installed globally with npm:

```bash
npm install -g os-oracle@latest
```

If installed with Bun:

```bash
bun install -g os-oracle@latest
```

You can also re-run with `npx` for an ad hoc session.

## 20. Can I use OS Oracle during a real penetration test?

Yes, if the engagement is properly authorised and within documented scope. OS Oracle is especially useful as a fast reference during approved assessments, but it does not replace your rules of engagement, internal methodology, or legal approvals.

## 21. Can I use it in a bug bounty program?

Only if the activity is explicitly allowed by the program rules and you stay within scope. Always read the target's safe-harbor language, exclusions, rate limits, and prohibited test categories.

## 22. Can I use it for classroom or certification prep?

Absolutely. That is one of the safest and best uses: labs, workshops, CTF preparation, classroom demos, and personal training environments.

## 23. How do I contribute content?

Review `CONTRIBUTING.md`, `DISCLAIMER.md`, and the docs under `docs/`. The project welcomes corrections, new tools, new playbooks, walkthroughs, and search improvements—provided the content is ethically framed and suitable for authorised use.

## 24. How do I add a Kali tool?

The contribution guide points you to the right data files, typically `src/data/kali-deep.ts` or `src/data/kali-extra3.ts`. New entries should include real commands, real error messages, and upstream references.

## 25. How do I add a playbook?

Add it to the playbook data modules such as `src/data/playbooks-extra.ts` or the core `src/data/hacking.ts`, using the existing data model. Good playbooks include prerequisites, steps, errors, detection notes, mitigation guidance, and a clear legal note.

## 26. How do I add a walkthrough?

Add it to `src/data/walkthroughs.ts` and follow `docs/walkthroughs.md`. Walkthroughs should be lab-only, step-by-step, realistic, and safe to reproduce in approved environments.

## 27. How do I add a Linux distribution reference?

Update `src/data/distros.ts` using the shared distro model and command/error patterns. This is useful when the project needs better cross-distro administration coverage for lab or operator workflows.

## 28. How is the data organized internally?

The project uses a mix of TypeScript source modules and packaged JSON data. `src/data/index.ts` merges multiple tool and playbook sources with slug-based deduplication, where later sources override earlier ones.

## 29. What is the difference between the CLI and web app?

The CLI is optimized for rapid terminal lookup. The web app is better for browsing categories, following walkthroughs, and exploring grouped search results with a richer reading experience.

## 30. Is there any cloud backend?

No runtime backend is required for core functionality. The project is intentionally static and local-first.

## 31. Are any environment variables required?

No application runtime environment variables are required for normal offline usage.

## 32. How do I report a security issue in OS Oracle itself?

Do **not** post vulnerability details publicly. Follow `SECURITY.md`: open a private GitHub Security Advisory if possible, or open a minimal contact-request issue without technical details.

## 33. How do I report incorrect or outdated content?

Open a normal GitHub issue or submit a pull request with citations and corrections. Accuracy matters a lot in a reference project used during real security work.

## 34. Does OS Oracle include exploit payloads or malware?

That is not the intended purpose. The project is framed as a reference and learning platform and should stay focused on documented techniques, commands, troubleshooting, detection, mitigation, and authorised workflows.

## 35. Can I trust it as my only source during an engagement?

Use it as a fast reference, not your sole authority. For high-risk decisions, verify syntax against upstream docs, the tool's `--help` output, official advisories, or your team's approved methodology.

## 36. Is it suitable for blue teams and defenders too?

Yes. Playbooks and walkthroughs are also useful for understanding detection points, mitigation opportunities, common operator behavior, and likely tool usage patterns in controlled exercises.

## 37. Why emphasize legal compliance so strongly?

Because penetration testing knowledge is dual-use. A professional reference platform should make the intended boundary explicit: get authorisation, stay within scope, use lab environments when learning, and do no harm.

## 38. Where should I practice the techniques described here?

Use owned or approved environments such as:

- your own VMs
- internal training labs
- intentionally vulnerable apps
- CTFs
- platforms like PortSwigger Web Security Academy, TryHackMe, or Hack The Box where the activity is allowed

## 39. Can teams self-host or mirror the project internally?

Yes, that is one of the advantages of the static/offline model. Teams can package the CLI, mirror the repository, or deploy static artifacts internally without standing up a backend.

## 40. What is the safest mental model for using OS Oracle?

Treat it like a field manual for authorised work: useful, local, fast, and educational—but always governed by written permission, scope control, and professional ethics.
