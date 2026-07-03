# FRAMEWORKS

> ⚠️ All resources and techniques are for authorized, legal security testing only.
>
> Frameworks help organize lawful assessment work, communicate risk clearly, and avoid ad hoc testing that misses critical evidence.

This reference summarizes major security frameworks and shows how pentesters can use them practically, not just cite them.

## OWASP Top 10 (2021)

The OWASP Top 10 is a high-level awareness list of common web application risk categories. It is best used to guide coverage, explain findings to stakeholders, and map tactical test cases to business-friendly language.

### A01:2021 - Broken Access Control

- **Description:** Users can act outside intended permissions.
- **Examples:** IDOR, forced browsing, privilege escalation via missing server-side checks, tenant breakout.
- **Mitigations:** Enforce authorization server-side, deny by default, centralize access checks, log sensitive actions, and test role boundaries.
- **Pentester use:** During web/API testing, create horizontal and vertical privilege matrices and explicitly test object ownership and admin-only actions.

### A02:2021 - Cryptographic Failures

- **Description:** Sensitive data is exposed because cryptography is missing, weak, or misused.
- **Examples:** Plaintext secrets, weak TLS settings, static IV reuse, homegrown crypto, bad password storage.
- **Mitigations:** Use modern libraries, strong password hashing, correct key management, and current TLS configurations.
- **Pentester use:** Check data in transit, at rest, and in client storage; review whether secret handling matches the sensitivity of the asset.

### A03:2021 - Injection

- **Description:** Untrusted input is interpreted as code or commands.
- **Examples:** SQL injection, command injection, LDAP injection, template injection.
- **Mitigations:** Parameterized queries, allowlists, safe APIs, output encoding, least privilege, and sandboxing.
- **Pentester use:** Map input sinks, then test where application logic crosses trust boundaries into interpreters or backend services.

### A04:2021 - Insecure Design

- **Description:** Security weaknesses stem from design decisions, not just coding mistakes.
- **Examples:** Missing rate limits, insecure password reset flows, unsafe multi-step approvals, no abuse case consideration.
- **Mitigations:** Threat modeling, secure design reviews, misuse-case testing, and reference architectures.
- **Pentester use:** Look for business logic flaws and workflow abuse that scanners usually miss.

### A05:2021 - Security Misconfiguration

- **Description:** Unsafe defaults, unnecessary features, or poor deployment hardening create exposure.
- **Examples:** Debug mode, exposed admin panels, verbose errors, open cloud buckets, default credentials.
- **Mitigations:** Harden builds, minimize surface area, automate configuration review, and standardize secure baselines.
- **Pentester use:** Enumerate environment-specific exposure, not just application routes.

### A06:2021 - Vulnerable and Outdated Components

- **Description:** Libraries, frameworks, or services contain known exploitable weaknesses.
- **Examples:** Unpatched CMS plugins, stale JavaScript packages, exposed appliances with KEV-listed flaws.
- **Mitigations:** Asset inventory, dependency scanning, patch SLAs, and software composition analysis.
- **Pentester use:** Cross-reference version info with [NVD](./RESOURCES.md#cve--vulnerability-databases), [OSV.dev](./RESOURCES.md#cve--vulnerability-databases), and vendor advisories.

### A07:2021 - Identification and Authentication Failures

- **Description:** Authentication or session handling lets attackers impersonate users.
- **Examples:** Credential stuffing success, weak MFA flows, insecure password reset, session fixation.
- **Mitigations:** Strong auth, MFA, secure session lifecycle, throttling, and anomaly monitoring.
- **Pentester use:** Test login, recovery, registration, MFA enrollment, token invalidation, and session rotation.

### A08:2021 - Software and Data Integrity Failures

- **Description:** The application trusts code or data without verifying integrity.
- **Examples:** Unsigned updates, insecure deserialization, compromised CI/CD artifacts, unsafe dependency mirrors.
- **Mitigations:** Signature verification, trusted pipelines, dependency pinning, and integrity validation.
- **Pentester use:** Review update mechanisms, serialization paths, webhook trust, and CI artifact flows.

### A09:2021 - Security Logging and Monitoring Failures

- **Description:** Detection, alerting, and response evidence is missing or inadequate.
- **Examples:** No auth failure logging, no alerting on privilege changes, logs without useful context.
- **Mitigations:** Centralized logging, tuned alerts, retention policy, time sync, and incident playbooks.
- **Pentester use:** Include what should have been logged or detected in findings, not just what was exploitable.

### A10:2021 - Server-Side Request Forgery (SSRF)

- **Description:** A server fetches attacker-controlled destinations, often reaching internal services.
- **Examples:** Metadata service access, internal HTTP pivoting, protocol smuggling through fetch features.
- **Mitigations:** Egress filtering, URL allowlists, network segmentation, metadata protection, and strict fetch design.
- **Pentester use:** Test image importers, webhooks, PDF renderers, URL previews, and cloud metadata reachability.

### Practical OWASP Top 10 Workflow

1. Use the Top 10 to build a coverage checklist before testing.
2. Map every finding to one or more categories for stakeholder readability.
3. Use it as a communication layer, not a substitute for deep methodology such as WSTG.

## MITRE ATT&CK

MITRE ATT&CK organizes adversary behavior into **tactics** (the why) and **techniques/sub-techniques** (the how). It is not a pentest checklist by itself; it is a shared language for describing attacker tradecraft and defensive coverage.

### Core tactic overview

- **Reconnaissance** — Gathering information about the target.
- **Resource Development** — Preparing infrastructure, accounts, and tooling.
- **Initial Access** — Gaining the first foothold.
- **Execution** — Running malicious code.
- **Persistence** — Maintaining access.
- **Privilege Escalation** — Gaining higher permissions.
- **Defense Evasion** — Avoiding detection and controls.
- **Credential Access** — Obtaining passwords, tokens, or keys.
- **Discovery** — Learning the environment.
- **Lateral Movement** — Moving to other hosts/accounts.
- **Collection** — Gathering target data.
- **Command and Control** — Communicating with controlled infrastructure.
- **Exfiltration** — Removing data.
- **Impact** — Disrupting, encrypting, or destroying.

### How to use ATT&CK for pentesting

- Map lab actions to techniques so reports speak the same language as blue teams.
- Use ATT&CK to propose detection engineering opportunities, not just exploitation proof.
- Design purple-team exercises around specific techniques such as credential dumping, Kerberoasting, or valid account abuse.
- Compare a client’s EDR/SIEM coverage against techniques used during testing.

### Practical example

If a test includes phishing simulation, PowerShell execution, LSASS credential access, remote service creation, and data staging, map those actions to ATT&CK tactics and techniques in the final report. That helps defenders see which telemetry, playbooks, and controls mattered most.

## PTES (Penetration Testing Execution Standard)

PTES is a methodology framework for planning and executing penetration tests consistently.

### Phases

1. **Pre-engagement interactions** — Scope, authorization, objectives, rules of engagement, success criteria, communication paths.
2. **Intelligence gathering** — Passive and active recon within scope.
3. **Threat modeling** — Prioritize likely attack paths based on target profile and business context.
4. **Vulnerability analysis** — Validate weaknesses, configurations, and exposures.
5. **Exploitation** — Gain controlled proof of impact.
6. **Post-exploitation** — Demonstrate realistic access, pivoting, data exposure, and persistence risk as authorized.
7. **Reporting** — Document evidence, business impact, remediation, and detection recommendations.

### How pentesters use PTES

- Turn it into a project plan before testing begins.
- Avoid common mistakes like testing before authorization is clear.
- Use it to structure field notes so reports write themselves more easily.

### Practical example

For an internal network test, PTES helps separate “we found SMB signing disabled” from “we exploited this to move laterally and access sensitive data.” The methodology preserves narrative and business impact.

## OWASP Web Security Testing Guide (WSTG)

WSTG is the detailed web testing methodology that turns broad OWASP categories into concrete checks.

### Major testing categories

- **Information Gathering** — Fingerprinting, discovery, and application mapping.
- **Configuration and Deployment Management Testing** — Debug features, exposed files, hardening gaps.
- **Identity Management Testing** — Registration, account lifecycle, enumeration.
- **Authentication Testing** — Login, MFA, password recovery, session handling.
- **Authorization Testing** — Access control and privilege boundaries.
- **Session Management Testing** — Token entropy, invalidation, fixation, transport.
- **Input Validation Testing** — Injection and parsing flaws.
- **Error Handling** — Sensitive data leakage and behavior clues.
- **Cryptography Testing** — Sensitive data handling and cryptographic misuse.
- **Business Logic Testing** — Workflow abuse, race conditions, hidden assumptions.
- **Client-side Testing** — DOM issues, storage, browser behavior, JavaScript logic.
- **API / modern app overlap** — WSTG principles also apply to SPA/API patterns even when routes are JSON-heavy.

### How pentesters use WSTG

- Convert categories into a repeatable test checklist.
- Track coverage so important classes of weakness are not skipped.
- Map findings back to a recognized methodology clients understand.

### Practical example

During a GraphQL/API engagement, WSTG still applies: identity, authz, input validation, business logic, and error handling remain central even if the transport differs from classic form-based apps.

## CVSS Scoring

CVSS helps communicate severity in a structured way, but it should not replace context.

### Core scoring concepts

- **Base metrics** — Intrinsic severity: attack vector, attack complexity, privileges required, user interaction, scope, confidentiality, integrity, availability.
- **Temporal metrics** — Maturity of exploit code, remediation level, report confidence.
- **Environmental metrics** — Organization-specific importance and control context.

### Practical calculation approach

1. Identify how the attack starts: network, adjacent, local, or physical.
2. Assess whether special conditions or user interaction are required.
3. Score the impact to confidentiality, integrity, and availability.
4. Adjust for environment if the affected asset is especially sensitive or well-compensated.

### How pentesters use CVSS well

- Score consistently, but pair the score with a plain-English business impact statement.
- Explain when an apparently medium issue is strategically high risk because of asset value or exploit chaining.
- Avoid inflating scores when preconditions materially limit exploitation.

## Lockheed Martin Cyber Kill Chain

The Kill Chain models intrusion as a sequence of attacker phases. It is older and more linear than ATT&CK, but still useful for explaining where controls can break an attack path.

### Phases

1. **Reconnaissance**
2. **Weaponization**
3. **Delivery**
4. **Exploitation**
5. **Installation**
6. **Command and Control**
7. **Actions on Objectives**

### How pentesters use it

- Show where a client could have stopped or detected an attack earlier.
- Explain phishing, malware delivery, and post-exploitation in a way executives quickly grasp.
- Compare offensive exercise steps to defensive choke points.

### Practical example

In a phishing-led assessment, email filtering may fail at delivery, but EDR or segmentation may still stop installation, C2, or objective completion. The Kill Chain is useful for narrating those breakpoints.

## Diamond Model of Intrusion Analysis

The Diamond Model focuses on relationships between four core elements:

- **Adversary**
- **Infrastructure**
- **Capability**
- **Victim**

### Why it matters to pentesters

- It helps structure threat emulation scenarios around realistic attacker infrastructure and capability choices.
- It encourages analysts to connect tooling, victim context, and infrastructure dependencies rather than thinking about single indicators in isolation.
- It is especially useful when translating red-team observations for threat hunters and intelligence teams.

### Practical example

If you simulate password spraying from cloud-hosted infrastructure using a known commodity toolset against a specific business unit, the Diamond Model helps document not just the action, but the attacker capability, infrastructure choices, and victim targeting assumptions.

## NIST Cybersecurity Framework (CSF)

NIST CSF organizes security outcomes into high-level functions. In newer versions, **Govern** joins the original operational functions.

### Functions

- **Govern** — Strategy, policy, oversight, and accountability.
- **Identify** — Asset, business, and risk understanding.
- **Protect** — Safeguards that prevent or reduce impact.
- **Detect** — Visibility and alerting.
- **Respond** — Action during incidents.
- **Recover** — Restoration and improvement.

### How pentesters use NIST CSF

- Tie findings to control outcomes instead of presenting a raw list of bugs.
- Show leadership whether weaknesses are primarily governance, preventive, detective, or response gaps.
- Turn a pentest report into a roadmap with both technical fixes and program improvements.

### Practical example

A report that finds exposed admin panels, weak MFA, poor alerting, and incomplete incident playbooks can map those respectively into Protect, Protect, Detect, and Respond/Recover gaps. That framing makes remediation planning easier for leadership.

## Choosing the Right Framework in Practice

- **Use OWASP Top 10** for high-level web risk communication.
- **Use WSTG** for detailed web test coverage.
- **Use PTES** for overall pentest lifecycle structure.
- **Use ATT&CK** for adversary behavior mapping and purple-team value.
- **Use CVSS** for severity consistency.
- **Use Kill Chain and Diamond Model** for intrusion narrative and defender communication.
- **Use NIST CSF** when stakeholders need a program-level remediation lens.

The best pentest reports often combine several of these: PTES for structure, WSTG for test execution, OWASP Top 10 for accessibility, ATT&CK for adversary mapping, and NIST CSF for remediation prioritization.
