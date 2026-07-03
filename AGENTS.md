# Agent Guidelines for OS Oracle

This project uses a standard Vite + TanStack Start (React/TypeScript) stack with no proprietary build dependencies.

## Key Conventions

- All content lives in `src/data/` as plain TypeScript objects — no database or CMS.
- Routes use TanStack Router file-based routing under `src/routes/`.
- UI components use shadcn/ui + Tailwind CSS (v4).
- Search is client-side via Fuse.js with intent expansion in `src/data/search-synonyms.ts`.
- The server entry point is `src/server.ts` (configured in `vite.config.ts`).

## Development

```bash
bun install       # install dependencies
bun run dev       # start dev server
bun run build     # production build
bun run lint      # ESLint check
```

## Content Guidelines

- All ethical-hacking content must include authorized-use disclaimers.
- Kali tool entries require: real commands, real flags, and real error messages with causes/fixes.
- Playbooks require: prerequisites, attack steps, detection guidance, and mitigation.
- See `CONTRIBUTING.md` for full authoring specs.
