# distro/ref — Linux & Kali reference + ethical security testing handbook

> **Authorised testing, education, and defence only.** Every command, playbook, and walkthrough in this
> repository is provided for **authorised** security testing, learning, and defensive purposes.
> Use against systems you do not own or lack **explicit written permission** to test is illegal and
> unethical. See [`DISCLAIMER.md`](./DISCLAIMER.md) and the in-app `/ethics` page.

An offline, static, client-side reference for:

- Every mainstream Linux distribution (Debian/Ubuntu, RHEL/Fedora/Rocky/Alma, Arch/Manjaro, openSUSE,
  Alpine, Gentoo, Slackware, NixOS, Kali) with real commands, examples, and known errors.
- The Kali Linux tool catalog — hundreds of tools, each with commands, flags, invocation
  examples, and common failure messages.
- A security-testing playbook: dozens of exploitation, post-exploitation, business-logic, cloud,
  Active Directory, wireless, mobile, IoT, and container scenarios.
- Narrated **play-by-play walkthroughs** — step-by-step, copy-pasteable, lab-only dry runs with
  expected output and branching decisions.
- An intent-based fuzzy search that maps natural-language questions ("how do I audit a Wi-Fi
  network?") to the right playbook, tool, or command.

No backend. No AI. No cloud. Everything is static TypeScript data + client-side
[Fuse.js](https://fusejs.io/).

## Screenshots

Placeholders live in [`docs/screenshots/`](./docs/screenshots) — add real captures before publishing.

## Quickstart

```bash
bun install
bun dev
# open http://localhost:8080
```

Node 20+ works too:

```bash
npm install
npm run dev
```

## Scripts

| Script           | What it does                     |
| ---------------- | -------------------------------- |
| `bun dev`        | Start Vite dev server on `:8080` |
| `bun run build`  | Production build                 |
| `bun run lint`   | ESLint the codebase              |
| `bun run format` | Prettier-format the codebase     |

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7, SSR-capable)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) primitives
- [Fuse.js](https://fusejs.io/) for fuzzy + intent search
- [lucide-react](https://lucide.dev/) icons

## Where the content lives

| File                                                  | What's inside                                     |
| ----------------------------------------------------- | ------------------------------------------------- |
| `src/data/types.ts`                                   | Shared types (`Command`, `KnownError`, `Distro`…) |
| `src/data/common-commands.ts`                         | Cross-distro core Linux commands                  |
| `src/data/distros.ts`                                 | Per-distro metadata + distro-specific commands    |
| `src/data/kali-{shallow,deep,extra,extra2,extra3}.ts` | Kali tool catalog                                 |
| `src/data/hacking.ts`                                 | Core exploitation playbooks                       |
| `src/data/playbooks-extra.ts`                         | Business-logic, cloud, AD, mobile, IoT playbooks  |
| `src/data/walkthroughs.ts`                            | Narrated play-by-play scenarios                   |
| `src/data/search-synonyms.ts`                         | Intent map + query expansion                      |

## Contributing

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md). Every content PR must include:

1. A source citation (man page, official docs, CVE reference, tool README).
2. An **ethics attestation** — the checklist in the PR template.
3. Tests where relevant (typecheck must pass).

See also [`docs/data-model.md`](./docs/data-model.md) and [`docs/adding-content.md`](./docs/adding-content.md).

## Community scaling

- The in-app [`/community`](./src/routes/community.tsx) page documents the safest expansion plan:
  structured submission types, approval workflow, security review gates, and the highest-value
  areas still to build out.
- GitHub issue forms now cover:
  - new Kali tool commands
  - new playbooks / walkthroughs
  - error-message fixes
  - high-value external resources
- The contribution model stays **static by design**: no live uploads, no runtime code execution,
  and no auto-publishing path that bypasses maintainers.

## Security

To report a vulnerability **in this codebase**, see [`SECURITY.md`](./SECURITY.md).
This project does not host any exploit payloads, malware, or offensive infrastructure.

## License

[MIT](./LICENSE). Third-party notices in [`NOTICE.md`](./NOTICE.md).

## Acknowledgements

- The Kali Linux and Offensive Security teams for the tool metadata that inspired the catalog.
- The maintainers of every open-source tool documented here.
- The security community whose write-ups, CVEs, and lab environments make ethical training possible.
