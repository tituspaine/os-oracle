import { KALI_TOOLS, kaliToolBySlug } from '../data/loader';
import { code, heading, muted, note, subheading, tag } from '../ui/display';
import { paginate } from '../ui/pager';

const findTool = (slug: string) =>
  kaliToolBySlug(slug) ?? KALI_TOOLS.find((tool) => tool.name.toLowerCase() === slug.toLowerCase());

export async function toolCommand(slug: string): Promise<void> {
  const tool = findTool(slug.trim());

  if (!tool) {
    console.log(`Tool not found: ${slug}`);
    return;
  }

  const lines: string[] = [
    heading(tool.name),
    `${tag('TOOL')} ${muted(tool.slug)}`,
    `${subheading('Category')}: ${tool.category}`,
    `${subheading('Package')}: ${tool.package}`,
    `${subheading('Invocation')}: ${code(tool.invocation)}`,
    `${subheading('Homepage')}: ${tool.homepage}`,
    '',
    tool.summary,
    '',
    subheading('Commands'),
  ];

  for (const [index, command] of (tool.commands ?? []).entries()) {
    lines.push(`${index + 1}. ${command.name}`);
    lines.push(`   Syntax: ${code(command.syntax)}`);
    lines.push(`   Description: ${command.description}`);
    lines.push(`   Best scenario: ${command.bestScenario}`);
    lines.push(`   Category: ${command.category}`);

    for (const example of command.examples) {
      lines.push(`   Example: ${code(example.code)}`);
      if (example.note) lines.push(`     ${note(example.note)}`);
    }

    lines.push('');
  }

  if (!tool.commands || tool.commands.length === 0) {
    lines.push(muted('No detailed commands available.'));
    lines.push('');
  }

  lines.push(subheading('Known errors'));

  for (const issue of tool.errors ?? []) {
    lines.push(`• ${issue.message}`);
    lines.push(`  Cause: ${issue.cause}`);
    lines.push(`  Fix: ${issue.fix}`);
    lines.push('');
  }

  if (!tool.errors || tool.errors.length === 0) {
    lines.push(muted('No known errors documented.'));
  }

  await paginate(lines);
}
