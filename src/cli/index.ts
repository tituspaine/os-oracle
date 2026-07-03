#!/usr/bin/env node
// @ts-nocheck

import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import os from "os";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

type CommandExample = {
  code: string;
  note?: string;
};

type ToolCommand = {
  name: string;
  syntax: string;
  description: string;
  examples?: CommandExample[];
  bestScenario?: string;
  category?: string;
};

type KnownError = {
  message: string;
  cause: string;
  fix: string;
  tool?: string;
};

type KaliTool = {
  slug: string;
  name: string;
  category: string;
  package?: string;
  homepage?: string;
  summary?: string;
  invocation?: string;
  depth?: string;
  commands?: ToolCommand[];
  errors?: KnownError[];
};

type Distro = {
  slug: string;
  name: string;
  family: string;
  developer?: string;
  firstReleased?: string;
  summary?: string;
  bestUseCases?: string[];
  whenToUse?: string[];
  whenNotToUse?: string[];
  packageManager?: string;
  defaultShell?: string;
  init?: string;
  commands?: ToolCommand[];
  errors?: KnownError[];
};

type PlaybookStepCommand = {
  code: string;
  note?: string;
};

type PlaybookStep = {
  title: string;
  detail: string;
  commands?: PlaybookStepCommand[];
};

type Playbook = {
  slug: string;
  title: string;
  category?: string;
  severity?: string;
  summary?: string;
  steps?: PlaybookStep[];
};

type WalkthroughStep = {
  title: string;
  narration?: string;
  command?: string;
  expectedOutput?: string;
  observation?: string;
};

type Walkthrough = {
  slug: string;
  title: string;
  summary?: string;
  steps?: WalkthroughStep[];
};

type BookmarkType = "tool" | "distro" | "playbook" | "walkthrough";

type Bookmark = {
  type: BookmarkType;
  slug: string;
  addedAt: string;
};

type HistoryEntry = {
  timestamp: string;
  command: string;
};

type Config = {
  color: boolean;
  pageSize: number;
  dataDir?: string;
};

type ParsedArgs = {
  positionals: string[];
  flags: Record<string, string | boolean>;
};

type PaginationResult<T> = {
  items: T[];
  total: number;
  start: number;
  end: number;
  page: number;
  pages: number;
};

type SearchResult = {
  type: "tool" | "distro" | "playbook" | "walkthrough" | "error";
  slug: string;
  title: string;
  summary: string;
  meta?: string;
  score: number;
};

const DEFAULT_CONFIG: Config = {
  color: true,
  pageSize: 20,
};

const STORAGE_DIR = path.join(os.homedir(), ".os-oracle");
const BOOKMARKS_PATH = path.join(STORAGE_DIR, "bookmarks.json");
const HISTORY_PATH = path.join(STORAGE_DIR, "history.json");
const CONFIG_PATH = path.join(STORAGE_DIR, "config.json");
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE_NAMES = [
  "commands.json",
  "distros.json",
  "playbooks.json",
  "walkthroughs.json",
  "errors.json",
] as const;
const MAX_HISTORY_ENTRIES = 500;
const LINE_WIDTH = 96;

let activeConfig: Config = DEFAULT_CONFIG;
let colorsEnabled = shouldUseColor(DEFAULT_CONFIG, false);

function main(): void {
  ensureStorage();
  const parsed = parseArgs(process.argv.slice(2));
  activeConfig = loadConfig();
  colorsEnabled = shouldUseColor(activeConfig, parsed.flags.color === false);

  const commandText = process.argv.slice(2).join(" ").trim();
  const [command, subcommand, ...rest] = parsed.positionals;

  if (commandText && !(command === "history" && subcommand === "clear")) {
    appendHistory(commandText);
  }

  if (!command || parsed.flags.help === true) {
    printHelp();
    return;
  }

  switch (command) {
    case "search":
      handleSearch(rest.length > 0 ? [subcommand, ...rest].filter(Boolean) as string[] : subcommand ? [subcommand, ...rest] : [], parsed);
      return;
    case "tools":
      handleTools(parsed);
      return;
    case "tool":
      handleTool(subcommand);
      return;
    case "distros":
      handleDistros(parsed);
      return;
    case "distro":
      handleDistro(subcommand);
      return;
    case "playbooks":
      handlePlaybooks(parsed);
      return;
    case "playbook":
      handlePlaybook(subcommand);
      return;
    case "walkthroughs":
      handleWalkthroughs(parsed);
      return;
    case "walkthrough":
      handleWalkthrough(subcommand);
      return;
    case "bookmark":
      handleBookmark(subcommand, rest);
      return;
    case "bookmarks":
      handleBookmarks();
      return;
    case "history":
      handleHistory(subcommand, parsed);
      return;
    case "config":
      handleConfig(subcommand, rest);
      return;
    case "version":
      handleVersion();
      return;
    case "offline":
      handleOffline();
      return;
    default:
      fail(`Unknown command: ${command}`);
      printHelp();
  }
}

function handleSearch(args: string[], parsed: ParsedArgs): void {
  if (args.length === 0) {
    fail("Usage: os-oracle search <query> [--type tools|distros|playbooks|walkthroughs]");
    return;
  }

  const query = args.join(" ").trim();
  const requestedType = typeof parsed.flags.type === "string" ? parsed.flags.type.toLowerCase() : undefined;
  if (
    requestedType &&
    requestedType !== "tools" &&
    requestedType !== "distros" &&
    requestedType !== "playbooks" &&
    requestedType !== "walkthroughs"
  ) {
    fail("--type must be one of: tools, distros, playbooks, walkthroughs");
    return;
  }

  const requiredFiles =
    requestedType === "tools"
      ? ["commands.json"]
      : requestedType === "distros"
        ? ["distros.json"]
        : requestedType === "playbooks"
          ? ["playbooks.json"]
          : requestedType === "walkthroughs"
            ? ["walkthroughs.json"]
            : ["commands.json", "distros.json", "playbooks.json", "walkthroughs.json"];
  if (!requireDataFiles(requiredFiles)) {
    return;
  }

  const commands = requestedType === "distros" || requestedType === "playbooks" || requestedType === "walkthroughs"
    ? []
    : loadDataFile<KaliTool[]>("commands.json");
  const distros = requestedType && requestedType !== "distros" ? [] : loadDataFile<Distro[]>("distros.json");
  const playbooks = requestedType && requestedType !== "playbooks" ? [] : loadDataFile<Playbook[]>("playbooks.json");
  const walkthroughs = requestedType && requestedType !== "walkthroughs" ? [] : loadDataFile<Walkthrough[]>("walkthroughs.json");
  const errors = requestedType ? [] : loadDataFile<KnownError[]>("errors.json");

  const terms = tokenize(query);
  const results: SearchResult[] = [];

  for (const tool of commands) {
    const haystack = [
      tool.slug,
      tool.name,
      tool.category,
      tool.summary,
      tool.package,
      tool.invocation,
      ...arrayOrEmpty(tool.commands).flatMap((item) => [
        item.name,
        item.syntax,
        item.description,
        item.bestScenario,
        item.category,
        ...arrayOrEmpty(item.examples).flatMap((example) => [example.code, example.note]),
      ]),
      ...arrayOrEmpty(tool.errors).flatMap((item) => [item.message, item.cause, item.fix]),
    ];
    const score = scoreMatch(terms, haystack);
    if (score > 0) {
      results.push({
        type: "tool",
        slug: tool.slug,
        title: tool.name,
        summary: tool.summary ?? "No summary available.",
        meta: tool.category,
        score,
      });
    }
  }

  for (const distro of distros) {
    const haystack = [
      distro.slug,
      distro.name,
      distro.family,
      distro.developer,
      distro.summary,
      distro.packageManager,
      distro.defaultShell,
      distro.init,
      ...arrayOrEmpty(distro.bestUseCases),
      ...arrayOrEmpty(distro.whenToUse),
      ...arrayOrEmpty(distro.whenNotToUse),
      ...arrayOrEmpty(distro.commands).flatMap((item) => [item.name, item.syntax, item.description]),
      ...arrayOrEmpty(distro.errors).flatMap((item) => [item.message, item.cause, item.fix]),
    ];
    const score = scoreMatch(terms, haystack);
    if (score > 0) {
      results.push({
        type: "distro",
        slug: distro.slug,
        title: distro.name,
        summary: distro.summary ?? "No summary available.",
        meta: `family: ${distro.family}`,
        score,
      });
    }
  }

  for (const playbook of playbooks) {
    const haystack = [
      playbook.slug,
      playbook.title,
      playbook.category,
      playbook.severity,
      playbook.summary,
      ...arrayOrEmpty(playbook.steps).flatMap((step) => [
        step.title,
        step.detail,
        ...arrayOrEmpty(step.commands).flatMap((command) => [command.code, command.note]),
      ]),
    ];
    const score = scoreMatch(terms, haystack);
    if (score > 0) {
      results.push({
        type: "playbook",
        slug: playbook.slug,
        title: playbook.title,
        summary: playbook.summary ?? "No summary available.",
        meta: [playbook.category, playbook.severity].filter(Boolean).join(" • "),
        score,
      });
    }
  }

  for (const walkthrough of walkthroughs) {
    const haystack = [
      walkthrough.slug,
      walkthrough.title,
      walkthrough.summary,
      ...arrayOrEmpty(walkthrough.steps).flatMap((step) => [
        step.title,
        step.narration,
        step.command,
        step.expectedOutput,
        step.observation,
      ]),
    ];
    const score = scoreMatch(terms, haystack);
    if (score > 0) {
      results.push({
        type: "walkthrough",
        slug: walkthrough.slug,
        title: walkthrough.title,
        summary: walkthrough.summary ?? "No summary available.",
        meta: `${arrayOrEmpty(walkthrough.steps).length} steps`,
        score,
      });
    }
  }

  for (const error of errors) {
    const haystack = [error.message, error.cause, error.fix, error.tool];
    const score = scoreMatch(terms, haystack);
    if (score > 0) {
      results.push({
        type: "error",
        slug: error.tool ?? slugify(error.message),
        title: error.message,
        summary: error.fix,
        meta: error.tool ? `tool: ${error.tool}` : "known error",
        score,
      });
    }
  }

  results.sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));
  printHeader(`Search results for “${query}”`);

  if (results.length === 0) {
    warn("No matches found.");
    return;
  }

  const pageSize = getPageSize();
  const pagination = paginate(results, pageSize, parsed.flags.all === true, getPageFlag(parsed));
  for (const result of pagination.items) {
    const typeColor =
      result.type === "tool"
        ? color("cyan", result.type)
        : result.type === "distro"
          ? color("magenta", result.type)
          : result.type === "playbook"
            ? color("yellow", result.type)
            : result.type === "walkthrough"
              ? color("green", result.type)
              : color("red", result.type);
    console.log(`${typeColor} ${color("bold", result.title)} ${dim(`(${result.slug})`)}`);
    if (result.meta) {
      console.log(wrapLine(`Meta: ${result.meta}`, 2));
    }
    console.log(wrapLine(result.summary, 2));
    console.log(separator());
  }
  printPaginationSummary(pagination, parsed.flags.all === true);
}

function handleTools(parsed: ParsedArgs): void {
  if (!requireDataFiles(["commands.json"])) {
    return;
  }
  const tools = loadDataFile<KaliTool[]>("commands.json");

  const category = typeof parsed.flags.category === "string" ? parsed.flags.category : undefined;
  const filtered = category
    ? tools.filter((tool) => equalsIgnoreCase(tool.category, category))
    : tools;
  filtered.sort((left, right) => left.name.localeCompare(right.name));

  printHeader(category ? `Kali tools in ${category}` : "Kali tools");
  if (filtered.length === 0) {
    warn(`No tools found${category ? ` for category ${category}` : ""}.`);
    return;
  }

  const pagination = paginate(filtered, getPageSize(), parsed.flags.all === true, getPageFlag(parsed));
  for (const tool of pagination.items) {
    console.log(
      `${color("cyan", tool.name)} ${dim(`(${tool.slug})`)} ${color("yellow", `[${tool.category}]`)}`,
    );
    if (tool.summary) {
      console.log(wrapLine(tool.summary, 2));
    }
    console.log(separator());
  }
  printPaginationSummary(pagination, parsed.flags.all === true);
}

function handleTool(name: string | undefined): void {
  if (!name) {
    fail("Usage: os-oracle tool <name>");
    return;
  }
  if (!requireDataFiles(["commands.json"])) {
    return;
  }

  const tools = loadDataFile<KaliTool[]>("commands.json");
  const extraErrors = loadDataFile<KnownError[]>("errors.json");
  const tool = findBySlugOrName(tools, name, (item) => item.name);
  if (!tool) {
    fail(`Tool not found: ${name}`);
    return;
  }

  printHeader(tool.name);
  console.log(`${color("yellow", "Category:")} ${tool.category}`);
  if (tool.package) console.log(`${color("yellow", "Package:")} ${tool.package}`);
  if (tool.invocation) console.log(`${color("yellow", "Invocation:")} ${color("green", tool.invocation)}`);
  if (tool.homepage) console.log(`${color("yellow", "Homepage:")} ${tool.homepage}`);
  if (tool.summary) console.log(wrapLine(tool.summary, 0));

  const commands = arrayOrEmpty(tool.commands);
  if (commands.length > 0) {
    console.log(separator());
    console.log(color("bold", "Commands"));
    for (const command of commands) {
      console.log(`${color("green", command.name)} ${dim(command.category ? `[${command.category}]` : "")}`.trim());
      console.log(wrapLine(`Syntax: ${command.syntax}`, 2));
      console.log(wrapLine(command.description, 2));
      if (command.bestScenario) {
        console.log(wrapLine(`Best scenario: ${command.bestScenario}`, 2));
      }
      for (const example of arrayOrEmpty(command.examples)) {
        console.log(wrapLine(`Example: ${example.code}`, 4));
        if (example.note) {
          console.log(wrapLine(`Note: ${example.note}`, 6));
        }
      }
      console.log(separator());
    }
  }

  const mergedErrors = mergeErrors(tool.slug, arrayOrEmpty(tool.errors), extraErrors);
  if (mergedErrors.length > 0) {
    console.log(color("bold", "Common errors"));
    for (const error of mergedErrors) {
      console.log(color("red", `• ${error.message}`));
      console.log(wrapLine(`Cause: ${error.cause}`, 2));
      console.log(wrapLine(`Fix: ${error.fix}`, 2));
      console.log(separator());
    }
  }
}

function handleDistros(parsed: ParsedArgs): void {
  if (!requireDataFiles(["distros.json"])) {
    return;
  }
  const distros = loadDataFile<Distro[]>("distros.json");

  const family = typeof parsed.flags.family === "string" ? parsed.flags.family : undefined;
  const filtered = family ? distros.filter((item) => equalsIgnoreCase(item.family, family)) : distros;
  filtered.sort((left, right) => left.name.localeCompare(right.name));

  printHeader(family ? `Distros in ${family}` : "Linux distros");
  if (filtered.length === 0) {
    warn(`No distros found${family ? ` for family ${family}` : ""}.`);
    return;
  }

  const pagination = paginate(filtered, getPageSize(), parsed.flags.all === true, getPageFlag(parsed));
  for (const distro of pagination.items) {
    console.log(
      `${color("cyan", distro.name)} ${dim(`(${distro.slug})`)} ${color("yellow", `[${distro.family}]`)}`,
    );
    if (distro.summary) {
      console.log(wrapLine(distro.summary, 2));
    }
    console.log(separator());
  }
  printPaginationSummary(pagination, parsed.flags.all === true);
}

function handleDistro(name: string | undefined): void {
  if (!name) {
    fail("Usage: os-oracle distro <name>");
    return;
  }
  if (!requireDataFiles(["distros.json"])) {
    return;
  }

  const distros = loadDataFile<Distro[]>("distros.json");
  const distro = findBySlugOrName(distros, name, (item) => item.name);
  if (!distro) {
    fail(`Distro not found: ${name}`);
    return;
  }

  printHeader(distro.name);
  console.log(`${color("yellow", "Family:")} ${distro.family}`);
  if (distro.developer) console.log(`${color("yellow", "Developer:")} ${distro.developer}`);
  if (distro.firstReleased) console.log(`${color("yellow", "First released:")} ${distro.firstReleased}`);
  if (distro.packageManager) console.log(`${color("yellow", "Package manager:")} ${distro.packageManager}`);
  if (distro.defaultShell) console.log(`${color("yellow", "Default shell:")} ${distro.defaultShell}`);
  if (distro.init) console.log(`${color("yellow", "Init:")} ${distro.init}`);
  if (distro.summary) console.log(wrapLine(distro.summary, 0));
  printStringArray("Best use cases", distro.bestUseCases);
  printStringArray("When to use", distro.whenToUse);
  printStringArray("When not to use", distro.whenNotToUse);

  const commands = arrayOrEmpty(distro.commands);
  if (commands.length > 0) {
    console.log(separator());
    console.log(color("bold", "Useful commands"));
    for (const command of commands) {
      console.log(color("green", command.name));
      console.log(wrapLine(`Syntax: ${command.syntax}`, 2));
      console.log(wrapLine(command.description, 2));
      console.log(separator());
    }
  }

  const errors = arrayOrEmpty(distro.errors);
  if (errors.length > 0) {
    console.log(color("bold", "Common errors"));
    for (const error of errors) {
      console.log(color("red", `• ${error.message}`));
      console.log(wrapLine(`Cause: ${error.cause}`, 2));
      console.log(wrapLine(`Fix: ${error.fix}`, 2));
      console.log(separator());
    }
  }
}

function handlePlaybooks(parsed: ParsedArgs): void {
  if (!requireDataFiles(["playbooks.json"])) {
    return;
  }
  const playbooks = loadDataFile<Playbook[]>("playbooks.json");

  const category = typeof parsed.flags.category === "string" ? parsed.flags.category : undefined;
  const filtered = category
    ? playbooks.filter((item) => equalsIgnoreCase(item.category ?? "", category))
    : playbooks;
  filtered.sort((left, right) => left.title.localeCompare(right.title));

  printHeader(category ? `Playbooks in ${category}` : "Security playbooks");
  if (filtered.length === 0) {
    warn(`No playbooks found${category ? ` for category ${category}` : ""}.`);
    return;
  }

  const pagination = paginate(filtered, getPageSize(), parsed.flags.all === true, getPageFlag(parsed));
  for (const playbook of pagination.items) {
    const meta = [playbook.category, playbook.severity].filter(Boolean).join(" • ");
    console.log(`${color("cyan", playbook.title)} ${dim(`(${playbook.slug})`)}`);
    if (meta) {
      console.log(wrapLine(meta, 2));
    }
    if (playbook.summary) {
      console.log(wrapLine(playbook.summary, 2));
    }
    console.log(separator());
  }
  printPaginationSummary(pagination, parsed.flags.all === true);
}

function handlePlaybook(slug: string | undefined): void {
  if (!slug) {
    fail("Usage: os-oracle playbook <slug>");
    return;
  }
  if (!requireDataFiles(["playbooks.json"])) {
    return;
  }

  const playbooks = loadDataFile<Playbook[]>("playbooks.json");
  const playbook = findBySlugOrName(playbooks, slug, (item) => item.title);
  if (!playbook) {
    fail(`Playbook not found: ${slug}`);
    return;
  }

  printHeader(playbook.title);
  if (playbook.category) console.log(`${color("yellow", "Category:")} ${playbook.category}`);
  if (playbook.severity) console.log(`${color("yellow", "Severity:")} ${playbook.severity}`);
  if (playbook.summary) console.log(wrapLine(playbook.summary, 0));
  console.log(separator());

  const steps = arrayOrEmpty(playbook.steps);
  if (steps.length === 0) {
    warn("No steps are available for this playbook.");
    return;
  }

  console.log(color("bold", "Steps"));
  steps.forEach((step, index) => {
    console.log(`${color("green", `${index + 1}. ${step.title}`)}`);
    console.log(wrapLine(step.detail, 2));
    for (const command of arrayOrEmpty(step.commands)) {
      console.log(wrapLine(`Command: ${command.code}`, 4));
      if (command.note) {
        console.log(wrapLine(`Note: ${command.note}`, 6));
      }
    }
    console.log(separator());
  });
}

function handleWalkthroughs(parsed: ParsedArgs): void {
  if (!requireDataFiles(["walkthroughs.json"])) {
    return;
  }
  const walkthroughs = loadDataFile<Walkthrough[]>("walkthroughs.json");

  const sorted = [...walkthroughs].sort((left, right) => left.title.localeCompare(right.title));
  printHeader("Walkthroughs");
  const pagination = paginate(sorted, getPageSize(), parsed.flags.all === true, getPageFlag(parsed));
  for (const walkthrough of pagination.items) {
    console.log(`${color("cyan", walkthrough.title)} ${dim(`(${walkthrough.slug})`)}`);
    if (walkthrough.summary) {
      console.log(wrapLine(walkthrough.summary, 2));
    }
    console.log(wrapLine(`${arrayOrEmpty(walkthrough.steps).length} steps`, 2));
    console.log(separator());
  }
  printPaginationSummary(pagination, parsed.flags.all === true);
}

function handleWalkthrough(slug: string | undefined): void {
  if (!slug) {
    fail("Usage: os-oracle walkthrough <slug>");
    return;
  }
  if (!requireDataFiles(["walkthroughs.json"])) {
    return;
  }

  const walkthroughs = loadDataFile<Walkthrough[]>("walkthroughs.json");
  const walkthrough = findBySlugOrName(walkthroughs, slug, (item) => item.title);
  if (!walkthrough) {
    fail(`Walkthrough not found: ${slug}`);
    return;
  }

  printHeader(walkthrough.title);
  if (walkthrough.summary) console.log(wrapLine(walkthrough.summary, 0));
  console.log(separator());

  const steps = arrayOrEmpty(walkthrough.steps);
  if (steps.length === 0) {
    warn("No steps are available for this walkthrough.");
    return;
  }

  console.log(color("bold", "Steps"));
  steps.forEach((step, index) => {
    console.log(`${color("green", `${index + 1}. ${step.title}`)}`);
    if (step.narration) console.log(wrapLine(step.narration, 2));
    if (step.command) console.log(wrapLine(`Command: ${step.command}`, 2));
    if (step.expectedOutput) console.log(wrapLine(`Expected: ${step.expectedOutput}`, 2));
    if (step.observation) console.log(wrapLine(`Observe: ${step.observation}`, 2));
    console.log(separator());
  });
}

function handleBookmark(action: string | undefined, rest: string[]): void {
  if (action !== "add" && action !== "remove") {
    fail("Usage: os-oracle bookmark add <type> <slug> | os-oracle bookmark remove <slug>");
    return;
  }

  const bookmarks = loadBookmarks();
  if (action === "add") {
    const [rawType, slug] = rest;
    if (!rawType || !slug) {
      fail("Usage: os-oracle bookmark add <type> <slug>");
      return;
    }
    if (!isBookmarkType(rawType)) {
      fail("Bookmark type must be one of: tool, distro, playbook, walkthrough");
      return;
    }
    const bookmarkFile =
      rawType === "tool"
        ? "commands.json"
        : rawType === "distro"
          ? "distros.json"
          : rawType === "playbook"
            ? "playbooks.json"
            : "walkthroughs.json";
    if (!requireDataFiles([bookmarkFile])) {
      return;
    }
    if (bookmarks.some((item) => item.type === rawType && equalsIgnoreCase(item.slug, slug))) {
      warn(`Bookmark already exists for ${rawType}:${slug}`);
      return;
    }
    if (!bookmarkTargetExists(rawType, slug)) {
      fail(`Cannot find ${rawType} with slug or name: ${slug}`);
      return;
    }
    bookmarks.push({ type: rawType, slug, addedAt: new Date().toISOString() });
    saveJson(BOOKMARKS_PATH, bookmarks);
    console.log(color("green", `Saved bookmark for ${rawType}:${slug}`));
    return;
  }

  const slug = rest[0];
  if (!slug) {
    fail("Usage: os-oracle bookmark remove <slug>");
    return;
  }
  const filtered = bookmarks.filter((item) => !equalsIgnoreCase(item.slug, slug));
  if (filtered.length === bookmarks.length) {
    warn(`No bookmark found for slug ${slug}`);
    return;
  }
  saveJson(BOOKMARKS_PATH, filtered);
  console.log(color("green", `Removed bookmark ${slug}`));
}

function handleBookmarks(): void {
  const bookmarks = loadBookmarks().sort((left, right) => right.addedAt.localeCompare(left.addedAt));
  printHeader("Bookmarks");
  if (bookmarks.length === 0) {
    warn("No bookmarks saved yet.");
    return;
  }

  for (const bookmark of bookmarks) {
    const label = resolveBookmarkLabel(bookmark);
    console.log(`${color("cyan", bookmark.slug)} ${dim(`(${bookmark.type})`)}`);
    if (label) {
      console.log(wrapLine(label, 2));
    }
    console.log(wrapLine(`Saved: ${formatTimestamp(bookmark.addedAt)}`, 2));
    console.log(separator());
  }
}

function handleHistory(action: string | undefined, parsed: ParsedArgs): void {
  if (action === "clear") {
    saveJson(HISTORY_PATH, [] as HistoryEntry[]);
    console.log(color("green", "History cleared."));
    return;
  }
  if (action) {
    fail("Usage: os-oracle history [clear]");
    return;
  }

  const history = loadHistory().sort((left, right) => right.timestamp.localeCompare(left.timestamp));
  printHeader("Command history");
  if (history.length === 0) {
    warn("No history yet.");
    return;
  }

  const limit = parsed.flags.all === true ? history.length : 20;
  const shown = history.slice(0, limit);
  for (const entry of shown) {
    console.log(`${dim(formatTimestamp(entry.timestamp))} ${entry.command}`);
  }
  if (parsed.flags.all !== true && history.length > shown.length) {
    console.log(separator());
    console.log(dim(`Showing ${shown.length} of ${history.length} items. Use --all to see all.`));
  }
}

function handleConfig(action: string | undefined, rest: string[]): void {
  if (!action) {
    printHeader("Config");
    printKeyValue(activeConfig);
    return;
  }

  if (action === "set") {
    const [key, rawValue] = rest;
    if (!key || rawValue === undefined) {
      fail("Usage: os-oracle config set <key> <value>");
      return;
    }
    if (!["color", "pageSize", "dataDir"].includes(key)) {
      fail("Config key must be one of: color, pageSize, dataDir");
      return;
    }
    const nextConfig = { ...activeConfig } as Record<string, string | number | boolean | undefined>;
    if (key === "color") {
      nextConfig.color = parseBoolean(rawValue, "color");
    } else if (key === "pageSize") {
      const pageSize = Number.parseInt(rawValue, 10);
      if (!Number.isFinite(pageSize) || pageSize <= 0) {
        fail("pageSize must be a positive integer.");
        return;
      }
      nextConfig.pageSize = pageSize;
    } else {
      nextConfig.dataDir = rawValue;
    }
    activeConfig = nextConfig as Config;
    saveJson(CONFIG_PATH, activeConfig);
    console.log(color("green", `Updated ${key}.`));
    return;
  }

  if (action === "reset") {
    activeConfig = { ...DEFAULT_CONFIG };
    saveJson(CONFIG_PATH, activeConfig);
    console.log(color("green", "Config reset to defaults."));
    return;
  }

  fail("Usage: os-oracle config [set <key> <value> | reset]");
}

function handleVersion(): void {
  const packagePathCandidates = [
    path.resolve(SCRIPT_DIR, "../../package.json"),
    path.resolve(SCRIPT_DIR, "../package.json"),
    path.resolve(process.cwd(), "package.json"),
  ];
  const packagePath = packagePathCandidates.find((candidate) => existsSync(candidate));
  if (!packagePath) {
    fail("Unable to locate package.json.");
    return;
  }

  const pkg = readJson<Record<string, unknown>>(packagePath, {});
  const version = typeof pkg.version === "string" ? pkg.version : "0.0.0";
  console.log(`os-oracle ${version}`);
}

function handleOffline(): void {
  printHeader("Offline status");
  const dataDir = resolveDataDirectory();
  console.log(`${color("yellow", "Data dir:")} ${dataDir}`);
  console.log(`${color("yellow", "Storage dir:")} ${STORAGE_DIR}`);
  console.log(`${color("yellow", "Offline mode:")} ready`);
  console.log(separator());

  let freshest = 0;
  let presentCount = 0;
  for (const filename of DATA_FILE_NAMES) {
    const filePath = resolveDataFilePath(filename);
    if (filePath && existsSync(filePath)) {
      const modified = statSync(filePath).mtimeMs;
      freshest = Math.max(freshest, modified);
      presentCount += 1;
      console.log(`${color("green", "✓")} ${filename} ${dim(`updated ${timeAgo(modified)}`)}`);
    } else {
      console.log(`${color("red", "✗")} ${filename} ${dim("missing")}`);
    }
  }

  console.log(separator());
  if (presentCount === 0) {
    printMissingDataMessage(["commands.json", "distros.json", "playbooks.json", "walkthroughs.json"]);
    return;
  }

  console.log(`${color("yellow", "Data freshness:")} ${freshest ? timeAgo(freshest) : "unknown"}`);
  console.log(dim("The CLI is fully offline and reads local JSON data only."));
}

function printHelp(): void {
  const lines = [
    "Usage: os-oracle <command> [options]",
    "",
    "Search",
    "  os-oracle search <query> [--type tools|distros|playbooks|walkthroughs]",
    "",
    "Tools",
    "  os-oracle tools [--category <cat>] [--all]",
    "  os-oracle tool <name>",
    "",
    "Distros",
    "  os-oracle distros [--family <family>] [--all]",
    "  os-oracle distro <name>",
    "",
    "Playbooks",
    "  os-oracle playbooks [--category <cat>] [--all]",
    "  os-oracle playbook <slug>",
    "",
    "Walkthroughs",
    "  os-oracle walkthroughs [--all]",
    "  os-oracle walkthrough <slug>",
    "",
    "Bookmarks",
    "  os-oracle bookmark add <type> <slug>",
    "  os-oracle bookmark remove <slug>",
    "  os-oracle bookmarks",
    "",
    "History",
    "  os-oracle history [--all]",
    "  os-oracle history clear",
    "",
    "Config",
    "  os-oracle config",
    "  os-oracle config set <key> <value>",
    "  os-oracle config reset",
    "",
    "Other",
    "  os-oracle version",
    "  os-oracle offline",
    "",
    "Global options",
    "  --all       Show all results",
    "  --page <n>  Show a specific page of paginated results",
    "  --no-color  Disable ANSI colors",
    "  --help      Show this help message",
  ];
  console.log(lines.join("\n"));
}

function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--") {
      positionals.push(...argv.slice(index + 1));
      break;
    }
    if (token === "-h") {
      flags.help = true;
      continue;
    }
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    if (token === "--no-color") {
      flags.color = false;
      continue;
    }

    const body = token.slice(2);
    const equalsIndex = body.indexOf("=");
    if (equalsIndex >= 0) {
      const key = body.slice(0, equalsIndex);
      const value = body.slice(equalsIndex + 1);
      flags[key] = value.length > 0 ? value : true;
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      flags[body] = next;
      index += 1;
    } else {
      flags[body] = true;
    }
  }

  return { positionals, flags };
}

function ensureStorage(): void {
  mkdirSync(STORAGE_DIR, { recursive: true });
  if (!existsSync(BOOKMARKS_PATH)) saveJson(BOOKMARKS_PATH, [] as Bookmark[]);
  if (!existsSync(HISTORY_PATH)) saveJson(HISTORY_PATH, [] as HistoryEntry[]);
  if (!existsSync(CONFIG_PATH)) saveJson(CONFIG_PATH, DEFAULT_CONFIG);
}

function loadConfig(): Config {
  const config = readJson<Config>(CONFIG_PATH, DEFAULT_CONFIG);
  return {
    color: typeof config.color === "boolean" ? config.color : DEFAULT_CONFIG.color,
    pageSize:
      typeof config.pageSize === "number" && Number.isFinite(config.pageSize) && config.pageSize > 0
        ? config.pageSize
        : DEFAULT_CONFIG.pageSize,
    dataDir: typeof config.dataDir === "string" && config.dataDir.trim() ? config.dataDir : undefined,
  };
}

function loadBookmarks(): Bookmark[] {
  return readJson<Bookmark[]>(BOOKMARKS_PATH, []);
}

function loadHistory(): HistoryEntry[] {
  return readJson<HistoryEntry[]>(HISTORY_PATH, []);
}

function appendHistory(command: string): void {
  const history = loadHistory();
  history.push({ timestamp: new Date().toISOString(), command });
  const trimmed = history.slice(-MAX_HISTORY_ENTRIES);
  saveJson(HISTORY_PATH, trimmed);
}

function loadDataFile<T>(filename: string): T {
  const resolved = resolveDataFilePath(filename);
  if (!resolved || !existsSync(resolved)) {
    return [] as T;
  }

  try {
    return readJson<T>(resolved, [] as T);
  } catch (error) {
    fail(`Failed to parse ${filename}: ${getErrorMessage(error)}`);
    return [] as T;
  }
}

function requireDataFiles(files: string[]): boolean {
  const missing = files.filter((file) => !dataFileExists(file));
  if (missing.length > 0) {
    printMissingDataMessage(missing);
    return false;
  }
  return true;
}

function dataFileExists(filename: string): boolean {
  const resolved = resolveDataFilePath(filename);
  return Boolean(resolved && existsSync(resolved));
}

function resolveDataDirectory(): string {
  const candidates = dataDirectoryCandidates();
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0] ?? path.resolve(SCRIPT_DIR, "../data/json");
}

function resolveDataFilePath(filename: string): string | undefined {
  for (const candidate of dataDirectoryCandidates()) {
    const filePath = path.join(candidate, filename);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  const fallbackDir = dataDirectoryCandidates()[0];
  return fallbackDir ? path.join(fallbackDir, filename) : undefined;
}

function dataDirectoryCandidates(): string[] {
  const envDir = process.env.OS_ORACLE_DATA;
  const configuredDir = activeConfig.dataDir;
  const values = [
    envDir,
    configuredDir,
    path.resolve(SCRIPT_DIR, "../data/json"),
    path.resolve(SCRIPT_DIR, "../../src/data/json"),
    path.resolve(process.cwd(), "src/data/json"),
  ].filter((value): value is string => Boolean(value && value.trim()));
  return Array.from(new Set(values));
}

function printMissingDataMessage(files: string[]): void {
  fail(`Missing data file${files.length > 1 ? "s" : ""}: ${files.join(", ")}`);
  console.error("Run 'os-oracle generate' to build the data files first");
}

function bookmarkTargetExists(type: BookmarkType, slug: string): boolean {
  switch (type) {
    case "tool":
      return Boolean(findBySlugOrName(loadDataFile<KaliTool[]>("commands.json"), slug, (item) => item.name));
    case "distro":
      return Boolean(findBySlugOrName(loadDataFile<Distro[]>("distros.json"), slug, (item) => item.name));
    case "playbook":
      return Boolean(findBySlugOrName(loadDataFile<Playbook[]>("playbooks.json"), slug, (item) => item.title));
    case "walkthrough":
      return Boolean(
        findBySlugOrName(loadDataFile<Walkthrough[]>("walkthroughs.json"), slug, (item) => item.title),
      );
  }
}

function resolveBookmarkLabel(bookmark: Bookmark): string | undefined {
  try {
    switch (bookmark.type) {
      case "tool": {
        const item = findBySlugOrName(loadDataFile<KaliTool[]>("commands.json"), bookmark.slug, (tool) => tool.name);
        return item ? `${item.name} • ${item.category}` : undefined;
      }
      case "distro": {
        const item = findBySlugOrName(loadDataFile<Distro[]>("distros.json"), bookmark.slug, (distro) => distro.name);
        return item ? `${item.name} • ${item.family}` : undefined;
      }
      case "playbook": {
        const item = findBySlugOrName(loadDataFile<Playbook[]>("playbooks.json"), bookmark.slug, (playbook) => playbook.title);
        return item ? item.title : undefined;
      }
      case "walkthrough": {
        const item = findBySlugOrName(
          loadDataFile<Walkthrough[]>("walkthroughs.json"),
          bookmark.slug,
          (walkthrough) => walkthrough.title,
        );
        return item ? item.title : undefined;
      }
    }
  } catch {
    return undefined;
  }
}

function mergeErrors(slug: string, embedded: KnownError[], external: KnownError[]): KnownError[] {
  const merged = [...embedded];
  for (const error of external) {
    if (error.tool && !equalsIgnoreCase(error.tool, slug)) {
      continue;
    }
    if (!merged.some((item) => equalsIgnoreCase(item.message, error.message))) {
      merged.push(error);
    }
  }
  return merged;
}

function paginate<T>(items: T[], pageSize: number, showAll: boolean, requestedPage: number): PaginationResult<T> {
  if (showAll || items.length <= pageSize) {
    return {
      items,
      total: items.length,
      start: items.length === 0 ? 0 : 1,
      end: items.length,
      page: 1,
      pages: items.length === 0 ? 0 : 1,
    };
  }

  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = clamp(requestedPage, 1, pages);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, items.length);
  return {
    items: items.slice(startIndex, endIndex),
    total: items.length,
    start: startIndex + 1,
    end: endIndex,
    page,
    pages,
  };
}

function printPaginationSummary<T>(pagination: PaginationResult<T>, showAll: boolean): void {
  if (pagination.total === 0) {
    return;
  }
  if (showAll || pagination.total === pagination.items.length) {
    if (pagination.total > getPageSize()) {
      console.log(dim(`Showing all ${pagination.total} results.`));
    }
    return;
  }
  console.log(
    dim(
      `Showing ${pagination.start}-${pagination.end} of ${pagination.total} results. ` +
        `Use --all to see all.${pagination.pages > 1 ? ` Page ${pagination.page}/${pagination.pages}.` : ""}`,
    ),
  );
}

function getPageSize(): number {
  return activeConfig.pageSize > 0 ? activeConfig.pageSize : DEFAULT_CONFIG.pageSize;
}

function getPageFlag(parsed: ParsedArgs): number {
  const raw = parsed.flags.page;
  if (typeof raw !== "string") {
    return 1;
  }
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function printHeader(title: string): void {
  const border = "═".repeat(Math.min(Math.max(title.length + 2, 10), LINE_WIDTH - 2));
  console.log(color("bold", `╔${border}╗`));
  console.log(color("bold", `║ ${title} ║`));
  console.log(color("bold", `╚${border}╝`));
}

function separator(): string {
  return dim("---");
}

function printStringArray(title: string, values: string[] | undefined): void {
  const list = arrayOrEmpty(values);
  if (list.length === 0) {
    return;
  }
  console.log(separator());
  console.log(color("bold", title));
  for (const value of list) {
    console.log(wrapLine(`• ${value}`, 2));
  }
}

function printKeyValue(values: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(values)) {
    console.log(`${color("yellow", key)}: ${String(value)}`);
  }
}

function wrapLine(text: string, indent = 0): string {
  const prefix = " ".repeat(indent);
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  if (words.length === 1 && words[0] === "") {
    return prefix;
  }
  const lines: string[] = [];
  let current = prefix;
  const maxWidth = Math.max(20, LINE_WIDTH - indent);

  for (const word of words) {
    const candidate = current.trim().length === 0 ? `${prefix}${word}` : `${current} ${word}`;
    if (stripAnsi(candidate).length <= maxWidth) {
      current = candidate;
    } else {
      if (current.trim().length > 0) {
        lines.push(current);
      }
      current = `${prefix}${word}`;
    }
  }

  if (current.trim().length > 0) {
    lines.push(current);
  }
  return lines.join("\n");
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    const raw = readFileSync(filePath, "utf8");
    if (!raw.trim()) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    if (existsSync(filePath)) {
      throw error;
    }
    return fallback;
  }
}

function saveJson(filePath: string, value: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function findBySlugOrName<T extends { slug: string }>(
  items: T[],
  query: string,
  getName: (item: T) => string,
): T | undefined {
  const normalized = normalize(query);
  return items.find((item) => normalize(item.slug) === normalized || normalize(getName(item)) === normalized);
}

function scoreMatch(terms: string[], fields: Array<string | undefined>): number {
  const haystack = normalize(fields.filter(Boolean).join(" "));
  if (!haystack) {
    return 0;
  }
  let score = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) {
      return 0;
    }
    score += haystack.includes(` ${term} `) ? 3 : 2;
    if (haystack.startsWith(term)) {
      score += 2;
    }
  }
  return score;
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(" ")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalize(value: string | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value: string): string {
  return normalize(value).replace(/\s+/g, "-");
}

function arrayOrEmpty<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function equalsIgnoreCase(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function isBookmarkType(value: string): value is BookmarkType {
  return value === "tool" || value === "distro" || value === "playbook" || value === "walkthrough";
}

function parseBoolean(value: string, label: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  throw new Error(`${label} must be true or false.`);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function stripAnsi(value: string): string {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

function shouldUseColor(config: Config, noColorFlag: boolean): boolean {
  if (process.env.NO_COLOR !== undefined) {
    return false;
  }
  if (noColorFlag) {
    return false;
  }
  return config.color !== false;
}

type ColorName = "bold" | "cyan" | "green" | "yellow" | "red" | "magenta" | "dim";

function color(name: ColorName, value: string): string {
  if (!colorsEnabled) {
    return value;
  }
  const code =
    name === "bold"
      ? "1"
      : name === "cyan"
        ? "36"
        : name === "green"
          ? "32"
          : name === "yellow"
            ? "33"
            : name === "red"
              ? "31"
              : name === "magenta"
                ? "35"
                : "2";
  return `\u001b[${code}m${value}\u001b[0m`;
}

function dim(value: string): string {
  return color("dim", value);
}

function fail(message: string): void {
  process.exitCode = 1;
  console.error(color("red", `Error: ${message}`));
}

function warn(message: string): void {
  console.log(color("yellow", message));
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function timeAgo(timestampMs: number): string {
  const diffMs = Date.now() - timestampMs;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

try {
  main();
} catch (error) {
  fail(getErrorMessage(error));
  process.exitCode = 1;
}
