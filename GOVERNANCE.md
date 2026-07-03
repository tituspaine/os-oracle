# Governance

> OS Oracle uses a **BDFL + community** governance model. The project welcomes discussion and contribution, while final responsibility for safety, scope, and release quality remains with the lead maintainer.

## Governance model

- **BDFL (Benevolent Dictator For Life):** `@tituspaine` acts as final decision-maker when consensus is unclear or time-sensitive.
- **Community input:** contributors and reviewers are encouraged to propose changes, challenge assumptions, and submit RFCs.
- **Maintainer stewardship:** maintainers translate community input into reviewed, mergeable, release-quality changes.

## Decision-making process

The default path is:

1. **Consensus** — discuss in a PR, issue, or RFC thread.
2. **Vote** — if a maintainer group exists and consensus stalls, maintainers may take a documented vote.
3. **Maintainer decision** — if the matter remains unresolved, the lead maintainer makes the final call.

This order is intentional: collaboration first, escalation second, final authority last.

## What requires broader discussion

The following should not be merged casually:

- major schema changes
- changes to legal or ethics framing
- new dependency or packaging strategies
- governance/process changes
- search architecture changes that affect discoverability across the repository
- any content direction that could materially widen the project's risk surface

## RFC process

For major changes, open an RFC issue or PR that includes:

1. **Problem statement**
2. **Motivation**
3. **Proposed design**
4. **Alternatives considered**
5. **Risks and safety considerations**
6. **Migration or rollout plan**

RFCs should stay open long enough for meaningful review before a final decision is made.

## Security policy reference

Security issues in the codebase should follow [`SECURITY.md`](./SECURITY.md).

Key rule:

- Do **not** disclose repository vulnerabilities publicly before maintainers have had a chance to assess and remediate them.

## Code of conduct enforcement

Community behavior is governed by [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

Enforcement principles:

- protect contributors and maintainers from harassment
- de-escalate when possible
- act quickly when safety or project integrity is at risk
- preserve the project's authorized-use and educational framing

Enforcement actions may include comment moderation, PR closure, temporary participation limits, or bans for repeated or severe violations.

## Release authority

Release authority belongs to the maintainers, with final release approval resting with the lead maintainer.

A release should only proceed when:

- review is complete
- critical CI checks are green or understood
- security issues are triaged
- documentation and changelog updates are ready when applicable

## Governance values

This project optimizes for:

- clarity over ambiguity
- safety over shock value
- maintainability over content sprawl
- community participation with accountable final ownership
