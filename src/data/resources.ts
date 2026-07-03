// Global ethical hacking resources — certifications, platforms, frameworks, databases, communities.
// All entries are legitimate, publicly available resources for defensive and authorized offensive research.

export type ResourceLink = {
  name: string;
  url: string;
  description: string;
  free?: boolean;
};

export type ResourceSection = {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: ResourceLink[];
};

export const GLOBAL_RESOURCES: ResourceSection[] = [
  {
    id: "certifications",
    title: "Certifications",
    icon: "🏆",
    description:
      "Industry-recognized credentials for offensive and defensive security practitioners.",
    items: [
      {
        name: "OSCP — Offensive Security Certified Professional",
        url: "https://www.offsec.com/courses/pen-200/",
        description:
          "Hands-on 24-hour exam requiring exploitation of real machines. Gold standard for penetration testers.",
        free: false,
      },
      {
        name: "PNPT — Practical Network Penetration Tester",
        url: "https://certifications.tcm-sec.com/pnpt/",
        description:
          "TCM Security's practical cert with a 5-day simulated pentest and report. Highly respected.",
        free: false,
      },
      {
        name: "CEH — Certified Ethical Hacker",
        url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        description:
          "EC-Council multiple-choice exam covering ethical hacking domains. Widely recognized.",
        free: false,
      },
      {
        name: "GPEN — GIAC Penetration Tester",
        url: "https://www.giac.org/certifications/penetration-tester-gpen/",
        description:
          "SANS/GIAC certification with open-book proctored exam covering pentesting techniques.",
        free: false,
      },
      {
        name: "GWAPT — GIAC Web Application Penetration Tester",
        url: "https://www.giac.org/certifications/web-application-penetration-tester-gwapt/",
        description: "Focused specifically on web application security testing.",
        free: false,
      },
      {
        name: "eJPT — eLearnSecurity Junior Penetration Tester",
        url: "https://security.ine.com/certifications/ejpt-certification/",
        description: "Beginner-friendly entry-level pentest cert. Great starting point.",
        free: false,
      },
      {
        name: "eCPPT — eLearnSecurity Certified Professional Penetration Tester",
        url: "https://security.ine.com/certifications/ecppt-certification/",
        description: "Intermediate pentest cert with report writing requirement.",
        free: false,
      },
      {
        name: "BSCP — Burp Suite Certified Practitioner",
        url: "https://portswigger.net/web-security/certification",
        description:
          "PortSwigger's web application security exam requiring 2 apps exploited in 4 hours.",
        free: false,
      },
      {
        name: "CRTO — Certified Red Team Operator",
        url: "https://training.zeropointsecurity.co.uk/courses/red-team-ops",
        description: "Red team operations using Cobalt Strike. Excellent C2 and AD attack content.",
        free: false,
      },
      {
        name: "CPTS — Certified Penetration Testing Specialist",
        url: "https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist",
        description: "HTB Academy's new comprehensive cert with 28-day exam environment.",
        free: false,
      },
      {
        name: "CompTIA PenTest+",
        url: "https://www.comptia.org/certifications/pentest",
        description:
          "Vendor-neutral intermediate pentest cert covering planning, scoping, and reporting.",
        free: false,
      },
      {
        name: "CompTIA Security+",
        url: "https://www.comptia.org/certifications/security",
        description: "Foundational security cert — good baseline for anyone entering the field.",
        free: false,
      },
    ],
  },
  {
    id: "learning-platforms",
    title: "Learning Platforms & Labs",
    icon: "🎓",
    description: "Interactive hands-on environments to practice ethical hacking legally.",
    items: [
      {
        name: "TryHackMe",
        url: "https://tryhackme.com",
        description:
          "Browser-based guided rooms for beginners to advanced. Largest free tier available.",
        free: true,
      },
      {
        name: "HackTheBox",
        url: "https://www.hackthebox.com",
        description:
          "Industry-standard pentesting labs. Machines range from easy to insane difficulty.",
        free: true,
      },
      {
        name: "PortSwigger Web Security Academy",
        url: "https://portswigger.net/web-security",
        description:
          "100% free, world-class web application security labs covering all OWASP categories.",
        free: true,
      },
      {
        name: "PentesterLab",
        url: "https://pentesterlab.com",
        description: "Practical web application and code review exercises with certificates.",
        free: true,
      },
      {
        name: "VulnHub",
        url: "https://www.vulnhub.com",
        description:
          "Downloadable vulnerable VMs for offline practice. Hundreds of machines available.",
        free: true,
      },
      {
        name: "OffSec Proving Grounds",
        url: "https://www.offsec.com/labs/",
        description:
          "OffSec's practice labs. Community tier is free; practice machines mirror OSCP difficulty.",
        free: true,
      },
      {
        name: "HackTheBox Academy",
        url: "https://academy.hackthebox.com",
        description: "Structured learning paths covering all penetration testing domains.",
        free: true,
      },
      {
        name: "DVWA — Damn Vulnerable Web App",
        url: "https://github.com/digininja/DVWA",
        description: "Self-hosted vulnerable PHP/MySQL web application for practicing web attacks.",
        free: true,
      },
      {
        name: "WebGoat — OWASP",
        url: "https://github.com/WebGoat/WebGoat",
        description: "OWASP's deliberately insecure application for learning web app security.",
        free: true,
      },
      {
        name: "Juice Shop — OWASP",
        url: "https://owasp.org/www-project-juice-shop/",
        description:
          "OWASP's modern vulnerable web app written in Node.js. Covers all OWASP Top 10.",
        free: true,
      },
      {
        name: "TCM Security Academy",
        url: "https://academy.tcm-sec.com",
        description: "Affordable practical courses by experienced pentesters. Excellent quality.",
        free: false,
      },
      {
        name: "INE Security",
        url: "https://ine.com/learning/areas/cyber-security",
        description: "Training provider behind eJPT/eCPPT certs. Comprehensive library.",
        free: false,
      },
      {
        name: "Cybrary",
        url: "https://www.cybrary.it",
        description: "Large library of security courses with free and paid tiers.",
        free: true,
      },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks & Methodologies",
    icon: "🗺️",
    description:
      "Structured frameworks for attack simulation, risk assessment, and security controls.",
    items: [
      {
        name: "MITRE ATT&CK",
        url: "https://attack.mitre.org",
        description:
          "Globally-accessible knowledge base of adversary tactics and techniques. Essential reference for red/blue teams.",
        free: true,
      },
      {
        name: "MITRE ATT&CK Navigator",
        url: "https://mitre-attack.github.io/attack-navigator/",
        description: "Interactive web tool for annotating and exploring the ATT&CK matrix.",
        free: true,
      },
      {
        name: "OWASP Top 10",
        url: "https://owasp.org/www-project-top-ten/",
        description: "The definitive list of the most critical web application security risks.",
        free: true,
      },
      {
        name: "OWASP Testing Guide",
        url: "https://owasp.org/www-project-web-security-testing-guide/",
        description: "Comprehensive methodology for testing web application security.",
        free: true,
      },
      {
        name: "OWASP API Security Top 10",
        url: "https://owasp.org/www-project-api-security/",
        description: "Top API security risks — essential as APIs become ubiquitous.",
        free: true,
      },
      {
        name: "PTES — Penetration Testing Execution Standard",
        url: "http://www.pentest-standard.org/index.php/Main_Page",
        description: "Standard defining the minimum requirements for a complete pentest.",
        free: true,
      },
      {
        name: "OSSTMM — Open Source Security Testing Methodology Manual",
        url: "https://www.isecom.org/OSSTMM.3.pdf",
        description: "Scientific methodology for security testing and metrics.",
        free: true,
      },
      {
        name: "NIST Cybersecurity Framework",
        url: "https://www.nist.gov/cyberframework",
        description:
          "Identify, Protect, Detect, Respond, Recover — widely adopted risk management framework.",
        free: true,
      },
      {
        name: "CIS Controls",
        url: "https://www.cisecurity.org/controls/",
        description:
          "Prioritized set of actions to defend against common cyber attacks. v8 covers 18 controls.",
        free: true,
      },
      {
        name: "CVSS — Common Vulnerability Scoring System",
        url: "https://www.first.org/cvss/",
        description: "Standard for rating the severity of security vulnerabilities.",
        free: true,
      },
      {
        name: "TIBER-EU Framework",
        url: "https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/html/index.en.html",
        description: "European framework for threat-intelligence-based ethical red-teaming.",
        free: true,
      },
    ],
  },
  {
    id: "vulnerability-databases",
    title: "Vulnerability & Exploit Databases",
    icon: "🗄️",
    description: "Authoritative databases for CVEs, advisories, and public exploits.",
    items: [
      {
        name: "NVD — National Vulnerability Database",
        url: "https://nvd.nist.gov",
        description: "NIST's comprehensive CVE database with CVSS scores and CPE mappings.",
        free: true,
      },
      {
        name: "CVE Details",
        url: "https://www.cvedetails.com",
        description: "Searchable CVE database with product-level browsing and statistics.",
        free: true,
      },
      {
        name: "Exploit-DB",
        url: "https://www.exploit-db.com",
        description:
          "Offensive Security's public exploit archive. Use searchsploit CLI for offline access.",
        free: true,
      },
      {
        name: "Vulners",
        url: "https://vulners.com",
        description:
          "Security intelligence search engine aggregating CVEs, exploits, advisories, and patches.",
        free: true,
      },
      {
        name: "Packet Storm Security",
        url: "https://packetstormsecurity.com",
        description: "Long-running archive of exploits, advisories, and security tools.",
        free: true,
      },
      {
        name: "OSV — Open Source Vulnerabilities",
        url: "https://osv.dev",
        description: "Google's open-source vulnerability database with structured data.",
        free: true,
      },
      {
        name: "VulDB",
        url: "https://vuldb.com",
        description: "Vulnerability database with timeline and context for each entry.",
        free: true,
      },
      {
        name: "CISA KEV — Known Exploited Vulnerabilities",
        url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
        description: "CISA's catalog of CVEs that are actively exploited in the wild.",
        free: true,
      },
      {
        name: "Snyk Vulnerability DB",
        url: "https://security.snyk.io",
        description: "Developer-focused vulnerability database covering open-source packages.",
        free: true,
      },
    ],
  },
  {
    id: "bug-bounty",
    title: "Bug Bounty Platforms",
    icon: "💰",
    description:
      "Platforms connecting security researchers with organizations offering authorized testing programs.",
    items: [
      {
        name: "HackerOne",
        url: "https://www.hackerone.com/hackers",
        description: "Largest bug bounty platform. Thousands of public and private programs.",
        free: true,
      },
      {
        name: "Bugcrowd",
        url: "https://www.bugcrowd.com/hackers/bugcrowd-university/",
        description: "Major platform with public programs and Bugcrowd University free training.",
        free: true,
      },
      {
        name: "Intigriti",
        url: "https://www.intigriti.com",
        description: "European bug bounty platform with strong community focus.",
        free: true,
      },
      {
        name: "Synack",
        url: "https://www.synack.com/red-team/",
        description: "Vetted researcher network with higher-paying private programs.",
        free: false,
      },
      {
        name: "YesWeHack",
        url: "https://www.yeswehack.com",
        description: "European platform with public and private programs.",
        free: true,
      },
      {
        name: "Open Bug Bounty",
        url: "https://www.openbugbounty.org",
        description: "Non-profit platform for responsible disclosure of web vulnerabilities.",
        free: true,
      },
      {
        name: "Immunefi (Web3)",
        url: "https://immunefi.com",
        description: "Bug bounty platform for blockchain and DeFi projects. High payouts.",
        free: true,
      },
      {
        name: "Cobalt",
        url: "https://cobalt.io",
        description:
          "PTaaS (Pentest as a Service) platform — not traditional bug bounty but relevant.",
        free: false,
      },
    ],
  },
  {
    id: "threat-intel",
    title: "Threat Intelligence & News",
    icon: "🔍",
    description: "Stay current with threat intelligence, research, and security news.",
    items: [
      {
        name: "Shodan",
        url: "https://www.shodan.io",
        description:
          "Internet-connected device search engine. Essential for external attack surface mapping.",
        free: true,
      },
      {
        name: "Censys",
        url: "https://search.censys.io",
        description:
          "Certificate and internet-wide scanning platform. Excellent for passive recon.",
        free: true,
      },
      {
        name: "GreyNoise",
        url: "https://viz.greynoise.io",
        description:
          "Identifies internet background noise vs targeted attacks on your infrastructure.",
        free: true,
      },
      {
        name: "VirusTotal",
        url: "https://www.virustotal.com",
        description: "Multi-engine malware scanner for files, URLs, IPs, and domains.",
        free: true,
      },
      {
        name: "Any.run",
        url: "https://app.any.run",
        description: "Interactive malware sandbox for analyzing suspicious files and URLs.",
        free: true,
      },
      {
        name: "URLScan.io",
        url: "https://urlscan.io",
        description: "Sandbox that scans and analyses URLs. Excellent for phishing investigation.",
        free: true,
      },
      {
        name: "Krebs on Security",
        url: "https://krebsonsecurity.com",
        description: "Brian Krebs's investigative security journalism. Deep-dive reporting.",
        free: true,
      },
      {
        name: "Schneier on Security",
        url: "https://www.schneier.com",
        description: "Bruce Schneier's security and policy blog. Thoughtful long-form analysis.",
        free: true,
      },
      {
        name: "The Hacker News",
        url: "https://thehackernews.com",
        description: "Daily cybersecurity news covering breaches, vulnerabilities, and tools.",
        free: true,
      },
      {
        name: "Bleeping Computer",
        url: "https://www.bleepingcomputer.com",
        description: "Tech and security news with excellent malware and ransomware coverage.",
        free: true,
      },
      {
        name: "Recorded Future Blog",
        url: "https://www.recordedfuture.com/blog",
        description: "Threat intelligence research from a major vendor.",
        free: true,
      },
    ],
  },
  {
    id: "tools-references",
    title: "Tool Documentation & References",
    icon: "📚",
    description: "Official documentation and cheat sheets for key security tools.",
    items: [
      {
        name: "GTFOBins",
        url: "https://gtfobins.github.io",
        description:
          "Unix binary privilege escalation and filter bypass cheatsheet. Essential for post-exploitation.",
        free: true,
      },
      {
        name: "LOLBAS — Living Off The Land Binaries",
        url: "https://lolbas-project.github.io",
        description: "Windows binaries that can be abused for execution, persistence, and bypass.",
        free: true,
      },
      {
        name: "HackTricks",
        url: "https://book.hacktricks.xyz",
        description:
          "Massive community wiki covering pentest techniques, CTF tricks, and tool usage.",
        free: true,
      },
      {
        name: "PayloadsAllTheThings",
        url: "https://github.com/swisskyrepo/PayloadsAllTheThings",
        description: "GitHub repo of payloads and bypasses for web/network pentesting.",
        free: true,
      },
      {
        name: "SecLists",
        url: "https://github.com/danielmiessler/SecLists",
        description:
          "Enormous collection of wordlists for usernames, passwords, URLs, fuzzing payloads.",
        free: true,
      },
      {
        name: "Impacket Documentation",
        url: "https://github.com/fortra/impacket",
        description: "Python library and tools for Windows/AD protocol attacks.",
        free: true,
      },
      {
        name: "Bloodhound Documentation",
        url: "https://bloodhound.readthedocs.io",
        description: "AD attack path analysis tool documentation.",
        free: true,
      },
      {
        name: "Metasploit Unleashed",
        url: "https://www.offsec.com/metasploit-unleashed/",
        description: "Free comprehensive Metasploit course by Offensive Security.",
        free: true,
      },
      {
        name: "Nmap NSE Reference",
        url: "https://nmap.org/nsedoc/",
        description: "Official documentation for all Nmap Scripting Engine scripts.",
        free: true,
      },
      {
        name: "OWASP Cheat Sheet Series",
        url: "https://cheatsheetseries.owasp.org",
        description: "Concise reference guides for developers and testers on security topics.",
        free: true,
      },
      {
        name: "Red Team Notes",
        url: "https://www.ired.team",
        description: "Comprehensive red team techniques and notes, well-organized by technique.",
        free: true,
      },
      {
        name: "WADComs",
        url: "https://wadcoms.github.io",
        description: "Interactive cheat sheet for offensive Active Directory commands.",
        free: true,
      },
    ],
  },
  {
    id: "legal-ethics",
    title: "Legal, Ethics & Responsible Disclosure",
    icon: "⚖️",
    description:
      "Frameworks and guidance for operating legally and ethically as a security researcher.",
    items: [
      {
        name: "EFF Electronic Frontier Foundation",
        url: "https://www.eff.org/issues/security",
        description: "Legal defence and advocacy for security researchers. Know your rights.",
        free: true,
      },
      {
        name: "CFAA — Computer Fraud and Abuse Act (US)",
        url: "https://www.law.cornell.edu/uscode/text/18/1030",
        description: "US law governing unauthorized computer access. Read it before any test.",
        free: true,
      },
      {
        name: "Computer Misuse Act (UK)",
        url: "https://www.legislation.gov.uk/ukpga/1990/18/contents",
        description: "UK legislation on unauthorized computer access and modification.",
        free: true,
      },
      {
        name: "ISO/IEC 29147 — Vulnerability Disclosure",
        url: "https://www.iso.org/standard/72311.html",
        description: "International standard for responsible disclosure of vulnerabilities.",
        free: false,
      },
      {
        name: "CERT/CC Responsible Disclosure Guidelines",
        url: "https://www.kb.cert.org/vuls/govdisclosure/",
        description: "Guidelines from CERT Coordination Center on disclosing vulnerabilities.",
        free: true,
      },
      {
        name: "Google Project Zero Disclosure Policy",
        url: "https://googleprojectzero.blogspot.com/2021/04/policy-and-disclosure-2021-edition.html",
        description: "Industry-shaping 90-day disclosure policy from Google's elite research team.",
        free: true,
      },
      {
        name: "HackerOne Disclosure Guidelines",
        url: "https://www.hackerone.com/vulnerability-and-security-testing-policy",
        description:
          "Practical guidance on responsible vulnerability disclosure in a bug bounty context.",
        free: true,
      },
      {
        name: "The Hacker's Manifesto (Ethics reading)",
        url: "http://phrack.org/issues/7/3.html",
        description: "Classic 1986 essay from Phrack. Historical context for hacker ethics.",
        free: true,
      },
      {
        name: "ISC2 Code of Ethics",
        url: "https://www.isc2.org/Ethics",
        description: "Professional code of ethics for certified security practitioners.",
        free: true,
      },
    ],
  },
  {
    id: "communities",
    title: "Communities & Conferences",
    icon: "🤝",
    description: "Places to connect with the global security research community.",
    items: [
      {
        name: "DEF CON",
        url: "https://defcon.org",
        description: "World's largest hacker conference (Las Vegas, annual). CTF, talks, villages.",
        free: false,
      },
      {
        name: "Black Hat",
        url: "https://www.blackhat.com",
        description: "Professional security conference with cutting-edge research presentations.",
        free: false,
      },
      {
        name: "BSides",
        url: "https://www.securitybsides.com",
        description: "Community-driven security conferences worldwide. Many are free.",
        free: true,
      },
      {
        name: "DEF CON Forums",
        url: "https://forum.defcon.org",
        description: "Active forums for hacker community discussion.",
        free: true,
      },
      {
        name: "Reddit r/netsec",
        url: "https://www.reddit.com/r/netsec/",
        description: "High-quality technical security news and research sharing.",
        free: true,
      },
      {
        name: "Reddit r/hacking",
        url: "https://www.reddit.com/r/hacking/",
        description: "General hacking discussion community.",
        free: true,
      },
      {
        name: "0x00sec",
        url: "https://0x00sec.org",
        description: "Technical hacking community with tutorials and discussion.",
        free: true,
      },
      {
        name: "Hack The Box Discord",
        url: "https://discord.gg/hackthebox",
        description:
          "Active community for HTB users. Hints, writeups (after expiry), career advice.",
        free: true,
      },
      {
        name: "TryHackMe Discord",
        url: "https://discord.gg/tryhackme",
        description: "THM community for room help and discussion.",
        free: true,
      },
      {
        name: "Phrack Magazine",
        url: "http://phrack.org",
        description: "The oldest e-zine for hackers. Deep technical content since 1985.",
        free: true,
      },
      {
        name: "PoC||GTFO",
        url: "https://github.com/angea/pocorgtfo",
        description: "Technical security e-zine featuring polyglot exploits and research.",
        free: true,
      },
    ],
  },
  {
    id: "ctf",
    title: "CTF & Practice",
    icon: "🚩",
    description: "Capture The Flag competitions and challenge archives for skill development.",
    items: [
      {
        name: "CTFtime",
        url: "https://ctftime.org",
        description: "Aggregator of all upcoming and past CTF competitions worldwide.",
        free: true,
      },
      {
        name: "picoCTF",
        url: "https://picoctf.org",
        description:
          "Beginner-focused CTF from Carnegie Mellon University. Excellent for newcomers.",
        free: true,
      },
      {
        name: "pwn.college",
        url: "https://pwn.college",
        description: "Free binary exploitation and systems security learning platform from ASU.",
        free: true,
      },
      {
        name: "CryptoHack",
        url: "https://cryptohack.org",
        description: "Cryptography learning platform through challenges. Fun and educational.",
        free: true,
      },
      {
        name: "Root-Me",
        url: "https://www.root-me.org",
        description: "French platform with hundreds of challenges across all security categories.",
        free: true,
      },
      {
        name: "Over The Wire",
        url: "https://overthewire.org/wargames/",
        description: "Classic Linux/CTF wargames. Bandit is the canonical beginner series.",
        free: true,
      },
      {
        name: "Hacking Lab",
        url: "https://www.hacking-lab.com",
        description: "Swiss legal hacking competitions and training platform.",
        free: true,
      },
      {
        name: "RingZer0 CTF",
        url: "https://ringzer0ctf.com",
        description: "Permanent CTF with a wide range of challenge categories.",
        free: true,
      },
    ],
  },
];
