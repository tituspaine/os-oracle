import { PLAYBOOKS, playbookBySlug } from '../data/loader';
import { code, heading, muted, note, severityBadge, subheading, tag } from '../ui/display';
import { paginate } from '../ui/pager';

const findPlaybook = (slug: string) =>
  playbookBySlug(slug) ?? PLAYBOOKS.find((playbook) => playbook.title.toLowerCase() === slug.toLowerCase());

export async function playbookCommand(slug: string): Promise<void> {
  const playbook = findPlaybook(slug.trim());

  if (!playbook) {
    console.log(`Playbook not found: ${slug}`);
    return;
  }

  const lines: string[] = [
    heading(playbook.title),
    `${tag('PLAYBOOK')} ${muted(playbook.slug)}`,
    `${subheading('Category')}: ${playbook.category}`,
    `${subheading('Severity')}: ${severityBadge(playbook.severity)}`,
    playbook.cve && playbook.cve.length ? `${subheading('CWE / CVE')}: ${playbook.cve.join(', ')}` : '',
    playbook.mitreAttack && playbook.mitreAttack.length ? `${subheading('MITRE ATT&CK')}: ${playbook.mitreAttack.join(', ')}` : '',
    '',
    playbook.summary,
    '',
    subheading('Prerequisites'),
    ...playbook.prerequisites.map((item) => `• ${item}`),
    '',
    `${subheading('Related tools')}: ${playbook.toolSlugs.join(', ') || 'None listed'}`,
    `${subheading('Legal note')}: ${note(playbook.legalNote)}`,
    '',
    subheading('Steps'),
  ].filter(Boolean);

  for (const [index, step] of playbook.steps.entries()) {
    lines.push(`${index + 1}. ${step.title}`);
    lines.push(`   ${step.detail}`);

    for (const command of step.commands) {
      lines.push(`   Command: ${code(command.code)}`);
      if (command.note) lines.push(`   ${note(command.note)}`);
    }

    lines.push('');
  }

  lines.push(subheading('Known errors'));

  for (const issue of playbook.errors) {
    lines.push(`• ${issue.message}`);
    lines.push(`  Cause: ${issue.cause}`);
    lines.push(`  Fix: ${issue.fix}`);
    lines.push('');
  }

  lines.push(subheading('Detection'));
  lines.push(playbook.detection);
  lines.push('');
  lines.push(subheading('Mitigation'));
  lines.push(playbook.mitigation);

  await paginate(lines);
}
