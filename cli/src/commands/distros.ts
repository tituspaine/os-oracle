import { DISTROS } from '../data/loader';
import { familyLabel, heading, muted, subheading, truncate } from '../ui/display';
import { paginate } from '../ui/pager';

export async function distrosCommand(): Promise<void> {
  const grouped = new Map<string, typeof DISTROS>();

  for (const distro of DISTROS) {
    const current = grouped.get(distro.family) ?? [];
    current.push(distro);
    grouped.set(distro.family, current);
  }

  const lines: string[] = [
    heading('Linux distros'),
    muted(`${DISTROS.length} distributions grouped by family`),
    '',
  ];

  for (const family of [...grouped.keys()].sort((a, b) => a.localeCompare(b))) {
    lines.push(subheading(familyLabel(family)));

    for (const distro of [...(grouped.get(family) ?? [])].sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(`• ${distro.name} ${muted(`(${distro.slug})`)} — ${truncate(distro.summary, 72)}`);
    }

    lines.push('');
  }

  await paginate(lines);
}
