import type { KaliTool } from "./types";

export const KALI_DEEP2_TOOLS: KaliTool[] = [
  {
    slug: "hashcat",
    name: "hashcat",
    category: "Password Attacks",
    package: "hashcat",
    homepage: "https://hashcat.net/hashcat/",
    depth: "deep",
    invocation: "hashcat",
    summary:
      "GPU-accelerated password recovery tool for local hashes, Linux shadow formats, and WPA handshakes/PMKIDs.",
    commands: [
      {
        name: "hashcat benchmark NTLM",
        syntax: "hashcat -b -m 1000",
        description: "Benchmark the local hardware against NTLM before starting a large crack job.",
        examples: [
          { code: "hashcat -b -m 1000", note: "Measure NTLM speed on the current CPU/GPU setup." },
        ],
        bestScenario:
          "Use before choosing whether a large NTLM job is practical on the current hardware.",
        category: "Benchmark",
      },
      {
        name: "hashcat NTLM wordlist attack",
        syntax: "hashcat -m 1000 -a 0 HASHFILE WORDLIST",
        description: "Run a straight dictionary attack against NTLM hashes.",
        examples: [
          {
            code: "hashcat -m 1000 -a 0 corp.ntlm /usr/share/wordlists/rockyou.txt",
            note: "First pass against a Windows NTLM dump.",
          },
        ],
        bestScenario:
          "Best first pass when cracking domain or local NTLM hashes with a common password list.",
        category: "Attack",
      },
      {
        name: "hashcat NTLM rules attack",
        syntax: "hashcat -m 1000 -a 0 HASHFILE WORDLIST -r RULEFILE",
        description:
          "Apply mutation rules to a wordlist for common suffix, case, and digit variations.",
        examples: [
          {
            code: "hashcat -m 1000 -a 0 corp.ntlm /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
            note: "Good second pass after a straight wordlist miss.",
          },
          {
            code: "hashcat -m 1000 -a 0 corp.ntlm /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/hashcat.rules",
            note: "Broader mutation set for longer runs.",
          },
        ],
        bestScenario:
          "Useful when users append years, punctuation, or capitalization to otherwise common passwords.",
        category: "Attack",
      },
      {
        name: "hashcat NTLM mask attack",
        syntax: "hashcat -m 1000 -a 3 HASHFILE MASK",
        description: "Brute-force a known password structure with a mask attack.",
        examples: [
          {
            code: "hashcat -m 1000 -a 3 corp.ntlm '?u?l?l?l?l?l?d?d'",
            note: "Try patterns like Summer24 or Winter25.",
          },
        ],
        bestScenario: "Ideal when policy or user habits strongly suggest a fixed format.",
        category: "Attack",
      },
      {
        name: "hashcat combination attack",
        syntax: "hashcat -m 1000 -a 1 HASHFILE LEFT_WORDLIST RIGHT_WORDLIST",
        description: "Combine every entry from one list with every entry from another list.",
        examples: [
          {
            code: "hashcat -m 1000 -a 1 corp.ntlm company-terms.txt years.txt",
            note: "Test combinations like Acme2024 or Finance2025.",
          },
        ],
        bestScenario: "Strong choice when users build passwords from two predictable word sets.",
        category: "Attack",
      },
      {
        name: "hashcat hybrid wordlist plus mask",
        syntax: "hashcat -m 1000 -a 6 HASHFILE WORDLIST MASK",
        description: "Append a mask to every wordlist entry.",
        examples: [
          {
            code: "hashcat -m 1000 -a 6 corp.ntlm /usr/share/wordlists/rockyou.txt '?d?d?d'",
            note: "Try wordlist candidates with a three-digit suffix.",
          },
        ],
        bestScenario: "Useful when users take a base word and add a short numeric tail.",
        category: "Attack",
      },
      {
        name: "hashcat sha512crypt shadow cracking",
        syntax: "hashcat -m 1800 -a 0 HASHFILE WORDLIST --username",
        description: "Crack Linux sha512crypt hashes exported from /etc/shadow.",
        examples: [
          {
            code: "hashcat -m 1800 -a 0 linux-shadow.txt /usr/share/wordlists/rockyou.txt --username",
            note: "Use --username when the file contains user:hash lines.",
          },
        ],
        bestScenario:
          "Use after obtaining Linux shadow data and preserving the original username-prefixed format.",
        category: "Attack",
      },
      {
        name: "hashcat WPA-PBKDF2-PMKID+EAPOL cracking",
        syntax: "hashcat -m 22000 -a 0 HANDSHAKE22000 WORDLIST",
        description: "Crack WPA/WPA2 handshakes or PMKIDs converted to modern 22000 format.",
        examples: [
          {
            code: "hashcat -m 22000 -a 0 office-wifi.22000 /usr/share/wordlists/rockyou.txt",
            note: "Offline attack against a captured WPA handshake or PMKID.",
          },
        ],
        bestScenario:
          "Standard offline Wi-Fi PSK auditing after converting captures to 22000 format.",
        category: "Attack",
      },
      {
        name: "hashcat custom potfile session",
        syntax: "hashcat -m MODE -a ATTACK HASHFILE INPUTS --potfile-path FILE",
        description:
          "Store recovered passwords in a dedicated potfile instead of the default global file.",
        examples: [
          {
            code: "hashcat -m 1000 -a 0 corp.ntlm /usr/share/wordlists/rockyou.txt --potfile-path results/corp-audit.potfile",
            note: "Keeps one engagement's recovered credentials separate from the default potfile.",
          },
        ],
        bestScenario: "Best when you need clean evidence output per assessment or per customer.",
        category: "Session",
      },
      {
        name: "hashcat show cracked hashes",
        syntax: "hashcat -m MODE HASHFILE --show",
        description: "Display cracked results from the potfile without rerunning the attack.",
        examples: [
          {
            code: "hashcat -m 22000 office-wifi.22000 --show",
            note: "Print recovered Wi-Fi keys from the potfile.",
          },
        ],
        bestScenario: "Use to export results after pausing or finishing a crack session.",
        category: "Output",
      },
      {
        name: "hashcat restore interrupted session",
        syntax: "hashcat --restore",
        description: "Resume the last interrupted session from the restore file.",
        examples: [
          {
            code: "hashcat --restore",
            note: "Continue a long-running job after a reboot or terminal disconnect.",
          },
        ],
        bestScenario: "Critical for long GPU runs that were interrupted mid-attack.",
        category: "Session",
      },
      {
        name: "hashcat force CPU fallback",
        syntax: "hashcat -m MODE -a ATTACK HASHFILE INPUTS --force",
        description:
          "Override warnings and run even when the OpenCL/CUDA environment is incomplete.",
        examples: [
          {
            code: "hashcat -m 1000 -a 0 corp.ntlm /usr/share/wordlists/rockyou.txt --force",
            note: "Fallback option when the GPU runtime is unavailable and a slow CPU run is acceptable.",
          },
        ],
        bestScenario: "Last resort for lab work on systems without working GPU drivers.",
        category: "Recovery",
      },
    ],
    errors: [
      {
        message: "No devices found/left",
        cause: "OpenCL or CUDA cannot see a usable GPU, or the driver/runtime is missing.",
        fix: "Install the correct GPU driver and OpenCL/CUDA runtime, verify with hashcat -I, or use --force for a slow CPU fallback.",
      },
      {
        message: "Token length exception",
        cause: "The selected hash mode does not match the hash format in the file.",
        fix: "Re-identify the hash type, confirm the correct -m value, and remove extra whitespace or labels from the input file.",
      },
      {
        message: "Separator unmatched",
        cause:
          "Hashcat expected a specific delimiter or field layout and the input line is malformed.",
        fix: "Re-export the hashes in hashcat-compatible format, keep one hash per line, and use flags like --username only when the file includes usernames.",
      },
      {
        message: "Not enough allocatable device memory",
        cause: "The selected workload or kernel needs more VRAM than the device can provide.",
        fix: "Lower the workload profile, split the job, or choose a smaller rule/mask set before retrying.",
      },
    ],
  },
  {
    slug: "aircrack-ng",
    name: "Aircrack-ng suite",
    category: "Wireless Attacks",
    package: "aircrack-ng",
    homepage: "https://www.aircrack-ng.org",
    depth: "deep",
    invocation: "aircrack-ng",
    summary:
      "Wireless auditing toolkit for monitor mode, capture, deauthentication, WEP injection, WPA handshake collection, and offline cracking.",
    commands: [
      {
        name: "airmon-ng kill interfering processes",
        syntax: "sudo airmon-ng check kill",
        description:
          "Stop NetworkManager, wpa_supplicant, and other processes that break monitor mode.",
        examples: [
          {
            code: "sudo airmon-ng check kill",
            note: "Clean the interface before switching it to monitor mode.",
          },
        ],
        bestScenario: "Run first when the adapter refuses monitor mode or channel changes.",
        category: "Preparation",
      },
      {
        name: "airmon-ng start monitor mode",
        syntax: "sudo airmon-ng start INTERFACE",
        description: "Create a monitor-mode interface for capture and injection.",
        examples: [
          {
            code: "sudo airmon-ng start wlan0",
            note: "Typically creates wlan0mon on modern Kali systems.",
          },
        ],
        bestScenario: "Required before using airodump-ng or aireplay-ng for active 802.11 work.",
        category: "Preparation",
      },
      {
        name: "airodump-ng survey nearby networks",
        syntax: "sudo airodump-ng MONITOR_INTERFACE",
        description: "List nearby access points, clients, channels, and encryption types.",
        examples: [
          {
            code: "sudo airodump-ng wlan0mon",
            note: "Identify the target BSSID, channel, and active clients.",
          },
        ],
        bestScenario: "Use during initial wireless recon to pick the exact target network.",
        category: "Recon",
      },
      {
        name: "airodump-ng capture a single WPA target",
        syntax: "sudo airodump-ng --bssid BSSID -c CHANNEL -w PREFIX MONITOR_INTERFACE",
        description: "Lock capture to one AP and save packets for later cracking.",
        examples: [
          {
            code: "sudo airodump-ng --bssid 00:11:22:33:44:55 -c 6 -w corpwifi wlan0mon",
            note: "Focused capture for handshake collection.",
          },
        ],
        bestScenario: "Use when you already know the target AP and want a clean capture file.",
        category: "Capture",
      },
      {
        name: "aireplay-ng deauthentication",
        syntax: "sudo aireplay-ng -0 COUNT -a BSSID [-c CLIENT] MONITOR_INTERFACE",
        description:
          "Send deauth frames to force a client to reconnect and generate a WPA handshake.",
        examples: [
          {
            code: "sudo aireplay-ng -0 10 -a 00:11:22:33:44:55 -c 66:77:88:99:AA:BB wlan0mon",
            note: "Target a specific client for a faster handshake capture.",
          },
        ],
        bestScenario:
          "Most reliable way to trigger a fresh handshake when at least one client is associated.",
        category: "Attack",
      },
      {
        name: "aireplay-ng ARP replay for WEP",
        syntax: "sudo aireplay-ng -3 -b BSSID -h STATION_MAC MONITOR_INTERFACE",
        description: "Replay captured ARP requests to generate IVs quickly on WEP networks.",
        examples: [
          {
            code: "sudo aireplay-ng -3 -b 00:11:22:33:44:55 -h 66:77:88:99:AA:BB wlan0mon",
            note: "Classic WEP acceleration technique.",
          },
        ],
        bestScenario: "Use only on WEP targets after collecting enough traffic to see ARP packets.",
        category: "Attack",
      },
      {
        name: "aircrack-ng crack capture with a wordlist",
        syntax: "aircrack-ng -w WORDLIST -b BSSID CAPFILE",
        description: "Run an offline dictionary attack against a WPA capture.",
        examples: [
          {
            code: "aircrack-ng -w /usr/share/wordlists/rockyou.txt -b 00:11:22:33:44:55 corpwifi-01.cap",
            note: "Test a handshake directly with the aircrack-ng cracking engine.",
          },
        ],
        bestScenario: "Quick offline WPA/WPA2 PSK auditing when you already have a .cap file.",
        category: "Cracking",
      },
      {
        name: "hcxdumptool PMKID capture",
        syntax: "sudo hcxdumptool -i MONITOR_INTERFACE -o OUTFILE --enable_status=1",
        description: "Capture PMKIDs without waiting for a full client handshake.",
        examples: [
          {
            code: "sudo hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1",
            note: "Useful when clients are not actively reconnecting.",
          },
        ],
        bestScenario: "Best for modern WPA/WPA2 PSK auditing when handshake capture is unreliable.",
        category: "Capture",
      },
      {
        name: "hcxpcapngtool convert to 22000",
        syntax: "hcxpcapngtool -o HASHFILE22000 -E ESSIDFILE PCAPNG",
        description: "Convert hcxdumptool or airodump captures into hashcat's 22000 format.",
        examples: [
          {
            code: "hcxpcapngtool -o pmkid.22000 -E essids.txt pmkid.pcapng",
            note: "Prepares the capture for hashcat mode 22000.",
          },
        ],
        bestScenario: "Required when moving from capture tooling into modern hashcat WPA cracking.",
        category: "Conversion",
      },
      {
        name: "hashcat crack PMKID or EAPOL",
        syntax: "hashcat -m 22000 HASHFILE22000 WORDLIST",
        description: "Crack PMKID or WPA handshakes captured and converted to 22000 format.",
        examples: [
          {
            code: "hashcat -m 22000 pmkid.22000 /usr/share/wordlists/rockyou.txt",
            note: "Standard offline crack after PMKID collection.",
          },
        ],
        bestScenario: "Use once the wireless capture has been converted and validated.",
        category: "Cracking",
      },
      {
        name: "reaver WPS PIN attack",
        syntax: "sudo reaver -i MONITOR_INTERFACE -b BSSID -c CHANNEL -vv",
        description: "Attack a WPS-enabled AP by brute-forcing the WPS PIN.",
        examples: [
          {
            code: "sudo reaver -i wlan0mon -b 00:11:22:33:44:55 -c 6 -vv",
            note: "Verbose WPS attack against an access point with WPS enabled.",
          },
        ],
        bestScenario: "Use only when the AP exposes WPS and rate limiting is weak or absent.",
        category: "Attack",
      },
    ],
    errors: [
      {
        message: "Interface wlan0mon does not exist",
        cause:
          "Monitor mode did not start or the interface name differs from what the command expects.",
        fix: "Re-run sudo airmon-ng start wlan0 and verify the new interface name with ip link before capturing.",
      },
      {
        message: "ioctl(SIOCSIWMODE) failed: Device or resource busy",
        cause: "NetworkManager or another wireless process is still controlling the adapter.",
        fix: "Run sudo airmon-ng check kill, bring the interface down, and retry monitor mode creation.",
      },
      {
        message: "Waiting for beacon frame (BSSID) on channel X",
        cause: "The monitor interface is on the wrong channel or the AP is out of range.",
        fix: "Set the correct channel with airodump-ng, move closer to the AP, and confirm the BSSID is active.",
      },
      {
        message: "hcxpcapngtool: 0 hashes written",
        cause: "The capture did not contain a usable PMKID or complete EAPOL handshake.",
        fix: "Capture longer, force a reconnect with deauth if allowed, or retry a PMKID collection against the target AP.",
      },
    ],
  },
  {
    slug: "nikto",
    name: "Nikto",
    category: "Web Application Analysis",
    package: "nikto",
    homepage: "https://cirt.net/Nikto2",
    depth: "deep",
    invocation: "nikto",
    summary:
      "Signature-driven web server scanner for dangerous files, outdated components, TLS issues, default content, and common misconfigurations.",
    commands: [
      {
        name: "nikto basic scan",
        syntax: "nikto -h TARGET",
        description: "Run a standard Nikto scan against a web server.",
        examples: [
          {
            code: "nikto -h http://10.10.10.20",
            note: "Quick first-pass scan against a plain HTTP service.",
          },
        ],
        bestScenario: "Start here when you need a broad check for common web server issues.",
        category: "Scan",
      },
      {
        name: "nikto HTTPS scan",
        syntax: "nikto -h TARGET -ssl",
        description: "Force TLS when Nikto cannot infer it from the target string.",
        examples: [
          {
            code: "nikto -h 10.10.10.20 -p 443 -ssl",
            note: "Useful when the target answers HTTPS on a bare IP.",
          },
        ],
        bestScenario:
          "Use against HTTPS services running on IPs or nonstandard virtual host layouts.",
        category: "Scan",
      },
      {
        name: "nikto scan a specific port and vhost",
        syntax: "nikto -h TARGET -p PORT -vhost HOSTNAME",
        description: "Scan a particular port while sending the correct Host header.",
        examples: [
          {
            code: "nikto -h 10.10.10.20 -p 8443 -ssl -vhost admin.example.com",
            note: "Probe a named vhost on a shared IP and alternate TLS port.",
          },
        ],
        bestScenario:
          "Important for shared hosting or reverse proxies where the default host is not the target.",
        category: "Scan",
      },
      {
        name: "nikto authenticated scan",
        syntax: "nikto -h TARGET -id USER:PASSWORD",
        description: "Supply HTTP basic-auth credentials so Nikto can reach protected content.",
        examples: [
          {
            code: "nikto -h https://staging.example.com -id admin:Admin123!",
            note: "Scan behind simple basic authentication.",
          },
        ],
        bestScenario:
          "Use when staging or administrative content is protected with HTTP basic auth.",
        category: "Authentication",
      },
      {
        name: "nikto plugin selection",
        syntax: "nikto -h TARGET -Plugins PLUGIN_LIST",
        description: "Limit the scan to specific plugin families.",
        examples: [
          {
            code: "nikto -h https://app.example.com -Plugins apacheusers,headers,ssl",
            note: "Focus on Apache exposure, header checks, and TLS findings.",
          },
        ],
        bestScenario:
          "Useful when you want faster, narrower scans or to validate a specific class of issues.",
        category: "Plugins",
      },
      {
        name: "nikto tuning categories",
        syntax: "nikto -h TARGET -Tuning CATEGORIES",
        description: "Restrict checks to selected tuning classes.",
        examples: [
          {
            code: "nikto -h https://app.example.com -Tuning 2,3,b",
            note: "Focus on misconfigurations, information disclosure, and software identification.",
          },
        ],
        bestScenario: "Reduce noise when a full Nikto run is too broad for the engagement window.",
        category: "Scan",
      },
      {
        name: "nikto ignore known 404 behavior",
        syntax: "nikto -h TARGET -404code CODES",
        description: "Treat custom error pages as not-found responses to reduce false positives.",
        examples: [
          {
            code: "nikto -h https://app.example.com -404code 302,404",
            note: "Useful when the app redirects missing pages instead of returning a clean 404.",
          },
        ],
        bestScenario: "Best when custom 302 or 200 error pages make default Nikto findings noisy.",
        category: "Filtering",
      },
      {
        name: "nikto evasive scan through Burp",
        syntax: "nikto -h TARGET -useproxy PROXY -evasion IDS_BYPASSES",
        description: "Proxy the scan and apply simple URI obfuscation evasions.",
        examples: [
          {
            code: "nikto -h https://app.example.com -useproxy http://127.0.0.1:8080 -evasion 1,8",
            note: "Replay through Burp while testing simple path encoding evasions.",
          },
        ],
        bestScenario:
          "Useful when you need to watch requests live or test how simple filters react to encoded paths.",
        category: "Evasion",
      },
      {
        name: "nikto JSON report output",
        syntax: "nikto -h TARGET -Format json -output FILE",
        description: "Write results in JSON for later parsing or evidence handling.",
        examples: [
          {
            code: "nikto -h https://app.example.com -Format json -output nikto-app.json",
            note: "Machine-readable report for triage or handoff.",
          },
        ],
        bestScenario:
          "Use when scan results need to be ingested by other tooling or attached to a report.",
        category: "Output",
      },
    ],
    errors: [
      {
        message: "No web server found",
        cause:
          "The host, port, TLS setting, or virtual host is wrong for the service being scanned.",
        fix: "Confirm the service with curl or nmap, then retry with the correct -p, -ssl, and -vhost settings.",
      },
      {
        message: "ERROR: Cannot resolve hostname",
        cause: "DNS resolution failed or the hostname was misspelled.",
        fix: "Correct the hostname, add the target to /etc/hosts if needed, or scan the IP directly with the proper -vhost value.",
      },
      {
        message: "Invalid -Format specified",
        cause: "The output format value is not supported by the installed Nikto build.",
        fix: "Use a supported format such as txt, csv, html, json, or xml and retry the scan.",
      },
    ],
  },
  {
    slug: "gobuster",
    name: "Gobuster",
    category: "Web Application Analysis",
    package: "gobuster",
    homepage: "https://github.com/OJ/gobuster",
    depth: "deep",
    invocation: "gobuster",
    summary:
      "Fast Go-based brute forcer for directories, files, DNS subdomains, virtual hosts, and cloud storage buckets.",
    commands: [
      {
        name: "gobuster dir basic content discovery",
        syntax: "gobuster dir -u URL -w WORDLIST",
        description: "Enumerate directories and files under a target web root.",
        examples: [
          {
            code: "gobuster dir -u https://app.example.com -w /usr/share/seclists/Discovery/Web-Content/common.txt",
            note: "Fast baseline directory enumeration with a compact SecLists wordlist.",
          },
        ],
        bestScenario: "Best first pass for low-noise content discovery on a web application.",
        category: "Directory",
      },
      {
        name: "gobuster dir with extensions",
        syntax: "gobuster dir -u URL -w WORDLIST -x EXTENSIONS",
        description: "Append common script and content extensions to each wordlist entry.",
        examples: [
          {
            code: "gobuster dir -u https://app.example.com -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,txt,html,js",
            note: "Hunt for exposed scripts and backup text files.",
          },
        ],
        bestScenario:
          "Use when the target likely hosts extension-based resources rather than clean URLs only.",
        category: "Directory",
      },
      {
        name: "gobuster dir tuned threads and status codes",
        syntax: "gobuster dir -u URL -w WORDLIST -t THREADS -s CODES -b CODES",
        description: "Increase concurrency and explicitly match or suppress response codes.",
        examples: [
          {
            code: "gobuster dir -u https://app.example.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -t 50 -s 200,204,301,302,307,401,403 -b 404",
            note: "Balanced scan for real content while ignoring standard 404s.",
          },
        ],
        bestScenario:
          "Useful on stable targets where speed matters and the response code profile is known.",
        category: "Directory",
      },
      {
        name: "gobuster dir with TLS skip and length filtering",
        syntax: "gobuster dir -u URL -w WORDLIST -k --exclude-length LENGTHS",
        description:
          "Ignore TLS certificate problems and drop results that match the default body size.",
        examples: [
          {
            code: "gobuster dir -u https://10.10.10.20 -w /usr/share/seclists/Discovery/Web-Content/common.txt -k --exclude-length 612,615",
            note: "Useful when a custom 200 error page causes false positives on an IP-only HTTPS target.",
          },
        ],
        bestScenario:
          "Good for staging or internal hosts using self-signed certs and uniform error pages.",
        category: "Directory",
      },
      {
        name: "gobuster DNS subdomain enumeration",
        syntax: "gobuster dns -do DOMAIN -w WORDLIST",
        description: "Brute-force subdomains by querying DNS.",
        examples: [
          {
            code: "gobuster dns -do example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
            note: "Standard subdomain discovery with a widely used SecLists list.",
          },
        ],
        bestScenario: "Use early in external recon to expand target surface area.",
        category: "DNS",
      },
      {
        name: "gobuster DNS with a custom resolver",
        syntax: "gobuster dns -do DOMAIN -w WORDLIST -r RESOLVER -t THREADS",
        description: "Query a chosen recursive resolver and adjust concurrency.",
        examples: [
          {
            code: "gobuster dns -do example.com -w /usr/share/seclists/Discovery/DNS/namelist.txt -r 1.1.1.1:53 -t 50",
            note: "Useful when the system resolver is slow or filtered.",
          },
        ],
        bestScenario: "Helpful when engagement infrastructure requires a known clean resolver.",
        category: "DNS",
      },
      {
        name: "gobuster virtual host discovery",
        syntax: "gobuster vhost -u URL --append-domain -w WORDLIST",
        description: "Brute-force Host headers to find name-based virtual hosts.",
        examples: [
          {
            code: "gobuster vhost -u https://10.10.10.20 --append-domain -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -k",
            note: "Check whether multiple sites are hidden behind one IP and TLS endpoint.",
          },
        ],
        bestScenario:
          "Best when DNS records are missing but you suspect name-based hosting on the target IP.",
        category: "VHost",
      },
      {
        name: "gobuster S3 bucket enumeration",
        syntax: "gobuster s3 -w WORDLIST",
        description: "Test candidate names for discoverable Amazon S3 buckets.",
        examples: [
          {
            code: "gobuster s3 -w /usr/share/seclists/Discovery/DNS/namelist.txt",
            note: "Try common organization and environment names against S3 bucket endpoints.",
          },
        ],
        bestScenario:
          "Useful during cloud exposure reviews when likely bucket naming conventions are known.",
        category: "S3",
      },
    ],
    errors: [
      {
        message:
          "the server returns a status code that matches the provided options for non-existing urls",
        cause:
          "The target uses a catch-all response, so Gobuster cannot distinguish valid results from invalid paths.",
        fix: "Add --exclude-length, tune -s/-b, or manually profile the not-found response before rerunning.",
      },
      {
        message: "unable to connect to server",
        cause:
          "The target is unreachable, blocked, or using TLS settings that the client cannot validate.",
        fix: "Confirm reachability with curl, correct the URL or port, and add -k only if a self-signed certificate is expected.",
      },
      {
        message: "Wildcard DNS found. To force processing of Wildcard DNS, specify --wildcard",
        cause: "Every tested subdomain resolves, making naive DNS brute force unreliable.",
        fix: "Verify the wildcard behavior manually and only continue with --wildcard if you have another way to separate real hosts from noise.",
      },
    ],
  },
  {
    slug: "ffuf",
    name: "ffuf",
    category: "Web Application Analysis",
    package: "ffuf",
    homepage: "https://github.com/ffuf/ffuf",
    depth: "deep",
    invocation: "ffuf",
    summary:
      "High-speed web fuzzer for content discovery, parameter names, header values, vhosts, and API inputs using the FUZZ keyword.",
    commands: [
      {
        name: "ffuf basic directory fuzzing",
        syntax: "ffuf -w WORDLIST -u URL/FUZZ",
        description: "Fuzz path segments by placing FUZZ in the URL.",
        examples: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt -u https://app.example.com/FUZZ -mc 200,301,302,401,403",
            note: "Standard web content discovery with response code matching.",
          },
        ],
        bestScenario: "Use as a fast first pass against web roots and API prefixes.",
        category: "Content Discovery",
      },
      {
        name: "ffuf GET parameter name fuzzing",
        syntax: "ffuf -w WORDLIST -u URL?FUZZ=value",
        description: "Discover hidden GET parameter names by fuzzing the parameter key.",
        examples: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -u 'https://app.example.com/search?FUZZ=test' -fs 4242",
            note: "Filters the known size of invalid parameter responses.",
          },
        ],
        bestScenario:
          "Great for finding undocumented debugging, filtering, or feature-flag parameters.",
        category: "Parameters",
      },
      {
        name: "ffuf POST body fuzzing",
        syntax: "ffuf -w WORDLIST -X POST -d BODY -u URL",
        description: "Fuzz a value inside POST body data.",
        examples: [
          {
            code: "ffuf -w /usr/share/wordlists/rockyou.txt -X POST -d 'username=admin&otp=FUZZ' -H 'Content-Type: application/x-www-form-urlencoded' -u https://app.example.com/login -fc 401",
            note: "Filter failed logins while testing password candidates in a controlled lab.",
          },
        ],
        bestScenario: "Use when a request body contains one field you want to mutate rapidly.",
        category: "POST",
      },
      {
        name: "ffuf header fuzzing",
        syntax: "ffuf -w WORDLIST -H 'Header: FUZZ' -u URL",
        description: "Fuzz a request header value instead of the URL path or body.",
        examples: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt -H 'X-Original-URL: /FUZZ' -u https://app.example.com/ -mc all -fc 404",
            note: "Helpful for reverse-proxy and header-based routing tests.",
          },
        ],
        bestScenario:
          "Useful for header-based access control bypass or hidden route discovery tests.",
        category: "Headers",
      },
      {
        name: "ffuf filter by status and size",
        syntax: "ffuf -w WORDLIST -u URL/FUZZ -mc CODES -fs SIZES",
        description:
          "Combine status-code matching with body-size filtering to reduce false positives.",
        examples: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -u https://app.example.com/FUZZ -mc all -fs 612,615",
            note: "Drop the default custom 200 error page sizes.",
          },
        ],
        bestScenario: "Essential when the target always returns 200 or 302 for missing content.",
        category: "Filtering",
      },
      {
        name: "ffuf filter by words and lines",
        syntax: "ffuf -w WORDLIST -u URL/FUZZ -fw WORDCOUNT -fl LINECOUNT",
        description: "Filter responses by word or line count instead of bytes.",
        examples: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt -u https://app.example.com/FUZZ -fw 120 -fl 35",
            note: "Helpful when the target compresses responses but keeps the same template structure.",
          },
        ],
        bestScenario:
          "Best when response length varies slightly but template word or line counts stay stable.",
        category: "Filtering",
      },
      {
        name: "ffuf multiple wordlists",
        syntax: "ffuf -w LIST1:KEY1 -w LIST2:KEY2 -u URL",
        description: "Fuzz multiple independent keywords in one request.",
        examples: [
          {
            code: "ffuf -w users.txt:USER -w ids.txt:ID -u https://api.example.com/users/USER/orders/ID -mc 200,403",
            note: "Enumerate composite API paths in one run.",
          },
        ],
        bestScenario:
          "Use when both the path and an embedded identifier come from separate candidate sets.",
        category: "Advanced",
      },
      {
        name: "ffuf recursive discovery",
        syntax: "ffuf -w WORDLIST -u URL/FUZZ -recursion -recursion-depth DEPTH",
        description: "Automatically launch new jobs when directories are discovered.",
        examples: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt -u https://app.example.com/FUZZ -recursion -recursion-depth 2 -maxtime-job 60",
            note: "Walk two directory levels without letting one branch run forever.",
          },
        ],
        bestScenario:
          "Useful when you want controlled depth-first discovery without chaining many manual runs.",
        category: "Recursion",
      },
      {
        name: "ffuf JSON output",
        syntax: "ffuf -w WORDLIST -u URL/FUZZ -o FILE -of json",
        description: "Save results in JSON for parsing or reporting.",
        examples: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt -u https://app.example.com/FUZZ -ac -o ffuf-results.json -of json",
            note: "Auto-calibrate first, then save structured output.",
          },
        ],
        bestScenario: "Best when results need to be fed into jq, scripts, or a report pipeline.",
        category: "Output",
      },
    ],
    errors: [
      {
        message: "Keyword FUZZ defined, but not found in headers, method, URL or POST data",
        cause:
          "The request template does not actually contain the FUZZ keyword mapped to the supplied wordlist.",
        fix: "Insert FUZZ into the URL, body, or header you want to mutate, or use named keywords like -w list.txt:USER consistently.",
      },
      {
        message: "Either -w or --input-cmd flag is required",
        cause: "No input source was provided for payload generation.",
        fix: "Add a wordlist with -w or provide an external generator with --input-cmd.",
      },
      {
        message: 'Get "https://target/FUZZ": context deadline exceeded',
        cause: "The target is too slow, rate limiting, or temporarily unreachable.",
        fix: "Lower the thread count, increase -timeout, add delays, and confirm the endpoint still responds outside ffuf.",
      },
    ],
  },
  {
    slug: "crackmapexec",
    name: "CrackMapExec / NetExec",
    category: "Post Exploitation",
    package: "crackmapexec",
    homepage: "https://github.com/byt3bl33d3r/CrackMapExec",
    depth: "deep",
    invocation: "crackmapexec",
    summary:
      "Post-exploitation and Active Directory operator toolkit for SMB and LDAP credential validation, enumeration, command execution, and credential dumping.",
    commands: [
      {
        name: "cme SMB password spray",
        syntax: "crackmapexec smb TARGETS -u USERS -p PASSWORD --continue-on-success",
        description: "Try one password across many hosts and users over SMB.",
        examples: [
          {
            code: "crackmapexec smb 10.10.10.0/24 -u users.txt -p 'Winter2024!' --continue-on-success",
            note: "Classic low-and-slow password spray across a subnet.",
          },
        ],
        bestScenario:
          "Use after confirming the domain lockout policy and obtaining an approved username list.",
        category: "SMB",
      },
      {
        name: "cme SMB pass-the-hash",
        syntax: "crackmapexec smb TARGET -u USER -H NTHASH",
        description: "Authenticate with an NTLM hash instead of a cleartext password.",
        examples: [
          {
            code: "crackmapexec smb 10.10.10.25 -u Administrator -H 8846f7eaee8fb117ad06bdd830b7586c",
            note: "Validate local admin access with a recovered NT hash.",
          },
        ],
        bestScenario: "Use when only NTLM material is available from LSASS, SAM, or relay output.",
        category: "SMB",
      },
      {
        name: "cme enumerate SMB shares",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD --shares",
        description: "List readable and writable SMB shares on the target.",
        examples: [
          {
            code: "crackmapexec smb fs01.corp.local -u auditor -p 'Password123!' --shares",
            note: "Quick share triage after a successful login.",
          },
        ],
        bestScenario: "Best when you want to identify data exposure or lateral movement paths.",
        category: "SMB",
      },
      {
        name: "cme enumerate local and domain users",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD --users",
        description: "Query user accounts through SMB/RPC with valid credentials.",
        examples: [
          {
            code: "crackmapexec smb dc01.corp.local -u auditor -p 'Password123!' --users",
            note: "Collect user information from a DC over authenticated SMB.",
          },
        ],
        bestScenario: "Use during AD recon when you already have a valid foothold.",
        category: "Enumeration",
      },
      {
        name: "cme enumerate groups",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD --groups",
        description: "Enumerate security groups and built-in groups over SMB/RPC.",
        examples: [
          {
            code: "crackmapexec smb dc01.corp.local -u auditor -p 'Password123!' --groups",
            note: "Map privileged groups and interesting delegations.",
          },
        ],
        bestScenario:
          "Helpful when prioritizing what cracked or sprayed accounts might lead to privilege.",
        category: "Enumeration",
      },
      {
        name: "cme remote command via smbexec",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD -x COMMAND --exec-method smbexec",
        description: "Execute a command using the smbexec method.",
        examples: [
          {
            code: "crackmapexec smb 10.10.10.25 -u Administrator -p 'Password123!' -x 'whoami /all' --exec-method smbexec",
            note: "Run a single command through the service-based execution path.",
          },
        ],
        bestScenario: "Use when you have admin rights and want reliable one-shot execution.",
        category: "Execution",
      },
      {
        name: "cme remote command via wmiexec",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD -x COMMAND --exec-method wmiexec",
        description: "Execute a command using WMI instead of SMB service creation.",
        examples: [
          {
            code: "crackmapexec smb 10.10.10.25 -u Administrator -p 'Password123!' -x 'ipconfig /all' --exec-method wmiexec",
            note: "Alternate execution method when smbexec is noisy or blocked.",
          },
        ],
        bestScenario: "Useful on hosts where WMI works better than service-based execution.",
        category: "Execution",
      },
      {
        name: "cme LDAP user enumeration",
        syntax: "crackmapexec ldap TARGET -u USER -p PASSWORD --users",
        description: "Enumerate domain users directly over LDAP.",
        examples: [
          {
            code: "crackmapexec ldap dc01.corp.local -u jdoe -p 'Winter2024!' --users",
            note: "Pull user objects from the domain over LDAP.",
          },
        ],
        bestScenario:
          "Best for cleaner domain enumeration when LDAP is reachable and SMB is restricted.",
        category: "LDAP",
      },
      {
        name: "cme LDAP AS-REP roasting",
        syntax: "crackmapexec ldap TARGET -u USER -p PASSWORD --asreproast OUTFILE",
        description:
          "Request AS-REP roastable hashes for accounts without Kerberos pre-authentication.",
        examples: [
          {
            code: "crackmapexec ldap dc01.corp.local -u jdoe -p 'Winter2024!' --asreproast asrep.hashes",
            note: "Collect hashes for offline cracking with hashcat mode 18200.",
          },
        ],
        bestScenario:
          "Use during early AD recon to find crackable accounts without extra interaction.",
        category: "LDAP",
      },
      {
        name: "cme dump SAM",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD --sam",
        description:
          "Dump the local SAM database from a Windows target when administrative access exists.",
        examples: [
          {
            code: "crackmapexec smb 10.10.10.25 -u Administrator -p 'Password123!' --sam",
            note: "Recover local account hashes for offline cracking or pivoting.",
          },
        ],
        bestScenario: "Use after confirming local admin rights on a member workstation or server.",
        category: "Dumping",
      },
      {
        name: "cme dump LSA secrets",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD --lsa",
        description: "Dump cached secrets and service account material from the LSA secrets store.",
        examples: [
          {
            code: "crackmapexec smb 10.10.10.25 -u Administrator -p 'Password123!' --lsa",
            note: "Can expose service passwords and auto-logon credentials.",
          },
        ],
        bestScenario: "Valuable when service account reuse may lead to broader access.",
        category: "Dumping",
      },
      {
        name: "cme dump NTDS",
        syntax: "crackmapexec smb TARGET -u USER -p PASSWORD --ntds",
        description: "Dump NTDS data from a domain controller when privileges allow it.",
        examples: [
          {
            code: "crackmapexec smb dc01.corp.local -u Administrator -p 'Password123!' --ntds",
            note: "High-impact domain credential extraction from a DC.",
          },
        ],
        bestScenario:
          "Use only after validating domain admin-equivalent rights on a domain controller.",
        category: "Dumping",
      },
    ],
    errors: [
      {
        message: "STATUS_LOGON_FAILURE",
        cause: "The username, password, hash, or domain context is wrong for the target.",
        fix: "Re-test the credentials on a known good host, add the correct domain, or try --local-auth for local accounts.",
      },
      {
        message: "STATUS_ACCESS_DENIED",
        cause:
          "The account authenticated successfully but lacks the rights required for the requested action.",
        fix: "Use lower-impact enumeration, switch to a host where the account is admin, or try a different execution method.",
      },
      {
        message: "KDC_ERR_PREAUTH_FAILED",
        cause:
          "Kerberos authentication failed because the supplied password is wrong or the account is not valid in that realm.",
        fix: "Verify the domain, check the password carefully, and confirm the account exists before retrying LDAP or Kerberos-based operations.",
      },
    ],
  },
  {
    slug: "impacket-secretsdump",
    name: "impacket secretsdump",
    category: "Post Exploitation",
    package: "impacket-scripts",
    homepage: "https://github.com/fortra/impacket",
    depth: "deep",
    invocation: "impacket-secretsdump",
    summary:
      "Credential dumping utility from Impacket for remote SAM/LSA/NTDS extraction, offline hive parsing, and DCSync-style retrieval.",
    commands: [
      {
        name: "secretsdump remote SAM and LSA",
        syntax: "impacket-secretsdump DOMAIN/USER:PASSWORD@TARGET",
        description:
          "Dump local SAM and LSA secrets remotely with valid administrative credentials.",
        examples: [
          {
            code: "impacket-secretsdump corp.local/Administrator:'Password123!'@10.10.10.25",
            note: "Remote local credential extraction from a workstation or server.",
          },
        ],
        bestScenario:
          "Use after obtaining administrative rights on a Windows host reachable over SMB.",
        category: "Remote Dump",
      },
      {
        name: "secretsdump pass-the-hash",
        syntax: "impacket-secretsdump -hashes LMHASH:NTHASH DOMAIN/USER@TARGET",
        description: "Authenticate to the remote host with NTLM material instead of a password.",
        examples: [
          {
            code: "impacket-secretsdump -hashes aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c corp.local/Administrator@10.10.10.25",
            note: "Leverage a recovered NT hash to dump local secrets.",
          },
        ],
        bestScenario: "Use when you have an admin NT hash but no cleartext password.",
        category: "Remote Dump",
      },
      {
        name: "secretsdump just-dc NTDS sync",
        syntax: "impacket-secretsdump -just-dc DOMAIN/USER:PASSWORD@DC",
        description:
          "Use the DRSUAPI path to pull domain credential material from a domain controller.",
        examples: [
          {
            code: "impacket-secretsdump -just-dc corp.local/svc_backup:'Password123!'@dc01.corp.local",
            note: "DCSync-style extraction when the account has replication rights.",
          },
        ],
        bestScenario:
          "Use when the account has DS-Replication-Get-Changes privileges and you want domain hashes only.",
        category: "DCSync",
      },
      {
        name: "secretsdump targeted DC user",
        syntax: "impacket-secretsdump -just-dc-user USER DOMAIN/USER:PASSWORD@DC",
        description: "Pull just one account from NTDS instead of the full domain set.",
        examples: [
          {
            code: "impacket-secretsdump -just-dc-user krbtgt corp.local/svc_backup:'Password123!'@dc01.corp.local",
            note: "Target a single high-value account to reduce output volume.",
          },
        ],
        bestScenario:
          "Useful when you only need a specific privileged account for follow-on analysis.",
        category: "DCSync",
      },
      {
        name: "secretsdump use VSS on a DC",
        syntax: "impacket-secretsdump -use-vss DOMAIN/USER:PASSWORD@TARGET",
        description:
          "Fall back to a Volume Shadow Copy technique when DRSUAPI is unavailable or filtered.",
        examples: [
          {
            code: "impacket-secretsdump -use-vss corp.local/Administrator:'Password123!'@dc01.corp.local",
            note: "Alternative path for NTDS extraction from a domain controller.",
          },
        ],
        bestScenario:
          "Use when replication-based dumping fails but remote admin access still exists.",
        category: "NTDS",
      },
      {
        name: "secretsdump offline local hives",
        syntax: "impacket-secretsdump -sam SAM -system SYSTEM LOCAL",
        description: "Parse offline Windows registry hives to recover local account hashes.",
        examples: [
          {
            code: "impacket-secretsdump -sam SAM -system SYSTEM LOCAL",
            note: "Offline local credential recovery from copied hives.",
          },
        ],
        bestScenario:
          "Useful in forensics or post-exploitation when only hive files are available.",
        category: "Offline",
      },
      {
        name: "secretsdump offline NTDS.dit parsing",
        syntax: "impacket-secretsdump -ntds NTDS.DIT -system SYSTEM LOCAL",
        description: "Extract domain hashes from an offline NTDS.dit plus the SYSTEM hive.",
        examples: [
          {
            code: "impacket-secretsdump -ntds ntds.dit -system SYSTEM LOCAL",
            note: "Offline domain credential extraction from collected files.",
          },
        ],
        bestScenario: "Use when you exfiltrated NTDS.dit and SYSTEM from a DC or backup set.",
        category: "Offline",
      },
      {
        name: "secretsdump write evidence files",
        syntax: "impacket-secretsdump -outputfile PREFIX DOMAIN/USER:PASSWORD@TARGET",
        description: "Save dumped material to structured output files.",
        examples: [
          {
            code: "impacket-secretsdump -outputfile dc01-secrets corp.local/Administrator:'Password123!'@dc01.corp.local",
            note: "Preserve output in files instead of only the terminal scrollback.",
          },
        ],
        bestScenario: "Best when you need repeatable evidence handling and later offline review.",
        category: "Output",
      },
    ],
    errors: [
      {
        message: "SMB SessionError: STATUS_LOGON_FAILURE",
        cause: "The supplied credentials or hashes are invalid for the remote host.",
        fix: "Validate the credential set with smbclient or crackmapexec first, then retry with the correct domain context.",
      },
      {
        message: "rpc_s_access_denied",
        cause:
          "The account authenticated but does not have rights for remote registry, SAM, or DRSUAPI access.",
        fix: "Use an account with local admin or replication privileges, or switch to an offline hive workflow.",
      },
      {
        message: "DRSUAPI SessionError: ERROR_DS_DRA_BAD_DN",
        cause:
          "The target is not a valid DC for the requested replication path, or the naming context is wrong.",
        fix: "Point the command at a real domain controller FQDN or IP and retry with -just-dc or -just-dc-user against that DC.",
      },
    ],
  },
  {
    slug: "enum4linux-ng",
    name: "enum4linux-ng",
    category: "Information Gathering",
    package: "enum4linux-ng",
    homepage: "https://github.com/cddmp/enum4linux-ng",
    depth: "deep",
    invocation: "enum4linux-ng",
    summary:
      "SMB, RPC, and LDAP enumeration helper for Windows and Samba hosts with null-session, authenticated, Kerberos, and pass-the-hash support.",
    commands: [
      {
        name: "enum4linux-ng full enumeration",
        syntax: "enum4linux-ng -A HOST",
        description: "Run the default all-checks profile against a target.",
        examples: [
          {
            code: "enum4linux-ng -A 10.10.10.25",
            note: "Fast first-pass SMB and RPC enumeration over a null session if allowed.",
          },
        ],
        bestScenario:
          "Start here when you want shares, users, OS info, printers, and policies in one run.",
        category: "Full Enumeration",
      },
      {
        name: "enum4linux-ng short full enumeration",
        syntax: "enum4linux-ng -As HOST",
        description: "Run the short all-checks profile without NetBIOS name lookup.",
        examples: [
          {
            code: "enum4linux-ng -As 10.10.10.25",
            note: "Useful when NetBIOS is noisy or blocked.",
          },
        ],
        bestScenario:
          "Use when you want a faster baseline and do not need NetBIOS name resolution.",
        category: "Full Enumeration",
      },
      {
        name: "enum4linux-ng enumerate users",
        syntax: "enum4linux-ng -U HOST",
        description: "Query users over RPC.",
        examples: [
          {
            code: "enum4linux-ng -U 10.10.10.25",
            note: "Test whether anonymous user enumeration is permitted.",
          },
        ],
        bestScenario:
          "Good for checking null-session exposure before moving to authenticated enumeration.",
        category: "Users",
      },
      {
        name: "enum4linux-ng enumerate groups with members",
        syntax: "enum4linux-ng -Gm HOST",
        description: "Enumerate groups and expand their members.",
        examples: [
          {
            code: "enum4linux-ng -Gm 10.10.10.25",
            note: "Pull group membership over RPC where permitted.",
          },
        ],
        bestScenario: "Useful when group composition matters more than a flat user list.",
        category: "Groups",
      },
      {
        name: "enum4linux-ng enumerate shares",
        syntax: "enum4linux-ng -S HOST",
        description: "List SMB shares through RPC and SMB tooling.",
        examples: [
          {
            code: "enum4linux-ng -S 10.10.10.25",
            note: "Check whether anonymous share listing is exposed.",
          },
        ],
        bestScenario:
          "Best when you want to confirm which shares are visible before using smbclient or smbmap.",
        category: "Shares",
      },
      {
        name: "enum4linux-ng password policy and OS info",
        syntax: "enum4linux-ng -P -O HOST",
        description: "Query account policy and basic OS information.",
        examples: [
          {
            code: "enum4linux-ng -P -O 10.10.10.25",
            note: "Collect password policy and version hints for later attack planning.",
          },
        ],
        bestScenario:
          "Useful when you need lockout policy before spraying or OS context before selecting an exploit path.",
        category: "Policies",
      },
      {
        name: "enum4linux-ng authenticated LDAP domain info",
        syntax: "enum4linux-ng -L -u USER -p PASSWORD HOST",
        description: "Use valid credentials to pull extra domain data over LDAP or LDAPS.",
        examples: [
          {
            code: "enum4linux-ng -L -u svc_enum -p 'Password123!' dc01.corp.local",
            note: "Authenticated domain information collection from a domain controller.",
          },
        ],
        bestScenario: "Best on domain controllers where LDAP enriches what RPC alone can expose.",
        category: "LDAP",
      },
      {
        name: "enum4linux-ng pass-the-hash authentication",
        syntax: "enum4linux-ng -u USER -H NTHASH HOST",
        description: "Authenticate with an NT hash instead of a password.",
        examples: [
          {
            code: "enum4linux-ng -u Administrator -H 8846f7eaee8fb117ad06bdd830b7586c 10.10.10.25",
            note: "Reuse recovered NTLM material for further enumeration.",
          },
        ],
        bestScenario:
          "Useful when you have an NT hash from SAM, LSA, or relay output but no password.",
        category: "Authentication",
      },
      {
        name: "enum4linux-ng export results",
        syntax: "enum4linux-ng -A HOST -oA PREFIX",
        description: "Write findings to both JSON and YAML-compatible export files.",
        examples: [
          {
            code: "enum4linux-ng -A 10.10.10.25 -oA dc01-enum",
            note: "Save structured output for later review and parsing.",
          },
        ],
        bestScenario: "Use when enumeration results need to feed other tooling or report evidence.",
        category: "Output",
      },
    ],
    errors: [
      {
        message: "Could not establish SMB session",
        cause:
          "Anonymous access is disabled and no valid credentials were provided, or SMB is filtered.",
        fix: "Retry with -u/-p, -H, or -K using valid credentials and confirm port 445 is reachable.",
      },
      {
        message: "NT_STATUS_ACCESS_DENIED",
        cause:
          "The target accepted the connection but refused the requested RPC or share enumeration action.",
        fix: "Switch to authenticated mode, reduce the scope to checks allowed for that account, or test another host.",
      },
      {
        message: "The NETBIOS connection with the remote host timed out",
        cause: "NetBIOS name service is blocked, filtered, or disabled on the target.",
        fix: "Use -As to skip NetBIOS-dependent checks and continue with SMB and LDAP-based enumeration.",
      },
    ],
  },
  {
    slug: "wpscan",
    name: "WPScan",
    category: "Web Application Analysis",
    package: "wpscan",
    homepage: "https://wpscan.com",
    depth: "deep",
    invocation: "wpscan",
    summary:
      "WordPress-focused scanner for version fingerprinting, user/plugin/theme enumeration, brute force testing, and vulnerability lookups via the WPScan API.",
    commands: [
      {
        name: "wpscan update local database",
        syntax: "wpscan --update",
        description: "Refresh the local metadata database before scanning.",
        examples: [
          { code: "wpscan --update", note: "Pull the latest scanner data before an assessment." },
        ],
        bestScenario: "Run before any serious scan so the plugin and theme checks are current.",
        category: "Maintenance",
      },
      {
        name: "wpscan basic scan",
        syntax: "wpscan --url URL",
        description: "Fingerprint the WordPress site with default detection settings.",
        examples: [
          {
            code: "wpscan --url https://blog.example.com",
            note: "Baseline WordPress version and interesting findings scan.",
          },
        ],
        bestScenario:
          "Start here to confirm the target is WordPress and gather low-noise findings.",
        category: "Scan",
      },
      {
        name: "wpscan enumerate users, plugins, and themes",
        syntax: "wpscan --url URL --enumerate ITEMS",
        description:
          "Enumerate common WordPress assets such as users, all plugins, and all themes.",
        examples: [
          {
            code: "wpscan --url https://blog.example.com --enumerate u,ap,at",
            note: "Gather usernames plus plugin and theme inventory.",
          },
        ],
        bestScenario: "Use after confirming WordPress to map exposed attack surface quickly.",
        category: "Enumeration",
      },
      {
        name: "wpscan vulnerability enumeration with API token",
        syntax: "wpscan --url URL --enumerate ITEMS --api-token TOKEN",
        description:
          "Query the WPScan API for known vulnerabilities affecting discovered components.",
        examples: [
          {
            code: "wpscan --url https://blog.example.com --enumerate vp,vt --api-token $WPSCAN_API_TOKEN",
            note: "Look up vulnerable plugins and themes after detection.",
          },
        ],
        bestScenario:
          "Use when you need version-aware vulnerability intelligence rather than simple fingerprinting alone.",
        category: "Vulnerability Detection",
      },
      {
        name: "wpscan passive and stealthy detection",
        syntax: "wpscan --stealthy --url URL --plugins-detection passive --enumerate ITEMS",
        description: "Reduce noise by sticking to passive techniques where possible.",
        examples: [
          {
            code: "wpscan --stealthy --url https://blog.example.com --plugins-detection passive --enumerate u",
            note: "Lower-profile user enumeration against a sensitive target.",
          },
        ],
        bestScenario:
          "Useful when you want minimal request volume and are willing to miss some components.",
        category: "Stealth",
      },
      {
        name: "wpscan aggressive plugin detection",
        syntax: "wpscan --url URL --plugins-detection aggressive --enumerate ap",
        description:
          "Actively probe for plugin paths and metadata instead of relying only on passive fingerprints.",
        examples: [
          {
            code: "wpscan --url https://blog.example.com --plugins-detection aggressive --enumerate ap",
            note: "More complete plugin coverage at the cost of more requests.",
          },
        ],
        bestScenario:
          "Best when passive detection misses likely plugins and the engagement permits more noise.",
        category: "Enumeration",
      },
      {
        name: "wpscan brute-force one user",
        syntax: "wpscan --url URL --usernames USER --passwords WORDLIST",
        description: "Test a password list against a single WordPress username.",
        examples: [
          {
            code: "wpscan --url https://blog.example.com --usernames admin --passwords /usr/share/wordlists/rockyou.txt",
            note: "Controlled credential testing against a known WordPress account.",
          },
        ],
        bestScenario:
          "Use when authorization explicitly permits WordPress password auditing for a specific account.",
        category: "Brute Force",
      },
      {
        name: "wpscan brute-force multiple users over xmlrpc",
        syntax:
          "wpscan --url URL --usernames USERLIST --passwords WORDLIST --password-attack xmlrpc",
        description: "Test multiple usernames and passwords using the XML-RPC attack path.",
        examples: [
          {
            code: "wpscan --url https://blog.example.com --usernames users.txt --passwords /usr/share/wordlists/rockyou.txt --password-attack xmlrpc",
            note: "Useful when xmlrpc.php is enabled and in scope for testing.",
          },
        ],
        bestScenario:
          "Use in controlled labs or approved audits where XML-RPC login behavior matters.",
        category: "Brute Force",
      },
      {
        name: "wpscan proxy through Burp",
        syntax: "wpscan --url URL --proxy PROXY",
        description: "Route requests through an intercepting proxy for review or logging.",
        examples: [
          {
            code: "wpscan --url https://blog.example.com --proxy http://127.0.0.1:8080",
            note: "Inspect detection requests and responses in Burp.",
          },
        ],
        bestScenario:
          "Best when you need to validate findings manually or capture evidence in a proxy history.",
        category: "Proxying",
      },
    ],
    errors: [
      {
        message: "Scan Aborted: The URL supplied redirects to ...",
        cause: "The site redirects to a different scheme or hostname than the one provided.",
        fix: "Rerun against the final canonical URL or add the appropriate redirect-handling option when that behavior is expected.",
      },
      {
        message: "The remote website is up, but does not seem to be running WordPress",
        cause:
          "The target is not WordPress, is heavily fronted by a proxy/CDN, or hides common WordPress markers.",
        fix: "Verify the platform manually, try the final origin host if known, and only continue if you can confirm WordPress is actually present.",
      },
      {
        message: "You have exceeded your daily API request limit",
        cause: "The free WPScan API quota for vulnerability lookups has been exhausted.",
        fix: "Wait for the daily limit reset, use another valid token, or continue with local fingerprinting results only.",
      },
    ],
  },
  {
    slug: "volatility3",
    name: "Volatility 3",
    category: "Forensics",
    package: "volatility3",
    homepage: "https://github.com/volatilityfoundation/volatility3",
    depth: "deep",
    invocation: "vol",
    summary:
      "Memory forensics framework for triaging Windows RAM images, replacing many classic Volatility 2 workflows with updated plugins and symbols.",
    commands: [
      {
        name: "vol windows.info",
        syntax: "vol -f IMAGE windows.info",
        description:
          "Identify the Windows sample and validate the kernel profile or symbols. In Volatility 3 this replaces the old imageinfo workflow.",
        examples: [
          {
            code: "vol -f memory.raw windows.info",
            note: "First command to run against an unknown Windows memory image.",
          },
        ],
        bestScenario:
          "Use before every other Windows plugin so you know the image is parseable and symbol resolution works.",
        category: "Triage",
      },
      {
        name: "vol windows.pslist",
        syntax: "vol -f IMAGE windows.pslist",
        description: "List active processes visible in the EPROCESS list.",
        examples: [
          {
            code: "vol -f memory.raw windows.pslist",
            note: "Baseline process inventory from RAM.",
          },
        ],
        bestScenario: "Useful for quick triage of what was running at capture time.",
        category: "Processes",
      },
      {
        name: "vol windows.pstree",
        syntax: "vol -f IMAGE windows.pstree",
        description: "Display parent-child process relationships.",
        examples: [
          {
            code: "vol -f memory.raw windows.pstree",
            note: "Spot suspicious children such as cmd.exe under a document viewer.",
          },
        ],
        bestScenario: "Best when you care about process lineage rather than a flat list.",
        category: "Processes",
      },
      {
        name: "vol windows.cmdline",
        syntax: "vol -f IMAGE windows.cmdline",
        description: "Recover command-line arguments for running processes.",
        examples: [
          {
            code: "vol -f memory.raw windows.cmdline",
            note: "See if powershell.exe or rundll32.exe launched with malicious arguments.",
          },
        ],
        bestScenario:
          "Use when process names alone are too generic and you need execution context.",
        category: "Processes",
      },
      {
        name: "vol windows.netscan",
        syntax: "vol -f IMAGE windows.netscan",
        description: "Enumerate sockets and network objects carved from memory.",
        examples: [
          {
            code: "vol -f memory.raw windows.netscan",
            note: "Find listening services and remote C2-style connections.",
          },
        ],
        bestScenario: "Primary network triage plugin for modern Windows memory images.",
        category: "Network",
      },
      {
        name: "vol windows.netstat",
        syntax: "vol -f IMAGE windows.netstat",
        description: "Traverse Windows network tracking structures for connection data.",
        examples: [
          {
            code: "vol -f memory.raw windows.netstat",
            note: "Alternate network view that can complement netscan findings.",
          },
        ],
        bestScenario: "Use alongside netscan when you want corroborating network artifacts.",
        category: "Network",
      },
      {
        name: "vol windows.filescan",
        syntax: "vol -f IMAGE windows.filescan",
        description: "Scan memory pools for file objects that were present in memory.",
        examples: [
          {
            code: "vol -f memory.raw windows.filescan",
            note: "Recover filenames that may no longer exist on disk.",
          },
        ],
        bestScenario:
          "Useful when malware dropped temporary files or interacted with sensitive documents.",
        category: "Files",
      },
      {
        name: "vol windows.dumpfiles",
        syntax: "vol -f IMAGE windows.dumpfiles --virtaddr ADDRESS",
        description: "Dump the contents of a file object found during filescan.",
        examples: [
          {
            code: "vol -f memory.raw windows.dumpfiles --virtaddr 0xfffffa8003b8d060",
            note: "Recover the file object at a virtual address returned by windows.filescan.",
          },
        ],
        bestScenario:
          "Use when a suspicious file object is visible in RAM but not safely recoverable from disk.",
        category: "Files",
      },
      {
        name: "vol windows.malfind",
        syntax: "vol -f IMAGE windows.malfind",
        description: "Find memory regions that look like injected or unpacked code.",
        examples: [
          {
            code: "vol -f memory.raw windows.malfind",
            note: "Check for RWX pages, injected shellcode, and suspicious VADs.",
          },
        ],
        bestScenario: "Ideal for malware triage and process injection hunting.",
        category: "Malware Analysis",
      },
      {
        name: "vol windows.handles",
        syntax: "vol -f IMAGE windows.handles",
        description:
          "Enumerate open handles to files, registry keys, processes, and other kernel objects.",
        examples: [
          {
            code: "vol -f memory.raw windows.handles",
            note: "See what sensitive objects suspicious processes had open.",
          },
        ],
        bestScenario:
          "Useful when tracking process interaction with files, mutexes, or registry keys.",
        category: "Artifacts",
      },
      {
        name: "vol windows.registry.hivelist",
        syntax: "vol -f IMAGE windows.registry.hivelist",
        description: "List registry hives present in memory.",
        examples: [
          {
            code: "vol -f memory.raw windows.registry.hivelist",
            note: "Identify SYSTEM, SAM, SECURITY, and user hives before deeper registry work.",
          },
        ],
        bestScenario: "Run before targeted registry extraction or hash recovery.",
        category: "Registry",
      },
      {
        name: "vol windows.hashdump",
        syntax: "vol -f IMAGE windows.hashdump",
        description:
          "Extract local account password hashes from SAM and SYSTEM material present in memory.",
        examples: [
          {
            code: "vol -f memory.raw windows.hashdump",
            note: "Recover local account hashes directly from the memory image.",
          },
        ],
        bestScenario:
          "Useful when RAM capture contains the data needed for offline credential analysis.",
        category: "Credentials",
      },
    ],
    errors: [
      {
        message: "Unsatisfied requirement plugins.Info.kernel.layer_name",
        cause: "Volatility could not build the translation layer for the memory image.",
        fix: "Confirm the file path is correct, rerun windows.info first, and make sure the sample is a supported raw memory image.",
      },
      {
        message: "No suitable kernels found during pdbscan",
        cause:
          "The correct Windows symbols were not found locally or could not be generated from the image.",
        fix: "Install or refresh the Windows symbol pack, allow Volatility to cache symbols, and retry windows.info before running other plugins.",
      },
      {
        message: "Unable to validate the plugin requirements",
        cause:
          "A plugin-specific dependency such as symbols, a valid layer, or a required option is missing.",
        fix: "Read the plugin help with vol PLUGIN -h, supply any required flags such as --virtaddr, and confirm symbol resolution succeeded first.",
      },
    ],
  },
];
