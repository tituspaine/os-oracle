# Commands Reference

Full reference for all `os-oracle` CLI commands.

---

## Search

### `os-oracle search <query>`

Search across all data: Kali tools, distros, playbooks, walkthroughs, and errors.

```bash
os-oracle search "port scan"
os-oracle search "sql injection"
os-oracle search "active directory"
```

Options:
```
--type tools|distros|playbooks|walkthroughs  Filter by type
--all                                          Show all results (no pagination)
```

Examples:
```bash
os-oracle search "sql" --type tools
os-oracle search "ubuntu" --type distros
os-oracle search "web" --type playbooks
```

---

## Tools (Kali Linux)

### `os-oracle tools`

List all Kali Linux tools.

```bash
os-oracle tools
os-oracle tools --category "Web Application Analysis"
os-oracle tools --all
```

Options:
```
--category <cat>  Filter by category name
--all             Show all (no pagination)
```

Available categories:
- Information Gathering
- Vulnerability Analysis
- Web Application Analysis
- Database Assessment
- Password Attacks
- Wireless Attacks
- Reverse Engineering
- Exploitation Tools
- Sniffing & Spoofing
- Post Exploitation
- Forensics
- Reporting Tools
- Social Engineering Tools

### `os-oracle tool <name>`

Show full reference for a specific Kali tool including all commands, flags, examples, and known errors.

```bash
os-oracle tool nmap
os-oracle tool metasploit
os-oracle tool burpsuite
os-oracle tool sqlmap
os-oracle tool hydra
```

---

## Distros

### `os-oracle distros`

List all Linux distributions.

```bash
os-oracle distros
os-oracle distros --family debian
os-oracle distros --family arch
```

Options:
```
--family <fam>  Filter by distro family: debian, rhel, arch, suse, alpine, gentoo, slackware, nixos, kali
--all           Show all
```

### `os-oracle distro <name>`

Show full reference for a Linux distribution including package manager commands, system commands, and known errors.

```bash
os-oracle distro ubuntu
os-oracle distro debian
os-oracle distro kali
os-oracle distro arch
os-oracle distro fedora
os-oracle distro alpine
os-oracle distro nixos
```

---

## Playbooks

### `os-oracle playbooks`

List all security playbooks.

```bash
os-oracle playbooks
os-oracle playbooks --category Web
os-oracle playbooks --category "Active Directory"
os-oracle playbooks --severity high
```

Options:
```
--category <cat>           Filter by category
--severity low|medium|high|critical  Filter by severity
--all                      Show all
```

Available categories:
- Web
- Network
- Active Directory
- Wireless
- Password
- Privilege Escalation
- Post-Exploitation
- Social

### `os-oracle playbook <slug>`

Show a full playbook with all steps and commands.

```bash
os-oracle playbook sql-injection
os-oracle playbook smb-enumeration
os-oracle playbook wifi-wpa2-crack
```

---

## Walkthroughs

### `os-oracle walkthroughs`

List all narrated walkthroughs.

```bash
os-oracle walkthroughs
os-oracle walkthroughs --all
```

### `os-oracle walkthrough <slug>`

Show a step-by-step walkthrough with narration, commands, expected output, and branching decisions.

```bash
os-oracle walkthrough nmap-scan
os-oracle walkthrough metasploit-eternalblue
```

---

## Bookmarks

### `os-oracle bookmark add <type> <slug>`

Add a bookmark. Type must be: `tool`, `distro`, `playbook`, or `walkthrough`.

```bash
os-oracle bookmark add tool nmap
os-oracle bookmark add distro ubuntu
os-oracle bookmark add playbook sql-injection
os-oracle bookmark add walkthrough nmap-scan
```

### `os-oracle bookmark remove <slug>`

Remove a bookmark by slug.

```bash
os-oracle bookmark remove nmap
```

### `os-oracle bookmarks`

List all saved bookmarks.

```bash
os-oracle bookmarks
```

---

## History

### `os-oracle history`

Show recent command history (last 20 by default).

```bash
os-oracle history
os-oracle history --all
```

### `os-oracle history clear`

Clear all command history.

```bash
os-oracle history clear
```

---

## Configuration

### `os-oracle config`

Show current configuration.

```bash
os-oracle config
```

### `os-oracle config set <key> <value>`

Set a configuration value.

```bash
os-oracle config set color true       # Enable/disable ANSI colors
os-oracle config set pageSize 30      # Items per page (default: 20)
```

Available config keys:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `color` | boolean | `true` | ANSI color output |
| `pageSize` | number | `20` | Results per page |

### `os-oracle config reset`

Reset configuration to defaults.

```bash
os-oracle config reset
```

---

## Utility

### `os-oracle offline`

Show offline status and data file information.

```bash
os-oracle offline
```

### `os-oracle version`

Show version, data counts, and system info.

```bash
os-oracle version
```

### `os-oracle --help` / `os-oracle help`

Show help for any command.

```bash
os-oracle --help
os-oracle tool --help
os-oracle search --help
```

---

## Global flags

These flags work with any command:

```
--no-color     Disable ANSI colors (also respects NO_COLOR env var)
--json         Output as JSON (where supported)
--all          Show all results without pagination
--help, -h     Show help
```

---

## Environment variables

```
OS_ORACLE_DATA    Path to data directory (default: built-in data)
NO_COLOR          Disable color output (standard)
```

---

## Storage locations

OS Oracle stores user data in `~/.os-oracle/`:

| File | Contents |
|------|----------|
| `~/.os-oracle/bookmarks.json` | Saved bookmarks |
| `~/.os-oracle/history.json` | Command history |
| `~/.os-oracle/config.json` | User configuration |
