import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

const needsJsExtension = (specifier) =>
  specifier.startsWith('.') && !/\.(?:[cm]?js|json)$/u.test(specifier);

const rewriteSpecifiers = (source) =>
  source
    .replace(/(from\s+['"])(\.{1,2}\/[^'"\n]+)(['"])/gu, (_, prefix, specifier, suffix) =>
      `${prefix}${needsJsExtension(specifier) ? `${specifier}.js` : specifier}${suffix}`,
    )
    .replace(/(import\(\s*['"])(\.{1,2}\/[^'"\n]+)(['"]\s*\))/gu, (_, prefix, specifier, suffix) =>
      `${prefix}${needsJsExtension(specifier) ? `${specifier}.js` : specifier}${suffix}`,
    );

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!entry.name.endsWith('.js')) continue;

    const original = await fs.readFile(fullPath, 'utf8');
    const rewritten = rewriteSpecifiers(original);
    if (rewritten !== original) {
      await fs.writeFile(fullPath, rewritten);
    }
  }
}

await walk(distDir);

const wrapper = `import { fileURLToPath } from 'node:url';\nimport { resolve } from 'node:path';\nimport main from './cli/src/index.js';\n\nexport default main;\n\nif (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {\n  await main(process.argv.slice(2));\n}\n`;

await fs.writeFile(join(distDir, 'index.js'), wrapper);
