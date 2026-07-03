# OS Oracle — Scaling Roadmap

> A comprehensive, prioritized plan for scaling OS Oracle into the definitive global knowledge platform for ethical hackers and security professionals.

---

## Table of Contents

1. [Content & Knowledge Base](#1-content--knowledge-base)
2. [Code Architecture & Scalability](#2-code-architecture--scalability)
3. [Community & Contribution Infrastructure](#3-community--contribution-infrastructure)
4. [UI/UX Enhancements](#4-uiux-enhancements)
5. [DevOps & Deployment](#5-devops--deployment)
6. [Developer Experience](#6-developer-experience)
7. [Documentation & Resources](#7-documentation--resources)
8. [Business & Sustainability](#8-business--sustainability)

---

## Priority Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Critical / Do first |
| 🟠 | High priority |
| 🟡 | Medium priority |
| 🟢 | Nice to have / Long-term |

---

## 1. Content & Knowledge Base

### Kali Linux Tool Coverage Gaps

**Current State:** Deep entries for ~15–20 tools, shallow entries for ~100+ tools generated via factory functions.

| Priority | Gap | Action |
|----------|-----|--------|
| 🔴 | Upgrade shallow tool entries to deep format | Add 3+ real commands, 3+ real errors per tool |
| 🔴 | Network reconnaissance tools | nmap advanced usage, masscan, netdiscover, arp-scan |
| 🔴 | Web application testing | Burp Suite CLI, nikto, gobuster, ffuf, wfuzz |
| 🟠 | Password attacks | hashcat GPU usage, john complex rules, hydra advanced modes |
| 🟠 | Post-exploitation | Empire, Covenant, Sliver C2 framework basics |
| 🟠 | Wireless security | aircrack-ng full workflow, bettercap, wifite |
| 🟡 | Forensics tools | volatility3, autopsy CLI, binwalk advanced |
| 🟡 | Reverse engineering | ghidra scripting, radare2 full reference, pwndbg |
| 🟡 | Social engineering | SET (Social Engineering Toolkit) full reference |
| 🟢 | Mobile security | apktool, jadx, frida instrumentation |
| 🟢 | Cloud security tools | pacu (AWS), ScoutSuite, Prowler |
| 🟢 | Container security | trivy, grype, syft, falco |

**Implementation:** Convert shallow tools using the `KaliTool` interface — see `src/data/types.ts`.  
**Target:** 200+ deep-format tool entries within first 6 months of open-source launch.

---

### Playbook Prioritization

Focus new playbooks on the highest-educational-value attack categories:

| Priority | Category | Rationale |
|----------|----------|-----------|
| 🔴 | Active Directory attacks | Most common enterprise target; AD compromise = org compromise |
| 🔴 | Web application (OWASP Top 10) | Most requested by pentesters and students |
| 🔴 | Privilege escalation (Linux + Windows) | Core skill, always relevant |
| 🟠 | Cloud environment attacks (AWS/Azure/GCP) | Fastest-growing attack surface |
| 🟠 | Phishing and initial access | Realistic entry-point scenarios |
| 🟠 | Internal network pivoting | Lateral movement techniques |
| 🟡 | Container/Kubernetes escapes | Growing relevance in modern infra |
| 🟡 | API security testing | REST/GraphQL attack patterns |
| 🟡 | Ransomware simulation (defensive) | Detection and response training |
| 🟢 | ICS/SCADA basics | Niche but high-value for industrial security |
| 🟢 | Mobile application testing | Android/iOS pentest workflows |

---

### Walkthrough Scenarios

High-value narrated walkthroughs to add:

| Priority | Scenario |
|----------|----------|
| 🔴 | HackTheBox/TryHackMe-style box walkthrough template |
| 🔴 | Full AD lab: from initial foothold to DA |
| 🔴 | OWASP WebGoat / DVWA step-by-step |
| 🟠 | AWS misconfiguration exploitation (lab) |
| 🟠 | Metasploit full workflow (service scan → shell → post) |
| 🟠 | Phishing simulation with Gophish |
| 🟡 | Docker escape techniques (lab) |
| 🟡 | OSINT deep dive walkthrough |
| 🟢 | CTF strategy walkthrough (binary exploitation basics) |

---

### External Integration Opportunities

| Priority | Integration | Description |
|----------|------------|-------------|
| 🟠 | MITRE ATT&CK | Tag each playbook/tool with ATT&CK technique IDs (T-numbers). Link out to https://attack.mitre.org. |
| 🟠 | CVE Database | Link known error scenarios and vulnerability exploitation playbooks to NVD/CVE records |
| 🟡 | OWASP | Cross-reference web playbooks with OWASP Testing Guide sections |
| 🟡 | HackTricks | Reference and attribution for technique descriptions |
| 🟢 | CWE | Map tool capabilities to Common Weakness Enumerations |
| 🟢 | D3FEND | Cross-reference mitigation sections with MITRE D3FEND |

---

### Community Content Submission Workflow

```
1. Contributor forks repo
2. Uses content template (see /docs/adding-content.md)
3. Runs local lint: bun run lint
4. Opens PR with completed checklist
5. Maintainer reviews for accuracy, ethics, formatting
6. CI runs automated quality checks
7. Merge to main → auto-deployed
```

**Add a `content-submission` PR template** at `.github/PULL_REQUEST_TEMPLATE/content.md` for new data entries, separate from code change PRs.

---

## 2. Code Architecture & Scalability

### Performance Optimizations

| Priority | Item | Implementation |
|----------|------|----------------|
| 🔴 | Paginate large data lists | Add `usePagination` hook; show 20 items/page on kali index |
| 🔴 | Virtualize long lists | Use `@tanstack/react-virtual` for tool/playbook lists >100 items |
| 🟠 | Fuse.js index pre-warming | Build the Fuse index once at module load, not on each keystroke |
| 🟠 | Debounce search input | Already partially done; ensure 150ms debounce on all search inputs |
| 🟠 | Route-based code splitting | Add `lazy()` wrapping around heavy route components |
| 🟡 | Tree-shaking audit | Ensure unused Radix UI components are not bundled |
| 🟡 | Bundle size analysis | Add `rollup-plugin-visualizer` to analyze bundle composition |
| 🟢 | Web Worker for search | Move Fuse.js indexing/search to a Web Worker for large datasets |

---

### Caching Strategies

| Priority | Cache Target | Strategy |
|----------|-------------|----------|
| 🟠 | Static asset caching | Configure Cache-Control headers: `max-age=31536000, immutable` for hashed assets |
| 🟠 | HTML caching | Short-lived cache (`max-age=60`) for HTML with stale-while-revalidate |
| 🟡 | Service Worker | Pre-cache app shell + critical data for offline usage |
| 🟡 | TanStack Query | Add `staleTime: Infinity` for static data since all content is static |

---

### Build Time Optimization

- Enable Vite's `build.minify: 'esbuild'` (already default in Vite 5+)
- Investigate `lightningcss` for CSS minification (already a transitive dep)
- Add `build.reportCompressedSize: false` to speed up CI builds
- Consider splitting `kali-extra.ts` / `kali-extra2.ts` / `kali-extra3.ts` into a single lazy-loaded module

---

### SEO / Metadata Improvements

| Priority | Item | Implementation |
|----------|------|----------------|
| 🔴 | Per-page `<title>` and `<meta description>` | Each tool/playbook/distro page should have unique head tags |
| 🔴 | Structured data (JSON-LD) | Add `HowTo` / `TechArticle` schema for tool pages |
| 🟠 | Open Graph images | Generate OG images per content type |
| 🟠 | Sitemap generation | Auto-generate `sitemap.xml` at build time from data |
| 🟠 | Canonical URLs | Add `<link rel="canonical">` on all pages |
| 🟡 | robots.txt | Add `public/robots.txt` with sitemap reference |
| 🟡 | Breadcrumb schema | Add JSON-LD breadcrumbs for navigation context |

---

## 3. Community & Contribution Infrastructure

### GitHub Issue Templates

Create `.github/ISSUE_TEMPLATE/`:

```
bug_report.yml          — App bugs (rendering, navigation, search)
content_error.yml       — Wrong command, bad example, outdated info
new_tool_request.yml    — Request a new Kali tool entry
new_playbook_request.yml — Request a new attack playbook
feature_request.yml     — UI/UX/functionality features
```

---

### PR Review Checklist

Add `.github/PULL_REQUEST_TEMPLATE.md` with:

```markdown
## Type of Change
- [ ] Bug fix
- [ ] New content (tool/playbook/walkthrough/distro)
- [ ] UI/UX improvement
- [ ] Documentation update
- [ ] Refactoring / performance

## Content Changes (if applicable)
- [ ] All commands are real and tested (or clearly marked as lab-only)
- [ ] Error messages include cause and fix
- [ ] Includes ethical use disclaimer where relevant
- [ ] Source citations added
- [ ] No personally identifiable information or real targets

## Code Changes (if applicable)
- [ ] `bun run lint` passes
- [ ] TypeScript compiles without errors
- [ ] No new dependencies added without discussion

## Testing
- [ ] Manually tested in browser
- [ ] Tested on mobile viewport
```

---

### CI/CD Gating

Enhance `.github/workflows/` with:

| Check | Tool | Gate |
|-------|------|------|
| TypeScript compile | `tsc --noEmit` | Block merge |
| ESLint | `bun run lint` | Block merge |
| Content schema validation | Custom Zod script | Block merge |
| Bundle size check | Size-limit | Warn on >10% increase |
| Link checking | `lychee` or `markdown-link-check` | Warn |
| CodeQL security scan | Already present | Block merge |

---

### Contributor Onboarding Process

1. **Welcome bot** — Auto-comment on first-time contributor PRs with resources
2. **Good first issues** — Maintain 10+ open issues labeled `good-first-issue` at all times
3. **Content templates** — One-file templates for adding tools, playbooks, walkthroughs
4. **Discord/Matrix channel** — Link in README for async contributor discussion
5. **Mentorship** — Experienced contributors volunteer to review first-time content PRs

---

### Content Quality Assurance Metrics

Track via GitHub Projects or a simple JSON manifest:

- % of Kali tools with deep entries vs. shallow
- % of tool errors with documented fixes
- Average commands-per-tool
- Coverage of MITRE ATT&CK technique IDs
- Last-updated date per tool/playbook

---

### Recognition & Attribution System

- Add `CONTRIBUTORS.md` auto-generated from git log
- "Content authored by" attribution in each tool/playbook data object
- GitHub Contributor graph prominently in README
- Monthly "Contributor Spotlight" in Discussions
- Hall of Fame section for significant contributions

---

## 4. UI/UX Enhancements

### Dark Mode

| Priority | Item |
|----------|------|
| 🔴 | Implement `prefers-color-scheme` CSS media query support via Tailwind dark variant |
| 🔴 | Add manual toggle (sun/moon icon in header) with `localStorage` persistence |
| 🟠 | Ensure all custom colors have dark-mode equivalents in `styles.css` |
| 🟠 | Test all shadcn/ui components in dark mode |

**Implementation:** Use Tailwind CSS `dark:` variant with a `class` strategy. Store preference in `localStorage` and apply `dark` class to `<html>`.

---

### Accessibility (a11y) Audit Recommendations

| Priority | Item |
|----------|------|
| 🔴 | Run axe-core audit on all main pages |
| 🔴 | Ensure all interactive elements have visible focus rings |
| 🔴 | All images and icons have meaningful `alt` text or `aria-label` |
| 🟠 | Keyboard navigation through tool/playbook cards |
| 🟠 | Skip-to-content link in header |
| 🟠 | Announce search results to screen readers (`aria-live`) |
| 🟡 | Color contrast ratio ≥ 4.5:1 everywhere |
| 🟡 | Reduce motion support (`prefers-reduced-motion`) |

---

### Mobile Responsiveness Polish

- Collapsible sidebar on mobile for tool/playbook navigation
- Swipe gestures for walkthrough step navigation
- Touch-friendly tap targets (min 44×44px)
- Sticky header with scroll-aware visibility
- Bottom navigation bar on mobile for primary sections

---

### Search Result Filtering & Sorting

| Priority | Feature |
|----------|---------|
| 🔴 | Filter by content type (Tools / Playbooks / Walkthroughs / Distros) |
| 🟠 | Filter by category/tag |
| 🟠 | Sort by relevance (default) / alphabetical / recently added |
| 🟡 | Advanced search (field-specific: `tool:nmap`, `category:recon`) |
| 🟡 | Search history (localStorage) |
| 🟢 | Saved searches |

---

### Bookmarking / Favorites System

- Store bookmarks in `localStorage` (no account needed)
- "Quick access" panel or sidebar section for bookmarked items
- Export bookmarks as JSON for portability
- Optional: shareable bookmark links via URL hash

---

### Offline Capability

| Priority | Item |
|----------|------|
| 🟠 | Service Worker with Workbox for offline caching |
| 🟠 | "You are offline" graceful fallback |
| 🟡 | PWA manifest (`manifest.json`) for installable app |
| 🟡 | Background sync for any future user-generated content |

Since all content is static, offline support is achievable with minimal effort.

---

## 5. DevOps & Deployment

### Containerization

**Dockerfile (production):**
```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Docker Compose (development):**
```yaml
services:
  dev:
    image: oven/bun:1
    working_dir: /app
    volumes:
      - .:/app
      - bun_cache:/root/.bun
    ports:
      - "3000:3000"
    command: bun run dev
volumes:
  bun_cache:
```

---

### Deployment Configuration

| Platform | Config Needed | Priority |
|----------|--------------|----------|
| **Vercel** | `vercel.json` with framework: `vite`, output dir: `dist` | 🔴 |
| **Netlify** | `netlify.toml` with `[build]` command and publish dir | 🔴 |
| **GitHub Pages** | `.github/workflows/deploy.yml` with `actions/deploy-pages` | 🟠 |
| **Cloudflare Pages** | Auto-detected with Vite; add `_redirects` file | 🟠 |
| **Self-hosted** | Docker Compose + nginx config | 🟡 |

**Recommended:** Vercel for zero-config deploys + edge CDN. Add a `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### CDN Optimization

- Enable Brotli/gzip compression at CDN layer
- Set immutable cache headers for `/assets/*` (hashed filenames)
- Pre-compress static assets at build time using `vite-plugin-compression`
- Use CDN for Google Fonts (or self-host them to avoid privacy concerns)

---

### Analytics (Privacy-Respecting)

| Option | Privacy | Cost | Notes |
|--------|---------|------|-------|
| **Plausible** | ✅ No cookies, GDPR-compliant | $9/mo (or self-host free) | Recommended |
| **Umami** | ✅ Self-hostable, open source | Free (self-hosted) | Excellent alternative |
| **Fathom** | ✅ No cookies | $14/mo | Simple, privacy-first |
| **Matomo** | ✅ Self-hostable | Free (self-hosted) | Feature-rich |
| ❌ Google Analytics | ❌ Cookie-based, data sharing | Free | Not recommended |

---

### Monitoring & Error Tracking (Non-Lovable)

| Option | Type | Notes |
|--------|------|-------|
| **Sentry** (self-hosted) | Error tracking | Full control over data |
| **GlitchTip** | Error tracking | Open-source Sentry alternative |
| **highlight.io** | Session replay + errors | Open-source, self-hostable |
| **Cronitor** | Uptime monitoring | Simple, affordable |
| **UptimeRobot** | Uptime monitoring | Free tier available |

**Recommended approach:** Add a minimal `window.onerror` + `unhandledrejection` handler that logs to console in development and optionally sends to a self-hosted GlitchTip instance in production.

---

## 6. Developer Experience

### Local Development Setup

Add a **Getting Started** section to README with:

```bash
# Prerequisites: Bun >= 1.1.0
curl -fsSL https://bun.sh/install | bash

# Clone and install
git clone https://github.com/tituspaine/os-oracle
cd os-oracle
bun install

# Start dev server
bun run dev
# → Open http://localhost:3000
```

---

### Pre-commit Hooks

Use **Lefthook** (fast, written in Go, works with Bun):

```yaml
# lefthook.yml
pre-commit:
  commands:
    lint:
      run: bun run lint --fix
    typecheck:
      run: bun tsc --noEmit
```

Install: `bun add -d lefthook && bunx lefthook install`

---

### Automated Changelog

Use **conventional commits** + `git-cliff` for automated changelog generation:

```
feat(tools): add deep entry for sqlmap
fix(search): improve synonym matching for 'scan'
docs(contributing): add walkthrough template
```

Add to CI: on every merge to main, auto-generate `CHANGELOG.md` and create a GitHub Release tag.

---

### Development Roadmap Visualization

Use **GitHub Projects** (built-in) with:
- Columns: Backlog → In Progress → Review → Done
- Milestones: v1.0 (launch), v1.1 (dark mode), v2.0 (full ATT&CK coverage)
- Labels: `content`, `ux`, `architecture`, `devops`, `docs`

Add a public roadmap link to the README for community visibility.

---

## 7. Documentation & Resources

### API Documentation

If a public read API is ever planned:

- Use **OpenAPI 3.0** spec for all endpoints
- Host docs with **Redoc** or **Swagger UI**
- Auto-generate TypeScript client with `openapi-typescript`
- Rate limiting and API key management from day one

**Current recommendation:** Before adding an API, expose a static JSON export of the data (e.g., `public/data/tools.json`) for community tooling to consume without a server.

---

### Tool Authoring Guide

Create `docs/tool-authoring-guide.md`:

1. **Choose a tool** from the gaps list or one you know well
2. **Gather real data:** actually run the tool, capture real output
3. **Fill the template:** use the `KaliTool` TypeScript interface
4. **Include mandatory fields:** `id`, `name`, `description`, `commands` (3+), `knownErrors` (3+)
5. **Test locally:** `bun run dev` and verify the tool page renders
6. **Submit PR** with the `content-submission` template

---

### Playbook Writing Best Practices

Create `docs/playbook-guide.md`:

- **One technique per playbook** — avoid combining multiple attack vectors
- **Prerequisites must be realistic** — list what access level is assumed
- **Detection guidance is mandatory** — every offensive step needs a blue-team counterpart
- **Mitigation guidance is mandatory** — link to vendor documentation or CIS benchmarks
- **No live targets** — all examples must reference lab environments (HackTheBox, TryHackMe, DVWA, etc.)
- **Source every claim** — cite CVEs, research papers, or authoritative references

---

### Walkthrough Scenario Templates

Create `docs/walkthrough-template.ts`:

```typescript
// Minimal walkthrough template
export const myWalkthrough: Walkthrough = {
  id: "my-scenario",
  title: "Short descriptive title",
  slug: "my-scenario",
  playbookRef: "related-playbook-id",
  environment: "lab",   // ALWAYS "lab" — never use real targets
  steps: [
    {
      step: 1,
      action: "What the attacker does",
      command: "actual --command --here",
      output: "Expected terminal output",
      commentary: "Why this works and what it means defensively",
    },
    // ...
  ],
};
```

---

### Video Tutorial Placeholders

Future video series to produce (or accept community contributions):

| # | Title | Target Audience |
|---|-------|----------------|
| 1 | Getting Started with OS Oracle | New contributors |
| 2 | Adding Your First Kali Tool Entry | Content contributors |
| 3 | Writing an Attack Playbook | Security practitioners |
| 4 | Setting Up a Lab Environment | Beginners |
| 5 | Active Directory Attack Chain Walkthrough | Intermediate pentesters |

Host on YouTube, link from README and relevant content pages.

---

## 8. Business & Sustainability

### Sponsorship & Donations

| Platform | Notes |
|----------|-------|
| **GitHub Sponsors** | Easiest for GitHub-native users; add `.github/FUNDING.yml` |
| **Open Collective** | Transparent finances; good for team/org expenses |
| **Patreon** | Better for recurring community sponsorships |
| **Ko-fi** | Low-friction one-time donations |

**Add `.github/FUNDING.yml`:**
```yaml
github: tituspaine
open_collective: os-oracle
```

---

### License Clarity

- **Current:** MIT License ✅
- **Action:** Add a `LICENSE-CONTENT` section to `CONTRIBUTING.md` clarifying that all contributed content (tool descriptions, playbook text) is also licensed under MIT
- **Action:** Add a note that ethical guidelines in `CODE_OF_CONDUCT.md` are non-negotiable conditions of contribution

---

### Trademark & Branding Guidelines

Create `docs/branding.md`:

- Project name: **OS Oracle** (stylized as `distro/ref` in UI)
- Logo usage: SVG source in `public/` (to be created)
- Color palette: document primary/secondary/accent tokens from `styles.css`
- Acceptable uses: forks, derivative works, educational materials
- Restricted uses: commercial products implying official affiliation

---

### Long-Term Maintenance Plan

| Concern | Mitigation |
|---------|-----------|
| Bus factor (single maintainer) | Recruit 2–3 co-maintainers within 6 months |
| Content staleness | Quarterly content audits; add `lastVerified` date field to `KaliTool` |
| Dependency security | Dependabot enabled; `bunfig.toml` 24h supply-chain guard retained |
| Community toxicity | Strong CoC with enforcement contact; moderation team |
| Scope creep | Public roadmap with frozen milestones; RFC process for major changes |
| Hosting costs | Static site = near-zero cost; GitHub Pages free tier sufficient for most traffic |

---

## Implementation Sequence (Suggested)

### Phase 1 — Launch Ready (Weeks 1–4)
- [x] Remove Lovable dependencies ← *done in this PR*
- [ ] Fix vite.config.ts for standard Vite + TanStack Start build
- [ ] Add `vercel.json` or `netlify.toml` for one-click deploy
- [ ] Add GitHub issue templates
- [ ] Add PR template
- [ ] Add `Getting Started` section to README

### Phase 2 — Community Foundation (Months 1–3)
- [ ] Paginate Kali tool index
- [ ] Per-page meta tags for SEO
- [ ] Dark mode toggle
- [ ] Filtering on search results
- [ ] Add 20+ deep Kali tool entries
- [ ] Add 5+ new playbooks (AD attacks, web OWASP)
- [ ] MITRE ATT&CK technique ID tagging

### Phase 3 — Scale (Months 3–6)
- [ ] Service Worker + PWA
- [ ] Bookmarking system
- [ ] Pre-commit hooks + conventional commits
- [ ] Automated changelog + versioned releases
- [ ] Docker Compose dev environment
- [ ] Privacy-respecting analytics (Plausible or Umami)

### Phase 4 — Global Resource (Months 6–12)
- [ ] 200+ deep Kali tool entries
- [ ] Full ATT&CK technique coverage
- [ ] Walkthroughs for top 10 attack scenarios
- [ ] Community recognition system
- [ ] Video tutorial series
- [ ] Sponsorship setup

---

*This document is a living roadmap. Open a GitHub Discussion to propose changes, additions, or priority adjustments.*
