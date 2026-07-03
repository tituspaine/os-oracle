declare module "fs" {
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): string | undefined;
  export function readFileSync(path: string, encoding: string): string;
  export function statSync(path: string): { mtimeMs: number };
  export function writeFileSync(path: string, data: string, encoding: string): void;
}

declare module "os" {
  const os: { homedir(): string };
  export default os;
}

declare module "path" {
  const path: {
    join: (...parts: string[]) => string;
    dirname: (value: string) => string;
    resolve: (...parts: string[]) => string;
  };
  export default path;
}

declare module "process" {
  const process: {
    argv: string[];
    env: Record<string, string | undefined>;
    cwd(): string;
    exitCode?: number;
  };
  export default process;
}

declare module "url" {
  export function fileURLToPath(url: string | URL): string;
}

declare global {
  const console: {
    log: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
  };

  interface ImportMeta {
    url: string;
  }
}

export {};
