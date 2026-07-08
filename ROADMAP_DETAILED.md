# Detailed Roadmap

> This roadmap describes the intended evolution of OS Oracle as an **offline-first ethical hacking knowledge platform**. All milestones assume continued alignment with the project's safety posture: **authorized use only, no malware, no exploit hosting, no credential harvesting**.

## Planning assumptions

- Dates are directional, not contractual.
- Content growth never outranks accuracy, ethics, or maintainability.
- Community expansion is gated by review quality and moderation capacity.

## Q3 2025 — Foundation

**Theme:** establish a stable, trustworthy baseline.

### Milestones

- Ship **CLI v1.0** for offline reference usage.
- Reach **100+ Kali tools** with command and error coverage.
- Reach **50+ playbooks** with defensive context.
- Reach **15+ distro profiles**.
- Finalize **GitHub Actions** for CI, docs, release, and security scanning.

### Success criteria

- Core search and content routes are stable.
- `bun run build` and `bun run lint` are wired into CI.
- Project governance, maintainer, and contributor docs are published.
- Every major content type includes explicit authorized-use framing.

## Q4 2025 — Content

**Theme:** depth and discoverability.

### Milestones

- Expand to **200+ tools**.
- Expand to **100+ playbooks**.
- Build out a **walkthrough library** for common lab scenarios.
- Improve **CLI search relevance**, aliases, and synonym coverage.

### Success criteria

- Search handles intent, not only exact string matches.
- Popular tool families have at least one deep, hand-authored entry.
- Walkthroughs consistently include expected output, observation, and mitigation context.
- Docs for adding content are mature enough for repeat external contribution.

## Q1 2026 — Community

**Theme:** structured participation.

### Milestones

- Launch a **contributor portal** experience in the docs/site.
- Add a **content validation pipeline** for data integrity and review hygiene.
- Introduce a **community forum route** or Discussions-oriented landing page.

### Success criteria

- New contributors can add tools/playbooks without reverse-engineering the repository.
- Validation catches broken slugs, missing fields, and bad cross-references early.
- Governance and moderation expectations are visible and enforceable.

## Q2 2026 — Scale

**Theme:** reliability at larger content volume.

### Milestones

- Reach **500+ tools**.
- Reach **250+ playbooks**.
- Add **data validation with Zod**.
- Introduce richer **full-text search** behavior.

### Success criteria

- Content schema validation becomes part of the normal build pipeline.
- Search remains fast despite significantly larger offline datasets.
- Tool/playbook/walkthrough cross-linking remains stable under growth.
- Invalid content is blocked before publication.

## Q3 2026 — Platform

**Theme:** package the knowledge base for more environments.

### Milestones

- Publish a **Web API** for approved local/self-hosted consumption.
- Ship a **mobile PWA** for offline reading.
- Publish an official **Docker image**.
- Release **npm package v2** with improved packaging and search ergonomics.

### Success criteria

- Offline-first behavior remains a first-class design constraint.
- Web, CLI, and package surfaces share the same canonical content model.
- Deployment artifacts remain easy to audit and self-host.

## Q4 2026 — Enterprise

**Theme:** operational adoption without compromising project values.

### Milestones

- Support **enterprise self-hosting**.
- Add **LDAP/SSO** integration for approved internal deployments.
- Add **audit logging** for administrative and publishing actions.

### Success criteria

- Organizations can run the platform privately without cloud dependence.
- Administrative controls are suitable for regulated internal environments.
- Security-sensitive workflow changes remain reviewable and observable.

## Long-term vision

OS Oracle aims to become a trusted, offline, community-maintained security reference with:

- **1M+ commands** across tools, platforms, and defensive workflows
- **AI-assisted search** that improves retrieval while preserving offline-first operation where possible
- **community-contributed playbooks** reviewed under strong ethics and quality controls
- a durable content pipeline that favors **accuracy, attribution, and safety** over hype

## Non-goals

The project does **not** aim to become a platform for:

- cloud storage or online account lock-in
- credential harvesting workflows
- exploit hosting or payload distribution
- malware samples, ransomware kits, or botnet tooling
- content that encourages unauthorized intrusion

## Cross-cutting priorities

These priorities apply in every quarter:

1. **Authorized use only** — the legal framing stays prominent.
2. **Offline-first architecture** — local access remains core.
3. **Source-backed content** — commands, errors, and playbooks should remain attributable.
4. **Contributor ergonomics** — the repo should get easier to extend over time.
5. **Defender context** — detection and mitigation should grow alongside offensive reference material.
