import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck, BookOpen, Scale, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/ethics")({
  head: () => ({
    meta: [
      { title: "Ethics, authorisation & responsible disclosure — distro/ref" },
      { name: "description", content: "Scope of authorisation, rules of engagement, responsible-disclosure principles, and relevant laws for anyone using this security-testing reference." },
      { property: "og:title", content: "Ethics & authorisation — distro/ref" },
      { property: "og:description", content: "How to use this reference lawfully and ethically." },
    ],
  }),
  component: EthicsPage,
});

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="prose prose-invert max-w-none text-sm text-foreground/90 space-y-2">{children}</div>
    </section>
  );
}

function EthicsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-destructive" aria-hidden="true" />
          <h1 className="text-3xl font-bold tracking-tight">Ethics, authorisation & responsible disclosure</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Everything on this site — every command, every playbook, every intent
          the search understands — is for authorised security testing,
          education, and defence. It is not a permission slip and does not
          expand any scope you were granted.
        </p>
      </header>

      <Section icon={ShieldCheck} title="Written authorisation is mandatory">
        <p>
          Before running any technique from this reference against a system
          you do not personally own, you need <strong>written authorisation</strong> —
          a signed statement of work, an in-scope target listed in a bug-bounty
          programme's policy, a lab you set up yourself, or a controlled CTF
          environment. Verbal or implied permission is not enough.
        </p>
        <p>
          Authorisation should identify: (1) the exact IP ranges, hostnames,
          applications, or accounts in scope; (2) the time window; (3) the
          techniques you are allowed to use (some engagements exclude social
          engineering, DoS, or specific data classes); (4) the contact who
          approves emergency stops; and (5) the data-handling requirements
          for anything you extract.
        </p>
      </Section>

      <Section icon={BookOpen} title="Rules of engagement">
        <ul className="list-disc pl-5">
          <li><strong>Minimum necessary access.</strong> Prove impact — don't hoard data. Stop escalating the moment the finding is demonstrated.</li>
          <li><strong>Do no lasting harm.</strong> Never destroy data, disable production services, or hold-open a backdoor beyond the engagement window.</li>
          <li><strong>Log everything.</strong> Keep an accurate record of every command, timestamp, and target — you may be asked to prove what you did (and did not) do.</li>
          <li><strong>Protect exfiltrated data.</strong> Any credentials, PII, or business data extracted during testing is regulated data. Store on encrypted media, delete after reporting, and never reuse credentials outside the engagement.</li>
          <li><strong>Stay in scope.</strong> If a discovery pulls you outside scope (a chained finding, a shared service), stop and check with the point of contact before continuing.</li>
        </ul>
      </Section>

      <Section icon={HeartHandshake} title="Responsible disclosure (findings outside a formal engagement)">
        <p>
          If you discover a vulnerability in software or a system you have no
          engagement for — for example, while researching in your own lab or
          reading source — report it to the vendor privately. Standard
          practice:
        </p>
        <ol className="list-decimal pl-5">
          <li>Locate the vendor's security contact (<code className="mono">security.txt</code>, security page, or CERT/CC).</li>
          <li>Send a clear write-up with reproduction steps and impact — do not attach exploit weapons.</li>
          <li>Agree on a disclosure timeline (typically 90 days).</li>
          <li>Coordinate the CVE assignment and public advisory.</li>
          <li>Do not attack additional customers of the vendor to "prove" the finding.</li>
        </ol>
        <p>
          Public bug-bounty policies (HackerOne, Bugcrowd, Intigriti, or
          vendor-run programmes) are the safest way to test third-party
          systems lawfully — the policy is your written authorisation.
        </p>
      </Section>

      <Section icon={Scale} title="Laws that commonly apply">
        <ul className="list-disc pl-5">
          <li><strong>United States — Computer Fraud and Abuse Act (18 U.S.C. §1030):</strong> criminalises unauthorised access or exceeding authorised access to a "protected computer" (broadly defined). State computer-crime statutes stack on top.</li>
          <li><strong>United Kingdom — Computer Misuse Act 1990:</strong> unauthorised access (§1), with intent (§2), impairing operation (§3), and making/supplying tools (§3A).</li>
          <li><strong>European Union — Directive 2013/40/EU on attacks against information systems,</strong> transposed into national law (e.g. Germany StGB §202a–§202c, France Loi Godfrain).</li>
          <li><strong>GDPR (EU) & UK Data Protection Act 2018:</strong> personal data extracted during testing is regulated — Article 32 requires appropriate security, and a breach still needs assessment.</li>
          <li><strong>DMCA §1201 (US):</strong> circumventing technological protection measures may be restricted; exemptions exist for good-faith security research (see the Copyright Office rulings).</li>
          <li><strong>Local wiretap/interception laws:</strong> passive sniffing on networks you are not authorised on may violate wiretap statutes even if you never log in.</li>
          <li><strong>Export controls:</strong> some intrusion software is dual-use regulated (Wassenaar). Consult counsel before distributing offensive tooling internationally.</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          This section is a plain-language summary, not legal advice. Get
          jurisdiction-specific counsel before doing anything ambiguous.
        </p>
      </Section>

      <Section icon={ShieldCheck} title="Defensive value">
        <p>
          Every offensive playbook in this reference has a <em>detection</em> and{" "}
          <em>mitigation</em> section for exactly this reason: the techniques
          only exist here so blue teams, developers, and system owners can
          find them first, log them properly, and shut them down. If you're
          reading this as a defender, start from the mitigation section of
          each playbook and work backwards into the offensive steps to build
          detections.
        </p>
      </Section>

      <p className="mt-10 rounded-md border border-border bg-card p-4 text-xs text-muted-foreground">
        By continuing to use this site you affirm that you will apply its
        contents only within the boundaries described above.
      </p>
    </div>
  );
}
