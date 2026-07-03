import chalk from 'chalk';
import Fuse from 'fuse.js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import dns from 'dns/promises';

const HOME_ITEMS = [
  { id: 'tools', label: 'Tools', hint: 'Browse Kali and security tools.' },
  { id: 'playbooks', label: 'Playbooks', hint: 'Step-by-step attack and defense playbooks.' },
  { id: 'distros', label: 'Distros', hint: 'Linux distro command references.' },
  { id: 'resources', label: 'Resources', hint: 'Curated learning and reference resources.' },
  { id: 'learning', label: 'Learning Paths', hint: 'Beginner → Intermediate → Advanced paths.' },
  { id: 'search', label: 'Search', hint: 'Real-time fuzzy search across all content.' },
  { id: 'lab', label: 'Lab Mode', hint: 'Safe local command preview sandbox.' },
  { id: 'settings', label: 'Settings', hint: 'Themes, shortcuts, import/export, offline status.' },
  { id: 'exit', label: 'Exit', hint: 'Quit OS Oracle.' },
];

const LEARNING_PATHS = [
  { level: 'Beginner', steps: ['Terminal basics', 'Networking basics', 'Web testing fundamentals'] },
  { level: 'Intermediate', steps: ['Enumeration workflows', 'Auth bypass patterns', 'Privilege escalation basics'] },
  { level: 'Advanced', steps: ['Cloud attack paths', 'AD abuse chains', 'Detection-aware operations'] },
];

const TUTORIAL_STEPS = [
  'Welcome to OS Oracle! Use ↑/↓ to move and Enter to select.',
  'Use ←, Esc, or b for < Back navigation.',
  'Press / from most screens to jump to Search.',
  'Press c on a command detail to copy command text to clipboard.',
  'Press p to preview command execution before running in your shell.',
];

const TIPS = [
  'Did you know? Press / to open Search quickly.',
  'Did you know? Press b or Esc to go back from any screen.',
  'Did you know? Search supports fuzzy matches like “metsploit”.',
  'Did you know? Press m on detail screens to bookmark items.',
];

function nowTip(screen) {
  const idx = Math.abs((Date.now() >> 12) + screen.length) % TIPS.length;
  return TIPS[idx];
}

function truncate(text, width) {
  if (!text) return '';
  if (text.length <= width) return text;
  if (width < 4) return text.slice(0, width);
  return `${text.slice(0, width - 1)}…`;
}

function ensureSettings(configDir) {
  const settingsPath = path.join(configDir, 'settings.json');
  const defaults = {
    firstLaunch: true,
    theme: 'dark',
    shortcuts: { search: '/', back: 'b' },
    offlineVerifiedAt: null,
    networkStatus: 'unknown',
  };
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(defaults, null, 2));
    return { settings: defaults, settingsPath };
  }
  try {
    const loaded = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    const merged = { ...defaults, ...loaded, shortcuts: { ...defaults.shortcuts, ...(loaded.shortcuts || {}) } };
    return { settings: merged, settingsPath };
  } catch {
    fs.writeFileSync(settingsPath, JSON.stringify(defaults, null, 2));
    return { settings: defaults, settingsPath };
  }
}

function saveSettings(settingsPath, settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function osc52Copy(text) {
  if (!text) return false;
  const encoded = Buffer.from(text, 'utf8').toString('base64');
  process.stdout.write(`\u001b]52;c;${encoded}\u0007`);
  return true;
}

async function networkState() {
  try {
    await Promise.race([
      dns.lookup('github.com'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1200)),
    ]);
    return 'online';
  } catch {
    return 'offline';
  }
}

export async function startTui({
  commands,
  playbooks,
  errors,
  distros,
  configDir,
  getBookmarks,
  saveBookmarks,
  addToHistory,
}) {
  const { settings, settingsPath } = ensureSettings(configDir);
  settings.networkStatus = await networkState();
  settings.offlineVerifiedAt = new Date().toISOString();
  saveSettings(settingsPath, settings);

  const resources = [
    { title: 'OWASP Top 10', link: 'https://owasp.org/www-project-top-ten/' },
    { title: 'MITRE ATT&CK', link: 'https://attack.mitre.org/' },
    { title: 'NVD', link: 'https://nvd.nist.gov/' },
    { title: 'PortSwigger Academy', link: 'https://portswigger.net/web-security' },
  ];

  const tools = [...new Set(commands.map((c) => c.tool || c.name).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const searchCorpus = [
    ...commands.map((c) => ({ type: 'tool-command', title: c.name || c.tool, detail: c.description, command: c.syntax })),
    ...playbooks.map((p) => ({ type: 'playbook', title: p.title, detail: p.summary, command: p.steps?.[0]?.command || '' })),
    ...errors.map((e) => ({ type: 'error', title: e.message, detail: e.cause, command: '' })),
    ...distros.map((d) => ({ type: 'distro', title: d.name, detail: `${d.commands?.length || 0} commands`, command: d.commands?.[0]?.syntax || '' })),
  ];
  const searchIndex = new Fuse(searchCorpus, { keys: ['title', 'detail', 'command'], threshold: 0.35 });

  const stack = settings.firstLaunch ? [{ screen: 'tutorial' }] : [{ screen: 'home' }];
  settings.firstLaunch = false;
  saveSettings(settingsPath, settings);

  let selected = 0;
  let query = '';
  let notice = '';
  let noticeAt = 0;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  readline.emitKeypressEvents(process.stdin, rl);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  const cleanup = () => {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    rl.close();
    process.stdout.write('\n');
  };

  const current = () => stack[stack.length - 1];
  const push = (screen, item = null) => {
    stack.push({ screen, item });
    selected = 0;
    query = '';
  };
  const pop = () => {
    if (stack.length > 1) {
      stack.pop();
      selected = 0;
      query = '';
    }
  };

  const setNotice = (text) => {
    notice = text;
    noticeAt = Date.now();
  };

  const viewRows = () => {
    const screen = current().screen;
    if (screen === 'home') return HOME_ITEMS;
    if (screen === 'tools') return tools.map((t) => ({ label: t, hint: 'Open tool details' }));
    if (screen === 'playbooks') return playbooks.map((p) => ({ label: p.title, hint: p.summary, payload: p }));
    if (screen === 'distros') return distros.map((d) => ({ label: d.name, hint: `${d.commands?.length || 0} commands`, payload: d }));
    if (screen === 'resources') return resources.map((r) => ({ label: r.title, hint: r.link, payload: r }));
    if (screen === 'learning') return LEARNING_PATHS.map((lp) => ({ label: lp.level, hint: lp.steps.join(' → '), payload: lp }));
    if (screen === 'settings') {
      return [
        { id: 'theme', label: `Theme: ${settings.theme}`, hint: 'Toggle dark/light.' },
        { id: 'export', label: 'Export config', hint: 'Save bookmarks/history/settings to JSON.' },
        { id: 'import', label: 'Import config', hint: 'Restore from exported JSON.' },
        { id: 'verify', label: `Offline status: ${settings.networkStatus}`, hint: 'Re-check network state.' },
      ];
    }
    if (screen === 'lab') {
      return [
        { label: 'nmap -sV TARGET', hint: 'Command preview only (no execution).' },
        { label: 'sqlmap -u URL --batch', hint: 'Command preview only (no execution).' },
        { label: 'gobuster dir -u URL -w WORDLIST', hint: 'Command preview only (no execution).' },
      ];
    }
    if (screen === 'tutorial') return TUTORIAL_STEPS.map((s) => ({ label: s, hint: '' }));
    if (screen === 'search') {
      if (!query.trim()) return [];
      return searchIndex.search(query).slice(0, 12).map((r) => ({ label: r.item.title, hint: `${r.item.type}: ${r.item.detail}`, payload: r.item }));
    }
    return [];
  };

  const openSelection = async () => {
    const screen = current().screen;
    const rows = viewRows();
    const row = rows[selected];
    if (!row) return;

    if (screen === 'home') {
      if (row.id === 'exit') {
        cleanup();
        return process.exit(0);
      }
      if (row.id === 'search') return push('search');
      if (row.id === 'tutorial') return push('tutorial');
      return push(row.id);
    }

    if (screen === 'settings') {
      if (row.id === 'theme') {
        settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
        saveSettings(settingsPath, settings);
        setNotice(`Theme switched to ${settings.theme}.`);
      } else if (row.id === 'verify') {
        settings.networkStatus = await networkState();
        settings.offlineVerifiedAt = new Date().toISOString();
        saveSettings(settingsPath, settings);
        setNotice(`Network state: ${settings.networkStatus}.`);
      } else if (row.id === 'export') {
        const outputPath = path.join(configDir, 'os-oracle-export.json');
        const payload = {
          settings,
          bookmarks: getBookmarks(),
          history: fs.existsSync(path.join(configDir, 'history.json'))
            ? JSON.parse(fs.readFileSync(path.join(configDir, 'history.json'), 'utf-8'))
            : [],
        };
        fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
        setNotice(`Exported to ${outputPath}`);
      } else if (row.id === 'import') {
        const inputPath = path.join(configDir, 'os-oracle-export.json');
        if (!fs.existsSync(inputPath)) {
          setNotice('No export file found to import.');
        } else {
          try {
            const payload = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
            if (payload.settings) saveSettings(settingsPath, { ...settings, ...payload.settings });
            if (Array.isArray(payload.bookmarks)) saveBookmarks(payload.bookmarks);
            if (Array.isArray(payload.history)) {
              fs.writeFileSync(path.join(configDir, 'history.json'), JSON.stringify(payload.history.slice(0, 100), null, 2));
            }
            setNotice('Import complete.');
          } catch {
            setNotice('Import failed: invalid JSON.');
          }
        }
      }
      return;
    }

    if (screen === 'search') {
      if (row.payload?.title) {
        addToHistory(query);
        push('detail', row.payload);
      }
      return;
    }

    if (screen === 'tools') {
      const toolRows = commands.filter((c) => (c.tool || c.name) === row.label).slice(0, 20);
      push('detail', {
        type: 'tool',
        title: row.label,
        detail: `${toolRows.length} commands available`,
        command: toolRows[0]?.syntax || '',
        extra: toolRows,
      });
      return;
    }

    push('detail', row.payload || row);
  };

  const helpText = (screen) => {
    if (screen === 'search') return 'Type to search • Enter open • c copy • b back';
    if (screen === 'detail') return 'p preview command • c copy command • m bookmark • b back';
    return '↑/↓ navigate • Enter select • / search • b back • q quit';
  };

  const render = () => {
    const width = process.stdout.columns || 100;
    const screen = current().screen;
    const rows = viewRows();
    const breadcrumb = `Home${stack.slice(1).map((s) => ` > ${s.screen[0].toUpperCase()}${s.screen.slice(1)}`).join('')}`;

    process.stdout.write('\x1Bc');

    const titleColor = settings.theme === 'dark' ? chalk.cyanBright : chalk.blue;
    const selectedColor = settings.theme === 'dark' ? chalk.bgBlue.white : chalk.bgCyan.black;

    process.stdout.write(`${titleColor.bold('OS Oracle Interactive Terminal')} ${chalk.gray('offline-first')}\n`);
    process.stdout.write(`${chalk.gray(truncate(breadcrumb, width))}\n`);
    process.stdout.write(`${chalk.gray(`Network: ${settings.networkStatus} • Last check: ${new Date(settings.offlineVerifiedAt).toLocaleString()}`)}\n\n`);

    if (screen === 'search') {
      process.stdout.write(`${chalk.yellow('Search:')} ${query || chalk.gray('type to search...')}\n\n`);
    }

    if (screen === 'detail') {
      const item = current().item || {};
      process.stdout.write(`${chalk.bold.green(truncate(item.title || item.label || 'Details', width))}\n`);
      if (item.detail) process.stdout.write(`${chalk.gray(truncate(item.detail, width))}\n`);
      if (item.command) process.stdout.write(`\n${chalk.bold('Command Preview:')}\n${chalk.magenta(item.command)}\n`);
      if (Array.isArray(item.extra) && item.extra.length) {
        process.stdout.write(`\n${chalk.bold('Top Commands:')}\n`);
        item.extra.slice(0, 8).forEach((r, i) => {
          process.stdout.write(`${chalk.gray(String(i + 1).padStart(2, ' '))}. ${truncate(r.syntax, width - 6)}\n`);
        });
      }
    } else {
      rows.forEach((row, i) => {
        const marker = i === selected ? '❯' : ' ';
        const line = `${marker} ${truncate(row.label || row.title || String(row), Math.max(20, width - 6))}`;
        process.stdout.write(i === selected ? `${selectedColor(line)}\n` : `${line}\n`);
        if (i === selected && row.hint) {
          process.stdout.write(`${chalk.gray(`   ${truncate(row.hint, width - 4)}`)}\n`);
        }
      });
      if (!rows.length && screen === 'search') {
        process.stdout.write(chalk.gray('No results yet. Keep typing...') + '\n');
      }
    }

    process.stdout.write(`\n${chalk.dim(nowTip(screen))}\n`);
    process.stdout.write(`${chalk.gray(helpText(screen))}\n`);
    if (notice && Date.now() - noticeAt < 4000) {
      process.stdout.write(`${chalk.green(`✓ ${truncate(notice, width - 2)}`)}\n`);
    }
  };

  render();

  process.stdin.on('keypress', async (str, key) => {
    const screen = current().screen;

    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      cleanup();
      return process.exit(0);
    }

    if (key.name === 'left' || key.name === 'escape' || str === 'b') {
      pop();
      render();
      return;
    }

    if (str === '/') {
      push('search');
      render();
      return;
    }

    if (screen === 'search') {
      if (key.name === 'backspace') {
        query = query.slice(0, -1);
        selected = 0;
      } else if (key.name === 'return') {
        await openSelection();
      } else if (key.name === 'up') {
        selected = Math.max(0, selected - 1);
      } else if (key.name === 'down') {
        selected = Math.min(Math.max(0, viewRows().length - 1), selected + 1);
      } else if (str && !key.ctrl && !key.meta && str.length === 1) {
        query += str;
        selected = 0;
      }
      render();
      return;
    }

    if (screen === 'detail') {
      const item = current().item || {};
      if (str === 'c') {
        if (item.command && osc52Copy(item.command)) setNotice('Command copied to clipboard.');
        else setNotice('No command available to copy.');
      } else if (str === 'p') {
        if (item.command) setNotice(`Preview: ${item.command}`);
        else setNotice('No command preview available.');
      } else if (str === 'm') {
        const bookmarks = getBookmarks();
        const value = item.title || item.label;
        if (value && !bookmarks.some((b) => b.item === value)) {
          bookmarks.unshift({ item: value, timestamp: new Date().toISOString() });
          saveBookmarks(bookmarks.slice(0, 200));
          setNotice(`Bookmarked: ${value}`);
        } else {
          setNotice('Already bookmarked.');
        }
      }
      render();
      return;
    }

    if (key.name === 'up') selected = Math.max(0, selected - 1);
    else if (key.name === 'down') selected = Math.min(Math.max(0, viewRows().length - 1), selected + 1);
    else if (key.name === 'return') await openSelection();

    render();
  });

  return new Promise(() => {});
}
