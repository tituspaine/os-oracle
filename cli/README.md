# OS Oracle CLI

Offline terminal interface for the OS Oracle knowledge base.

## Features

- Direct access to tools, playbooks, distros, walkthroughs, resources, and bookmarks
- Interactive numbered menu when run without arguments
- Direct command mode for scripting
- Colored output and pagination for long lists
- Reads live data from the web app's `src/data/` sources during build

## Install

```bash
cd cli
npm install
npm run build
```

Run locally:

```bash
node ./bin/os-oracle.js
```

## Commands

```bash
os-oracle                     # interactive main menu
os-oracle search <query>      # search all content
os-oracle tools               # list all Kali tools
os-oracle tool <slug>         # view one tool
os-oracle playbooks           # list all playbooks
os-oracle playbook <slug>     # view one playbook
os-oracle walkthroughs        # list walkthroughs
os-oracle walkthrough <slug>  # view one walkthrough
os-oracle distros             # list distros
os-oracle distro <slug>       # view one distro
os-oracle resources           # show reference resources
os-oracle bookmarks           # list bookmarks
os-oracle bookmarks add <type> <slug>
os-oracle bookmarks remove <type> <slug>
os-oracle help                # show help
```

Supported bookmark types: `tool`, `playbook`, `walkthrough`, `distro`.
