// Second wave of Kali/security tools not yet covered elsewhere.
// Same pattern as kali-extra.ts — every tool gets a command box
// and a not-found error entry so the detail page is complete.
import type { KaliTool, KaliCategory, Command, KnownError } from "./types";

const help = (inv: string): Command[] => [
  {
    name: `${inv} --help`,
    syntax: `${inv} --help`,
    description: "Print built-in usage.",
    examples: [{ code: `${inv} --help | less`, note: "Page through the full help." }],
    bestScenario: "Fast flag lookup.",
    category: "Reference",
  },
  {
    name: `man ${inv.split(" ")[0]}`,
    syntax: `man ${inv.split(" ")[0]}`,
    description: "Read the packaged man page.",
    examples: [{ code: `man ${inv.split(" ")[0]}`, note: "Authoritative reference." }],
    bestScenario: "When --help omits protocol details.",
    category: "Reference",
  },
];

const notFound = (inv: string): KnownError[] => [
  {
    message: `${inv}: command not found`,
    cause: "Package not installed on this host, or PATH missing /usr/sbin.",
    fix: `Install via 'sudo apt install <package>' (see the Package field above), or add /usr/sbin/ to PATH.`,
  },
];

// Compact factory
function tool(
  slug: string,
  name: string,
  category: KaliCategory,
  pkg: string,
  invocation: string,
  summary: string,
  extra: Command[] = [],
  extraErrors: KnownError[] = [],
  homepage = "",
): KaliTool {
  return {
    slug,
    name,
    category,
    package: pkg,
    homepage,
    summary,
    depth: "shallow",
    invocation,
    commands: [...extra, ...help(invocation)],
    errors: [...extraErrors, ...notFound(invocation)],
  };
}

export const KALI_EXTRA2_TOOLS: KaliTool[] = [
  // ============================================================
  // Information Gathering (extra)
  // ============================================================
  tool("assetfinder", "assetfinder", "Information Gathering", "assetfinder", "assetfinder",
    "Find related domains/subdomains for a given root."),
  tool("findomain", "findomain", "Information Gathering", "findomain", "findomain",
    "Cross-platform subdomain enumerator using multiple sources."),
  tool("waybackurls", "waybackurls", "Information Gathering", "waybackurls", "waybackurls",
    "Fetch all URLs the Wayback Machine knows about for a domain."),
  tool("gau", "getallurls (gau)", "Information Gathering", "gau", "gau",
    "Fetch known URLs from AlienVault OTX, Wayback, CommonCrawl and URLScan."),
  tool("hakrawler", "hakrawler", "Information Gathering", "hakrawler", "hakrawler",
    "Fast, headless web crawler for endpoint discovery."),
  tool("shodan-cli", "shodan CLI", "Information Gathering", "shodan", "shodan",
    "Query the Shodan API from the command line."),
  tool("censys-cli", "censys CLI", "Information Gathering", "censys", "censys",
    "Query the Censys API for hosts/certificates."),
  tool("crtsh", "crt.sh helper", "Information Gathering", "crtsh", "crtsh",
    "Query crt.sh for certificate-transparency subdomains."),
  tool("subfinder-plus", "subfinder", "Information Gathering", "subfinder", "subfinder",
    "Passive subdomain enumeration from ProjectDiscovery."),
  tool("dnsvalidator", "dnsvalidator", "Information Gathering", "dnsvalidator", "dnsvalidator",
    "Maintain a fast, working DNS resolver list."),
  tool("puredns", "puredns", "Information Gathering", "puredns", "puredns",
    "Fast, reliable subdomain bruteforcer with wildcard detection."),
  tool("massdns", "massdns", "Information Gathering", "massdns", "massdns",
    "Stub DNS resolver capable of millions of queries per second."),
  tool("dnstwist", "dnstwist", "Information Gathering", "dnstwist", "dnstwist",
    "Detect typosquatting and phishing domains against your brand."),
  tool("urlfinder", "urlfinder", "Information Gathering", "urlfinder", "urlfinder",
    "Discover URLs and JS endpoints from a target."),
  tool("gitleaks", "gitleaks", "Information Gathering", "gitleaks", "gitleaks",
    "Detect secrets in git repositories."),
  tool("trufflehog", "TruffleHog", "Information Gathering", "trufflehog", "trufflehog",
    "Scan git/S3/filesystems for verifiable secrets."),
  tool("noseyparker", "Nosey Parker", "Information Gathering", "noseyparker", "noseyparker",
    "High-performance secret-scanner for source repos and file dumps."),

  // ============================================================
  // Web / API
  // ============================================================
  tool("kiterunner", "kiterunner (kr)", "Web Application Analysis", "kiterunner", "kr",
    "Content-discovery for APIs — better than dictionary brute-force for REST/GraphQL."),
  tool("arjun", "Arjun", "Web Application Analysis", "arjun", "arjun",
    "HTTP parameter discovery."),
  tool("paramspider", "ParamSpider", "Web Application Analysis", "paramspider", "paramspider",
    "Mine URL parameters from public archives."),
  tool("gf", "gf (patterns)", "Web Application Analysis", "gf", "gf",
    "Wrapper around grep with reusable pattern sets for bug hunters."),
  tool("kxss", "kxss", "Web Application Analysis", "kxss", "kxss",
    "Discover reflection points that may lead to XSS."),
  tool("dalfox", "dalfox", "Web Application Analysis", "dalfox", "dalfox",
    "Fast XSS scanner and payload analyzer in Go."),
  tool("racepwn", "Turbo Intruder / race-tools (ref)", "Web Application Analysis", "turbo-intruder", "turbo-intruder",
    "Reference — Burp extension for race-condition testing."),
  tool("commix", "commix", "Web Application Analysis", "commix", "commix",
    "Automated command-injection tester."),
  tool("jaeles", "jaeles", "Web Application Analysis", "jaeles", "jaeles",
    "Powerful, flexible web app scanner using yaml signatures."),
  tool("wapiti", "wapiti", "Web Application Analysis", "wapiti", "wapiti",
    "Web app vulnerability scanner (black-box)."),
  tool("skipfish", "skipfish", "Web Application Analysis", "skipfish", "skipfish",
    "High-performance active web app security recon."),
  tool("cadaver", "cadaver", "Web Application Analysis", "cadaver", "cadaver",
    "WebDAV CLI client — good for uploading test files."),
  tool("davtest", "davtest", "Web Application Analysis", "davtest", "davtest",
    "Test WebDAV enabled servers for upload/execution."),
  tool("clusterd", "clusterd", "Web Application Analysis", "clusterd", "clusterd",
    "Application server attack toolkit (JBoss, ColdFusion, WebLogic)."),
  tool("droopescan", "droopescan", "Web Application Analysis", "droopescan", "droopescan",
    "Plugin-based scanner for Drupal, Joomla, WordPress and more."),
  tool("cmseek", "CMSeeK", "Web Application Analysis", "cmseek", "cmseek",
    "Fingerprint and analyze 200+ content management systems."),
  tool("brutespray", "brutespray", "Password Attacks", "brutespray", "brutespray",
    "Consume nmap output and spray creds across discovered services."),

  // ============================================================
  // Cloud
  // ============================================================
  tool("aws-cli", "aws CLI", "Vulnerability Analysis", "awscli", "aws",
    "Official AWS command line — used defensively for audit and offensively for enum."),
  tool("gcloud-cli", "gcloud CLI", "Vulnerability Analysis", "google-cloud-sdk", "gcloud",
    "Google Cloud CLI — audit IAM and services."),
  tool("azcli", "az CLI", "Vulnerability Analysis", "azure-cli", "az",
    "Microsoft Azure CLI — enum tenants and role assignments."),
  tool("cloudsplaining", "cloudsplaining", "Vulnerability Analysis", "cloudsplaining", "cloudsplaining",
    "IAM policy analyzer for AWS."),
  tool("cloudmapper", "CloudMapper", "Vulnerability Analysis", "cloudmapper", "cloudmapper",
    "Analyze and visualize AWS environments."),
  tool("cloudsploit", "CloudSploit", "Vulnerability Analysis", "cloudsploit", "cloudsploit",
    "Cloud security posture management across providers."),
  tool("stormspotter", "stormspotter", "Vulnerability Analysis", "stormspotter", "stormspotter",
    "Azure Red Team enumeration."),
  tool("azurehound", "AzureHound", "Post Exploitation", "azurehound", "azurehound",
    "Azure/AAD data collector for BloodHound."),
  tool("roadrecon", "ROADrecon", "Post Exploitation", "roadrecon", "roadrecon",
    "Enumerate Azure AD tenants."),
  tool("aadinternals", "AADInternals (ref)", "Post Exploitation", "aadinternals", "aadinternals",
    "PowerShell toolkit for Azure AD — reference entry."),
  tool("kubectl", "kubectl", "Vulnerability Analysis", "kubectl", "kubectl",
    "Official Kubernetes CLI. Essential for cluster audits."),
  tool("kubectl-who-can", "kubectl-who-can", "Vulnerability Analysis", "kubectl-who-can", "kubectl-who-can",
    "Show which subjects can perform an action on Kubernetes resources."),
  tool("rakkess", "rakkess", "Vulnerability Analysis", "rakkess", "rakkess",
    "Review Kubernetes access matrix for all subjects."),
  tool("popeye", "Popeye", "Vulnerability Analysis", "popeye", "popeye",
    "Kubernetes cluster sanitizer — checks for misconfigs."),
  tool("kubeaudit", "kubeaudit", "Vulnerability Analysis", "kubeaudit", "kubeaudit",
    "Audit K8s clusters for common security misconfigurations."),
  tool("checkov", "Checkov", "Vulnerability Analysis", "checkov", "checkov",
    "Static analysis for Terraform, CloudFormation, K8s, Docker."),
  tool("tfsec", "tfsec", "Vulnerability Analysis", "tfsec", "tfsec",
    "Static analysis for Terraform."),
  tool("terrascan", "terrascan", "Vulnerability Analysis", "terrascan", "terrascan",
    "IaC scanner for Terraform/K8s/Helm/CloudFormation."),
  tool("kics", "KICS", "Vulnerability Analysis", "kics", "kics",
    "Find security vulnerabilities in IaC files."),

  // ============================================================
  // Container / supply chain
  // ============================================================
  tool("syft", "Syft", "Vulnerability Analysis", "syft", "syft",
    "Generate SBOMs from container images and filesystems."),
  tool("cosign", "cosign", "Vulnerability Analysis", "cosign", "cosign",
    "Sign, verify and store container image signatures (Sigstore)."),
  tool("dive", "dive", "Reverse Engineering", "dive", "dive",
    "Explore each layer of a Docker image."),
  tool("dockle", "dockle", "Vulnerability Analysis", "dockle", "dockle",
    "Container image linter for security best practices."),
  tool("hadolint", "hadolint", "Vulnerability Analysis", "hadolint", "hadolint",
    "Dockerfile linter."),

  // ============================================================
  // Password / cred
  // ============================================================
  tool("cewl", "CeWL", "Password Attacks", "cewl", "cewl",
    "Generate custom wordlists by spidering a target site."),
  tool("cupp", "CUPP", "Password Attacks", "cupp", "cupp",
    "Common User Password Profiler — generates targeted wordlists."),
  tool("crunch-adv", "crunch (advanced)", "Password Attacks", "crunch", "crunch",
    "Highly configurable wordlist generator."),
  tool("mentalist", "mentalist (ref)", "Password Attacks", "mentalist", "mentalist",
    "GUI wordlist rule generator — reference entry."),
  tool("kerbrute", "kerbrute", "Password Attacks", "kerbrute", "kerbrute",
    "Fast Kerberos brute-forcer and user enumerator."),
  tool("smblogin", "smblogin", "Password Attacks", "smblogin", "smblogin",
    "SMB login checker."),
  tool("winrm-brute", "winrm brute (crackmapexec)", "Password Attacks", "crackmapexec", "crackmapexec winrm",
    "Spray creds over WinRM using crackmapexec."),
  tool("rdp-brute", "hydra RDP", "Password Attacks", "hydra", "hydra rdp://",
    "Brute-force RDP credentials with hydra."),

  // ============================================================
  // Wireless / RF
  // ============================================================
  tool("bettercap", "bettercap", "Sniffing & Spoofing", "bettercap", "bettercap",
    "Swiss army knife for network attacks & monitoring."),
  tool("mitmproxy", "mitmproxy", "Sniffing & Spoofing", "mitmproxy", "mitmproxy",
    "Interactive HTTPS proxy."),
  tool("ettercap", "ettercap", "Sniffing & Spoofing", "ettercap-graphical", "ettercap",
    "Comprehensive suite for MITM attacks."),
  tool("driftnet", "driftnet", "Sniffing & Spoofing", "driftnet", "driftnet",
    "Watches network traffic and picks out images."),
  tool("net-creds", "net-creds", "Sniffing & Spoofing", "net-creds", "net-creds",
    "Sniff passwords and sensitive data from pcap/live traffic."),
  tool("mitm6", "mitm6", "Sniffing & Spoofing", "mitm6", "mitm6",
    "IPv6-based MITM for Windows-heavy networks."),
  tool("scapy", "Scapy", "Sniffing & Spoofing", "python3-scapy", "scapy",
    "Interactive packet manipulation program."),
  tool("dsniff", "dsniff", "Sniffing & Spoofing", "dsniff", "dsniff",
    "Suite of tools for network auditing & pentesting."),

  // ============================================================
  // Post-exploitation / C2
  // ============================================================
  tool("mythic", "Mythic", "Exploitation Tools", "mythic", "mythic",
    "Cross-platform, post-exploit red team framework."),
  tool("havoc", "Havoc", "Exploitation Tools", "havoc", "havoc",
    "Modern, malleable post-exploitation command and control framework."),
  tool("villain", "Villain", "Exploitation Tools", "villain", "villain",
    "Backdoor generator/multi-session handler."),
  tool("chisel", "chisel", "Post Exploitation", "chisel", "chisel",
    "Fast TCP/UDP tunnel over HTTP."),
  tool("ligolo-ng", "Ligolo-ng", "Post Exploitation", "ligolo-ng", "ligolo",
    "Reverse tunnelling — TUN interface, no SOCKS needed."),
  tool("sshuttle", "sshuttle", "Post Exploitation", "sshuttle", "sshuttle",
    "Transparent SSH-based VPN for pivoting."),
  tool("proxychains-ng", "proxychains-ng", "Post Exploitation", "proxychains4", "proxychains4",
    "Force any TCP connection to follow a proxy chain."),
  tool("socat-adv", "socat (advanced)", "Post Exploitation", "socat", "socat",
    "Multipurpose relay for bidirectional data transfer."),
  tool("ncat-adv", "ncat (nmap)", "Post Exploitation", "ncat", "ncat",
    "Improved netcat from the nmap project."),

  // ============================================================
  // Reverse engineering & malware
  // ============================================================
  tool("cutter", "Cutter", "Reverse Engineering", "cutter", "cutter",
    "Free/open-source GUI for Rizin reverse engineering framework."),
  tool("iaito", "iaito", "Reverse Engineering", "iaito", "iaito",
    "Official Qt frontend for radare2."),
  tool("edb", "edb-debugger", "Reverse Engineering", "edb-debugger", "edb",
    "Qt-based cross-platform debugger."),
  tool("apktool-plus", "apktool", "Reverse Engineering", "apktool", "apktool",
    "Reverse engineering Android APK files."),
  tool("jadx", "jadx", "Reverse Engineering", "jadx", "jadx",
    "Dex to Java decompiler."),
  tool("dex2jar", "dex2jar", "Reverse Engineering", "dex2jar", "d2j-dex2jar",
    "Convert Android dex to Java jar."),
  tool("androguard", "Androguard", "Reverse Engineering", "androguard", "androguard",
    "Reverse engineering + malware analysis for Android."),

  // ============================================================
  // Forensics / DFIR
  // ============================================================
  tool("magnet-ram-capture", "MAGNET RAM Capture (ref)", "Forensics", "magnet-ram", "magnet-ram",
    "Reference — free memory imager for Windows."),
  tool("linpmem", "linpmem", "Forensics", "linpmem", "linpmem",
    "Linux memory acquisition tool from the Rekall project."),
  tool("winpmem", "winpmem", "Forensics", "winpmem", "winpmem",
    "Open-source Windows memory acquisition tool."),
  tool("regripper", "RegRipper", "Forensics", "regripper", "regripper",
    "Windows registry data extractor."),
  tool("chainsaw", "Chainsaw", "Forensics", "chainsaw", "chainsaw",
    "Rapidly search and hunt through Windows event logs."),
  tool("hayabusa", "Hayabusa", "Forensics", "hayabusa", "hayabusa",
    "Windows event log fast forensics timeline generator and threat hunter."),
  tool("dfir-orc", "DFIR-ORC", "Forensics", "dfir-orc", "dfir-orc",
    "Forensics artifact collection tool for Windows."),

  // ============================================================
  // Social engineering / phishing
  // ============================================================
  tool("gophish", "gophish", "Social Engineering Tools", "gophish", "gophish",
    "Open-source phishing framework."),
  tool("evilginx2-alias", "evilginx2 (alias)", "Social Engineering Tools", "evilginx2", "evilginx2",
    "MITM attack framework used for phishing session cookies + creds."),
  tool("modlishka", "Modlishka", "Social Engineering Tools", "modlishka", "modlishka",
    "Reverse-proxy phishing tool bypassing 2FA."),
  tool("king-phisher", "King Phisher (ref)", "Social Engineering Tools", "king-phisher", "king-phisher",
    "Phishing campaign toolkit — reference entry."),
  tool("blackphish", "blackeye/blackphish (ref)", "Social Engineering Tools", "blackphish", "blackphish",
    "Reference — collection of phishing templates."),

  // ============================================================
  // Reporting
  // ============================================================
  tool("faraday", "Faraday", "Reporting Tools", "faraday", "faraday",
    "Collaborative pentest and vulnerability management platform."),
  tool("dradis", "Dradis", "Reporting Tools", "dradis", "dradis",
    "Collaboration & reporting framework for security teams."),
  tool("serpico", "Serpico", "Reporting Tools", "serpico", "serpico",
    "Pentest report generator."),
  tool("magictree", "MagicTree", "Reporting Tools", "magictree", "magictree",
    "Productivity tool for penetration testers (data + reports)."),
  tool("pipal", "Pipal", "Reporting Tools", "pipal", "pipal",
    "Password metrics tool — great for post-crack reports."),
];
