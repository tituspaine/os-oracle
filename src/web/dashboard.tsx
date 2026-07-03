import { useMemo, useState } from 'react';

export function Dashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [query, setQuery] = useState('');
  const classes = useMemo(
    () => (theme === 'dark' ? 'min-h-screen bg-zinc-950 text-zinc-100' : 'min-h-screen bg-white text-zinc-900'),
    [theme],
  );

  return (
    <main className={classes}>
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">OS Oracle Dashboard</h1>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded border px-3 py-1 text-sm"
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </header>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Real-time search"
          className="rounded border bg-transparent px-3 py-2"
        />
        <p className="text-sm opacity-80">Searching for: {query || 'everything'}</p>
      </section>
    </main>
  );
}

export default Dashboard;
