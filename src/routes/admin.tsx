import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Database,
  Activity,
  FileText,
  Eye,
  Trash2,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KALI_TOOLS, DISTROS, PLAYBOOKS } from "@/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — OS Oracle" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

/* -------------------------------------------------------------------------- */
/*  Mock data — a real deployment connects to the backend API                 */
/* -------------------------------------------------------------------------- */

type Submission = {
  id: number;
  author: string;
  type: "tool" | "playbook" | "error" | "distro" | "correction";
  title: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  date: string;
  securityScore: number;
  flags: string[];
};

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 101,
    author: "sec_researcher_42",
    type: "tool",
    title: "Add: crackmapexec — SMB/WinRM/MSSQL lateral movement",
    status: "pending",
    date: "2025-07-02",
    securityScore: 97,
    flags: [],
  },
  {
    id: 102,
    author: "pentest_pro",
    type: "playbook",
    title: "New playbook: Kerberoasting via Impacket step-by-step",
    status: "pending",
    date: "2025-07-01",
    securityScore: 95,
    flags: [],
  },
  {
    id: 103,
    author: "anon_user_x",
    type: "tool",
    title: "Add remote shell dropper script",
    status: "flagged",
    date: "2025-06-30",
    securityScore: 12,
    flags: ["malicious-payload-detected", "no-lab-context", "credential-harvester"],
  },
  {
    id: 104,
    author: "linux_expert",
    type: "distro",
    title: "Correction: Fedora DNF5 commands updated for F40+",
    status: "approved",
    date: "2025-06-29",
    securityScore: 100,
    flags: [],
  },
  {
    id: 105,
    author: "vuln_scanner",
    type: "error",
    title: "20 new nmap NSE script errors with fixes",
    status: "pending",
    date: "2025-06-28",
    securityScore: 99,
    flags: [],
  },
  {
    id: 106,
    author: "shady_actor",
    type: "playbook",
    title: "How to deploy ransomware on corporate network",
    status: "flagged",
    date: "2025-06-27",
    securityScore: 0,
    flags: ["illegal-content", "malware", "no-authorisation-context"],
  },
];

const STATS = [
  { label: "Kali Tools", value: KALI_TOOLS.length, icon: Shield, color: "text-primary" },
  { label: "Distros", value: DISTROS.length, icon: Database, color: "text-blue-500" },
  { label: "Playbooks", value: PLAYBOOKS.length, icon: FileText, color: "text-green-500" },
  {
    label: "Commands",
    value:
      KALI_TOOLS.reduce((acc, t) => acc + (t.commands?.length ?? 0), 0) +
      DISTROS.reduce((acc, d) => acc + d.commands.length, 0),
    icon: Activity,
    color: "text-purple-500",
  },
];

/* -------------------------------------------------------------------------- */

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [authError, setAuthError] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [tab, setTab] = useState<"queue" | "stats" | "security">("queue");

  if (!authed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <Shield className="mx-auto mb-3 h-10 w-10 text-primary" />
            <h1 className="text-xl font-bold">Admin Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This area is restricted to OS Oracle administrators.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pass === "admin" || pass === "os-oracle-admin") {
                setAuthed(true);
                setAuthError(false);
              } else {
                setAuthError(true);
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {authError && <p className="text-xs text-destructive">Invalid credentials.</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo: password is <code className="font-mono">admin</code>
          </p>
        </div>
      </div>
    );
  }

  const pending = submissions.filter((s) => s.status === "pending");
  const flagged = submissions.filter((s) => s.status === "flagged");

  const approve = (id: number) =>
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)));
  const reject = (id: number) =>
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s)));
  const remove = (id: number) => setSubmissions((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            OS Oracle content moderation and platform management
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {pending.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {pending.length} pending
            </Badge>
          )}
          {flagged.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {flagged.length} flagged
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4 text-center">
            <Icon className={`mx-auto mb-2 h-6 w-6 ${color}`} />
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-border">
        {(["queue", "stats", "security"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "queue"
              ? `Review Queue (${pending.length + flagged.length})`
              : t === "stats"
                ? "Content Stats"
                : "Security Alerts"}
          </button>
        ))}
      </div>

      {/* Review Queue */}
      {tab === "queue" && (
        <div className="space-y-3">
          {flagged.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Flagged — Requires Immediate Action
              </h2>
              {flagged.map((s) => (
                <SubmissionRow
                  key={s.id}
                  submission={s}
                  onApprove={approve}
                  onReject={reject}
                  onRemove={remove}
                />
              ))}
            </>
          )}
          {pending.length > 0 && (
            <>
              <h2 className="mt-6 text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Pending Review
              </h2>
              {pending.map((s) => (
                <SubmissionRow
                  key={s.id}
                  submission={s}
                  onApprove={approve}
                  onReject={reject}
                  onRemove={remove}
                />
              ))}
            </>
          )}
          {pending.length === 0 && flagged.length === 0 && (
            <p className="text-sm text-muted-foreground">Queue is clear. 🎉</p>
          )}
        </div>
      )}

      {/* Content Stats */}
      {tab === "stats" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <BarChart3 className="h-4 w-4 text-primary" /> Content Breakdown
            </h2>
            <div className="grid gap-2 text-sm">
              {[
                ["Kali Tools (total)", KALI_TOOLS.length],
                [
                  "Kali Tools with full commands",
                  KALI_TOOLS.filter((t) => (t.commands?.length ?? 0) > 0).length,
                ],
                [
                  "Kali Commands (total)",
                  KALI_TOOLS.reduce((a, t) => a + (t.commands?.length ?? 0), 0),
                ],
                ["Distros", DISTROS.length],
                ["Distro Commands", DISTROS.reduce((a, d) => a + d.commands.length, 0)],
                [
                  "Known Error Entries",
                  DISTROS.reduce((a, d) => a + d.errors.length, 0) +
                    KALI_TOOLS.reduce((a, t) => a + (t.errors?.length ?? 0), 0),
                ],
                ["Playbooks", PLAYBOOKS.length],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex justify-between border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-semibold">{Number(value).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4 text-primary" /> Submission Stats (Last 30 Days)
            </h2>
            <div className="grid gap-2 text-sm">
              {[
                ["Total submissions", MOCK_SUBMISSIONS.length],
                ["Approved", MOCK_SUBMISSIONS.filter((s) => s.status === "approved").length],
                ["Pending review", MOCK_SUBMISSIONS.filter((s) => s.status === "pending").length],
                [
                  "Flagged / rejected",
                  MOCK_SUBMISSIONS.filter((s) => s.status === "flagged" || s.status === "rejected")
                    .length,
                ],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex justify-between border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Alerts */}
      {tab === "security" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4" /> Active Security Alerts
            </h2>
            {flagged.map((s) => (
              <div
                key={s.id}
                className="mb-3 rounded-md border border-destructive/30 bg-background p-3"
              >
                <div className="flex justify-between gap-2 flex-wrap">
                  <span className="font-medium text-sm">{s.title}</span>
                  <span className="text-xs text-muted-foreground">
                    by {s.author} · {s.date}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.flags.map((f) => (
                    <Badge key={f} variant="destructive" className="text-[10px]">
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Security score:</span>
                  <span className="font-mono text-xs font-bold text-destructive">
                    {s.securityScore}/100
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-auto h-6 text-xs"
                    onClick={() => remove(s.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {flagged.length === 0 && (
              <p className="text-sm text-muted-foreground">No active security alerts.</p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 font-semibold text-sm">Automated Security Checks</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Malicious payload detection", status: "active" },
                { label: "Credential / API key detection", status: "active" },
                { label: "Dangerous command patterns (rm -rf /, fork bombs)", status: "active" },
                { label: "Illegal-activity keyword filter", status: "active" },
                { label: "Duplicate / plagiarism detection", status: "active" },
                { label: "Ethics policy enforcement", status: "active" },
                { label: "Community peer review (3 approvals required)", status: "active" },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{label}</span>
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] text-green-600 border-green-500/40"
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubmissionRow({
  submission: s,
  onApprove,
  onReject,
  onRemove,
}: {
  submission: Submission;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const statusColor: Record<string, string> = {
    pending: "text-yellow-600 border-yellow-500/40",
    approved: "text-green-600 border-green-500/40",
    rejected: "text-muted-foreground border-border",
    flagged: "text-destructive border-destructive/40",
  };

  return (
    <div
      className={`rounded-lg border bg-card p-4 ${s.status === "flagged" ? "border-destructive/40 bg-destructive/5" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="text-[10px] capitalize">
              {s.type}
            </Badge>
            <Badge variant="outline" className={`text-[10px] capitalize ${statusColor[s.status]}`}>
              {s.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              by {s.author} · {s.date}
            </span>
          </div>
          <p className="font-medium text-sm">{s.title}</p>
          {s.flags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {s.flags.map((f) => (
                <Badge key={f} variant="destructive" className="text-[10px]">
                  {f}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Score:</span>
          <span
            className={`font-mono font-bold ${s.securityScore >= 90 ? "text-green-500" : s.securityScore >= 50 ? "text-yellow-500" : "text-destructive"}`}
          >
            {s.securityScore}/100
          </span>
        </div>
      </div>
      {(s.status === "pending" || s.status === "flagged") && (
        <div className="mt-3 flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => {}}>
            <Eye className="h-3 w-3" />
            Review
          </Button>
          {s.status === "pending" && (
            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => onApprove(s.id)}>
              <CheckCircle2 className="h-3 w-3" />
              Approve
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            className="h-7 text-xs gap-1"
            onClick={() => (s.status === "flagged" ? onRemove(s.id) : onReject(s.id))}
          >
            <Trash2 className="h-3 w-3" />
            {s.status === "flagged" ? "Remove" : "Reject"}
          </Button>
        </div>
      )}
    </div>
  );
}
