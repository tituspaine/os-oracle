import { Link } from "@tanstack/react-router";
import { Terminal, Search } from "lucide-react";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-semibold tracking-tight">distro<span className="text-primary">/ref</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/">Distros</NavLink>
          <NavLink to="/kali">Kali Tools</NavLink>
          <NavLink to="/search"><Search className="mr-1 inline h-3.5 w-3.5" />Search</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
      activeProps={{ className: "rounded-md px-3 py-1.5 text-primary bg-muted" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
        Local, static reference. No AI. No cloud. No telemetry. Data compiled from public documentation and man pages.
      </div>
    </footer>
  );
}
