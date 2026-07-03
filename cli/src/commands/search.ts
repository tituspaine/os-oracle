import { DISTROS, KALI_TOOLS, PLAYBOOKS, WALKTHROUGHS } from '../data/loader';
import { RESOURCE_GROUPS } from './resources';
import { heading, muted, subheading, tag } from '../ui/display';
import { paginate } from '../ui/pager';

type SearchHit = {
  kind: 'tool' | 'playbook' | 'distro' | 'walkthrough' | 'resource';
  slug: string;
  title: string;
  summary: string;
  score: number;
  meta?: string;
};

const rank = (query: string, ...fields: string[]) => {
  const q = query.toLowerCase();
  let score = 0;

  for (const field of fields) {
    const value = field.toLowerCase();
    if (value === q) score += 100;
    else if (value.startsWith(q)) score += 40;
    else if (value.includes(q)) score += 10;
  }

  return score;
};

const include = (query: string, ...fields: string[]) =>
  fields.some((field) => field.toLowerCase().includes(query.toLowerCase()));

export async function searchCommand(query: string): Promise<void> {
  const q = query.trim();
  if (!q) {
    console.log('Provide a search query. Example: os-oracle search nmap');
    return;
  }

  const hits: SearchHit[] = [];

  for (const tool of KALI_TOOLS) {
    const commandText = (tool.commands ?? [])
      .flatMap((command) => [command.name, command.syntax, command.description, command.bestScenario])
      .join(' ');

    if (include(q, tool.slug, tool.name, tool.summary, tool.category, tool.package, tool.invocation, commandText)) {
      hits.push({
        kind: 'tool',
        slug: tool.slug,
        title: tool.name,
        summary: tool.summary,
        score: rank(q, tool.slug, tool.name, tool.category, tool.package),
        meta: tool.category,
      });
    }
  }

  for (const playbook of PLAYBOOKS) {
    const stepText = playbook.steps.flatMap((step) => [step.title, step.detail]).join(' ');

    if (include(q, playbook.slug, playbook.title, playbook.summary, playbook.category, playbook.severity, stepText)) {
      hits.push({
        kind: 'playbook',
        slug: playbook.slug,
        title: playbook.title,
        summary: playbook.summary,
        score: rank(q, playbook.slug, playbook.title, playbook.category, playbook.severity),
        meta: `${playbook.category} • ${playbook.severity}`,
      });
    }
  }

  for (const distro of DISTROS) {
    const commandText = distro.commands.flatMap((command) => [command.name, command.syntax, command.description]).join(' ');

    if (include(q, distro.slug, distro.name, distro.summary, distro.family, distro.packageManager, commandText)) {
      hits.push({
        kind: 'distro',
        slug: distro.slug,
        title: distro.name,
        summary: distro.summary,
        score: rank(q, distro.slug, distro.name, distro.family, distro.packageManager),
        meta: `${distro.family} • ${distro.packageManager}`,
      });
    }
  }

  for (const walkthrough of WALKTHROUGHS) {
    const stepText = walkthrough.steps.flatMap((step) => [step.title, step.narration ?? '', step.observation ?? '']).join(' ');

    if (include(q, walkthrough.slug, walkthrough.title, walkthrough.scenario, walkthrough.labSetup, walkthrough.difficulty, stepText)) {
      hits.push({
        kind: 'walkthrough',
        slug: walkthrough.slug,
        title: walkthrough.title,
        summary: walkthrough.scenario,
        score: rank(q, walkthrough.slug, walkthrough.title, walkthrough.difficulty),
        meta: `${walkthrough.difficulty} • ${walkthrough.duration}`,
      });
    }
  }

  for (const [group, items] of Object.entries(RESOURCE_GROUPS)) {
    for (const item of items) {
      if (include(q, group, item)) {
        hits.push({
          kind: 'resource',
          slug: item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          title: item,
          summary: `Reference entry in ${group}.`,
          score: rank(q, item, group),
          meta: group,
        });
      }
    }
  }

  hits.sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));

  if (hits.length === 0) {
    console.log(`No results found for "${q}".`);
    return;
  }

  const lines: string[] = [
    heading(`Search results for "${q}"`),
    muted(`${hits.length} match${hits.length === 1 ? '' : 'es'}`),
    '',
  ];

  for (const hit of hits) {
    lines.push(`${tag(hit.kind.toUpperCase())} ${subheading(hit.title)} ${muted(`(${hit.slug})`)}`);
    lines.push(`  ${hit.summary}`);
    if (hit.meta) lines.push(`  ${muted(hit.meta)}`);
    lines.push('');
  }

  await paginate(lines);
}
