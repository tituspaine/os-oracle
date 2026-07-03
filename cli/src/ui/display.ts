import chalk from 'chalk';

export const heading = (text: string) => chalk.bold.cyan(text);
export const subheading = (text: string) => chalk.bold.yellow(text);
export const code = (text: string) => chalk.green(text);
export const note = (text: string) => chalk.cyan(text);
export const error = (text: string) => chalk.red(text);
export const success = (text: string) => chalk.green(text);
export const muted = (text: string) => chalk.dim(text);
export const tag = (text: string) => chalk.bgBlue.white(` ${text} `);

export function hr() {
  console.log(chalk.dim('─'.repeat(process.stdout.columns || 80)));
}

export function banner() {
  console.log(chalk.bold.cyan('\n  ██████╗ ███████╗    ██████╗ ██████╗  █████╗  ██████╗██╗     ███████╗'));
  console.log(chalk.bold.cyan('  ██╔═══██╗██╔════╝   ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██║     ██╔════╝'));
  console.log(chalk.bold.cyan('  ██║   ██║███████╗   ██║   ██║██████╔╝███████║██║     ██║     █████╗  '));
  console.log(chalk.bold.cyan('  ██║   ██║╚════██║   ██║   ██║██╔══██╗██╔══██║██║     ██║     ██╔══╝  '));
  console.log(chalk.bold.cyan('  ╚██████╔╝███████║   ╚██████╔╝██║  ██║██║  ██║╚██████╗███████╗███████╗'));
  console.log(chalk.bold.cyan('   ╚═════╝ ╚══════╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝'));
  console.log(chalk.dim('  Ethical Hacking Reference — Offline Terminal Edition\n'));
}

export const truncate = (text: string, length = 60) =>
  text.length <= length ? text : `${text.slice(0, Math.max(0, length - 1)).trimEnd()}…`;

export const severityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => ({
  low: chalk.green('🟢 low'),
  medium: chalk.yellow('🟡 medium'),
  high: chalk.hex('#ff9800')('🟠 high'),
  critical: chalk.red('🔴 critical'),
}[severity]);

export const difficultyBadge = (difficulty: 'beginner' | 'intermediate' | 'advanced') => ({
  beginner: chalk.green('beginner'),
  intermediate: chalk.yellow('intermediate'),
  advanced: chalk.red('advanced'),
}[difficulty]);

export const familyLabel = (family: string) => ({
  debian: 'Debian family',
  rhel: 'RHEL family',
  arch: 'Arch family',
  suse: 'SUSE family',
  alpine: 'Alpine family',
  gentoo: 'Gentoo family',
  slackware: 'Slackware family',
  nixos: 'NixOS family',
  kali: 'Kali family',
}[family] ?? family);
