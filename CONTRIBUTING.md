# Contributing

Thanks for your interest in improving **distro/ref**. This project is entirely open source and
community-maintained.

Please read [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) and [`DISCLAIMER.md`](./DISCLAIMER.md)
before contributing.

## What we welcome

- Corrections to existing commands, flags, examples, or error messages.
- New Kali/Linux tools (with real commands and real errors).
- New playbooks (with a public CVE reference, MITRE ATT&CK mapping where applicable, and a
  clearly ethical framing).
- New walkthroughs (lab-only, realistic expected output).
- UI polish, accessibility fixes, and search improvements.

## What we do **not** accept

- Exploit payloads, weaponised code, malware, ransomware, DDoS tools, credential-harvesting kits,
  or infrastructure code for offensive campaigns.
- Content that assumes or encourages unauthorised access to any system.
- Vendored copies of copyrighted third-party documentation.
- Content without a source citation.

## Low-friction submission paths

Not every contributor needs to open a code PR first. Use the GitHub issue forms for:

- **New Kali tool command** — one real command, flags, examples, and common errors.
- **New playbook / walkthrough** — a lab-safe scenario with citations and ethical framing.
- **Error message + fix** — exact text, root cause, and at least one confirmed remediation.
- **Resource / link** — a high-signal upstream source that strengthens the reference.

The in-app `/community` page mirrors the same workflow and explains the current scale roadmap.

## Dev setup

```bash
bun install
bun dev              # http://localhost:8080
bun run build        # production build must pass
bun run lint         # ESLint must pass
```

Use `.nvmrc` (`nvm use`) if you prefer npm/pnpm. Node 20 LTS is the floor.

## Adding a Kali tool

1. Pick the right file:
   - Deep, hand-authored entry → `src/data/kali-deep.ts`
   - New shallow entry using the `tool()` factory → `src/data/kali-extra3.ts`
2. Follow the `KaliTool` shape in `src/data/types.ts`.
3. Include at least:
   - 3+ real commands (flag + description + one realistic example).
   - 2+ real error messages (message, cause, fix).
   - The upstream `homepage` URL.
4. `bun run build` must pass.

## Adding a playbook

1. Add to `src/data/playbooks-extra.ts` (or `src/data/hacking.ts` for core primitives).
2. Include: `cve[]` where applicable, `mitreAttack[]` codes, `prerequisites`, ordered `steps`
   with commands, `errors`, `detection`, and `mitigation`.
3. Add a `legalNote` — copy the wording used by neighbouring playbooks.
4. If you can, add a **walkthrough** in `src/data/walkthroughs.ts` with the same slug.

## Adding a walkthrough

See [`docs/walkthroughs.md`](./docs/walkthroughs.md). Every walkthrough must be safe to run in a
lab (DVWA, WebGoat, HTB retired, PortSwigger Academy, your own VM). No production targets.

## PR checklist

The PR template will prompt you; the short version is:

- [ ] Source citation (link the upstream docs / CVE / man page).
- [ ] Ethics attestation checked.
- [ ] `bun run build` passes locally.
- [ ] `bun run lint` passes locally.
- [ ] No new dependencies without discussion.

## Security review gates

Every contribution should be easy to submit but hard to weaponise:

- Keep examples tied to upstream docs, man pages, CVE records, or safe lab environments.
- Do not submit malware, credential harvesters, persistence kits, destructive payloads, or
  bypass-ready exploit chains.
- Prefer defensive, troubleshooting, detection, mitigation, and authorised-testing framing.
- If a contribution would require a backend, cloud service, or arbitrary code execution path,
  open a feature request before doing implementation work.

## Style

- TypeScript strict mode, no `any`.
- One export per data file mirrors the existing pattern.
- Keep prose in `description`/`narration` fields concise and neutral.
- Do not add cloud/backend/AI dependencies. This project is fully static by design.

## Licensing

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE) and that you have the right to license them under those terms.
