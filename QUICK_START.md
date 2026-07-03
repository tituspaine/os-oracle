# OS Oracle - Quick Start Guide

## 🚀 Running OS Oracle Offline in Linux Terminal

### Installation Methods

#### **Method 1: Direct from Git (Recommended for Development)**

```bash
# Clone the repository
git clone https://github.com/tituspaine/os-oracle.git
cd os-oracle

# Install dependencies
npm install
# or with Bun (faster):
bun install

# Build the CLI
npm run build
# or with Bun:
bun run build

# Run directly
node dist/cli.js search "nmap"
# or create an alias:
alias os-oracle="node /path/to/os-oracle/dist/cli.js"
```

#### **Method 2: From npm (Once Published)**

```bash
npm install -g os-oracle
os-oracle search "sql injection"
```

#### **Method 3: Using Bun**

```bash
bun install -g os-oracle
os-oracle search "privilege escalation"
```

---

## 📖 Essential Commands

### Search Everything
```bash
os-oracle search "nmap scanning"
os-oracle search "privilege escalation" --filter playbook
os-oracle search "connection refused" --filter error --limit 5
```

### Browse Kali Tools
```bash
os-oracle tools                    # List all available tools
os-oracle tool nmap               # View nmap details
os-oracle tool nmap --commands    # Show all nmap commands
os-oracle tool metasploit --commands --limit 20
```

### Attack Playbooks
```bash
os-oracle playbooks               # List all playbooks
os-oracle playbook sql-injection  # View specific playbook with steps
os-oracle playbook xss            # Cross-site scripting playbook
```

### Linux Distributions
```bash
os-oracle distros                 # List supported distros
os-oracle distro ubuntu           # Ubuntu commands & tools
os-oracle distro arch --search firewall
os-oracle distro kali             # Kali-specific commands
```

### Manage Bookmarks
```bash
os-oracle bookmark add nmap              # Save for quick access
os-oracle bookmark add "privilege escalation" 
os-oracle bookmark list                  # View saved items
```

### View History
```bash
os-oracle history                 # Recent searches
os-oracle history --clear         # Clear search history
```

### System Information
```bash
os-oracle offline                 # Verify all data loaded
os-oracle version                 # Check OS Oracle version
```

---

## 🔍 Command Reference

| Command | Purpose |
|---------|---------|
| `search <query>` | Full-text search across all content |
| `tools [--limit N]` | List Kali tools |
| `tool <name> [--commands]` | Tool details & commands |
| `playbooks [--limit N]` | List attack playbooks |
| `playbook <slug>` | Full playbook with steps |
| `distros` | List Linux distributions |
| `distro <name> [--search X]` | Distro-specific commands |
| `bookmark add <item>` | Save bookmark |
| `bookmark list` | View saved bookmarks |
| `history [--clear]` | View/clear search history |
| `offline` | Verify offline capability |
| `version` | Display version info |

---

## 📂 Project Structure

```
os-oracle/
├── src/
│   ├── cli/
│   │   └── index.js           # CLI entry point (306 lines)
│   ├── data/
│   │   ├── index.ts           # Data merge pipeline
│   │   ├── kali-*.ts          # Kali tool definitions
│   │   ├── hacking.ts         # Core playbooks
│   │   ├── distros.ts         # Linux distributions
│   │   └── walkthroughs.ts    # CTF walkthroughs
│   └── routes/                # Web interface routes
├── scripts/
│   └── build.js               # Build script
├── docs/
│   ├── RESOURCES.md           # 149+ curated resources
│   ├── CERTIFICATIONS.md      # Ethical hacking certs
│   ├── LEARNING_PATHS.md      # Beginner→Advanced paths
│   └── FRAMEWORKS.md          # OWASP, MITRE ATT&CK, etc.
├── .github/
│   ├── workflows/             # CI/CD automation
│   └── ISSUE_TEMPLATE/        # Contribution templates
└── package.json               # Dependencies & scripts
```

---

## 🛠️ Development Setup

### Requirements
- **Node.js 18+** (v20 or v22 recommended)
- **Bun** (optional, for faster builds)
- **Git**

### Local Development

```bash
# Install
bun install

# Development (watch mode)
bun run dev

# Lint code
bun run lint

# Build everything
bun run build

# Test CLI locally
node dist/cli.js search "metasploit"
```

### Building the CLI Binary

```bash
# Creates dist/cli.js + all data files
npm run build

# Test it
node dist/cli.js version
```

---

## 🌐 GitHub Pages Documentation

**Website:** https://tituspaine.github.io/os-oracle

Once deployed, you'll find:
- ✅ Feature showcase
- ✅ CLI command reference
- ✅ Installation instructions
- ✅ API documentation
- ✅ Contributing guide
- ✅ Resource library (149+ links)

---

## 📦 Dependencies

**Production:**
- `commander` - CLI framework
- `chalk` - Terminal colors
- `fuse.js` - Fuzzy search

**Development:**
- `eslint` - Code linting
- `prettier` - Code formatting
- `typescript` - Type safety
- `vite` - Web build tool
- `react` - Web UI (TanStack Start)

---

## 🔐 Security & Ethics

**⚠️ IMPORTANT:**

OS Oracle is for **authorized security testing ONLY**.

- ✅ Use for legitimate penetration testing with written authorization
- ✅ Use for security training and education
- ✅ Use for CTF competitions
- ✅ Use for bug bounty hunting with program rules compliance

- ❌ **DO NOT** use for unauthorized access
- ❌ **DO NOT** use for illegal activities
- ❌ **DO NOT** use to bypass security measures without permission

See `DISCLAIMER.md` for full legal terms.

---

## 📚 Learning Resources

Access 150+ curated resources:

```bash
# From within OS Oracle
os-oracle search "oscp"
os-oracle search "certifications"
```

**External Links:**
- 🎓 [Learning Paths](docs/LEARNING_PATHS.md)
- 🏆 [Certifications](docs/CERTIFICATIONS.md)
- 📖 [Frameworks](docs/FRAMEWORKS.md)
- 🔗 [Resources](docs/RESOURCES.md)

---

## 🚀 Contributing

### Submit New Content

```bash
# Via GitHub Issues (easiest)
gh issue create --template content_request.md

# Or manually:
# 1. Fork https://github.com/tituspaine/os-oracle
# 2. Add your tool/playbook/error to src/data/
# 3. Submit PR with description
# 4. Pass security review
```

See `CONTRIBUTING_ADVANCED.md` for detailed guide.

---

## 🐛 Troubleshooting

### Issue: "Command not found: os-oracle"

**Solution:**
```bash
# Use full path
node /path/to/os-oracle/dist/cli.js search "test"

# OR create alias
echo 'alias os-oracle="node /path/to/os-oracle/dist/cli.js"' >> ~/.bashrc
source ~/.bashrc

# OR install globally
npm install -g ./
```

### Issue: "Data files not found"

**Solution:**
```bash
# Rebuild
npm run build

# Verify data exists
ls -la src/data/*.json

# Check data loads
os-oracle offline
```

### Issue: Slow search on first run

**Solution:**
- First search indexes all 1M+ commands (30 seconds)
- Subsequent searches are instant
- This is normal and expected

---

## 📊 Project Statistics

- **1,000,000+** verified ethical hacking commands
- **500+** attack playbooks (OWASP, CVE, MITRE ATT&CK)
- **100+** Kali tools with documentation
- **200+** step-by-step walkthroughs
- **20,000+** error messages with solutions
- **15+** Linux distributions
- **150+** curated resources
- **0 bytes** downloaded at runtime (fully offline)

---

## 📞 Support

- 📖 [Full Documentation](docs/)
- 🐛 [Report Issues](https://github.com/tituspaine/os-oracle/issues)
- 💬 [GitHub Discussions](https://github.com/tituspaine/os-oracle/discussions)
- 🤝 [Contributing Guide](CONTRIBUTING_ADVANCED.md)

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details

Built with ❤️ for ethical hackers, security professionals, and learners worldwide.

**OS Oracle v1.0.0** - 100% Offline | 100% Free | 100% Open Source
