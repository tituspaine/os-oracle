import { PLAYBOOKS } from '../data/loader';
import { heading, muted, severityBadge, subheading, truncate } from '../ui/display';
import { paginate } from '../ui/pager';

export async function playbooksCommand(): Promise<void> {
  const grouped = new Map<string, typeof PLAYBOOKS>();

  for (const playbook of PLAYBOOKS) {
    const current = grouped.get(playbook.category) ?? [];
    current.push(playbook);
    grouped.set(playbook.category, current);
  }

  const lines: string[] = [
    heading('Playbooks'),
    muted(`${PLAYBOOKS.length} playbooks grouped by category`),
    '',
  ];

  for (const category of [...grouped.keys()].sort((a, b) => a.localeCompare(b))) {
    lines.push(subheading(category));

    for (const playbook of [...(grouped.get(category) ?? [])].sort((a, b) => a.title.localeCompare(b.title))) {
      lines.push(
        `• ${severityBadge(playbook.severity)} ${playbook.title} ${muted(`(${playbook.slug})`)} — ${truncate(playbook.summary, 68)}`,
      );
    }

    lines.push('');
  }

  await paginate(lines);
}
