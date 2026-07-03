#!/usr/bin/env node
/**
 * OS Oracle — CLI build script
 * Copies the CLI entry point and data files into dist/ so the package
 * can be published to npm and run via `npx os-oracle`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SRC_CLI = path.join(root, 'src', 'cli', 'index.js');
const SRC_DATA = path.join(root, 'src', 'data');
const DIST = path.join(root, 'dist');
const DIST_DATA = path.join(DIST, 'data');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Copy CLI entry point
fs.copyFileSync(SRC_CLI, path.join(DIST, 'cli.js'));
console.log('✓  dist/cli.js');

// Copy JSON data files only (TypeScript sources are not needed at runtime)
fs.mkdirSync(DIST_DATA, { recursive: true });
for (const entry of fs.readdirSync(SRC_DATA)) {
  if (entry.endsWith('.json')) {
    fs.copyFileSync(path.join(SRC_DATA, entry), path.join(DIST_DATA, entry));
    console.log(`✓  dist/data/${entry}`);
  }
}

console.log('\nBuild complete → dist/');
