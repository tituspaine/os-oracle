import { WALKTHROUGHS } from '../data/loader';
import { difficultyBadge, heading, muted, subheading, truncate } from '../ui/display';
import { paginate } from '../ui/pager';

export async function walkthroughsCommand(): Promise<void> {
  const lines: string[] = [
    heading('Walkthroughs'),
    muted(`${WALKTHROUGHS.length} guided walkthroughs`),
    '',
    subheading('Available walkthroughs'),
  ];

  for (const walkthrough of [...WALKTHROUGHS].sort((a, b) => a.title.localeCompare(b.title))) {
    lines.push(
      `• ${difficultyBadge(walkthrough.difficulty)} ${walkthrough.title} ${muted(`(${walkthrough.slug})`)} — ${truncate(walkthrough.scenario, 74)}`,
    );
    lines.push(`  ${muted(`${walkthrough.duration} • ${walkthrough.labSetup}`)}`);
  }

  await paginate(lines);
}
