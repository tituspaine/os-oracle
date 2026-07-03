# OS Oracle — Beginner Quick Start (TUI-first)

This guide is optimized for people new to security tools and terminal workflows.

> ⚠️ Authorized use only: practice on labs/CTFs/approved environments.

## 1) Install

```bash
git clone https://github.com/tituspaine/os-oracle.git
cd os-oracle
npm install
npm run build
```

Run locally:

```bash
node dist/cli.js version
```

Optional alias:

```bash
alias os-oracle="node $(pwd)/dist/cli.js"
```

---

## 2) First 10 minutes (recommended path)

```bash
# Discover categories
os-oracle tools
os-oracle playbooks
os-oracle distros

# Search one topic
os-oracle search "nmap"

# Open one detailed reference
os-oracle tool nmap --commands

# Save progress
os-oracle bookmark add nmap
os-oracle bookmark list
```

---

## 3) Beginner learning loop

Use this repeatable loop each day:

1. Pick one topic (`recon`, `web`, `privilege escalation`)
2. `search` it
3. Open one `tool` and one `playbook`
4. Run only in legal practice environments
5. Bookmark useful entries
6. Review with `history`

---

## 4) Core commands cheat sheet

| Command | What it does |
|---|---|
| `search <query>` | Find tools, errors, commands, and playbooks |
| `tools` | List security tools |
| `tool <name> --commands` | Show command examples for one tool |
| `playbooks` | List available offensive/defensive scenarios |
| `playbook <slug>` | View a full scenario with steps |
| `distros` | List distro references |
| `distro <name> --search <q>` | Find commands for one distro |
| `bookmark add <item>` | Save an entry |
| `bookmark list` | Show saved entries |
| `history` | Show recent lookups |

---

## 5) Troubleshooting

### `os-oracle: command not found`
Use direct execution:

```bash
node dist/cli.js search "nmap"
```

### Missing build artifacts
Rebuild:

```bash
npm run build
```

### Unsure where to start
Use this sequence:

```bash
os-oracle search "beginner reconnaissance"
os-oracle playbooks
os-oracle tool nmap --commands
```

---

## 6) Next steps

- Read `docs/LEARNING_PATHS.md`
- Pick one certification path in `docs/CERTIFICATIONS.md`
- Practice one playbook per week and save your bookmark set