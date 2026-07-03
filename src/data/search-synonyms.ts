// Intent → canonical keyword expansion for the search bar.
// Each key is a natural-language intent phrase; the values are terms that
// should also be searched. The search page uses this to expand the user's
// query before hitting the fuzzy index.

export const SYNONYMS: Record<string, string[]> = {
  // Wireless
  "crack wifi": ["wpa2", "handshake", "hashcat", "aircrack", "airodump", "pmkid", "wpa"],
  "hack wifi": ["wpa2", "aircrack", "wifite", "reaver", "pmkid", "handshake", "deauth"],
  "wifi password": ["wpa2", "hashcat", "aircrack", "wpa", "handshake"],
  "wireless attack": ["aircrack", "wifite", "kismet", "bettercap", "mdk4", "reaver", "pixiewps"],
  "deauth": ["aireplay", "mdk4", "wifite"],
  "evil twin": ["wifiphisher", "hostapd", "airgeddon"],

  // Web
  "sqli": ["sqlmap", "sql injection", "bbqsql"],
  "sql injection": ["sqlmap", "bbqsql", "sqli"],
  "hack website": ["burpsuite", "sqlmap", "nikto", "gobuster", "ffuf", "wpscan"],
  "xss": ["dalfox", "xsser", "burpsuite", "reflected", "stored"],
  "cross site scripting": ["dalfox", "xsser", "xss"],
  "csrf": ["burpsuite"],
  "ssrf": ["burpsuite", "imds", "metadata"],
  "file upload": ["burpsuite", "weevely", "shell"],
  "web shell": ["weevely", "shell"],
  "lfi": ["lfi", "burpsuite", "ffuf", "log poisoning"],
  "rfi": ["lfi", "rfi", "burpsuite"],
  "directory brute": ["gobuster", "ffuf", "dirb", "dirbuster", "feroxbuster"],
  "content discovery": ["gobuster", "ffuf", "dirbuster", "kiterunner"],
  "wordpress": ["wpscan", "cmsmap"],
  "cms scan": ["wpscan", "joomscan", "droopescan", "cmsmap"],
  "waf detection": ["wafw00f"],
  "tech stack": ["whatweb", "wappalyzer"],
  "jwt": ["jwt_tool"],
  "log4shell": ["log4j", "log4shell", "jndi"],

  // Network / recon
  "find open ports": ["nmap", "masscan", "rustscan"],
  "port scan": ["nmap", "masscan", "rustscan"],
  "scan network": ["nmap", "masscan", "netdiscover", "arp-scan", "fping"],
  "host discovery": ["nmap", "netdiscover", "fping", "arping"],
  "subdomain enumeration": ["subfinder", "assetfinder", "amass", "dnsrecon", "dnsenum", "fierce"],
  "dns enumeration": ["dnsrecon", "dnsenum", "dnsmap", "fierce"],
  "smb enumeration": ["enum4linux", "smbmap", "smbclient", "nxc", "crackmapexec", "rpcclient"],
  "snmp": ["onesixtyone", "snmpwalk", "snmp-check"],
  "ldap": ["ldapsearch", "windapsearch"],
  "banner grab": ["nmap", "whatweb", "curl", "nc"],

  // AD
  "active directory": ["bloodhound", "nxc", "crackmapexec", "impacket", "kerbrute", "responder", "mimikatz"],
  "kerberoast": ["impacket", "hashcat", "GetUserSPNs", "kerberos"],
  "asrep roast": ["impacket", "hashcat", "GetNPUsers"],
  "dcsync": ["impacket", "secretsdump", "mimikatz"],
  "pass the hash": ["impacket", "nxc", "crackmapexec"],
  "ntlm relay": ["responder", "impacket", "ntlmrelayx"],
  "llmnr poisoning": ["responder", "mitm6"],
  "bloodhound": ["bloodhound", "sharphound"],

  // Passwords
  "crack password": ["hashcat", "john", "hash-identifier"],
  "brute force ssh": ["hydra", "ncrack", "medusa"],
  "brute force login": ["hydra", "ncrack", "medusa", "burpsuite"],
  "crack hash": ["hashcat", "john", "hash-identifier"],
  "identify hash": ["hash-identifier", "hashid"],
  "wordlist": ["cewl", "crunch", "cupp", "rockyou"],
  "rockyou": ["wordlists", "rockyou"],

  // Exploitation
  "eternalblue": ["ms17-010", "metasploit", "nmap"],
  "reverse shell": ["msfvenom", "metasploit", "nc", "socat"],
  "exploit windows": ["metasploit", "msfvenom", "impacket"],
  "exploit linux": ["metasploit", "linpeas", "dirtypipe", "pwnkit"],
  "payload": ["msfvenom", "msfpc", "veil", "shellter"],
  "av evasion": ["veil", "shellter", "msfvenom"],
  "router exploit": ["routersploit"],
  "search exploit": ["searchsploit", "exploitdb"],

  // Privesc
  "linux privesc": ["linpeas", "linenum", "unix-privesc-check", "dirtypipe", "pwnkit"],
  "windows privesc": ["winpeas", "powersploit", "watson"],
  "escalate privileges": ["linpeas", "winpeas", "sudo", "suid", "getcap"],
  "suid": ["find", "gtfobins"],
  "sudo abuse": ["sudo -l", "gtfobins"],
  "kernel exploit": ["dirtypipe", "pwnkit", "searchsploit"],

  // Post
  "dump credentials linux": ["mimipenguin", "linpeas"],
  "dump credentials windows": ["mimikatz", "secretsdump", "lsass"],
  "lsass": ["mimikatz", "procdump", "pypykatz"],
  "pivoting": ["chisel", "ligolo-ng", "sshuttle", "proxychains4"],
  "tunneling": ["chisel", "ssh", "sshuttle", "ligolo-ng"],
  "persistence": ["cron", "systemd", "empire", "powersploit"],

  // Sniffing
  "sniff traffic": ["wireshark", "tcpdump", "tshark", "bettercap"],
  "mitm": ["bettercap", "ettercap", "mitmproxy", "responder"],
  "arp spoof": ["bettercap", "ettercap", "arpspoof"],
  "packet capture": ["wireshark", "tcpdump", "tshark"],

  // Forensics
  "recover deleted files": ["foremost", "scalpel", "photorec", "testdisk"],
  "file carving": ["foremost", "scalpel", "bulk_extractor"],
  "memory analysis": ["volatility", "bulk_extractor"],
  "disk image": ["dd", "dcfldd", "ddrescue", "guymager", "ewfacquire"],
  "metadata": ["exiftool"],

  // Reversing
  "reverse engineer": ["ghidra", "radare2", "cutter", "ida", "gdb", "objdump"],
  "decompile android": ["jadx", "apktool", "dex2jar", "jd-gui"],
  "debug binary": ["gdb", "edb-debugger", "strace", "ltrace"],

  // Social eng / phishing
  "phishing": ["gophish", "evilginx2", "king-phisher", "setoolkit", "wifiphisher"],
  "credential harvest": ["evilginx2", "setoolkit", "gophish"],

  // Misc / vague
  "what is running": ["ps", "top", "htop", "systemctl", "ss"],
  "listening ports": ["ss", "netstat", "lsof"],
  "block ip": ["iptables", "nftables", "ufw", "firewalld"],
  "firewall": ["iptables", "nftables", "ufw", "firewalld"],
  "disk full": ["df", "du", "ncdu"],
  "install package": ["apt", "dnf", "pacman", "zypper", "apk"],
};

// Return the set of expansion terms for a raw query.
// Matches exact intents (case-insensitive) and also substring intents so
// "how do I crack wifi WPA" still triggers the "crack wifi" bucket.
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
  // Also add every whitespace-separated token so multi-word queries still hit.
  for (const tok of needle.split(/\s+/)) if (tok.length > 2) out.add(tok);
  return [...out];
}

// Fuzzy suggestion when nothing matches — return the nearest intent phrases.
export function nearestIntents(q: string, limit = 5): string[] {
  const needle = q.toLowerCase();
  const scored = Object.keys(SYNONYMS)
    .map((intent) => {
      const tokens = needle.split(/\s+/).filter(Boolean);
      const score = tokens.reduce((acc, t) => acc + (intent.includes(t) ? t.length : 0), 0);
      return { intent, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.intent);
}
