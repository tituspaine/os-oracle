// Intent → canonical terms + curated playbook/tool routing.
//
// This module powers both the global search (query expansion) and the
// dedicated intent-based Security Testing search at /hacking/search.
// Everything here is static — no AI, no cloud, no telemetry.
//
// Editorial guardrails:
//   - Every intent maps to authorised testing techniques only.
//   - Guidance strings emphasise scope and authorisation.
//   - Business-logic and pricing intents map to the QA-style playbook,
//     not to fraud/abuse tooling.

export type IntentDomain =
  | "web"
  | "api"
  | "network"
  | "active-directory"
  | "wireless"
  | "bluetooth"
  | "cloud"
  | "container"
  | "mobile"
  | "iot"
  | "ics"
  | "password"
  | "os-privesc"
  | "post-exploit"
  | "forensics"
  | "reversing"
  | "social"
  | "defensive";

export type Intent = {
  id: string;
  phrases: string[];
  domain: IntentDomain;
  playbooks: string[]; // playbook slugs
  tools: string[];     // kali tool slugs
  commands?: string[]; // canonical starter commands
  guidance: string;    // short ethical framing shown above results
};

const SCOPE = "Confirm the target is in your authorised scope before running any command below.";

export const INTENTS: Intent[] = [
  // ─────────────── Web ───────────────
  {
    id: "web-sqli",
    phrases: [
      "sql injection", "sqli", "test for sql injection", "hack a database through a website",
      "audit database query safety", "check parameterised queries",
      "how do i test if a login is sqli", "test login form for sqli",
    ],
    domain: "web",
    playbooks: ["sqli-sqlmap"],
    tools: ["sqlmap", "sqlmap-alias", "burpsuite", "bbqsql", "jsql"],
    commands: ["sqlmap -r req.txt --batch --level=3 --risk=2"],
    guidance: `${SCOPE} Prefer capturing the raw request via Burp so you replay exactly what the user's browser sends.`,
  },
  {
    id: "web-xss",
    phrases: [
      "xss", "cross site scripting", "reflected xss", "stored xss", "dom xss",
      "how do i test for xss", "audit output encoding",
    ],
    domain: "web",
    playbooks: ["xss-reflected"],
    tools: ["dalfox", "xsser", "burpsuite", "zaproxy"],
    guidance: `${SCOPE} Use OOB canaries for blind XSS; a fired canary is proof-of-impact without touching real users.`,
  },
  {
    id: "web-business-logic",
    phrases: [
      "pricing logic", "test website pricing", "audit checkout logic",
      "how do i test a website's pricing", "how can i test the security of a website's pricing logic",
      "negative price test", "coupon abuse test", "test promo code security",
      "cart tampering test", "audit shopping cart", "audit business logic",
      "test coupon race condition", "check for parameter tampering",
    ],
    domain: "web",
    playbooks: ["business-logic-pricing", "idor"],
    tools: ["burpsuite", "zaproxy", "ffuf"],
    guidance: `${SCOPE} Business-logic testing is authorised QA/security testing against your own app or an in-scope target — never against real merchants without contract.`,
  },
  {
    id: "web-idor",
    phrases: [
      "idor", "insecure direct object reference", "test authorization",
      "check if i can access another user's data", "horizontal privilege",
      "vertical privilege escalation on api",
    ],
    domain: "web",
    playbooks: ["idor"],
    tools: ["burpsuite", "autorize", "zaproxy"],
    guidance: `${SCOPE} Compare responses between two authenticated accounts you both own or that are explicitly in scope.`,
  },
  {
    id: "web-ssrf",
    phrases: [
      "ssrf", "server side request forgery", "test for ssrf", "cloud metadata theft",
      "imds", "how do i test the pdf renderer for ssrf", "audit webhook target",
    ],
    domain: "web",
    playbooks: ["ssrf-cloud"],
    tools: ["burpsuite", "ffuf"],
    guidance: `${SCOPE} Use an OOB canary before probing internal metadata endpoints; document every callback.`,
  },
  {
    id: "web-xxe",
    phrases: [
      "xxe", "xml external entity", "test xml parser", "audit soap endpoint",
      "read files via xml", "billion laughs",
    ],
    domain: "web",
    playbooks: ["xxe"],
    tools: ["burpsuite", "zaproxy"],
    guidance: `${SCOPE} Start with a harmless entity that points to your OOB canary before trying file reads.`,
  },
  {
    id: "web-ssti",
    phrases: [
      "ssti", "server side template injection", "template injection",
      "test jinja for rce", "test twig", "test freemarker",
    ],
    domain: "web",
    playbooks: ["ssti"],
    tools: ["burpsuite", "tplmap"],
    guidance: `${SCOPE} Detect the engine with a math expression first (7*7 vs {{7*7}}) before escalating.`,
  },
  {
    id: "web-deserialization",
    phrases: [
      "deserialization", "insecure deserialization", "java serialization",
      "python pickle rce", ".net binaryformatter", "audit serialization",
    ],
    domain: "web",
    playbooks: ["deserialization"],
    tools: ["ysoserial", "burpsuite"],
    guidance: `${SCOPE} Deserialization payloads can be destructive; test in staging or with a chain you fully understand.`,
  },
  {
    id: "web-prototype-pollution",
    phrases: [
      "prototype pollution", "js prototype pollution", "audit lodash merge",
      "test node app for prototype pollution",
    ],
    domain: "web",
    playbooks: ["prototype-pollution"],
    tools: ["burpsuite"],
    guidance: `${SCOPE} Prototype pollution often chains to gadget code paths — map gadgets before claiming impact.`,
  },
  {
    id: "web-request-smuggling",
    phrases: [
      "http request smuggling", "smuggle", "cl.te", "te.cl",
      "audit reverse proxy behaviour",
    ],
    domain: "web",
    playbooks: ["http-request-smuggling"],
    tools: ["burpsuite"],
    guidance: `${SCOPE} Smuggling tests can affect other users' traffic; run only in dedicated staging or with explicit permission.`,
  },
  {
    id: "web-csrf",
    phrases: [
      "csrf", "cross site request forgery", "test state changing endpoints",
      "check csrf token protection", "audit samesite cookies",
    ],
    domain: "web",
    playbooks: ["csrf"],
    tools: ["burpsuite", "zaproxy"],
    guidance: `${SCOPE} Craft a PoC that only affects your own account before reporting.`,
  },
  {
    id: "web-open-redirect",
    phrases: [
      "open redirect", "test for open redirect", "audit login redirect",
    ],
    domain: "web",
    playbooks: ["open-redirect"],
    tools: ["burpsuite", "ffuf"],
    guidance: `${SCOPE} Chain open redirect only to OAuth token theft when the OAuth flow is in scope.`,
  },
  {
    id: "web-cors",
    phrases: [
      "cors misconfiguration", "test cors", "wildcard origin", "credentials true origin",
    ],
    domain: "web",
    playbooks: ["cors-misconfig"],
    tools: ["burpsuite", "corsy"],
    guidance: `${SCOPE} Read the CORS response headers carefully — Access-Control-Allow-Credentials with a reflected Origin is the classic finding.`,
  },
  {
    id: "web-file-upload",
    phrases: [
      "file upload bypass", "unrestricted file upload", "test avatar upload",
      "audit file upload", "upload a shell",
    ],
    domain: "web",
    playbooks: ["file-upload-rce"],
    tools: ["burpsuite", "weevely"],
    guidance: `${SCOPE} Prove impact with a benign file (e.g. text with a harmless script tag) before attempting code execution.`,
  },
  {
    id: "web-graphql",
    phrases: [
      "graphql", "graphql introspection", "audit graphql", "test graphql for idor",
      "graphql batching attack",
    ],
    domain: "api",
    playbooks: ["graphql-abuse"],
    tools: ["graphql-cop", "burpsuite", "inql"],
    guidance: `${SCOPE} Introspection alone is not a vulnerability if the schema is public; look for authorisation flaws and batching abuse.`,
  },
  {
    id: "web-jwt",
    phrases: [
      "jwt", "jwt vulnerabilities", "test jwt none algorithm",
      "audit jwt signature", "jwt kid injection",
    ],
    domain: "api",
    playbooks: ["jwt-flaws"],
    tools: ["jwt_tool", "burpsuite"],
    guidance: `${SCOPE} Test alg=none, weak HMAC keys, and kid path traversal only against tokens issued to your own accounts.`,
  },
  {
    id: "web-race-condition",
    phrases: [
      "race condition", "toctou", "test double spend", "gift card race",
      "how do i test coupon race",
    ],
    domain: "web",
    playbooks: ["race-condition"],
    tools: ["burpsuite", "turbo-intruder"],
    guidance: `${SCOPE} Burp's Turbo Intruder (single-packet attack) is the modern way to test race windows.`,
  },
  {
    id: "web-log4shell",
    phrases: [
      "log4shell", "log4j", "cve-2021-44228", "jndi", "test for log4j",
    ],
    domain: "web",
    playbooks: ["log4shell"],
    tools: ["burpsuite", "nuclei"],
    guidance: `${SCOPE} Use an OOB canary first; only escalate to class delivery in isolated lab environments.`,
  },
  {
    id: "web-directory-brute",
    phrases: [
      "directory brute", "content discovery", "hidden endpoints",
      "find admin panel", "brute force paths",
    ],
    domain: "web",
    playbooks: ["content-discovery"],
    tools: ["ffuf", "gobuster", "feroxbuster", "dirb", "kiterunner"],
    commands: ["ffuf -u https://target.tld/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -mc 200,301,302,401,403"],
    guidance: `${SCOPE} Rate-limit yourself; noisy fuzzing trips WAFs and can degrade shared infrastructure.`,
  },
  {
    id: "web-wordpress",
    phrases: [
      "wordpress audit", "wpscan", "test wordpress site", "audit cms",
      "how do i test a wordpress site",
    ],
    domain: "web",
    playbooks: ["wordpress-audit"],
    tools: ["wpscan", "cmsmap", "joomscan", "droopescan"],
    guidance: `${SCOPE} wpscan --api-token gets you vulnerability data; enumerate users/plugins passively first.`,
  },

  // ─────────────── Network / infrastructure ───────────────
  {
    id: "net-port-scan",
    phrases: [
      "port scan", "find open ports", "scan network", "map hosts",
      "asset discovery", "network reconnaissance",
    ],
    domain: "network",
    playbooks: ["port-scanning"],
    tools: ["nmap", "masscan", "rustscan", "netdiscover", "fping", "arping"],
    commands: [
      "nmap -sS -sV -O -T4 --top-ports 1000 10.0.0.0/24",
      "masscan -p1-65535 --rate 10000 10.0.0.0/24",
    ],
    guidance: `${SCOPE} Full-port scans can trigger IDS; align rate and timing with rules of engagement.`,
  },
  {
    id: "net-smb",
    phrases: [
      "smb enumeration", "audit file shares", "enumerate windows shares",
      "test smb signing", "check for anonymous smb",
    ],
    domain: "network",
    playbooks: ["smb-enum"],
    tools: ["enum4linux", "smbmap", "smbclient", "rpcclient", "cme-alias"],
    guidance: `${SCOPE} Anonymous SMB enumeration is legal on hosts you own; document the exact commands used.`,
  },
  {
    id: "net-eternalblue",
    phrases: [
      "eternalblue", "ms17-010", "cve-2017-0144", "test smbv1",
    ],
    domain: "network",
    playbooks: ["smb-eternalblue"],
    tools: ["nmap", "metasploit"],
    guidance: `${SCOPE} Vulnerability probing is safer than full exploitation on production; prefer the nmap NSE check first.`,
  },
  {
    id: "net-zerologon",
    phrases: [
      "zerologon", "cve-2020-1472", "netlogon vulnerability", "test domain controller",
    ],
    domain: "network",
    playbooks: ["zerologon"],
    tools: ["impacket", "nmap"],
    guidance: `${SCOPE} Zerologon can lock out the DC computer account — only run on hosts explicitly authorised and be ready to restore.`,
  },
  {
    id: "net-printnightmare",
    phrases: [
      "printnightmare", "cve-2021-34527", "print spooler exploit",
    ],
    domain: "network",
    playbooks: ["printnightmare"],
    tools: ["impacket", "metasploit"],
    guidance: `${SCOPE} Disabling the Print Spooler service is the fastest mitigation and a common finding.`,
  },
  {
    id: "net-llmnr-poison",
    phrases: [
      "llmnr poisoning", "nbt-ns spoofing", "mdns poisoning",
      "capture ntlm hashes on lan",
    ],
    domain: "network",
    playbooks: ["ntlm-relay"],
    tools: ["responder", "impacket", "mitm6"],
    guidance: `${SCOPE} Passive poisoning still affects users; only run on your own segment or a lab.`,
  },
  {
    id: "net-mitm",
    phrases: [
      "mitm", "man in the middle", "arp spoof", "intercept traffic",
    ],
    domain: "network",
    playbooks: ["arp-mitm"],
    tools: ["bettercap", "ettercap", "dsniff"],
    guidance: `${SCOPE} MITM affects other users on the segment — do not run on shared / public networks.`,
  },

  // ─────────────── Active Directory ───────────────
  {
    id: "ad-kerberoast",
    phrases: [
      "kerberoast", "asrep roast", "spn roasting", "crack service account",
    ],
    domain: "active-directory",
    playbooks: ["kerberoast", "asrep-roast"],
    tools: ["impacket", "hashcat", "john", "kerbrute"],
    guidance: `${SCOPE} Kerberoasting only needs a low-priv AD account; treat cracked service creds as sensitive.`,
  },
  {
    id: "ad-bloodhound",
    phrases: [
      "bloodhound", "map ad attack paths", "audit active directory permissions",
    ],
    domain: "active-directory",
    playbooks: ["bloodhound-mapping"],
    tools: ["bloodhound", "sharphound"],
    guidance: `${SCOPE} Collect with the least noisy method (--collectionmethod DCOnly) if stealth is in scope.`,
  },
  {
    id: "ad-adcs-esc1",
    phrases: [
      "adcs esc1", "certificate template abuse", "audit ad cs",
      "test enrollee supplies subject", "certipy",
    ],
    domain: "active-directory",
    playbooks: ["adcs-esc1"],
    tools: ["certipy", "impacket"],
    guidance: `${SCOPE} Enumerate templates with certipy find; only request certificates for accounts you're allowed to impersonate.`,
  },
  {
    id: "ad-dcsync",
    phrases: [
      "dcsync", "dump ntds", "pull password hashes from dc",
    ],
    domain: "active-directory",
    playbooks: ["mimikatz-dcsync"],
    tools: ["impacket", "mimikatz-wine"],
    guidance: `${SCOPE} DCSync exposes every hash in the domain — treat output as top-secret and delete after reporting.`,
  },
  {
    id: "ad-relay",
    phrases: [
      "ntlm relay", "smb relay", "responder ntlmrelayx", "test smb signing enforcement",
    ],
    domain: "active-directory",
    playbooks: ["ntlm-relay"],
    tools: ["responder", "impacket"],
    guidance: `${SCOPE} Relay attacks depend on SMB signing not being required — enumerate first with nxc --gen-relay-list.`,
  },

  // ─────────────── Wireless ───────────────
  {
    id: "wifi-audit",
    phrases: [
      "audit wifi", "audit wi-fi security", "audit wireless network",
      "how do i audit a wi-fi network", "how can i audit the security of a wi-fi network",
      "wireless assessment", "test wpa2", "test wpa3",
    ],
    domain: "wireless",
    playbooks: ["wpa2-handshake", "pmkid-attack", "wps-pixie-dust", "evil-twin"],
    tools: ["aircrack-ng", "hcxdumptool", "hcxtools", "hashcat", "wifite", "reaver", "bully", "pixiewps", "kismet"],
    guidance: `${SCOPE} Wireless auditing requires you to own the AP or hold written authorisation from the network owner.`,
  },
  {
    id: "wifi-crack",
    phrases: [
      "crack wifi", "crack wpa2 password", "wifi password", "capture handshake",
    ],
    domain: "wireless",
    playbooks: ["wpa2-handshake"],
    tools: ["aircrack-ng", "hcxtools", "hashcat"],
    guidance: `${SCOPE} Only capture handshakes for SSIDs you are authorised to audit.`,
  },
  {
    id: "wifi-pmkid",
    phrases: [
      "pmkid attack", "clientless wpa2 attack", "capture pmkid",
    ],
    domain: "wireless",
    playbooks: ["pmkid-attack"],
    tools: ["hcxdumptool", "hcxtools", "hashcat"],
    guidance: `${SCOPE} PMKID doesn't require a client; still requires authorisation on the SSID.`,
  },
  {
    id: "wifi-wps",
    phrases: [
      "wps attack", "reaver", "pixie dust", "test wps",
    ],
    domain: "wireless",
    playbooks: ["wps-pixie-dust"],
    tools: ["reaver", "bully", "pixiewps", "wifite"],
    guidance: `${SCOPE} WPS Pixie Dust succeeds offline in seconds against vulnerable APs — great for demonstrating why to disable WPS.`,
  },
  {
    id: "wifi-eviltwin",
    phrases: [
      "evil twin", "rogue ap", "captive portal test", "wifiphisher",
    ],
    domain: "wireless",
    playbooks: ["evil-twin"],
    tools: ["wifiphisher", "airgeddon", "hostapd-wpe"],
    guidance: `${SCOPE} Evil-twin tests interact with real users nearby — coordinate physical scope and legal review before running.`,
  },
  {
    id: "bluetooth",
    phrases: [
      "bluetooth audit", "ble scan", "test bluetooth pairing",
    ],
    domain: "bluetooth",
    playbooks: ["ble-recon"],
    tools: ["bluez-tools", "btscanner"],
    guidance: `${SCOPE} Passive BLE scanning is safe; active pairing tests require device owner permission.`,
  },

  // ─────────────── Cloud & containers ───────────────
  {
    id: "cloud-aws-iam",
    phrases: [
      "aws iam audit", "audit iam permissions", "test aws privilege escalation",
      "s3 bucket audit", "find public buckets you own",
    ],
    domain: "cloud",
    playbooks: ["aws-iam-audit", "s3-exposure"],
    tools: ["pacu", "prowler", "scoutsuite"],
    guidance: `${SCOPE} Only audit accounts you own or that are explicitly in scope; enumeration APIs leave CloudTrail evidence.`,
  },
  {
    id: "cloud-gcp",
    phrases: [
      "gcp audit", "audit gcp iam", "google cloud security review",
    ],
    domain: "cloud",
    playbooks: ["gcp-iam-audit"],
    tools: ["scoutsuite", "prowler"],
    guidance: `${SCOPE} Use ScoutSuite in read-only mode first; enable write-mode probes only with explicit permission.`,
  },
  {
    id: "cloud-azure",
    phrases: [
      "azure ad", "aad device code phishing", "audit entra id",
    ],
    domain: "cloud",
    playbooks: ["aad-device-code"],
    tools: ["roadtx", "aadinternals"],
    guidance: `${SCOPE} Device-code flows are commonly abused for phishing — only exercise against your own tenant or an in-scope tenant.`,
  },
  {
    id: "k8s",
    phrases: [
      "kubernetes audit", "k8s pentest", "audit rbac", "test container escape",
      "exposed kubelet", "audit cluster",
    ],
    domain: "container",
    playbooks: ["k8s-rbac-audit", "container-escape"],
    tools: ["kube-hunter", "kubescape", "peirates"],
    guidance: `${SCOPE} Cluster scans can be disruptive; run against a dedicated audit namespace or non-prod cluster where possible.`,
  },
  {
    id: "docker",
    phrases: [
      "docker socket abuse", "audit docker daemon", "container breakout",
    ],
    domain: "container",
    playbooks: ["docker-socket-abuse"],
    tools: ["docker-bench-security"],
    guidance: `${SCOPE} Mounting /var/run/docker.sock inside a container is root-equivalent to the host — audit and remove.`,
  },

  // ─────────────── Mobile ───────────────
  {
    id: "mobile-android",
    phrases: [
      "android apk analysis", "audit android app", "test mobile app",
      "reverse engineer apk", "check ssl pinning",
    ],
    domain: "mobile",
    playbooks: ["android-static", "android-dynamic"],
    tools: ["apktool", "jadx", "mobsf", "frida", "objection"],
    guidance: `${SCOPE} Static analysis is safe on any APK you obtained lawfully; dynamic runtime testing needs an app you own or have permission to test.`,
  },
  {
    id: "mobile-ios",
    phrases: [
      "ios ipa analysis", "audit ios app", "reverse engineer ipa",
    ],
    domain: "mobile",
    playbooks: ["ios-static"],
    tools: ["frida", "objection"],
    guidance: `${SCOPE} iOS dynamic analysis typically requires a jailbroken device you own.`,
  },

  // ─────────────── IoT / firmware / ICS ───────────────
  {
    id: "iot-firmware",
    phrases: [
      "firmware analysis", "extract firmware", "audit iot firmware",
      "binwalk", "reverse engineer router firmware",
    ],
    domain: "iot",
    playbooks: ["firmware-extraction"],
    tools: ["binwalk", "firmwalker", "radare2-cutter"],
    guidance: `${SCOPE} Analyse only firmware you have the right to inspect (vendor programme, device you own).`,
  },
  {
    id: "iot-mqtt",
    phrases: [
      "mqtt audit", "test mqtt broker", "iot messaging security",
    ],
    domain: "iot",
    playbooks: ["mqtt-audit"],
    tools: ["mosquitto-clients"],
    guidance: `${SCOPE} Unauthenticated MQTT brokers are common in poorly-configured IoT — test only brokers you own.`,
  },
  {
    id: "ics-modbus",
    phrases: [
      "ics scada", "modbus", "audit plc lab", "industrial protocol test",
    ],
    domain: "ics",
    playbooks: ["modbus-enum"],
    tools: ["modbus-cli", "nmap"],
    guidance: `${SCOPE} ICS/SCADA testing on live plants is dangerous and typically illegal without operator approval — use dedicated lab or vendor-provided sim.`,
  },

  // ─────────────── Passwords / auth ───────────────
  {
    id: "pw-spray",
    phrases: [
      "password spray", "test common passwords across users",
      "audit password policy", "spray o365",
    ],
    domain: "password",
    playbooks: ["password-spray"],
    tools: ["kerbrute", "cme-alias", "hydra"],
    guidance: `${SCOPE} Sprays trip lockout — coordinate window and account carefully; document every attempt.`,
  },
  {
    id: "pw-brute-ssh",
    phrases: [
      "brute force ssh", "spray ssh credentials", "test ssh password auth",
    ],
    domain: "password",
    playbooks: ["ssh-brute"],
    tools: ["hydra", "ncrack", "medusa"],
    guidance: `${SCOPE} Prefer publicly-known default creds and known-user targeted spray over blind brute; slower means less lockout risk.`,
  },
  {
    id: "pw-hashcat",
    phrases: [
      "crack hash", "hashcat", "john the ripper", "identify a hash format",
    ],
    domain: "password",
    playbooks: ["hashcat-workflow"],
    tools: ["hashcat", "john", "hash-identifier"],
    guidance: `${SCOPE} Offline cracking is invisible to the target, but the hashes themselves may be regulated data — protect them.`,
  },

  // ─────────────── OS privesc ───────────────
  {
    id: "linux-privesc",
    phrases: [
      "linux privilege escalation", "root linux", "audit linux privesc paths",
      "test suid binaries", "audit sudoers",
    ],
    domain: "os-privesc",
    playbooks: ["linux-privesc", "dirtypipe", "pwnkit"],
    tools: ["linpeas", "linenum", "unix-privesc-check"],
    guidance: `${SCOPE} Fastest wins are usually sudo -l, SUID, and getcap — try those before running kernel exploits.`,
  },
  {
    id: "windows-privesc",
    phrases: [
      "windows privilege escalation", "audit windows privesc",
      "unquoted service path", "always install elevated", "test uac bypass",
    ],
    domain: "os-privesc",
    playbooks: ["windows-privesc", "always-install-elevated"],
    tools: ["winpeas", "powersploit"],
    guidance: `${SCOPE} WinPEAS output is huge — grep for red/yellow highlights first.`,
  },

  // ─────────────── Post-exploit / pivoting ───────────────
  {
    id: "pivot",
    phrases: [
      "pivoting", "tunneling", "proxy through host", "chisel", "sshuttle",
    ],
    domain: "post-exploit",
    playbooks: ["pivoting-tunneling"],
    tools: ["chisel", "sshuttle", "proxychains-ng", "ligolo-ng"],
    guidance: `${SCOPE} Document every tunnel; tear them down at the end of the engagement.`,
  },

  // ─────────────── Forensics / reversing (defensive) ───────────────
  {
    id: "forensics-memory",
    phrases: [
      "memory forensics", "volatility", "analyse memory dump", "ram capture analysis",
    ],
    domain: "forensics",
    playbooks: ["memory-forensics"],
    tools: ["volatility", "bulk_extractor"],
    guidance: "Forensic analysis of your own or authorised systems is always legal — protect chain of custody with hashes.",
  },
  {
    id: "reverse-binary",
    phrases: [
      "reverse engineer binary", "analyse malware sample", "debug a binary",
    ],
    domain: "reversing",
    playbooks: ["reverse-binary"],
    tools: ["ghidra", "radare2-cutter", "gdb", "gdb-peda", "strace", "ltrace"],
    guidance: "Run unknown binaries only in an isolated VM with no network path to production or personal data.",
  },

  // ─────────────── Social (authorised phishing) ───────────────
  {
    id: "phishing-authorised",
    phrases: [
      "phishing simulation", "authorised phishing", "gophish campaign",
      "mfa bypass phishing test", "evilginx",
    ],
    domain: "social",
    playbooks: ["phishing-evilginx", "gophish-campaign"],
    tools: ["gophish", "evilginx2", "wifiphisher"],
    guidance: `${SCOPE} Authorised phishing needs an approved narrative, a monitored capture destination, and an all-clear message afterwards.`,
  },

  // ─────────────── Defensive counterparts ───────────────
  {
    id: "defensive-detect",
    phrases: [
      "detect kerberoasting", "detect llmnr poisoning", "sigma rules for lateral movement",
      "how do i defend against this",
    ],
    domain: "defensive",
    playbooks: [],
    tools: [],
    guidance: "Every offensive playbook on this site has detection and mitigation sections — open a playbook and scroll to the bottom.",
  },
];

/** Flat synonym record kept for backward compatibility with the global
 * search. New code should prefer the INTENTS list above. */
export const SYNONYMS: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {};
  for (const intent of INTENTS) {
    const terms = [...intent.tools, ...intent.playbooks];
    for (const phrase of intent.phrases) {
      out[phrase] = terms;
    }
  }
  // Preserve a few legacy shorthands that people type verbatim.
  Object.assign(out, {
    "rockyou": ["wordlists", "rockyou"],
    "listening ports": ["ss", "netstat", "lsof"],
    "install package": ["apt", "dnf", "pacman", "zypper", "apk"],
    "firewall": ["iptables", "nftables", "ufw", "firewalld"],
    "disk full": ["df", "du", "ncdu"],
  });
  return out;
})();

const QUESTION_STOP = new Set([
  "how", "what", "when", "where", "why", "which", "can", "do", "does", "did",
  "is", "are", "should", "could", "would", "the", "a", "an", "to", "for",
  "of", "on", "in", "with", "into", "at", "my", "our", "your", "their",
  "i", "we", "you", "they", "please", "help", "me", "us", "test", "check",
  "audit", "assess", "verify",
]);

/** Normalise a free-text query into tokens for scoring. */
export function normaliseQuery(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

/** Match a user query against known intents; returns matches scored by
 * phrase-token overlap. */
export function matchIntents(q: string, limit = 8): { intent: Intent; score: number }[] {
  const tokens = normaliseQuery(q).filter((t) => !QUESTION_STOP.has(t));
  if (tokens.length === 0) return [];
  const set = new Set(tokens);
  const scored = INTENTS.map((intent) => {
    let score = 0;
    for (const phrase of intent.phrases) {
      const pt = normaliseQuery(phrase);
      const hits = pt.filter((t) => set.has(t)).length;
      if (hits > 0) {
        // reward proportion of phrase matched + absolute overlap
        score = Math.max(score, hits * 2 + (hits === pt.length ? 3 : 0));
      }
      if (phrase.toLowerCase() === q.trim().toLowerCase()) score = Math.max(score, 100);
    }
    // also check tool/playbook slug direct hits
    for (const s of [...intent.tools, ...intent.playbooks]) {
      if (set.has(s.toLowerCase())) score += 2;
    }
    return { intent, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** Return the set of expansion terms for a raw query — used by the
 * global fuzzy search index. */
export function expandQuery(q: string): string[] {
  const needle = q.toLowerCase().trim();
  if (!needle) return [];
  const out = new Set<string>([needle]);
  for (const [intent, terms] of Object.entries(SYNONYMS)) {
    if (needle === intent || needle.includes(intent) || intent.includes(needle)) {
      for (const t of terms) out.add(t);
      out.add(intent);
    }
  }
  // Intent phrase matching
  for (const { intent } of matchIntents(needle, 4)) {
    for (const t of intent.tools) out.add(t);
    for (const p of intent.playbooks) out.add(p);
  }
  for (const tok of normaliseQuery(needle)) if (!QUESTION_STOP.has(tok)) out.add(tok);
  return [...out];
}

export function nearestIntents(q: string, limit = 5): string[] {
  return matchIntents(q, limit).map((m) => m.intent.phrases[0]);
}
