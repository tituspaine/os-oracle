#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const entryFile = join(__dirname, '../dist/index.js');

if (!existsSync(entryFile)) {
  console.error('OS Oracle CLI is not built yet. Run `npm install` and `npm run build` inside cli/.');
  process.exit(1);
}

const { default: main } = await import(entryFile);
await main(process.argv.slice(2));
