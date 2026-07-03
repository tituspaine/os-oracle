# Deployment

> **Authorised use only:** OS Oracle documents security tooling and testing workflows for legal, approved, and lab-based use. Deployment should support defensive education and authorised assessment work only.

## Overview

OS Oracle is designed to be easy to run, package, and publish because it is **offline by design** and has **no required backend services**. The operational model is intentionally simple:

- local development with Bun and Node.js
- npm distribution for the CLI
- GitHub Releases for versioned delivery
- GitHub Pages for static documentation/site publishing
- optional Docker packaging for portable CLI execution

## Local development

### Prerequisites

Recommended local tooling:

- **Bun** for installs and day-to-day scripts
- **Node.js 18+** for CLI compatibility, with Node 20 commonly used in CI
- **Git** for version control and tag-based releases

### Install dependencies

```bash
bun install
```

### Start local development

```bash
bun run dev
```

Use this during day-to-day content and UI work. For the web surface, contributors typically expect a local dev server; for CLI-focused work, this is also the fastest script entry point during iteration.

### Build the project

```bash
bun run build
```

Current build responsibilities include packaging the CLI entry point and copying JSON data into `dist/`.

### Lint the source

```bash
bun run lint
```

Run lint before opening a pull request or cutting a release.

## Build output

The repository uses `scripts/build.js` to prepare publishable artifacts.

### What the build script does

1. deletes the old `dist/` directory
2. copies `src/cli/index.js` to `dist/cli.js`
3. copies JSON data assets from `src/data/` into `dist/data/`

This makes `dist/` suitable for:

- npm package publishing
- `npx os-oracle`
- GitHub Pages artifact uploads in the current workflow
- container builds that want a minimal runtime payload

## npm publish workflow

The CLI is published as the `os-oracle` npm package.

### Standard release steps

1. update version metadata as needed
2. verify lint/build locally
3. create and push a semantic version tag such as `v1.2.3`
4. let GitHub Actions publish to npm automatically

### Manual local checks before release

```bash
bun install
bun run lint
bun run build
npm pack
```

`npm pack` is a useful dry run to confirm the package contains the expected CLI and data assets.

### Publish path in this repository

`package.json` defines:

- package name: `os-oracle`
- bin entry: `./dist/cli.js`

The release workflow then runs:

```bash
npm publish --access public
```

with `NODE_AUTH_TOKEN` sourced from the `NPM_TOKEN` GitHub secret.

## GitHub Release workflow

The project includes **`.github/workflows/release.yml`**.

### Trigger

A pushed tag matching:

```text
v*.*.*
```

Examples:

- `v1.0.0`
- `v1.1.4`
- `v1.2.0-beta.1`

### What `release.yml` does

1. checks out the repository
2. installs Bun
3. installs Node.js 20
4. installs dependencies
5. runs lint
6. runs build
7. publishes the package to npm
8. creates a GitHub Release entry

### Practical release example

```bash
git tag v1.2.0
git push origin v1.2.0
```

That tag push is what triggers the automation in `.github/workflows/release.yml`.

## GitHub Pages deployment

The project includes **`.github/workflows/docs.yml`** for documentation/static deployment.

### Trigger conditions

The workflow runs on:

- pushes to `main`
- changes under `docs/**`
- changes to root `*.md` files
- changes under `src/**`
- manual `workflow_dispatch`

### What `docs.yml` does

1. checks out the repository
2. installs Bun
3. installs dependencies
4. runs `bun run build`
5. configures GitHub Pages
6. uploads `dist/` as the deploy artifact
7. deploys to the `github-pages` environment

### Why this fits OS Oracle

The Pages deployment model matches the project philosophy:

- static artifacts
- no database
- no app server required
- no environment-specific backend configuration

## Docker

Docker is optional, but useful when you want a repeatable CLI environment for workshops, labs, or internal tooling images.

### Full example Dockerfile

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY scripts ./scripts
COPY src ./src

RUN npm install
RUN node scripts/build.js

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

ENTRYPOINT ["node", "dist/cli.js"]
CMD ["--help"]
```

### Build the image

```bash
docker build -t os-oracle:latest .
```

### Run examples

```bash
docker run --rm os-oracle:latest --help
docker run --rm os-oracle:latest search "nmap"
docker run --rm os-oracle:latest tool sqlmap --commands
```

### Persist bookmarks and history

If you want bookmarks/history to survive container deletion, mount a home directory path that preserves `~/.os-oracle/`.

Example:

```bash
docker run --rm \
  -v "$HOME/.os-oracle:/root/.os-oracle" \
  os-oracle:latest bookmark list
```

## Environment variables

### Required runtime variables

**None.**

OS Oracle is intentionally **offline by design** and does not require:

- API keys
- database URLs
- auth secrets
- SaaS endpoints
- telemetry tokens

### CI/CD secrets

While the app itself needs no runtime environment variables, GitHub automation may require repository secrets such as:

- `NPM_TOKEN` for npm publishing

These are release-pipeline secrets, not application runtime requirements.

## CI/CD pipeline explanation

The repository contains four key workflows.

### `ci.yml`

Purpose:

- validate pushes and pull requests to `main`
- run the standard quality gate

Behavior:

- matrix over Node 20.x and 22.x
- installs Bun
- installs Node
- runs `bun install --frozen-lockfile`
- runs `bun run lint`
- runs `bun run build`

Why it matters:

- catches packaging and code-quality regressions early
- ensures the offline reference corpus still builds cleanly

### `release.yml`

Purpose:

- publish tagged releases to npm
- create a GitHub Release automatically

Behavior:

- triggered by `v*.*.*` tags
- runs lint/build before publish
- publishes with `npm publish --access public`
- creates a GitHub Release with generated notes

Why it matters:

- keeps versioned CLI delivery repeatable
- ties npm publication directly to Git tags

### `docs.yml`

Purpose:

- build and deploy the static documentation/site artifact to GitHub Pages

Behavior:

- runs on doc/source changes and manual dispatch
- uploads `dist/` as the Pages artifact
- deploys to the `github-pages` environment

Why it matters:

- preserves a static-hosting model
- avoids introducing backend infrastructure just for docs/site delivery

### `security.yml`

Purpose:

- continuously assess code and dependency risk

Behavior:

- **CodeQL** analysis for JavaScript/TypeScript
- **dependency review** on pull requests
- **OSV scan** against the repository and lockfile

Why it matters:

- aligns with the project's low-trust, security-conscious posture
- helps protect a tool used by security practitioners

## Deployment patterns

### 1. Local-only operator workstation

Best for:

- independent researchers
- cert prep
- CTF and lab study
- air-gapped or restricted environments

Flow:

```bash
bun install
bun run build
node dist/cli.js search "privilege escalation"
```

### 2. npm-distributed CLI

Best for:

- teams standardizing on a simple install method
- workshop attendees
- internal developer tooling portals

Flow:

```bash
npm install -g os-oracle
os-oracle --help
```

### 3. Static Pages deployment

Best for:

- public project docs
- internal read-only reference portal
- training cohorts needing browser access to a static knowledge base

Flow:

- push to `main`
- let `docs.yml` build and publish the artifact

### 4. Dockerized CLI

Best for:

- reproducible workshop environments
- ephemeral lab runners
- container-based toolboxes

Flow:

```bash
docker build -t os-oracle:latest .
docker run --rm os-oracle:latest search "metasploit"
```

## Security and compliance notes

Because OS Oracle covers offensive security topics, deployment guidance should preserve the project's guardrails:

- use only in authorised contexts
- avoid bundling it into unauthorised automation platforms
- preserve the disclaimer and ethics framing in downstream deployments
- prefer isolated lab/demo environments when training others

## Summary

OS Oracle deployment is intentionally straightforward:

- develop locally with Bun
- package with the existing build script
- publish the CLI to npm via tag-driven GitHub Actions
- deploy static artifacts through GitHub Pages
- optionally run the CLI in Docker

No backend, no runtime secrets, and no cloud dependency are required for core functionality.
