import { Link, useNavigate } from "@tanstack/react-router";
import { Terminal, Search, ShieldCheck, Scale, Globe } from "lucide-react";
import { useState, type ReactNode, type FormEvent } from "react";

export function SiteHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: q || undefined } });
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-semibold tracking-tight">
            distro<span className="text-primary">/ref</span>
          </span>
        </Link>
        <form
          onSubmit={onSubmit}
          className="order-3 flex w-full items-center gap-2 sm:order-2 sm:w-auto sm:flex-1 sm:max-w-md"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Describe what you want to test — e.g. "audit Wi-Fi security"'
              className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-sm outline-none focus:border-primary"
              aria-label="Intent search"
            />
          </div>
        </form>
        <nav className="order-2 flex items-center gap-1 text-sm sm:order-3">
          <NavLink to="/">Distros</NavLink>
          <NavLink to="/kali">Kali</NavLink>
          <NavLink to="/hacking">
            <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />
            Security Testing
          </NavLink>
          <NavLink to="/resources">
            <Globe className="mr-1 inline h-3.5 w-3.5" />
            Resources
          </NavLink>
          <NavLink to="/ethics">
            <Scale className="mr-1 inline h-3.5 w-3.5" />
            Ethics
          </NavLink>
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
        Local, static reference. No AI. No cloud. No telemetry. Content is for authorised security
        testing, learning, and defence only — see{" "}
        <Link to="/ethics" className="text-primary hover:underline">
          ethics & authorisation
        </Link>
        .
      </div>
    </footer>
  );
}
