import { ShieldAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Site-wide banner. Visible on every route via __root.tsx.
 * Wording is intentionally identical everywhere so users can never
 * miss the authorised-use scope of this reference.
 */
export function AuthorizedUseBanner() {
  return (
    <div
      role="note"
      aria-label="Authorised use notice"
      className="border-b border-destructive/40 bg-destructive/10"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-xs sm:text-[13px]">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        <p className="text-foreground/90">
          <strong>Authorised testing, education, and defence only.</strong>{" "}
          All information on this site is provided for authorised security
          testing, learning, and defensive purposes. Use against systems you
          do not own or lack explicit written permission to test is illegal
          and unethical.{" "}
          <Link to="/ethics" className="text-primary underline underline-offset-2 hover:opacity-80">
            Read the ethics &amp; scope guide
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
