import { useEffect, useState, type ReactNode } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const KEY = "distroref.ack.v1";

/**
 * One-time client-side acknowledgement gate for the Security Testing
 * handbook. Purely cosmetic/educational — stored in localStorage,
 * no cloud, no analytics. Renders children after the user checks the
 * box and clicks the confirmation button.
 */
export function AckGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(KEY) === "yes") {
        setOk(true);
      }
    } catch {
      // localStorage may be blocked; fall through and require ack each visit.
    }
  }, []);

  if (!mounted) return null;
  if (ok) return <>{children}</>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
          <h1 className="text-lg font-semibold">Authorised-use acknowledgement</h1>
        </div>
        <p className="text-sm text-foreground/90">
          The Security Testing handbook documents offensive techniques so
          defenders can understand, detect, and mitigate them, and so
          authorised testers can perform their work under written scope.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground/90">
          <li>• I will only apply these techniques to systems I own or that I have <em>explicit written authorisation</em> to test.</li>
          <li>• I understand unauthorised use may violate the CFAA (US), Computer Misuse Act (UK), and equivalent laws worldwide.</li>
          <li>• I will follow responsible disclosure for any vulnerability found outside a formal engagement.</li>
          <li>• I will treat every finding as sensitive and store credentials or PII securely.</li>
        </ul>
        <label className="mt-5 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>I acknowledge the terms above and will only use this material for authorised, ethical purposes.</span>
        </label>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!checked}
            onClick={() => {
              try { window.localStorage.setItem(KEY, "yes"); } catch { /* ignore */ }
              setOk(true);
            }}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" /> I understand — continue
          </button>
          <Link
            to="/ethics"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
          >
            Read the full ethics guide
          </Link>
        </div>
      </div>
    </div>
  );
}
