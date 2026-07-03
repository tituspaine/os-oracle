# Security policy

## Reporting a vulnerability **in this codebase**

This project is a static reference application. It has no backend, no auth, no user data, and no
network egress at runtime. That said, if you discover a vulnerability in this codebase (e.g. an
XSS in the rendered content, a supply-chain issue in a dependency, or a way for the client-side
app to leak local state), please **do not open a public issue**.

Instead:

1. Open a private **GitHub Security Advisory** on the repository (Security → Advisories → New
   draft security advisory).
2. If you cannot use GitHub Security Advisories, open an issue titled `SECURITY: contact request`
   with **no vulnerability details**, and a maintainer will reach out privately.

We aim to acknowledge reports within **72 hours** and to publish a fix (or a mitigating advisory)
within **30 days** for confirmed issues.

## Scope

**In scope**

- The web application in `src/`.
- The published static bundle.
- Direct dependencies pinned in `package.json`.

**Out of scope**

- The security of any third-party tool, exploit, CVE, or technique **documented** by this project.
  Report those to the respective upstream projects and CVE authorities.
- Speculative "this could be misused" reports about documented content — see
  [`DISCLAIMER.md`](./DISCLAIMER.md).

## Safe-harbour

Good-faith security research on this repository — including reviewing the source, running a local
copy, and running standard SAST/DAST against a local build — is welcome and will not be pursued.
Do not test against any production deployment you do not own without permission.

## Coordinated disclosure

We follow a **90-day coordinated disclosure** window. If you plan to publish, please give us a
heads-up so a fix can ship first.
