import { KALI_TOOLS } from '../data/loader';
import { heading, muted, subheading, truncate } from '../ui/display';
import { paginate } from '../ui/pager';

export async function toolsCommand(): Promise<void> {
  const grouped = new Map<string, typeof KALI_TOOLS>();

  for (const tool of KALI_TOOLS) {
    const current = grouped.get(tool.category) ?? [];
    current.push(tool);
    grouped.set(tool.category, current);
  }

  const lines: string[] = [
    heading('Kali tools'),
    muted(`${KALI_TOOLS.length} tools grouped by category`),
    '',
  ];

  let index = 1;

  for (const category of [...grouped.keys()].sort((a, b) => a.localeCompare(b))) {
    lines.push(subheading(category));

    for (const tool of [...(grouped.get(category) ?? [])].sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(
        `${String(index).padStart(3, ' ')}. ${tool.name} ${muted(`(${tool.slug})`)} — ${truncate(tool.summary, 60)}`,
      );
      index += 1;
    }

    lines.push('');
  }

  await paginate(lines);
}
