import { WALKTHROUGHS, walkthroughBySlug } from '../data/loader';
import { code, difficultyBadge, heading, muted, note, subheading, tag } from '../ui/display';
import { paginate } from '../ui/pager';

const findWalkthrough = (slug: string) =>
  walkthroughBySlug(slug) ?? WALKTHROUGHS.find((walkthrough) => walkthrough.title.toLowerCase() === slug.toLowerCase());

export async function walkthroughCommand(slug: string): Promise<void> {
  const walkthrough = findWalkthrough(slug.trim());

  if (!walkthrough) {
    console.log(`Walkthrough not found: ${slug}`);
    return;
  }

  const lines: string[] = [
    heading(walkthrough.title),
    `${tag('WALKTHROUGH')} ${muted(walkthrough.slug)}`,
    `${subheading('Difficulty')}: ${difficultyBadge(walkthrough.difficulty)}`,
    `${subheading('Duration')}: ${walkthrough.duration}`,
    `${subheading('Lab setup')}: ${walkthrough.labSetup}`,
    `${subheading('Related tools')}: ${walkthrough.toolSlugs?.join(', ') || 'None listed'}`,
    '',
    walkthrough.scenario,
    '',
    `${subheading('Legal note')}: ${note(walkthrough.legalNote)}`,
    '',
    subheading('Steps'),
  ];

  for (const [index, step] of walkthrough.steps.entries()) {
    lines.push(`${index + 1}. ${step.title}`);
    if (step.narration) lines.push(`   ${step.narration}`);
    if (step.command) lines.push(`   Command: ${code(step.command)}`);
    if (step.expectedOutput) lines.push(`   Expected output: ${step.expectedOutput}`);
    if (step.observation) lines.push(`   Observation: ${step.observation}`);
    if (step.toolSlugs && step.toolSlugs.length) lines.push(`   Tools: ${step.toolSlugs.join(', ')}`);

    for (const branch of step.branches ?? []) {
      lines.push(`   When: ${branch.when}`);
      lines.push(`   Then: ${branch.then}`);
    }

    lines.push('');
  }

  lines.push(subheading('Success criteria'));
  lines.push(walkthrough.successCriteria);
  lines.push('');
  lines.push(subheading('Detection summary'));
  lines.push(walkthrough.detectionSummary);
  lines.push('');
  lines.push(subheading('Mitigation summary'));
  lines.push(walkthrough.mitigationSummary);

  await paginate(lines);
}
