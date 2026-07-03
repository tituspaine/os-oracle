import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { banner, error as errorText, muted, subheading } from './ui/display';
import { searchCommand } from './commands/search';
import { toolsCommand } from './commands/tools';
import { toolCommand } from './commands/tool';
import { playbooksCommand } from './commands/playbooks';
import { playbookCommand } from './commands/playbook';
import { distrosCommand } from './commands/distros';
import { distroCommand } from './commands/distro';
import { walkthroughsCommand } from './commands/walkthroughs';
import { walkthroughCommand } from './commands/walkthrough';
import { resourcesCommand } from './commands/resources';
import { bookmarksCommand } from './commands/bookmarks';

function showHelp(): void {
  banner();
  console.log(`Usage:
  os-oracle                     interactive menu
  os-oracle search <query>
  os-oracle tools
  os-oracle tool <slug>
  os-oracle playbooks
  os-oracle playbook <slug>
  os-oracle walkthroughs
  os-oracle walkthrough <slug>
  os-oracle distros
  os-oracle distro <slug>
  os-oracle resources
  os-oracle bookmarks
  os-oracle bookmarks add <type> <slug>
  os-oracle bookmarks remove <type> <slug>
  os-oracle help
`);
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

async function interactiveBookmarks(): Promise<void> {
  const action = (await prompt('Bookmarks action [list/add/remove/clear]: ')).toLowerCase() || 'list';
  if (action === 'list' || action === 'clear') {
    await bookmarksCommand([action]);
    return;
  }

  const type = await prompt('Type [tool/playbook/walkthrough/distro]: ');
  const slug = await prompt('Slug: ');
  await bookmarksCommand([action, type, slug]);
}

async function interactiveMenu(): Promise<void> {
  banner();

  while (true) {
    console.log('1. Search');
    console.log('2. List tools');
    console.log('3. View tool');
    console.log('4. List playbooks');
    console.log('5. View playbook');
    console.log('6. List walkthroughs');
    console.log('7. View walkthrough');
    console.log('8. List distros');
    console.log('9. View distro');
    console.log('10. Resources');
    console.log('11. Bookmarks');
    console.log('12. Help');
    console.log('0. Exit');

    const choice = await prompt(subheading('Choose an option: '));
    console.log('');

    switch (choice) {
      case '1':
        await searchCommand(await prompt('Search query: '));
        break;
      case '2':
        await toolsCommand();
        break;
      case '3':
        await toolCommand(await prompt('Tool slug: '));
        break;
      case '4':
        await playbooksCommand();
        break;
      case '5':
        await playbookCommand(await prompt('Playbook slug: '));
        break;
      case '6':
        await walkthroughsCommand();
        break;
      case '7':
        await walkthroughCommand(await prompt('Walkthrough slug: '));
        break;
      case '8':
        await distrosCommand();
        break;
      case '9':
        await distroCommand(await prompt('Distro slug: '));
        break;
      case '10':
        await resourcesCommand();
        break;
      case '11':
        await interactiveBookmarks();
        break;
      case '12':
        showHelp();
        break;
      case '0':
      case 'q':
      case 'quit':
      case 'exit':
        console.log(muted('Goodbye.'));
        return;
      default:
        console.log(errorText(`Unknown choice: ${choice}`));
    }

    console.log('');
  }
}

async function requireValue(value: string | undefined, usage: string): Promise<string | undefined> {
  if (value && value.trim()) return value;
  console.log(errorText(usage));
  process.exitCode = 1;
  return undefined;
}

export default async function main(args = process.argv.slice(2)): Promise<void> {
  const [command, ...rest] = args;

  switch (command) {
    case undefined:
      await interactiveMenu();
      return;
    case 'search':
      await searchCommand(rest.join(' '));
      return;
    case 'tools':
      await toolsCommand();
      return;
    case 'tool': {
      const slug = await requireValue(rest[0], 'Usage: os-oracle tool <slug>');
      if (slug) await toolCommand(slug);
      return;
    }
    case 'playbooks':
      await playbooksCommand();
      return;
    case 'playbook': {
      const slug = await requireValue(rest[0], 'Usage: os-oracle playbook <slug>');
      if (slug) await playbookCommand(slug);
      return;
    }
    case 'walkthroughs':
      await walkthroughsCommand();
      return;
    case 'walkthrough': {
      const slug = await requireValue(rest[0], 'Usage: os-oracle walkthrough <slug>');
      if (slug) await walkthroughCommand(slug);
      return;
    }
    case 'distros':
      await distrosCommand();
      return;
    case 'distro': {
      const slug = await requireValue(rest[0], 'Usage: os-oracle distro <slug>');
      if (slug) await distroCommand(slug);
      return;
    }
    case 'resources':
      await resourcesCommand();
      return;
    case 'bookmarks':
      await bookmarksCommand(rest);
      return;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      return;
    default:
      console.log(errorText(`Unknown command: ${command}`));
      showHelp();
      process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
