import { homedir } from 'node:os';
import { join } from 'node:path';
import { promises as fs } from 'node:fs';
import { DISTROS, KALI_TOOLS, PLAYBOOKS, WALKTHROUGHS } from '../data/loader';
import { heading, muted, subheading, success } from '../ui/display';
import { paginate } from '../ui/pager';

type BookmarkType = 'tool' | 'playbook' | 'walkthrough' | 'distro';

type Bookmark = {
  type: BookmarkType;
  slug: string;
  title: string;
  addedAt: string;
};

const BOOKMARKS_FILE = join(homedir(), '.os-oracle-bookmarks.json');

async function readBookmarks(): Promise<Bookmark[]> {
  try {
    const content = await fs.readFile(BOOKMARKS_FILE, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return [];
    throw error;
  }
}

async function writeBookmarks(bookmarks: Bookmark[]): Promise<void> {
  await fs.writeFile(BOOKMARKS_FILE, `${JSON.stringify(bookmarks, null, 2)}\n`, 'utf8');
}

function resolveBookmark(type: BookmarkType, slug: string): Omit<Bookmark, 'addedAt'> | undefined {
  switch (type) {
    case 'tool': {
      const tool = KALI_TOOLS.find((item) => item.slug === slug);
      return tool ? { type, slug: tool.slug, title: tool.name } : undefined;
    }
    case 'playbook': {
      const playbook = PLAYBOOKS.find((item) => item.slug === slug);
      return playbook ? { type, slug: playbook.slug, title: playbook.title } : undefined;
    }
    case 'walkthrough': {
      const walkthrough = WALKTHROUGHS.find((item) => item.slug === slug);
      return walkthrough ? { type, slug: walkthrough.slug, title: walkthrough.title } : undefined;
    }
    case 'distro': {
      const distro = DISTROS.find((item) => item.slug === slug);
      return distro ? { type, slug: distro.slug, title: distro.name } : undefined;
    }
  }
}

async function listBookmarks(): Promise<void> {
  const bookmarks = await readBookmarks();

  if (bookmarks.length === 0) {
    console.log(`No bookmarks saved yet. File: ${BOOKMARKS_FILE}`);
    return;
  }

  const lines: string[] = [heading('Bookmarks'), muted(BOOKMARKS_FILE), ''];

  for (const [index, bookmark] of bookmarks.entries()) {
    lines.push(
      `${index + 1}. ${bookmark.title} ${muted(`(${bookmark.type}:${bookmark.slug})`)} — saved ${new Date(bookmark.addedAt).toLocaleString()}`,
    );
  }

  await paginate(lines);
}

async function addBookmark(type: BookmarkType, slug: string): Promise<void> {
  const target = resolveBookmark(type, slug);
  if (!target) {
    console.log(`Nothing found for ${type}:${slug}`);
    return;
  }

  const bookmarks = await readBookmarks();
  if (bookmarks.some((bookmark) => bookmark.type === type && bookmark.slug === slug)) {
    console.log(`${type}:${slug} is already bookmarked.`);
    return;
  }

  bookmarks.push({ ...target, addedAt: new Date().toISOString() });
  await writeBookmarks(bookmarks);
  console.log(success(`Saved bookmark: ${target.title} (${type}:${slug})`));
}

async function removeBookmark(type: BookmarkType, slug: string): Promise<void> {
  const bookmarks = await readBookmarks();
  const filtered = bookmarks.filter((bookmark) => !(bookmark.type === type && bookmark.slug === slug));

  if (filtered.length === bookmarks.length) {
    console.log(`Bookmark not found: ${type}:${slug}`);
    return;
  }

  await writeBookmarks(filtered);
  console.log(success(`Removed bookmark: ${type}:${slug}`));
}

async function clearBookmarks(): Promise<void> {
  await writeBookmarks([]);
  console.log(success('Cleared all bookmarks.'));
}

export async function bookmarksCommand(args: string[]): Promise<void> {
  const [action = 'list', type, slug] = args;

  if (action === 'list') {
    await listBookmarks();
    return;
  }

  if (action === 'clear') {
    await clearBookmarks();
    return;
  }

  if (!type || !slug) {
    console.log('Usage: os-oracle bookmarks <list|add|remove|clear> [tool|playbook|walkthrough|distro] [slug]');
    return;
  }

  if (!['tool', 'playbook', 'walkthrough', 'distro'].includes(type)) {
    console.log(`Unsupported bookmark type: ${type}`);
    return;
  }

  if (action === 'add') {
    await addBookmark(type as BookmarkType, slug);
    return;
  }

  if (action === 'remove') {
    await removeBookmark(type as BookmarkType, slug);
    return;
  }

  console.log(`Unknown bookmarks action: ${action}`);
}
