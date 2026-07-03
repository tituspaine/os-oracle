# Getting Started with OS Oracle

OS Oracle is a free, offline-first CLI tool for Linux and Kali Linux security reference.

## Requirements

- **Node.js 18+** or **Bun 1.0+**
- Any Linux/macOS terminal (Windows via WSL)

## Installation

### Option 1: npm (most common)

```bash
npm install -g os-oracle
```

### Option 2: Bun

```bash
bun install -g os-oracle
```

### Option 3: Build from source

```bash
git clone https://github.com/tituspaine/os-oracle.git
cd os-oracle
npm install
npm run generate:data
npm run build:cli
npm link
```

## Verify installation

```bash
os-oracle version
```

Expected output:
```
OS Oracle v1.0.0
Data: src/data/json/ — all files loaded
Status: ✅ Offline ready
```

## First steps

### 1. Search for anything

```bash
os-oracle search "port scan"
os-oracle search "sql injection"
os-oracle search "privilege escalation"
```

### 2. Look up a specific tool

```bash
os-oracle tool nmap
os-oracle tool metasploit
os-oracle tool burpsuite
```

### 3. Browse tools by category

```bash
os-oracle tools
os-oracle tools --category "Information Gathering"
os-oracle tools --category "Web Application Analysis"
```

### 4. Linux distro reference

```bash
os-oracle distros
os-oracle distro ubuntu
os-oracle distro arch
os-oracle distro kali
```

### 5. Security playbooks

```bash
os-oracle playbooks
os-oracle playbooks --category Web
os-oracle playbook sql-injection
```

### 6. Walkthroughs

```bash
os-oracle walkthroughs
os-oracle walkthrough nmap-scan
```

### 7. Save bookmarks

```bash
os-oracle bookmark add tool nmap
os-oracle bookmark add distro ubuntu
os-oracle bookmarks
```

## Configuration

OS Oracle stores its configuration in `~/.os-oracle/config.json`.

View config:
```bash
os-oracle config
```

Set options:
```bash
os-oracle config set color true      # Enable ANSI colors (default: true)
os-oracle config set pageSize 30     # Items per page (default: 20)
os-oracle config reset               # Reset to defaults
```

## Offline use

All data is embedded. OS Oracle works completely offline:

```bash
os-oracle offline
```

Expected output:
```
✅ All data files loaded:
   commands.json   — 100+ tools
   distros.json    — 15+ distros
   playbooks.json  — 500+ playbooks
   walkthroughs.json — 200+ walkthroughs
   errors.json     — 1000+ error fixes
```

## Data directory

Data files are at `src/data/json/` relative to the package installation, or set a custom path:

```bash
export OS_ORACLE_DATA=/path/to/your/data
os-oracle offline  # shows status with custom path
```

## Getting help

```bash
os-oracle --help
os-oracle tool --help
os-oracle search --help
```

## Next steps

- See [COMMANDS_REFERENCE.md](./COMMANDS_REFERENCE.md) for full command documentation
- See [docs/index.html](https://tituspaine.github.io/os-oracle) for the web documentation
- See [CONTRIBUTING.md](../CONTRIBUTING.md) to add new data or fix errors
