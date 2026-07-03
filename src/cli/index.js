#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import Fuse from 'fuse.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { startTui } from './tui/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load data
const dataDirCandidates = [
  path.join(__dirname, '../data'),
  path.join(__dirname, './data'),
  path.join(process.cwd(), 'src/data'),
];
const dataDir = dataDirCandidates.find((candidate) => fs.existsSync(path.join(candidate, 'commands.json'))) || dataDirCandidates[0];
let commands = [];
let playbooks = [];
let errors = [];
let distros = [];
let walkthroughs = [];

try {
  if (fs.existsSync(path.join(dataDir, 'commands.json'))) {
    commands = JSON.parse(fs.readFileSync(path.join(dataDir, 'commands.json'), 'utf-8'));
  }
  if (fs.existsSync(path.join(dataDir, 'playbooks.json'))) {
    playbooks = JSON.parse(fs.readFileSync(path.join(dataDir, 'playbooks.json'), 'utf-8'));
  }
  if (fs.existsSync(path.join(dataDir, 'errors.json'))) {
    errors = JSON.parse(fs.readFileSync(path.join(dataDir, 'errors.json'), 'utf-8'));
  }
  if (fs.existsSync(path.join(dataDir, 'distros.json'))) {
    distros = JSON.parse(fs.readFileSync(path.join(dataDir, 'distros.json'), 'utf-8'));
  }
  if (fs.existsSync(path.join(dataDir, 'walkthroughs.json'))) {
    walkthroughs = JSON.parse(fs.readFileSync(path.join(dataDir, 'walkthroughs.json'), 'utf-8'));
  }
} catch (err) {
  console.error(chalk.red('Error loading data files'));
}

const configDir = path.join(os.homedir(), '.os-oracle');
fs.mkdirSync(configDir, { recursive: true });

// Helper functions
function getBookmarks() {
  const file = path.join(configDir, 'bookmarks.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function saveBookmarks(bookmarks) {
  fs.writeFileSync(path.join(configDir, 'bookmarks.json'), JSON.stringify(bookmarks, null, 2));
}

function addToHistory(query) {
  const file = path.join(configDir, 'history.json');
  let history = [];
  if (fs.existsSync(file)) {
    history = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }
  history.unshift({ query, timestamp: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(history.slice(0, 100), null, 2));
}

// Create search indexes
const commandIndex = new Fuse(commands, { keys: ['name', 'syntax', 'description'], threshold: 0.3 });
const playbookIndex = new Fuse(playbooks, { keys: ['title', 'summary', 'category'], threshold: 0.3 });
const errorIndex = new Fuse(errors, { keys: ['message', 'cause'], threshold: 0.3 });

// CLI Setup
const program = new Command();

program
  .name('os-oracle')
  .description('Global Ethical Hacking Reference Platform - Terminal Edition')
  .version('1.0.0');

program
  .command('tui')
  .description('Launch interactive keyboard-driven terminal UI')
  .action(async () => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      console.log(chalk.yellow('Interactive TUI requires a terminal (TTY).'));
      process.exit(1);
    }
    await startTui({
      commands,
      playbooks,
      errors,
      distros,
      walkthroughs,
      configDir,
      getBookmarks,
      saveBookmarks,
      addToHistory,
    });
  });

// SEARCH
program
  .command('search <query>')
  .option('--filter <type>', 'Filter: command, playbook, error')
  .option('--limit <number>', 'Limit results', '20')
  .action((query, options) => {
    addToHistory(query);
    const limit = parseInt(options.limit);
    
    console.log(chalk.cyan(`\n🔍 Search Results for "${query}"\n`));
    
    if (!options.filter || options.filter === 'command') {
      const results = commandIndex.search(query).slice(0, limit);
      if (results.length > 0) {
        console.log(chalk.bold.yellow('Commands:'));
        results.forEach(r => {
          console.log(chalk.green(`  • ${r.item.name}`));
          console.log(chalk.gray(`    ${r.item.syntax}`));
        });
      }
    }
    
    if (!options.filter || options.filter === 'playbook') {
      const results = playbookIndex.search(query).slice(0, limit);
      if (results.length > 0) {
        console.log(chalk.bold.yellow('\nPlaybooks:'));
        results.forEach(r => {
          console.log(chalk.green(`  • ${r.item.title}`));
          console.log(chalk.gray(`    ${r.item.summary}`));
        });
      }
    }
    
    if (!options.filter || options.filter === 'error') {
      const results = errorIndex.search(query).slice(0, limit);
      if (results.length > 0) {
        console.log(chalk.bold.yellow('\nErrors:'));
        results.forEach(r => {
          console.log(chalk.green(`  • ${r.item.message}`));
          console.log(chalk.gray(`    ${r.item.cause}`));
        });
      }
    }
    
    console.log();
  });

// TOOLS
program
  .command('tools')
  .option('--limit <number>', 'Limit results', '20')
  .action((options) => {
    const unique = [...new Map(commands.map(c => [c.tool, c])).values()];
    console.log(chalk.bold.cyan('\n🛠️  Available Kali Tools:\n'));
    unique.slice(0, parseInt(options.limit)).forEach(cmd => {
      console.log(chalk.green(`  • ${cmd.tool || cmd.name}`));
    });
    console.log();
  });

// TOOL
program
  .command('tool <name>')
  .option('--commands', 'Show commands')
  .option('--limit <number>', 'Limit', '10')
  .action((name, options) => {
    const toolCmds = commands.filter(c => (c.tool || c.name).toLowerCase() === name.toLowerCase());
    if (toolCmds.length === 0) {
      console.log(chalk.red(`\nTool '${name}' not found\n`));
      return;
    }
    
    console.log(chalk.bold.cyan(`\n${toolCmds[0].tool || name}\n`));
    
    if (options.commands) {
      console.log(chalk.bold.yellow('Commands:'));
      toolCmds.slice(0, parseInt(options.limit)).forEach(cmd => {
        console.log(chalk.green(`  ${cmd.syntax}`));
        console.log(chalk.gray(`    ${cmd.description}`));
      });
    } else {
      console.log(chalk.gray(`${toolCmds.length} commands available`));
      console.log(chalk.gray('Use: os-oracle tool ' + name + ' --commands\n'));
    }
  });

// PLAYBOOKS
program
  .command('playbooks')
  .option('--limit <number>', 'Limit', '20')
  .action((options) => {
    console.log(chalk.bold.cyan('\n📘 Attack Playbooks:\n'));
    playbooks.slice(0, parseInt(options.limit)).forEach(pb => {
      console.log(chalk.green(`  • ${pb.title}`));
      console.log(chalk.gray(`    ${pb.summary}`));
    });
    console.log();
  });

// PLAYBOOK
program
  .command('playbook <slug>')
  .action((slug) => {
    const pb = playbooks.find(p => p.slug === slug);
    if (!pb) {
      console.log(chalk.red(`\nPlaybook '${slug}' not found\n`));
      return;
    }
    
    console.log(chalk.bold.cyan(`\n${pb.title}\n`));
    console.log(chalk.gray(pb.summary + '\n'));
    
    if (pb.steps) {
      console.log(chalk.bold.yellow('Steps:'));
      pb.steps.forEach((s, i) => {
        console.log(chalk.green(`  ${i + 1}. ${s.title}`));
        console.log(chalk.gray(`     ${s.description}`));
      });
    }
    console.log();
  });

// DISTROS
program
  .command('distros')
  .action(() => {
    console.log(chalk.bold.cyan('\n🐧 Linux Distributions:\n'));
    distros.forEach(d => {
      console.log(chalk.green(`  • ${d.name}`));
    });
    console.log();
  });

// DISTRO
program
  .command('distro <name>')
  .option('--search <query>', 'Search')
  .option('--limit <number>', 'Limit', '15')
  .action((name, options) => {
    const distro = distros.find(d => d.name.toLowerCase() === name.toLowerCase());
    if (!distro) {
      console.log(chalk.red(`\nDistro '${name}' not found\n`));
      return;
    }
    
    console.log(chalk.bold.cyan(`\n${distro.name} Commands\n`));
    
    let cmds = distro.commands || [];
    if (options.search) {
      cmds = cmds.filter(c => c.name.toLowerCase().includes(options.search.toLowerCase()));
    }
    
    cmds.slice(0, parseInt(options.limit)).forEach(cmd => {
      console.log(chalk.green(`  ${cmd.syntax}`));
      console.log(chalk.gray(`    ${cmd.description}`));
    });
    console.log();
  });

// BOOKMARK
program
  .command('bookmark <action> [item]')
  .action((action, item) => {
    if (action === 'add' && item) {
      const bookmarks = getBookmarks();
      if (!bookmarks.some(b => b.item === item)) {
        bookmarks.push({ item, timestamp: new Date().toISOString() });
        saveBookmarks(bookmarks);
        console.log(chalk.green(`✓ Bookmarked: ${item}`));
      }
    } else if (action === 'list') {
      const bookmarks = getBookmarks();
      if (bookmarks.length === 0) {
        console.log(chalk.yellow('\nNo bookmarks yet\n'));
      } else {
        console.log(chalk.bold.cyan('\n⭐ Bookmarks:\n'));
        bookmarks.forEach(b => console.log(chalk.green(`  • ${b.item}`)));
        console.log();
      }
    }
  });

// HISTORY
program
  .command('history')
  .option('--clear', 'Clear history')
  .action((options) => {
    if (options.clear) {
      fs.writeFileSync(path.join(configDir, 'history.json'), JSON.stringify([], null, 2));
      console.log(chalk.green('✓ History cleared'));
      return;
    }
    
    const file = path.join(configDir, 'history.json');
    if (!fs.existsSync(file)) {
      console.log(chalk.yellow('\nNo history\n'));
      return;
    }
    
    const history = JSON.parse(fs.readFileSync(file, 'utf-8'));
    console.log(chalk.bold.cyan('\n📜 Recent Searches:\n'));
    history.slice(0, 20).forEach((h, i) => {
      console.log(chalk.green(`  ${i + 1}. ${h.query}`));
    });
    console.log();
  });

// OFFLINE
program
  .command('offline')
  .action(() => {
    console.log(chalk.green('\n✓ OS Oracle is fully offline-capable'));
    console.log(chalk.gray('All data is embedded locally'));
    console.log(chalk.gray('No internet connection required\n'));
  });

// VERSION
program
  .command('version')
  .action(() => {
    console.log(chalk.bold.cyan('\nOS Oracle v1.0.0'));
    console.log(chalk.gray('Terminal Edition - 100% Offline\n'));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  if (process.stdin.isTTY && process.stdout.isTTY) {
    await startTui({
      commands,
      playbooks,
      errors,
      distros,
      walkthroughs,
      configDir,
      getBookmarks,
      saveBookmarks,
      addToHistory,
    });
  } else {
    program.outputHelp();
  }
}