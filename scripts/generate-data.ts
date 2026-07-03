/**
 * generate-data.ts
 * Reads existing TypeScript data sources and writes them as JSON to src/data/json/
 * Run with: bun run generate:data   (or: npx tsx scripts/generate-data.ts)
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT_DIR = join(__dirname, "../src/data/json");

mkdirSync(OUT_DIR, { recursive: true });

// Import data from existing TypeScript sources
import { DISTROS } from "../src/data/distros";
import { KALI_TOOLS, PLAYBOOKS, WALKTHROUGHS } from "../src/data/index";

function write(filename: string, data: unknown) {
  const dest = join(OUT_DIR, filename);
  const entries = Array.isArray(data) ? data.length : Object.keys(data as object).length;
  writeFileSync(dest, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Wrote ${filename} (${entries} entries)`);
}

// ─── Distros ─────────────────────────────────────────────────────────────────
write("distros.json", DISTROS);

// ─── Kali tools ──────────────────────────────────────────────────────────────
write("commands.json", KALI_TOOLS);

// ─── Flatten all errors across tools + distros ───────────────────────────────
type AnyError = { message: string; cause: string; fix: string; tool?: string; distro?: string };
const errors: AnyError[] = [];
for (const tool of KALI_TOOLS as Array<{ slug: string; errors?: AnyError[] }>) {
  for (const e of tool.errors ?? []) {
    errors.push({ ...e, tool: tool.slug });
  }
}
for (const d of DISTROS as Array<{ slug: string; errors?: AnyError[] }>) {
  for (const e of d.errors ?? []) {
    errors.push({ ...e, distro: d.slug });
  }
}
write("errors.json", errors);

// ─── Playbooks ───────────────────────────────────────────────────────────────
write("playbooks.json", PLAYBOOKS);

// ─── Walkthroughs ─────────────────────────────────────────────────────────────
write("walkthroughs.json", WALKTHROUGHS);

console.log("\n🎉 All data files generated successfully!");
console.log(`   Output directory: ${OUT_DIR}`);
