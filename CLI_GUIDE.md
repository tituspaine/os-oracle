# CLI Guide

> **Authorised use only:** OS Oracle is for legal, approved penetration testing, defensive validation, training, and lab work. Do not use any referenced tools or techniques outside explicit written scope.

## What the CLI is for

The OS Oracle CLI is a local reference companion for ethical hackers and penetration testers who need fast answers in a terminal:

- find the right tool for a task
- recall command syntax during an engagement
- review playbooks before a lab exercise
- check common error causes and fixes
- keep a private local history of searches and bookmarks

It is designed to work **offline**, with all core data bundled locally.

## Installation

### npm global install

```bash
npm install -g os-oracle
```

### Bun global install

```bash
bun install -g os-oracle
```

### Run without installing

```bash
npx os-oracle --help
```

### Verify the install

```bash
os-oracle version
os-oracle offline
```

## Configuration and local files

The CLI stores personal state in:

```text
~/.os-oracle/
```

Typical files:

- `bookmarks.json` — saved items such as `nmap`, `sqlmap`, or `privilege escalation`
- `history.json` — recent search history

This directory is local to your workstation and separate from the packaged knowledge corpus.

## Command reference

Below is a complete command reference for the current CLI surface.

---

## `os-oracle search <query> [--filter command|playbook|error] [--limit N]`

Searches the local corpus using fuzzy matching. Use this when you remember a concept, tool, technique, or error string but not the exact page you need.

### Syntax

```bash
os-oracle search <query> [--filter command|playbook|error] [--limit N]
```

### Options

- `--filter command` — return command/tool-oriented matches only
- `--filter playbook` — return playbook matches only
- `--filter error` — return error troubleshooting matches only
- `--limit N` — cap the number of results returned per section

### Real examples

```bash
os-oracle search "nmap"
os-oracle search "sql injection" --filter playbook
os-oracle search "command not found" --filter error
os-oracle search "metasploit windows exploit" --limit 5
os-oracle search "sqlmap" --filter command --limit 10
os-oracle search "nikto" --filter command
os-oracle search "privilege escalation" --filter playbook
```

### When to use it

- you know the goal but not the exact command
- you need to pivot from a symptom to a fix
- you want to compare tool-oriented and playbook-oriented results

---

## `os-oracle tools [--limit N]`

Lists unique Kali tools known to the local corpus.

### Syntax

```bash
os-oracle tools [--limit N]
```

### Options

- `--limit N` — limit how many tools are shown

### Real examples

```bash
os-oracle tools
os-oracle tools --limit 10
os-oracle tools --limit 50
```

### Practical use

Run this when you want a quick inventory of what is available locally, such as during a lab prep session or while deciding whether the corpus includes `nmap`, `sqlmap`, `metasploit`, `nikto`, or `gobuster`.

---

## `os-oracle tool <name> [--commands] [--limit N]`

Shows information about a specific tool. Without `--commands`, it prints a short summary indicating how many commands are available. With `--commands`, it prints command syntax and descriptions.

### Syntax

```bash
os-oracle tool <name> [--commands] [--limit N]
```

### Options

- `--commands` — show the tool's commands
- `--limit N` — limit how many commands are shown

### Real examples

```bash
os-oracle tool nmap
os-oracle tool nmap --commands
os-oracle tool nmap --commands --limit 5
os-oracle tool sqlmap --commands
os-oracle tool metasploit --commands --limit 10
os-oracle tool nikto --commands
os-oracle tool gobuster --commands
```

### Example use cases

- recall common `nmap` scan patterns before host discovery
- review `sqlmap` enumeration flags in a lab app like DVWA
- browse `metasploit` commands before opening `msfconsole`

---

## `os-oracle playbooks [--limit N]`

Lists available attack playbooks.

### Syntax

```bash
os-oracle playbooks [--limit N]
```

### Options

- `--limit N` — limit the number of playbooks shown

### Real examples

```bash
os-oracle playbooks
os-oracle playbooks --limit 10
os-oracle playbooks --limit 25
```

### Typical use

Use this to survey higher-level technique coverage before training, tabletop exercises, or lab walkthroughs.

---

## `os-oracle playbook <slug>`

Displays a specific playbook by slug.

### Syntax

```bash
os-oracle playbook <slug>
```

### Real examples

```bash
os-oracle playbook sql-injection-basics
os-oracle playbook privilege-escalation-linux
os-oracle playbook xss-attack
```

### Tips

- get the slug from `os-oracle playbooks`
- use this before running tooling in a lab so you understand sequence, prerequisites, and safety considerations

---

## `os-oracle distros`

Lists the Linux distributions included in the local reference set.

### Syntax

```bash
os-oracle distros
```

### Real examples

```bash
os-oracle distros
```

### Current examples you are likely to see

- Ubuntu
- Debian
- Arch Linux
- Kali Linux

Use this when moving between assessment hosts, jump boxes, or training VMs with different package managers and service-management workflows.

---

## `os-oracle distro <name> [--search <query>] [--limit N]`

Displays commands for a specific Linux distribution, optionally filtered by a search phrase.

### Syntax

```bash
os-oracle distro <name> [--search <query>] [--limit N]
```

### Options

- `--search <query>` — filter the distro command list by name text
- `--limit N` — limit how many commands are displayed

### Real examples

```bash
os-oracle distro "Ubuntu"
os-oracle distro "Kali Linux"
os-oracle distro "Ubuntu" --search apt
os-oracle distro "Debian" --search systemctl --limit 10
os-oracle distro "Arch Linux" --search pacman
os-oracle distro "Kali Linux" --search ssh --limit 5
```

### Why it matters

Pen testers often pivot between attacker systems, lab targets, bastion hosts, and disposable VMs. This command helps you quickly recall distro-specific package, service, and administration syntax.

---

## `os-oracle bookmark add|list [item]`

Stores or displays bookmarks in your local `~/.os-oracle/bookmarks.json` file.

### Syntax

```bash
os-oracle bookmark add <item>
os-oracle bookmark list
```

### Real examples

```bash
os-oracle bookmark add nmap
os-oracle bookmark add sqlmap
os-oracle bookmark add metasploit
os-oracle bookmark add privilege-escalation-linux
os-oracle bookmark list
```

### Suggested bookmark targets

- a tool name: `nmap`
- a technique slug: `sql-injection-basics`
- a workflow topic: `privilege escalation`
- a favorite distro reference: `Ubuntu`

---

## `os-oracle history [--clear]`

Shows recent searches or clears them.

### Syntax

```bash
os-oracle history [--clear]
```

### Options

- `--clear` — erase local search history

### Real examples

```bash
os-oracle history
os-oracle history --clear
```

### When to use it

- review what you searched during a lab session
- reconstruct a training workflow for notes
- clear local state before demoing on a shared machine

---

## `os-oracle offline`

Confirms the offline-first behavior of the platform.

### Syntax

```bash
os-oracle offline
```

### Real examples

```bash
os-oracle offline
```

### Why it is useful

This is a quick confidence check for users operating in:

- disconnected labs
- client environments with no outbound access
- travel or incident-response environments with poor connectivity

---

## `os-oracle version`

Prints the CLI version.

### Syntax

```bash
os-oracle version
```

### Real examples

```bash
os-oracle version
```

Use this when verifying installs, troubleshooting package issues, or confirming which release is installed on a lab workstation.

---

## `os-oracle --help`

Shows built-in help from Commander.

### Syntax

```bash
os-oracle --help
```

### Real examples

```bash
os-oracle --help
npx os-oracle --help
```

This is the fastest way to confirm option names and command signatures from the terminal.

## Common workflows

### 1. Quick recon prep in a lab

```bash
os-oracle search "nmap"
os-oracle tool nmap --commands --limit 8
os-oracle bookmark add nmap
```

### 2. SQL injection study flow

```bash
os-oracle search "sql injection" --filter playbook
os-oracle playbook sql-injection-basics
os-oracle tool sqlmap --commands --limit 6
```

### 3. Web assessment notes setup

```bash
os-oracle tool nikto --commands
os-oracle tool gobuster --commands
os-oracle bookmark add nikto
os-oracle bookmark add gobuster
```

### 4. Metasploit refresher before a lab exercise

```bash
os-oracle search "metasploit" --filter command
os-oracle tool metasploit --commands --limit 10
```

### 5. Distro-specific admin lookup on a jump host

```bash
os-oracle distros
os-oracle distro "Ubuntu" --search apt
os-oracle distro "Arch Linux" --search pacman
```

## Tips and tricks

### Prefer narrow searches during live work

Instead of broad terms like `scan`, try:

- `nmap`
- `sqlmap`
- `command not found`
- `privilege escalation`
- `ssh authentication failed`

### Use bookmarks as a lightweight field kit

Bookmark the tools and playbooks you use repeatedly during:

- external recon labs
- web-app testing classes
- internal network assessment runbooks
- cert prep and CTF study sessions

### Pair tool pages with playbooks

A tool page tells you **how** to run something. A playbook explains **when and why** in a broader workflow. Using both together is often the fastest safe-learning path.

### Keep history in mind on shared systems

`history.json` is local and convenient, but if you are using a shared training VM, clear it when appropriate:

```bash
os-oracle history --clear
```

### Remember the CLI is reference, not automation

OS Oracle is intentionally a knowledge platform, not an attack orchestrator. Use it to recall commands, understand error messages, and review authorised workflows.

## Troubleshooting

### `os-oracle: command not found`

The package may not be installed globally, or the global bin directory may not be on your `PATH`.

Try:

```bash
npm install -g os-oracle
# or
bun install -g os-oracle
```

Or use:

```bash
npx os-oracle --help
```

### I installed it, but I want to confirm local-only behavior

Run:

```bash
os-oracle offline
```

### Where are my bookmarks and history stored?

In:

```text
~/.os-oracle/
```

## Safety reminder

Use OS Oracle in:

- owned lab environments
- authorised client engagements
- approved training exercises
- classroom and certification prep

Do **not** use referenced tools or techniques against systems without explicit permission.
