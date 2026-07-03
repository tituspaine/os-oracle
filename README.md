# 🔮 OS Oracle — Offline Linux & Kali Reference CLI

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub_Pages-blue.svg)](https://tituspaine.github.io/os-oracle)
[![npm](https://img.shields.io/badge/npm-os--oracle-red.svg)](https://www.npmjs.com/package/os-oracle)

> **Authorized testing, education, and defence only.** All content is provided for authorized
> security testing, learning, and defensive purposes. See [DISCLAIMER.md](./DISCLAIMER.md).

An **offline-first**, terminal-only reference for:

- **100+ Kali Linux tools** — commands, flags, examples, common errors
- **15+ Linux distributions** — package managers, system commands, errors
- **Security playbooks** — step-by-step attack scenarios (Web, AD, Wireless, Network…)
- **Narrated walkthroughs** — copy-pasteable lab dry-runs with expected output
- **Smart search** — find anything by keyword across all categories

**No internet required. No account. No fees. Ever.**

---

## 📚 Documentation

**→ [https://tituspaine.github.io/os-oracle](https://tituspaine.github.io/os-oracle)**

---

## 🚀 Quick Start

### Install

```bash
# npm (Node 18+)
npm install -g os-oracle

# Bun
bun install -g os-oracle
```

### Use it

```bash
# Search everything
os-oracle search "sql injection"

# Look up a Kali tool
os-oracle tool nmap
os-oracle tool metasploit

# Browse all tools
os-oracle tools
os-oracle tools --category "Web Application Analysis"

# Linux distro reference
os-oracle distro ubuntu
os-oracle distro arch

# Security playbooks
os-oracle playbooks
os-oracle playbook sql-injection

# Walkthroughs
os-oracle walkthroughs
os-oracle walkthrough nmap-scan

# Bookmarks
os-oracle bookmark add tool nmap
os-oracle bookmarks

# Check offline status
os-oracle offline
```

---

## 📋 All Commands

| Command | Description |
|---------|-------------|
| `os-oracle search <query>` | Search all data |
| `os-oracle search <q> --type tools` | Filter by type |
| `os-oracle tools` | List all Kali tools |
| `os-oracle tools --category <cat>` | Filter by category |
| `os-oracle tool <name>` | Full tool reference |
| `os-oracle distros` | List all distros |
| `os-oracle distro <name>` | Full distro reference |
| `os-oracle playbooks` | List all playbooks |
| `os-oracle playbook <slug>` | Show playbook |
| `os-oracle walkthroughs` | List walkthroughs |
| `os-oracle walkthrough <slug>` | Show walkthrough |
| `os-oracle bookmark add <type> <slug>` | Add bookmark |
| `os-oracle bookmark remove <slug>` | Remove bookmark |
| `os-oracle bookmarks` | List bookmarks |
| `os-oracle history` | Recent command history |
| `os-oracle history clear` | Clear history |
| `os-oracle config` | Show config |
| `os-oracle config set <key> <val>` | Set config value |
| `os-oracle config reset` | Reset to defaults |
| `os-oracle offline` | Check data status |
| `os-oracle version` | Show version |

---

## 🗄️ Data

All data lives in `src/data/` as TypeScript source files:

| File | Contents |
|------|----------|
| `src/data/kali-deep.ts` | Deep Kali tool entries (full commands + examples) |
| `src/data/kali-shallow.ts` | Shallow Kali tool entries (stubs) |
| `src/data/kali-extra*.ts` | Additional tools |
| `src/data/distros.ts` | Linux distribution data |
| `src/data/hacking.ts` | Security playbooks |
| `src/data/playbooks-extra.ts` | Additional playbooks |
| `src/data/walkthroughs.ts` | Narrated walkthroughs |

JSON files (for the CLI) are generated with:

```bash
npm run generate:data
```

---

## 🛠️ Development

```bash
# Clone
git clone https://github.com/tituspaine/os-oracle.git
cd os-oracle

# Install
bun install   # or: npm install

# Web UI dev server
bun dev

# Generate JSON data for CLI
bun run generate:data

# Build CLI
bun run build:cli

# Lint
bun run lint

# Build web app
bun run build
```

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

**To add a new Kali tool:** edit `src/data/kali-extra3.ts`  
**To add a new distro:** edit `src/data/distros.ts`  
**To add a playbook:** edit `src/data/playbooks-extra.ts`  
**To add a walkthrough:** edit `src/data/walkthroughs.ts`  

---

## 📄 License

[MIT](./LICENSE) — free to use, fork, modify, and redistribute.

---

## ⚠️ Disclaimer

This tool is for **authorized testing, education, and defensive security** only. Using techniques
against systems you don't own or lack explicit written permission to test is illegal. See
[DISCLAIMER.md](./DISCLAIMER.md) and the in-app `/ethics` page.
