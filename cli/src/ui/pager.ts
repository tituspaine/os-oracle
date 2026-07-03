import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { muted } from './display';

export async function paginate(lines: string[], pageSize = 18): Promise<boolean> {
  if (lines.length === 0) return true;

  if (!input.isTTY || !output.isTTY || lines.length <= pageSize) {
    for (const line of lines) console.log(line);
    return true;
  }

  const rl = readline.createInterface({ input, output });

  try {
    for (let start = 0; start < lines.length; start += pageSize) {
      for (const line of lines.slice(start, start + pageSize)) {
        console.log(line);
      }

      if (start + pageSize < lines.length) {
        const answer = (await rl.question(muted('Press Enter to continue, q to quit: ')))
          .trim()
          .toLowerCase();

        if (answer === 'q') return false;
      }
    }

    return true;
  } finally {
    rl.close();
  }
}
