import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ResourceCategory =
  | "Practice Platforms"
  | "CVE Databases"
  | "Bug Bounty"
  | "Tools"
  | "News"
  | "Standards";

type Resource = {
  name: string;
  description: string;
  url: string;
  category: ResourceCategory;
};

const CATEGORIES: ResourceCategory[] = [
  "Practice Platforms",
  "CVE Databases",
  "Bug Bounty",
  "Tools",
  "News",
  "Standards",
];

const RESOURCES: Resource[] = [
  { name: "Hack The Box", description: "The leading ethical hacking practice platform with real-world labs.", url: "https://www.hackthebox.com", category: "Practice Platforms" },
  { name: "TryHackMe", description: "Beginner-friendly CTF platform with guided learning paths.", url: "https://tryhackme.com", category: "Practice Platforms" },
  { name: "PortSwigger Web Security Academy", description: "Free, world-class web security training.", url: "https://portswigger.net/web-security", category: "Practice Platforms" },
  { name: "VulnHub", description: "Downloadable vulnerable virtual machines for practice.", url: "https://www.vulnhub.com", category: "Practice Platforms" },
  { name: "PentesterLab", description: "Hands-on web application security exercises.", url: "https://pentesterlab.com", category: "Practice Platforms" },
  { name: "Root-Me", description: "Large collection of security challenges across web, reverse, crypto, and forensics.", url: "https://www.root-me.org", category: "Practice Platforms" },
  { name: "OverTheWire", description: "Classic Linux and exploitation wargames for command-line learning.", url: "https://overthewire.org/wargames/", category: "Practice Platforms" },
  { name: "picoCTF", description: "Free capture-the-flag platform designed for learners and classrooms.", url: "https://picoctf.org", category: "Practice Platforms" },
  { name: "CyberDefenders", description: "Blue-team and DFIR labs with realistic investigation scenarios.", url: "https://cyberdefenders.org", category: "Practice Platforms" },
  { name: "Blue Team Labs Online", description: "Detection and incident-response labs focused on defender workflows.", url: "https://blueteamlabs.online", category: "Practice Platforms" },
  { name: "Immersive", description: "Interactive cyber labs for hands-on team training and exercises.", url: "https://www.immersive.io", category: "Practice Platforms" },
  { name: "RangeForce", description: "Role-based cyber ranges for offensive and defensive skill development.", url: "https://www.rangeforce.com", category: "Practice Platforms" },
  { name: "CTFtime", description: "Calendar and scoreboard for public CTF competitions worldwide.", url: "https://ctftime.org", category: "Practice Platforms" },
  { name: "SANS Holiday Hack Challenge", description: "Annual themed security challenge packed with guided puzzles and labs.", url: "https://holidayhackchallenge.com", category: "Practice Platforms" },
  { name: "OWASP Juice Shop", description: "Intentionally insecure modern web app for training and workshops.", url: "https://owasp.org/www-project-juice-shop/", category: "Practice Platforms" },
  { name: "OWASP WebGoat", description: "Deliberately vulnerable application for learning secure coding and testing.", url: "https://owasp.org/www-project-webgoat/", category: "Practice Platforms" },
  { name: "Metasploitable 2", description: "Rapid7's intentionally vulnerable Linux VM for exploitation practice.", url: "https://docs.rapid7.com/metasploit/metasploitable-2/", category: "Practice Platforms" },
  { name: "DVWA", description: "Damn Vulnerable Web Application for practicing common web attack chains.", url: "https://github.com/digininja/DVWA", category: "Practice Platforms" },
  { name: "DVGA", description: "Damn Vulnerable GraphQL Application for GraphQL attack-path practice.", url: "https://github.com/dolevf/Damn-Vulnerable-GraphQL-Application", category: "Practice Platforms" },
  { name: "bWAPP", description: "A buggy web app with dozens of web security lessons and scenarios.", url: "https://sourceforge.net/projects/bwapp/", category: "Practice Platforms" },
  { name: "Altoro Mutual", description: "Deliberately insecure banking app useful for demoing classic web flaws.", url: "https://github.com/HCL-TECH-SOFTWARE/AltoroJ", category: "Practice Platforms" },
  { name: "OWASP Security Shepherd", description: "Gamified OWASP training project with guided challenge categories.", url: "https://owasp.org/www-project-security-shepherd/", category: "Practice Platforms" },
  { name: "Damn Vulnerable DeFi", description: "Smart-contract and DeFi exploitation challenges for blockchain learners.", url: "https://www.damnvulnerabledefi.xyz/", category: "Practice Platforms" },

  { name: "NVD", description: "The U.S. government repository of standards-based vulnerability data.", url: "https://nvd.nist.gov", category: "CVE Databases" },
  { name: "MITRE CVE", description: "Official list of publicly disclosed cybersecurity vulnerabilities and exposures.", url: "https://cve.mitre.org", category: "CVE Databases" },
  { name: "Exploit Database", description: "Archive of public exploits and corresponding vulnerable software.", url: "https://www.exploit-db.com", category: "CVE Databases" },
  { name: "CISA Known Exploited Vulnerabilities", description: "Catalog of vulnerabilities that are actively exploited in the wild.", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog", category: "CVE Databases" },
  { name: "VulDB", description: "Commercial and community vulnerability intelligence with exploit references.", url: "https://vuldb.com", category: "CVE Databases" },
  { name: "CVE Details", description: "Searchable CVE database with product, vendor, and scoring views.", url: "https://www.cvedetails.com", category: "CVE Databases" },
  { name: "OpenCVE", description: "Open-source CVE subscription and monitoring platform.", url: "https://www.opencve.io", category: "CVE Databases" },
  { name: "AttackerKB", description: "Researcher-focused vulnerability knowledge base with exploitability context.", url: "https://attackerkb.com", category: "CVE Databases" },
  { name: "Rapid7 Vulnerability DB", description: "Reference database linking vulnerabilities to exposure and exploit content.", url: "https://www.rapid7.com/db/", category: "CVE Databases" },
  { name: "Packet Storm Security", description: "Long-running archive of exploits, advisories, tools, and whitepapers.", url: "https://packetstormsecurity.com/", category: "CVE Databases" },
  { name: "Snyk Vulnerability DB", description: "Package-focused vulnerability intelligence with fix guidance.", url: "https://security.snyk.io/", category: "CVE Databases" },
  { name: "GitHub Advisory Database", description: "Advisories covering open-source package vulnerabilities and fixes.", url: "https://github.com/advisories", category: "CVE Databases" },
  { name: "OSV", description: "Open Source Vulnerabilities database with API access and package indexing.", url: "https://osv.dev/", category: "CVE Databases" },
  { name: "CERT/CC Vulnerability Notes", description: "Coordinated vulnerability notes from Carnegie Mellon's CERT division.", url: "https://kb.cert.org/vuls/", category: "CVE Databases" },
  { name: "FIRST EPSS", description: "Exploit Prediction Scoring System for prioritizing likely exploitation.", url: "https://www.first.org/epss/", category: "CVE Databases" },
  { name: "Microsoft Security Update Guide", description: "Microsoft's searchable release database for CVEs and patches.", url: "https://msrc.microsoft.com/update-guide", category: "CVE Databases" },
  { name: "Red Hat CVE Database", description: "Red Hat's product-specific CVE tracking and remediation notes.", url: "https://access.redhat.com/security/security-updates/cve", category: "CVE Databases" },
  { name: "Debian Security Tracker", description: "Debian package vulnerability tracking across releases.", url: "https://security-tracker.debian.org/tracker/", category: "CVE Databases" },
  { name: "Ubuntu CVE Tracker", description: "Ubuntu's status dashboard for package vulnerabilities and fixes.", url: "https://ubuntu.com/security/cves", category: "CVE Databases" },

  { name: "HackerOne", description: "Leading bug bounty platform connecting hackers with organizations.", url: "https://www.hackerone.com", category: "Bug Bounty" },
  { name: "Bugcrowd", description: "Crowdsourced security platform for bug bounties.", url: "https://www.bugcrowd.com", category: "Bug Bounty" },
  { name: "Intigriti", description: "European bug bounty and responsible disclosure platform.", url: "https://www.intigriti.com", category: "Bug Bounty" },
  { name: "Synack Red Team", description: "Private bug bounty and continuous testing platform with vetting.", url: "https://www.synack.com/red-team/", category: "Bug Bounty" },
  { name: "YesWeHack", description: "Bug bounty and VDP platform with global private and public programs.", url: "https://www.yeswehack.com", category: "Bug Bounty" },
  { name: "Open Bug Bounty", description: "Disclosure platform focused on web vulnerabilities and remediation.", url: "https://www.openbugbounty.org", category: "Bug Bounty" },
  { name: "Hacker101", description: "Free training plus CTF challenges that lead into real bounty workflows.", url: "https://www.hacker101.com", category: "Bug Bounty" },
  { name: "Mozilla Bug Bounty", description: "Mozilla's public bug bounty and security reward information.", url: "https://www.mozilla.org/en-US/security/bug-bounty/", category: "Bug Bounty" },
  { name: "Google VRP", description: "Google's vulnerability reward program hub and rules of engagement.", url: "https://bughunters.google.com", category: "Bug Bounty" },
  { name: "Microsoft Bounty Programs", description: "Microsoft's current bounty programs, payouts, and disclosure rules.", url: "https://www.microsoft.com/en-us/msrc/bounty", category: "Bug Bounty" },
  { name: "Meta Bug Bounty", description: "Meta's research program for Facebook, Instagram, and related assets.", url: "https://www.facebook.com/whitehat/", category: "Bug Bounty" },
  { name: "GitHub Bug Bounty", description: "GitHub's program scope, policy, and reporting guidance.", url: "https://bounty.github.com/", category: "Bug Bounty" },
  { name: "GitLab Bug Bounty", description: "GitLab's security program hosted through HackerOne.", url: "https://hackerone.com/gitlab", category: "Bug Bounty" },
  { name: "Shopify Bug Bounty", description: "Shopify's program rules and current reward guidance.", url: "https://www.shopify.com/bugbounty", category: "Bug Bounty" },
  { name: "Internet Bug Bounty", description: "Foundation-backed rewards for critical open-source internet software.", url: "https://internetbugbounty.org/", category: "Bug Bounty" },
  { name: "Atlassian Bug Bounty", description: "Atlassian's platform security testing scope and disclosure process.", url: "https://www.atlassian.com/trust/security/bug-bounty-program", category: "Bug Bounty" },
  { name: "Dropbox Bug Bounty", description: "Dropbox's vulnerability program on HackerOne.", url: "https://hackerone.com/dropbox", category: "Bug Bounty" },

  { name: "GTFOBins", description: "Unix binaries that can be used to bypass local security restrictions.", url: "https://gtfobins.github.io", category: "Tools" },
  { name: "PayloadsAllTheThings", description: "Useful payloads for various attacks.", url: "https://github.com/swisskyrepo/PayloadsAllTheThings", category: "Tools" },
  { name: "SecLists", description: "Collection of multiple types of lists for security assessments.", url: "https://github.com/danielmiessler/SecLists", category: "Tools" },
  { name: "HackTricks", description: "Comprehensive hacking tricks and techniques.", url: "https://book.hacktricks.xyz", category: "Tools" },
  { name: "LOLBAS", description: "Living Off The Land Binaries, Scripts and Libraries.", url: "https://lolbas-project.github.io", category: "Tools" },
  { name: "Kali Linux Docs", description: "Official Kali Linux documentation.", url: "https://www.kali.org/docs/", category: "Tools" },
  { name: "Nmap Reference Guide", description: "Canonical Nmap reference manual and network scanning book content.", url: "https://nmap.org/book/man.html", category: "Tools" },
  { name: "Metasploit Docs", description: "Official framework guides, module usage, and payload documentation.", url: "https://docs.metasploit.com/", category: "Tools" },
  { name: "Burp Suite Docs", description: "Official documentation for Burp Suite testing workflows and tooling.", url: "https://portswigger.net/burp/documentation", category: "Tools" },
  { name: "Wireshark Docs", description: "Packet analysis documentation, display filters, and protocol references.", url: "https://www.wireshark.org/docs/", category: "Tools" },
  { name: "sqlmap Wiki", description: "Usage examples and switches for automated SQL injection testing.", url: "https://github.com/sqlmapproject/sqlmap/wiki", category: "Tools" },
  { name: "Ghidra", description: "Open-source reverse engineering suite from the NSA.", url: "https://ghidra-sre.org/", category: "Tools" },
  { name: "Impacket", description: "Python toolkit and example scripts for network protocol testing.", url: "https://github.com/fortra/impacket", category: "Tools" },
  { name: "ffuf", description: "Fast web fuzzer for content discovery and parameter probing.", url: "https://github.com/ffuf/ffuf", category: "Tools" },
  { name: "Nuclei", description: "Template-driven vulnerability scanner for rapid validation.", url: "https://github.com/projectdiscovery/nuclei", category: "Tools" },
  { name: "OWASP Amass", description: "Attack surface mapping and DNS enumeration framework.", url: "https://github.com/owasp-amass/amass", category: "Tools" },
  { name: "Responder", description: "LLMNR, NBT-NS, and MDNS poisoning toolkit for authorized AD tests.", url: "https://github.com/SpiderLabs/Responder", category: "Tools" },
  { name: "mitmproxy", description: "Interactive TLS-capable proxy for traffic inspection and replay.", url: "https://mitmproxy.org/", category: "Tools" },
  { name: "Nikto", description: "Web server scanner covering dangerous files and weak configurations.", url: "https://github.com/sullo/nikto", category: "Tools" },
  { name: "John the Ripper", description: "Password recovery suite with many formats and cracking modes.", url: "https://www.openwall.com/john/", category: "Tools" },
  { name: "Hashcat", description: "GPU-accelerated password recovery and auditing tool.", url: "https://hashcat.net/hashcat/", category: "Tools" },
  { name: "PEASS-ng", description: "Privilege escalation scripts for Linux and Windows post-exploitation.", url: "https://github.com/peass-ng/PEASS-ng", category: "Tools" },
  { name: "pwntools", description: "Python framework for exploit development and CTF automation.", url: "https://docs.pwntools.com/", category: "Tools" },
  { name: "pwndbg", description: "Feature-rich GDB plugin for exploit development and reversing.", url: "https://github.com/pwndbg/pwndbg", category: "Tools" },
  { name: "SearchSploit", description: "CLI interface to Exploit-DB for offline exploit lookup.", url: "https://www.exploit-db.com/searchsploit", category: "Tools" },

  { name: "SANS ISC", description: "Internet Storm Center threat intelligence and daily diary entries.", url: "https://isc.sans.edu", category: "News" },
  { name: "Google Project Zero", description: "Security research into zero-day vulnerabilities.", url: "https://googleprojectzero.blogspot.com", category: "News" },
  { name: "Krebs on Security", description: "In-depth security news and investigation.", url: "https://krebsonsecurity.com", category: "News" },
  { name: "The Hacker News", description: "Fast-moving security news covering breaches, malware, and defense.", url: "https://thehackernews.com", category: "News" },
  { name: "BleepingComputer", description: "Security and incident reporting with strong coverage of active campaigns.", url: "https://www.bleepingcomputer.com", category: "News" },
  { name: "Dark Reading", description: "Enterprise security news, analysis, and attacker trend coverage.", url: "https://www.darkreading.com", category: "News" },
  { name: "SecurityWeek", description: "Industry reporting on vulnerabilities, policy, and major incidents.", url: "https://www.securityweek.com", category: "News" },
  { name: "Schneier on Security", description: "Bruce Schneier's long-running commentary on security and policy.", url: "https://www.schneier.com/", category: "News" },
  { name: "Cisco Talos Blog", description: "Threat research and malware write-ups from Cisco Talos.", url: "https://blog.talosintelligence.com/", category: "News" },
  { name: "MSRC Blog", description: "Microsoft Security Response Center advisories and research notes.", url: "https://www.microsoft.com/en-us/msrc/blog/", category: "News" },
  { name: "Mandiant Blog", description: "Incident response, intrusion analysis, and actor tracking research.", url: "https://www.mandiant.com/resources/blog", category: "News" },
  { name: "Trail of Bits Blog", description: "Deep technical posts on auditing, exploitability, and secure design.", url: "https://blog.trailofbits.com/", category: "News" },
  { name: "NCC Group Research", description: "Consulting-grade security research and exploit write-ups.", url: "https://www.nccgroup.com/research-blog/", category: "News" },
  { name: "Elastic Security Labs", description: "Detection-focused research on malware, campaigns, and telemetry.", url: "https://www.elastic.co/security-labs", category: "News" },
  { name: "SentinelLabs", description: "Threat hunting and malware analysis from SentinelOne researchers.", url: "https://www.sentinelone.com/labs/", category: "News" },
  { name: "Unit 42", description: "Threat intelligence and incident response research from Palo Alto Networks.", url: "https://unit42.paloaltonetworks.com/", category: "News" },
  { name: "CISA Advisories", description: "Official U.S. government alerts and cybersecurity advisories.", url: "https://www.cisa.gov/news-events/cybersecurity-advisories", category: "News" },
  { name: "Red Canary Blog", description: "Detection engineering and threat operations content for defenders.", url: "https://redcanary.com/blog/", category: "News" },
  { name: "CrowdStrike Blog", description: "Threat intel, adversary analysis, and enterprise defense guidance.", url: "https://www.crowdstrike.com/blog/", category: "News" },

  { name: "OWASP Top 10", description: "The standard awareness document for web application security.", url: "https://owasp.org/Top10/", category: "Standards" },
  { name: "OWASP ASVS", description: "Application Security Verification Standard for secure design reviews.", url: "https://owasp.org/www-project-application-security-verification-standard/", category: "Standards" },
  { name: "MITRE ATT&CK", description: "Globally-accessible knowledge base of adversary tactics and techniques.", url: "https://attack.mitre.org", category: "Standards" },
  { name: "MITRE D3FEND", description: "Knowledge graph of defensive techniques mapped against ATT&CK concepts.", url: "https://d3fend.mitre.org/", category: "Standards" },
  { name: "CIS Controls", description: "Prioritized safeguards for improving organizational cyber defense.", url: "https://www.cisecurity.org/controls", category: "Standards" },
  { name: "NIST Cybersecurity Framework", description: "Foundational guidance for identify, protect, detect, respond, recover.", url: "https://www.nist.gov/cyberframework", category: "Standards" },
  { name: "NIST SP 800-61", description: "Computer security incident handling guide for response planning.", url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final", category: "Standards" },
  { name: "NIST SP 800-53", description: "Security and privacy controls catalog for information systems.", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final", category: "Standards" },
  { name: "CWE", description: "MITRE catalog of common weakness classes behind many vulnerabilities.", url: "https://cwe.mitre.org/", category: "Standards" },
  { name: "CAPEC", description: "Standardized catalog of adversary attack patterns.", url: "https://capec.mitre.org/", category: "Standards" },
  { name: "PTES", description: "Penetration Testing Execution Standard covering end-to-end engagements.", url: "https://www.pentest-standard.org/", category: "Standards" },
  { name: "OSSTMM", description: "Open methodology for measuring operational security posture.", url: "https://www.isecom.org/OSSTMM.3.pdf", category: "Standards" },
  { name: "OWASP WSTG", description: "Web Security Testing Guide with practical testing methodology.", url: "https://owasp.org/www-project-web-security-testing-guide/", category: "Standards" },
  { name: "OWASP API Security Top 10", description: "Risk categories and testing focus areas for modern APIs.", url: "https://owasp.org/API-Security/editions/2023/en/0x11-t10/", category: "Standards" },
  { name: "OWASP MASVS", description: "Mobile AppSec verification standard for iOS and Android projects.", url: "https://mas.owasp.org/MASVS/", category: "Standards" },
  { name: "STIX 2.1", description: "Structured threat intelligence representation standard.", url: "https://oasis-open.github.io/cti-documentation/stix/intro", category: "Standards" },
  { name: "TAXII 2.1", description: "Threat intel transport protocol for sharing STIX data.", url: "https://oasis-open.github.io/cti-documentation/taxii/intro", category: "Standards" },
  { name: "FIRST CVSS", description: "Common Vulnerability Scoring System specification and calculator links.", url: "https://www.first.org/cvss/", category: "Standards" },
  { name: "SSVC", description: "Stakeholder-Specific Vulnerability Categorization decision framework.", url: "https://www.cisa.gov/stakeholder-specific-vulnerability-categorization-ssvc", category: "Standards" },
  { name: "CSA Cloud Controls Matrix", description: "Cloud security control framework for shared-responsibility reviews.", url: "https://cloudsecurityalliance.org/research/cloud-controls-matrix", category: "Standards" },
  { name: "SLSA", description: "Supply-chain levels for software artifacts and build integrity.", url: "https://slsa.dev/", category: "Standards" },
  { name: "NIST SP 800-115", description: "Technical guide to information security testing and assessment.", url: "https://csrc.nist.gov/pubs/sp/800/115/final", category: "Standards" },
];

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: `Resources (${RESOURCES.length}) — distro/ref` },
      { name: "description", content: "Curated ethical hacking resources covering labs, vulnerability intel, bug bounty programs, tools, news, and standards." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "All">("All");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return RESOURCES.filter((resource) => {
      if (category !== "All" && resource.category !== category) return false;
      if (!needle) return true;
      return [resource.name, resource.description, resource.url, resource.category]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [category, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Curated security resources</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          A hand-picked offline-friendly directory of practice labs, standards, reference material, and current intel sources.
        </p>
      </header>

      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Authorized use only</p>
            <p className="mt-1 text-muted-foreground">
              These links are provided for education, defense, labs, and authorized assessments only. Verify scope, follow each platform's rules,
              and never use offensive techniques without explicit written permission.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search resources, vendors, labs, or standards…"
          className="max-w-2xl"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setQ(""); setCategory("All"); }}>
            Reset filters
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setCategory("All")}
          className={`rounded-full border px-3 py-1 text-xs ${category === "All" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
        >
          All
        </button>
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full border px-3 py-1 text-xs ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Showing {filtered.length} of {RESOURCES.length} curated resources.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((resource) => (
          <a key={`${resource.category}-${resource.name}`} href={resource.url} target="_blank" rel="noreferrer" className="block h-full">
            <Card className="h-full border-border transition hover:border-primary/60 hover:bg-accent/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{resource.name}</CardTitle>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {resource.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="mono truncate">{resource.url.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
