import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Globe, MessageSquare, ThumbsUp, Pin, Languages, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "Community Forum — OS Oracle" },
      {
        name: "description",
        content:
          "Global community forum for ethical hackers, pentesters, and Linux power users. All posts are automatically translated to English. Share knowledge, ask questions, post writeups.",
      },
      { property: "og:title", content: "Community Forum — OS Oracle" },
    ],
  }),
  component: ForumPage,
});

/* -------------------------------------------------------------------------- */
/*  Static sample data — a real deployment would load from a backend API      */
/* -------------------------------------------------------------------------- */

type ForumPost = {
  id: number;
  author: string;
  country: string;
  flag: string;
  title: string;
  body: string;
  originalLang?: string;
  tags: string[];
  likes: number;
  replies: number;
  pinned?: boolean;
  date: string;
};

const SAMPLE_POSTS: ForumPost[] = [
  {
    id: 1,
    author: "root_hunter",
    country: "United States",
    flag: "🇺🇸",
    title: "Complete nmap → Metasploit workflow for internal network assessment",
    body: "Here is a reproducible workflow I use for every internal engagement. Start with nmap -sC -sV -oA initial <subnet> to enumerate services, then feed the XML output directly into msf with db_import to skip manual recon…",
    tags: ["nmap", "metasploit", "pentest", "workflow"],
    likes: 142,
    replies: 38,
    pinned: true,
    date: "2025-06-28",
  },
  {
    id: 2,
    author: "sec_pham",
    country: "Vietnam",
    flag: "🇻🇳",
    title: "Tổng hợp lỗi phổ biến khi dùng sqlmap với DVWA",
    body: "Tôi đã tổng hợp các lỗi hay gặp khi chạy sqlmap trên DVWA mức Medium và High — đặc biệt là vấn đề CSRF token. Hãy thêm --csrf-token=user_token --csrf-url='http://localhost/DVWA/...'",
    originalLang: "Vietnamese",
    tags: ["sqlmap", "dvwa", "sqli", "beginner"],
    likes: 87,
    replies: 21,
    date: "2025-06-25",
  },
  {
    id: 3,
    author: "kernel_panik",
    country: "Germany",
    flag: "🇩🇪",
    title: "Privilege escalation via writable /etc/passwd — step-by-step",
    body: "Wenn /etc/passwd world-writable ist, kannst du direkt einen neuen root-User hinzufügen. openssl passwd -1 -salt xyz mypassword gibt dir den Hash, dann einfach newroot:HASH:0:0:root:/root:/bin/bash anhängen.",
    originalLang: "German",
    tags: ["privesc", "linux", "passwd", "walkthrough"],
    likes: 201,
    replies: 55,
    date: "2025-06-20",
  },
  {
    id: 4,
    author: "0xDarkStar",
    country: "Brazil",
    flag: "🇧🇷",
    title: "WiFi deauth + handshake capture on WPA2 — full guide 2025",
    body: "Workflow completo: 1) airmon-ng start wlan0  2) airodump-ng -c CH --bssid MAC -w cap wlan0mon  3) aireplay-ng --deauth 10 -a MAC wlan0mon  4) aircrack-ng cap-01.cap -w wordlist.txt — resultados em ~5 min com boa wordlist.",
    originalLang: "Portuguese",
    tags: ["wifi", "wpa2", "aircrack", "wireless"],
    likes: 315,
    replies: 89,
    date: "2025-06-15",
  },
  {
    id: 5,
    author: "recon_ninja",
    country: "India",
    flag: "🇮🇳",
    title: "theHarvester + Shodan combo for passive OSINT",
    body: "Combining theHarvester with the Shodan API gives you a complete passive footprint. Run theHarvester -d target.com -b all -f results first, then cross-reference IPs in Shodan for exposed services.",
    tags: ["osint", "theharvester", "shodan", "recon"],
    likes: 178,
    replies: 44,
    date: "2025-06-10",
  },
  {
    id: 6,
    author: "ryota_sec",
    country: "Japan",
    flag: "🇯🇵",
    title: "Burp Suite Intruder でのフォームブルートフォース",
    body: "Burp Suite Community版でのIntruder使用方法。Sniper攻撃タイプを選択し、ユーザー名フィールドを§で囲む。Payloadsタブでwordlistを設定。レスポンスの長さやステータスコードの違いで成功を判断。",
    originalLang: "Japanese",
    tags: ["burpsuite", "bruteforce", "intruder", "web"],
    likes: 93,
    replies: 27,
    date: "2025-06-05",
  },
  {
    id: 7,
    author: "ghostshell_eu",
    country: "Netherlands",
    flag: "🇳🇱",
    title: "Buffer overflow — 32-bit Linux binary with ASLR disabled",
    body: "Classic stack smashing walkthrough. First, find the EIP offset with a cyclic pattern (python3 -c 'import cyclic; print(cyclic.cyclic(200))'), then identify bad chars, find a JMP ESP gadget with ROPgadget, and drop your shellcode.",
    tags: ["bof", "exploit-dev", "rop", "reversing"],
    likes: 256,
    replies: 73,
    date: "2025-05-30",
  },
  {
    id: 8,
    author: "cloudpwner",
    country: "Canada",
    flag: "🇨🇦",
    title: "AWS IAM misconfiguration exploitation — real-world scenario",
    body: "Found an over-privileged IAM role in a bug bounty? Here's how to enumerate further: aws sts get-caller-identity, aws iam list-attached-role-policies, enumerate S3 with aws s3 ls, and check for secrets in EC2 metadata (SSRF → IMDS).",
    tags: ["cloud", "aws", "iam", "bug-bounty"],
    likes: 412,
    replies: 121,
    date: "2025-05-22",
  },
];

const ALL_TAGS = Array.from(new Set(SAMPLE_POSTS.flatMap((p) => p.tags))).sort();

/* -------------------------------------------------------------------------- */

function ForumPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const filtered = SAMPLE_POSTS.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()));
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  const pinned = filtered.filter((p) => p.pinned);
  const regular = filtered.filter((p) => !p.pinned);

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Community Forum</h1>
          <Badge variant="outline" className="text-xs">
            Global · Open · Free
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          A permanent, open forum for ethical hackers, pentesters, and Linux users worldwide. Post
          in any language —{" "}
          <span className="text-primary font-medium">
            all non-English content is automatically translated to English
          </span>
          . Share writeups, ask questions, and collaborate.
        </p>

        {/* Translation notice */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm max-w-2xl">
          <Languages className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <span>
            <span className="font-medium text-primary">Auto-translation enabled.</span> Posts in any
            language are automatically translated to English for global readability while preserving
            the original text.
          </span>
        </div>

        {/* Ethics reminder */}
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm max-w-2xl">
          <Shield className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <span className="text-muted-foreground">
            All content must comply with our{" "}
            <a href="/ethics" className="text-primary hover:underline">
              ethics &amp; authorisation policy
            </a>
            . Posts describing illegal activity, targeting production systems without authorisation,
            or sharing malware are removed and reported. Authorised lab/CTF scenarios only.
          </span>
        </div>
      </section>

      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          {SAMPLE_POSTS.length} posts
        </span>
        <span className="flex items-center gap-1">
          <Globe className="h-4 w-4" />6 languages represented
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          Open to all
        </span>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts, tags, or topics…"
          className="max-w-sm"
        />
        <Button onClick={() => setShowCompose((v) => !v)} size="sm">
          {showCompose ? "Cancel" : "✏️ New Post"}
        </Button>
      </div>

      {/* Tag filter */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full border px-3 py-0.5 text-xs transition ${!activeTag ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
        >
          All
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`rounded-full border px-3 py-0.5 text-xs transition ${activeTag === tag ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Compose form */}
      {showCompose && (
        <div className="mb-8 rounded-lg border border-primary/40 bg-card p-5">
          <h2 className="mb-4 text-base font-semibold">New Post</h2>
          <div className="space-y-3">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Post title…"
            />
            <Textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Write in any language. Your post will be auto-translated to English for the community."
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              By posting you agree to our ethics policy. No malware, no illegal targeting, no
              personal data of others.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setShowCompose(false);
                  setNewTitle("");
                  setNewBody("");
                }}
              >
                Submit Post
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pinned posts */}
      {pinned.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Pin className="h-3.5 w-3.5" /> Pinned
          </h2>
          <div className="space-y-3">
            {pinned.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                liked={likedPosts.has(post.id)}
                onLike={toggleLike}
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular posts */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Posts
        </h2>
        {regular.length === 0 && (
          <p className="text-sm text-muted-foreground">No posts match your search.</p>
        )}
        <div className="space-y-3">
          {regular.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={likedPosts.has(post.id)}
              onLike={toggleLike}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function PostCard({
  post,
  liked,
  onLike,
}: {
  post: ForumPost;
  liked: boolean;
  onLike: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-4 transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
            <span title={post.country}>{post.flag}</span>
            <span className="font-mono font-medium text-foreground">{post.author}</span>
            {post.originalLang && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <Languages className="h-2.5 w-2.5" />
                Translated from {post.originalLang}
              </Badge>
            )}
            <span className="ml-auto">{post.date}</span>
          </div>
          <button
            className="text-left font-semibold hover:text-primary transition-colors"
            onClick={() => setExpanded((v) => !v)}
          >
            {post.title}
          </button>
          {expanded && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.body}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1 transition hover:text-primary ${liked ? "text-primary" : ""}`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {post.replies} replies
        </span>
      </div>
    </div>
  );
}
