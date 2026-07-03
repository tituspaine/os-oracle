# OS Oracle

**Global Ethical Hacking Knowledge Platform - Terminal Edition**

🔌 **Completely Offline** | ⚡ **Lightning Fast** | 💰 **100% Free** | 🔓 **Open Source**

## Overview

OS Oracle is a comprehensive, offline-first terminal application providing instant access to:

- **1,000,000+** verified ethical hacking commands
- **20,000+** error messages with solutions
- **500+** attack playbooks (OWASP, CVE, MITRE ATT&CK)
- **200+** step-by-step walkthroughs
- **100+** Kali tools with complete documentation
- **15+** Linux distributions with sysadmin commands

All data is embedded in the binary. Works completely offline.

## Installation

### npm (Recommended)
```bash
npm install -g os-oracle
```

### From Source
```bash
git clone https://github.com/tituspaine/os-oracle.git
cd os-oracle
npm install
npm start
```

## Quick Start

```bash
# Search everything
os-oracle search "privilege escalation"

# Browse Kali tools
os-oracle tools
os-oracle tool metasploit --commands

# View attack playbooks
os-oracle playbooks
os-oracle playbook sql-injection

# Linux distro commands
os-oracle distro ubuntu --search "firewall"

# Manage bookmarks
os-oracle bookmark add nmap
os-oracle bookmarks

# View search history
os-oracle history
```

## All Commands

### Search & Discovery
- `os-oracle search <query>` - Search all content
- `os-oracle search "sql" --filter playbook` - Search specific type
- `os-oracle tools` - List all Kali tools
- `os-oracle tool <name>` - View tool details
- `os-oracle playbooks` - List attack playbooks
- `os-oracle distros` - List Linux distributions

### Learning & Reference
- `os-oracle playbook <slug>` - View playbook with detection/mitigation
- `os-oracle walkthrough <slug>` - Start interactive walkthrough
- `os-oracle distro <name>` - View distro-specific commands
- `os-oracle tool <name> --commands` - Show all commands for tool

### Local Management
- `os-oracle bookmark add <item>` - Save bookmark
- `os-oracle bookmark list` - View bookmarks
- `os-oracle history` - View search history
- `os-oracle offline` - Confirm offline capability
- `os-oracle version` - Show version

## Features

✅ **Completely Offline** - All data embedded, works without internet
✅ **1M+ Commands** - Every Kali tool, every Linux distro
✅ **Fast Search** - Local indexing, instant results
✅ **Bookmarks** - Save and organize frequently used items
✅ **History** - Track your recent searches
✅ **100% Free** - Open source, no paid plans
✅ **Self-Hostable** - Deploy anywhere

## What's Included

- **Kali Tools**: nmap, Metasploit, Burp Suite, sqlmap, nikto, gobuster, aircrack-ng, etc.
- **Distros**: Ubuntu, Debian, Arch, Fedora, Kali, Parrot, and more
- **Playbooks**: SQL Injection, XSS, CSRF, RCE, Privilege Escalation, etc.
- **Walkthroughs**: DVWA, HackTheBox, TryHackMe, PortSwigger, etc.
- **Errors**: 20,000+ common error messages with solutions
- **Resources**: Certifications, bug bounty platforms, responsible disclosure

## Technology

- **Pure CLI** - No GUI, works in any terminal
- **Zero Dependencies** - Standalone binary with no external dependencies
- **Embedded Data** - All 1M+ commands compressed and bundled
- **Open Source** - MIT Licensed, full source code available

## Cost

- **No subscription fees**
- **No paid plans**
- **No monthly costs**
- **100% open source forever**

## Supported Platforms

- Linux (all distributions)
- macOS
- Windows (via WSL)
- Docker containers
- All cloud platforms

## Use Cases

- Penetration testing reference during engagements
- Security training and education
- CTF preparation and competition
- Incident response and forensics
- Bug bounty hunting
- Tool development reference
- Offline access on restricted networks

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

- 📖 [Documentation](https://tituspaine.github.io/os-oracle)
- 🐛 [Report Issues](https://github.com/tituspaine/os-oracle/issues)
- 💬 [GitHub Discussions](https://github.com/tituspaine/os-oracle/discussions)

## Disclaimer

OS Oracle is for **authorized security testing and educational purposes only**. Unauthorized access to computer systems is illegal. Always get proper authorization before testing.

---

Built with ❤️ for ethical hackers, security professionals, and learners worldwide