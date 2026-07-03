import { DISTROS, distroBySlug } from '../data/loader';
import { code, familyLabel, heading, muted, note, subheading, tag } from '../ui/display';
import { paginate } from '../ui/pager';

const findDistro = (slug: string) =>
  distroBySlug(slug) ?? DISTROS.find((distro) => distro.name.toLowerCase() === slug.toLowerCase());

export async function distroCommand(slug: string): Promise<void> {
  const distro = findDistro(slug.trim());

  if (!distro) {
    console.log(`Distro not found: ${slug}`);
    return;
  }

  const groupedCommands = new Map<string, typeof distro.commands>();
  for (const command of distro.commands) {
    const current = groupedCommands.get(command.category) ?? [];
    current.push(command);
    groupedCommands.set(command.category, current);
  }

  const lines: string[] = [
    heading(distro.name),
    `${tag('DISTRO')} ${muted(distro.slug)}`,
    `${subheading('Family')}: ${familyLabel(distro.family)}`,
    `${subheading('Developer')}: ${distro.developer}`,
    `${subheading('First released')}: ${distro.firstReleased}`,
    `${subheading('Package manager')}: ${distro.packageManager}`,
    `${subheading('Default shell')}: ${distro.defaultShell}`,
    `${subheading('Init system')}: ${distro.init}`,
    '',
    distro.summary,
    '',
    subheading('Best use cases'),
    ...distro.bestUseCases.map((item) => `• ${item}`),
    '',
    subheading('When to use'),
    ...distro.whenToUse.map((item) => `• ${item}`),
    '',
    subheading('When not to use'),
    ...distro.whenNotToUse.map((item) => `• ${item}`),
    '',
    subheading('Commands'),
  ];

  for (const category of [...groupedCommands.keys()].sort((a, b) => a.localeCompare(b))) {
    lines.push(category);

    for (const command of groupedCommands.get(category) ?? []) {
      lines.push(`  • ${command.name}`);
      lines.push(`    Syntax: ${code(command.syntax)}`);
      lines.push(`    Description: ${command.description}`);
      lines.push(`    Best scenario: ${command.bestScenario}`);
      for (const example of command.examples) {
        lines.push(`    Example: ${code(example.code)}`);
        if (example.note) lines.push(`    ${note(example.note)}`);
      }
    }

    lines.push('');
  }

  lines.push(subheading('Known errors'));
  for (const issue of distro.errors) {
    lines.push(`• ${issue.message}`);
    lines.push(`  Cause: ${issue.cause}`);
    lines.push(`  Fix: ${issue.fix}`);
    lines.push('');
  }

  await paginate(lines);
}
