# OS Oracle

**The open, offline knowledge operating system for ethical hackers.**

OS Oracle aims to be the **world’s most in-depth, beginner-friendly, and practical** reference for authorized security testing.

🔌 Offline-first • 🧭 Beginner Mode • ⚡ Fast local search • 🔓 Open source

> ⚠️ **Authorized use only:** OS Oracle is for legal security testing, education, CTFs, and approved bug bounty work.

---

## Why this exists

Most security learning is fragmented:
- Commands are scattered across blogs and outdated gists
- Beginners don’t know *what to run first*
- Advanced users waste time hunting syntax and edge cases
- Many resources assume internet access

OS Oracle solves this with one searchable system that combines:
- tool command references
- exploitation/playbook flow
- defensive context and mitigations
- common errors + fixes
- progressive learning paths

---

## Beginner-first TUI navigation (new default mental model)

Think of OS Oracle as a **guided terminal map**:

1. **Start**: pick your level (`beginner`, `intermediate`, `advanced`)
2. **Choose a track**: recon, web, AD, wireless, priv-esc, etc.
3. **Run guided workflows**: safe step-by-step sequences
4. **Dive deeper**: open linked tools, errors, and mitigations
5. **Save progress**: bookmarks + history

### Suggested command flow for new users

```bash
# 1) Start broad and learn the landscape
os-oracle distros
os-oracle tools
os-oracle playbooks

# 2) Search one topic and narrow down
os-oracle search "nmap"
os-oracle search "nmap" --filter tool

# 3) Open detail pages
os-oracle tool nmap --commands
os-oracle playbook reconnaissance

# 4) Save and continue later
os-oracle bookmark add nmap
os-oracle history
```

---

## Installation

### npm (recommended)
```bash
npm install -g os-oracle
```

### From source
```bash
git clone https://github.com/tituspaine/os-oracle.git
cd os-oracle
npm install
npm start
```

---

## Core commands

### Discovery
- `os-oracle search <query>`
- `os-oracle search "sql" --filter playbook`
- `os-oracle tools`
- `os-oracle tool <name>`
- `os-oracle playbooks`
- `os-oracle distros`

### Learning
- `os-oracle playbook <slug>`
- `os-oracle walkthrough <slug>`
- `os-oracle distro <name>`
- `os-oracle tool <name> --commands`

### Personal workflow
- `os-oracle bookmark add <item>`
- `os-oracle bookmark list`
- `os-oracle history`
- `os-oracle offline`
- `os-oracle version`

---

## What would make this the world’s best resource (roadmap)

To become truly best-in-class, OS Oracle should keep shipping depth in these areas:

1. **Coverage completeness**
   - Expand long-tail tools and niche workflows
   - Add version-aware command variants (tool version + distro version)

2. **Scenario-driven learning**
   - Beginner-to-advanced tracks by objective (e.g., "Enumerate SMB safely")
   - Real-world troubleshooting trees, not just flat command lists

3. **Trust & verification**
   - Source-backed commands with references and tested examples
   - Confidence labels: verified / community / experimental

4. **Defensive pairing**
   - Every offensive tactic linked to detection, logging, and mitigation

5. **Accessibility & UX in terminal**
   - Consistent command naming
   - Progressive disclosure (simple by default, advanced flags on demand)
   - Friendly error recovery suggestions for every failed command path

6. **Contributor velocity**
   - Templates for adding new tools/playbooks/errors quickly
   - CI checks for schema quality and duplicate command detection

---

## Responsible use

OS Oracle is for **authorized** security work only.

✅ Training, labs, CTFs, sanctioned pentests, approved bug bounty scopes  
❌ Unauthorized access, disruption, persistence, data exfiltration, illegal use

See [DISCLAIMER.md](DISCLAIMER.md) for legal terms.

---

## Support

- 📖 Docs: https://tituspaine.github.io/os-oracle
- 🐛 Issues: https://github.com/tituspaine/os-oracle/issues
- 💬 Discussions: https://github.com/tituspaine/os-oracle/discussions

Built for ethical hackers, defenders, and learners.