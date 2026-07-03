import type { Command } from "./types";

export const DISTRO_EXTRA_COMMANDS: Record<string, Command[]> = {
  ubuntu: [
    {
      name: "apt-mark hold",
      syntax: "sudo apt-mark hold PKG...",
      description: "Prevent selected packages from being upgraded until the hold is cleared.",
      examples: [
        {
          code: "sudo apt-mark hold openssh-server",
          note: "Freeze a critical package during change control.",
        },
        { code: "apt-mark showhold", note: "Review packages currently pinned on hold." },
      ],
      bestScenario: "Temporarily blocking a risky package upgrade on a production Ubuntu host.",
      category: "Package Management",
    },
    {
      name: "apt-cache policy",
      syntax: "apt-cache policy [PKG]",
      description: "Show package candidate versions and which repositories provide them.",
      examples: [
        { code: "apt-cache policy nginx", note: "Compare installed and candidate nginx versions." },
        { code: "apt-cache policy", note: "Inspect repository priorities and pinning rules." },
      ],
      bestScenario:
        "Verifying whether a security fix is available from the configured Ubuntu repositories.",
      category: "Package Management",
    },
    {
      name: "groupadd",
      syntax: "sudo groupadd GROUP",
      description: "Create a new local Unix group.",
      examples: [
        { code: "sudo groupadd deploy", note: "Create a shared group for deployment access." },
      ],
      bestScenario: "Preparing least-privilege group assignments for a new service or admin team.",
      category: "User Management",
    },
    {
      name: "chage -l",
      syntax: "sudo chage -l USER",
      description: "Display password aging, expiry, and inactivity settings for a user.",
      examples: [
        { code: "sudo chage -l alice", note: "Audit whether Alice must rotate her password." },
      ],
      bestScenario: "Reviewing local account password expiration rules during a compliance check.",
      category: "User Management",
    },
    {
      name: "last -F",
      syntax: "last -F [USER]",
      description: "Show recent login history with full login and logout timestamps.",
      examples: [
        { code: "last -F root", note: "Review recent root logins with exact session times." },
      ],
      bestScenario: "Investigating when an administrator last accessed an Ubuntu server.",
      category: "User Management",
    },
    {
      name: "ip addr show",
      syntax: "ip addr show [DEV]",
      description: "Display IP addresses assigned to interfaces, including state and labels.",
      examples: [{ code: "ip addr show ens3", note: "Inspect the primary server interface." }],
      bestScenario: "Confirming interface addressing after a cloud networking or DHCP issue.",
      category: "Networking",
    },
    {
      name: "nmcli device status",
      syntax: "nmcli device status",
      description: "List devices known to NetworkManager and their current connection state.",
      examples: [
        {
          code: "nmcli device status",
          note: "Check whether Wi-Fi or Ethernet is managed and connected.",
        },
      ],
      bestScenario:
        "Troubleshooting laptop or desktop networking on NetworkManager-managed Ubuntu systems.",
      category: "Networking",
    },
    {
      name: "ss -tulpn",
      syntax: "sudo ss -tulpn",
      description: "List listening TCP and UDP sockets with owning processes.",
      examples: [
        { code: "sudo ss -tulpn | grep :22", note: "Confirm which process is listening on SSH." },
      ],
      bestScenario: "Checking exposed services before tightening firewall rules.",
      category: "Networking",
    },
    {
      name: "resolvectl status",
      syntax: "resolvectl status [LINK]",
      description:
        "Inspect DNS servers, search domains, and resolver status from systemd-resolved.",
      examples: [{ code: "resolvectl status", note: "Review the active DNS configuration." }],
      bestScenario: "Debugging split-DNS or resolver issues on modern Ubuntu releases.",
      category: "Networking",
    },
    {
      name: "ufw allow",
      syntax: "sudo ufw allow PORT[/PROTO]",
      description: "Permit inbound traffic through Ubuntu's uncomplicated firewall.",
      examples: [
        { code: "sudo ufw allow 22/tcp", note: "Permit SSH before enabling the firewall." },
      ],
      bestScenario: "Opening only the minimum ports required on a newly hardened Ubuntu host.",
      category: "Security",
    },
    {
      name: "ufw enable",
      syntax: "sudo ufw enable",
      description: "Enable the uncomplicated firewall and load the current rule set.",
      examples: [
        { code: "sudo ufw enable", note: "Turn on firewall enforcement after validating rules." },
      ],
      bestScenario: "Switching a server from permissive to enforced network filtering.",
      category: "Security",
    },
    {
      name: "systemctl mask",
      syntax: "sudo systemctl mask UNIT",
      description:
        "Completely prevent a service from being started, even manually or by dependencies.",
      examples: [
        {
          code: "sudo systemctl mask bluetooth.service",
          note: "Disable an unnecessary attack surface.",
        },
      ],
      bestScenario: "Hard-disabling unneeded services during server hardening.",
      category: "Services",
    },
    {
      name: "journalctl -u ssh",
      syntax: "sudo journalctl -u ssh --since 'today'",
      description: "Review logs for the OpenSSH service from the systemd journal.",
      examples: [
        {
          code: "sudo journalctl -u ssh --since '1 hour ago'",
          note: "Check recent authentication and daemon events.",
        },
      ],
      bestScenario: "Investigating failed logins or daemon restarts on an Ubuntu server.",
      category: "Services",
    },
    {
      name: "blkid",
      syntax: "sudo blkid [DEVICE]",
      description: "Show filesystem type, UUID, and labels for block devices.",
      examples: [
        { code: "sudo blkid /dev/sdb1", note: "Capture the UUID before editing /etc/fstab." },
      ],
      bestScenario: "Identifying the correct persistent identifier for a mount configuration.",
      category: "Storage",
    },
    {
      name: "fstrim -av",
      syntax: "sudo fstrim -av",
      description: "Discard unused blocks on all mounted filesystems that support trim.",
      examples: [{ code: "sudo fstrim -av", note: "Run a manual trim on SSD-backed filesystems." }],
      bestScenario: "Confirming trim works on SSD-based cloud or laptop installations.",
      category: "Storage",
    },
    {
      name: "pgrep -af",
      syntax: "pgrep -af PATTERN",
      description: "Search running processes and print matching PIDs with full command lines.",
      examples: [
        { code: "pgrep -af nginx", note: "See master and worker processes with arguments." },
      ],
      bestScenario: "Quickly locating a daemon before signaling or tracing it.",
      category: "Performance",
    },
    {
      name: "uname -r",
      syntax: "uname -r",
      description: "Print only the currently running kernel release.",
      examples: [
        { code: "uname -r", note: "Confirm whether the host is booted into the expected kernel." },
      ],
      bestScenario: "Verifying a kernel patch or livepatch prerequisite on Ubuntu.",
      category: "Kernel",
    },
  ],
  debian: [
    {
      name: "apt-mark showhold",
      syntax: "apt-mark showhold",
      description: "List packages currently placed on hold so they will not be upgraded.",
      examples: [
        {
          code: "apt-mark showhold",
          note: "Review intentionally pinned packages before a full upgrade.",
        },
      ],
      bestScenario: "Auditing why a Debian system is not taking selected package updates.",
      category: "Package Management",
    },
    {
      name: "apt-cache madison",
      syntax: "apt-cache madison PKG",
      description:
        "Show available package versions across configured repositories in a compact table.",
      examples: [
        {
          code: "apt-cache madison openssl",
          note: "Compare stable, security, and backports versions.",
        },
      ],
      bestScenario:
        "Determining which Debian archive contains the version you need to install or pin.",
      category: "Package Management",
    },
    {
      name: "dpkg-reconfigure",
      syntax: "sudo dpkg-reconfigure PKG",
      description: "Re-run a package's post-install configuration dialogs and maintainer scripts.",
      examples: [
        { code: "sudo dpkg-reconfigure tzdata", note: "Reset timezone configuration cleanly." },
      ],
      bestScenario: "Repairing or reapplying package configuration without reinstalling on Debian.",
      category: "Package Management",
    },
    {
      name: "userdel -r",
      syntax: "sudo userdel -r USER",
      description: "Delete a local user account and remove its home directory and mail spool.",
      examples: [
        {
          code: "sudo userdel -r contractor1",
          note: "Fully remove a departed contractor account.",
        },
      ],
      bestScenario: "Deprovisioning local accounts from a long-lived Debian server.",
      category: "User Management",
    },
    {
      name: "id",
      syntax: "id [USER]",
      description: "Show a user's UID, primary GID, and supplementary groups.",
      examples: [
        { code: "id www-data", note: "Confirm the effective identity of a service account." },
      ],
      bestScenario:
        "Checking exact numeric identity and group membership during permission troubleshooting.",
      category: "User Management",
    },
    {
      name: "who",
      syntax: "who",
      description: "List users currently logged into the system.",
      examples: [{ code: "who", note: "See who has active terminals or SSH sessions." }],
      bestScenario:
        "Quickly determining whether anyone is actively using a Debian host before maintenance.",
      category: "User Management",
    },
    {
      name: "ip -br addr",
      syntax: "ip -br addr",
      description: "Show a concise, one-line-per-interface summary of assigned IP addresses.",
      examples: [{ code: "ip -br addr", note: "Get a fast overview of all network interfaces." }],
      bestScenario:
        "Triage on minimal Debian systems where you want a compact networking snapshot.",
      category: "Networking",
    },
    {
      name: "ip route get",
      syntax: "ip route get DESTINATION",
      description:
        "Show which route and source address the kernel would use to reach a destination.",
      examples: [
        { code: "ip route get 8.8.8.8", note: "Verify the egress interface and chosen source IP." },
      ],
      bestScenario: "Debugging asymmetric routing or multi-homed server connectivity.",
      category: "Networking",
    },
    {
      name: "dig +short",
      syntax: "dig +short NAME [TYPE]",
      description: "Return only the answer section from a DNS lookup.",
      examples: [{ code: "dig +short debian.org A", note: "Get just the IPv4 addresses." }],
      bestScenario: "Fast DNS verification in shell scripts or incident response notes.",
      category: "Networking",
    },
    {
      name: "wget --mirror",
      syntax: "wget --mirror --convert-links URL",
      description:
        "Recursively mirror a site or directory tree while rewriting links for local browsing.",
      examples: [
        {
          code: "wget --mirror --convert-links https://intranet.example/",
          note: "Capture a static copy of an internal site.",
        },
      ],
      bestScenario:
        "Preserving a web resource for offline review from a Debian bastion or lab host.",
      category: "Networking",
    },
    {
      name: "systemctl disable --now",
      syntax: "sudo systemctl disable --now UNIT",
      description: "Stop a service immediately and prevent it from starting at boot.",
      examples: [
        {
          code: "sudo systemctl disable --now avahi-daemon.service",
          note: "Remove an unnecessary discovery service.",
        },
      ],
      bestScenario: "Reducing attack surface on a minimal Debian server.",
      category: "Services",
    },
    {
      name: "journalctl -u cron",
      syntax: "sudo journalctl -u cron --since 'today'",
      description: "Review cron daemon activity from the systemd journal.",
      examples: [
        {
          code: "sudo journalctl -u cron --since '6 hours ago'",
          note: "Inspect scheduled task execution and failures.",
        },
      ],
      bestScenario: "Troubleshooting missed scheduled jobs on Debian.",
      category: "Services",
    },
    {
      name: "iptables -L -n -v",
      syntax: "sudo iptables -L -n -v",
      description: "List IPv4 firewall rules with numeric addresses and packet counters.",
      examples: [
        {
          code: "sudo iptables -L -n -v",
          note: "Inspect current filter table rules and hit counts.",
        },
      ],
      bestScenario: "Auditing packet filtering on a Debian host that still uses iptables.",
      category: "Security",
    },
    {
      name: "fdisk -l",
      syntax: "sudo fdisk -l [DEVICE]",
      description: "Display partition tables for disks in a human-readable summary.",
      examples: [
        {
          code: "sudo fdisk -l /dev/sdb",
          note: "Review partition layout on a newly attached disk.",
        },
      ],
      bestScenario: "Validating disk geometry before resizing or migrating storage.",
      category: "Storage",
    },
    {
      name: "blkid",
      syntax: "sudo blkid [DEVICE]",
      description: "Print filesystem UUIDs and types for block devices.",
      examples: [
        { code: "sudo blkid", note: "Capture UUIDs for persistent mounts or recovery notes." },
      ],
      bestScenario: "Mapping Debian storage devices to stable identifiers for /etc/fstab.",
      category: "Storage",
    },
    {
      name: "vmstat 1 5",
      syntax: "vmstat 1 5",
      description: "Sample virtual memory, CPU, and IO activity every second for five intervals.",
      examples: [
        { code: "vmstat 1 5", note: "Spot run-queue pressure, swapping, or IO wait spikes." },
      ],
      bestScenario:
        "Quick performance triage on a Debian server without a heavier monitoring stack.",
      category: "Performance",
    },
    {
      name: "sysctl -a",
      syntax: "sysctl -a",
      description: "Dump kernel tunables and their current values.",
      examples: [
        {
          code: "sysctl -a | grep net.ipv4.ip_forward",
          note: "Check whether packet forwarding is enabled.",
        },
      ],
      bestScenario: "Reviewing kernel security and networking tunables during an audit.",
      category: "Kernel",
    },
    {
      name: "lsusb",
      syntax: "lsusb",
      description: "List connected USB devices detected by the kernel.",
      examples: [
        { code: "lsusb", note: "Confirm whether removable media or adapters are present." },
      ],
      bestScenario: "Identifying attached USB hardware on embedded or lab Debian systems.",
      category: "Kernel",
    },
  ],
  fedora: [
    {
      name: "dnf check-update",
      syntax: "dnf check-update",
      description: "Check whether package updates are available without performing an upgrade.",
      examples: [
        { code: "dnf check-update", note: "See pending advisories before a maintenance window." },
      ],
      bestScenario: "Reviewing Fedora updates before deciding whether to patch immediately.",
      category: "Package Management",
    },
    {
      name: "dnf repoquery --installed",
      syntax: "dnf repoquery --installed [PATTERN]",
      description: "Query installed packages with repoquery formatting and filtering.",
      examples: [
        {
          code: "dnf repoquery --installed 'kernel*'",
          note: "List installed kernel packages precisely.",
        },
      ],
      bestScenario: "Auditing installed RPM content using Fedora's newer DNF tooling.",
      category: "Package Management",
    },
    {
      name: "dnf distro-sync",
      syntax: "sudo dnf distro-sync",
      description:
        "Synchronize installed packages to the versions available from enabled repositories.",
      examples: [
        {
          code: "sudo dnf distro-sync",
          note: "Realign packages after mixing repos or failed updates.",
        },
      ],
      bestScenario: "Repairing package version drift on Fedora after repository changes.",
      category: "Package Management",
    },
    {
      name: "usermod -aG wheel",
      syntax: "sudo usermod -aG wheel USER",
      description: "Add a user to Fedora's standard administrative wheel group.",
      examples: [
        {
          code: "sudo usermod -aG wheel alice",
          note: "Grant sudo-capable admin access in the usual Fedora way.",
        },
      ],
      bestScenario: "Provisioning a new administrator on Fedora.",
      category: "User Management",
    },
    {
      name: "last -n 20",
      syntax: "last -n 20",
      description: "Show the 20 most recent login sessions.",
      examples: [{ code: "last -n 20", note: "Review who accessed the host most recently." }],
      bestScenario: "Checking recent access history during incident response.",
      category: "User Management",
    },
    {
      name: "nmcli connection show --active",
      syntax: "nmcli connection show --active",
      description: "Display currently active NetworkManager connections.",
      examples: [
        {
          code: "nmcli connection show --active",
          note: "Identify which profile is up on a workstation or server.",
        },
      ],
      bestScenario: "Verifying active connection profiles on a Fedora system using NetworkManager.",
      category: "Networking",
    },
    {
      name: "ss -tulpn",
      syntax: "sudo ss -tulpn",
      description: "Show listening sockets and the processes bound to them.",
      examples: [{ code: "sudo ss -tulpn | grep :443", note: "Check which daemon owns HTTPS." }],
      bestScenario: "Confirming exposed ports before or after firewalld changes.",
      category: "Networking",
    },
    {
      name: "firewall-cmd --list-all",
      syntax: "sudo firewall-cmd --list-all",
      description: "Show the active firewalld zone, services, ports, and rich rules.",
      examples: [
        {
          code: "sudo firewall-cmd --list-all",
          note: "Review the effective runtime firewall policy.",
        },
      ],
      bestScenario: "Auditing Fedora's default firewall posture on a server or workstation.",
      category: "Security",
    },
    {
      name: "firewall-cmd --add-service",
      syntax: "sudo firewall-cmd --add-service=SERVICE --permanent",
      description: "Permit a named service through firewalld and persist the rule across reboots.",
      examples: [
        {
          code: "sudo firewall-cmd --add-service=https --permanent && sudo firewall-cmd --reload",
          note: "Open HTTPS permanently.",
        },
      ],
      bestScenario: "Safely exposing a standard service using Fedora's zone-based firewall.",
      category: "Security",
    },
    {
      name: "sestatus",
      syntax: "sestatus",
      description: "Report SELinux mode, policy name, and other enforcement details.",
      examples: [{ code: "sestatus", note: "Check whether SELinux is enforcing on this host." }],
      bestScenario: "Determining whether SELinux should be part of a service troubleshooting path.",
      category: "Security",
    },
    {
      name: "getenforce",
      syntax: "getenforce",
      description: "Print the current SELinux enforcement mode.",
      examples: [
        {
          code: "getenforce",
          note: "Quickly see if SELinux is Enforcing, Permissive, or Disabled.",
        },
      ],
      bestScenario: "Fast SELinux state checks during remote troubleshooting.",
      category: "Security",
    },
    {
      name: "setenforce 0",
      syntax: "sudo setenforce 0",
      description:
        "Temporarily switch SELinux from enforcing to permissive mode until reboot or reset.",
      examples: [
        { code: "sudo setenforce 0", note: "Test whether SELinux is blocking an application." },
      ],
      bestScenario:
        "Narrowing down whether an access denial is SELinux-related before fixing policy properly.",
      category: "Security",
    },
    {
      name: "systemctl enable --now",
      syntax: "sudo systemctl enable --now UNIT",
      description: "Enable a service for boot and start it immediately.",
      examples: [
        {
          code: "sudo systemctl enable --now firewalld",
          note: "Ensure the firewall is active now and after reboot.",
        },
      ],
      bestScenario: "Persistently enabling critical services on Fedora.",
      category: "Services",
    },
    {
      name: "journalctl -u firewalld",
      syntax: "sudo journalctl -u firewalld --since 'today'",
      description: "Review firewalld service logs from the systemd journal.",
      examples: [
        {
          code: "sudo journalctl -u firewalld --since '2 hours ago'",
          note: "Inspect recent firewall reloads or failures.",
        },
      ],
      bestScenario: "Debugging why expected firewall changes are not taking effect on Fedora.",
      category: "Services",
    },
    {
      name: "lsblk -f",
      syntax: "lsblk -f",
      description: "Display block devices with filesystems, labels, and UUIDs.",
      examples: [{ code: "lsblk -f", note: "Map Fedora volumes before mounting or resizing." }],
      bestScenario: "Understanding storage layout before LUKS, LVM, or mount changes.",
      category: "Storage",
    },
    {
      name: "fstrim -av",
      syntax: "sudo fstrim -av",
      description: "Trim all mounted filesystems that support discard.",
      examples: [{ code: "sudo fstrim -av", note: "Confirm SSD trim activity across mounts." }],
      bestScenario: "Maintaining SSD-backed Fedora systems or VMs.",
      category: "Storage",
    },
    {
      name: "iostat -xz 1 3",
      syntax: "iostat -xz 1 3",
      description:
        "Sample extended CPU and block device IO statistics three times at one-second intervals.",
      examples: [
        { code: "iostat -xz 1 3", note: "Check whether storage latency is causing slowness." },
      ],
      bestScenario: "Investigating IO bottlenecks on a Fedora server.",
      category: "Performance",
    },
    {
      name: "lspci -nnk",
      syntax: "lspci -nnk",
      description: "List PCI devices with numeric IDs and kernel drivers in use.",
      examples: [
        {
          code: "lspci -nnk | grep -A3 -i ethernet",
          note: "Confirm the NIC driver bound to a device.",
        },
      ],
      bestScenario: "Troubleshooting hardware driver selection on Fedora.",
      category: "Kernel",
    },
  ],
  arch: [
    {
      name: "pacman -Fy",
      syntax: "sudo pacman -Fy",
      description: "Refresh the package file database used for file ownership lookups.",
      examples: [{ code: "sudo pacman -Fy", note: "Update file metadata before using pacman -F." }],
      bestScenario: "Preparing an Arch system to search which package provides a missing file.",
      category: "Package Management",
    },
    {
      name: "pacman -F",
      syntax: "pacman -F PATH",
      description: "Query which package in the sync databases owns a given file path.",
      examples: [
        { code: "pacman -F /usr/bin/ss", note: "Identify which package provides a needed binary." },
      ],
      bestScenario: "Resolving missing-command questions quickly on Arch.",
      category: "Package Management",
    },
    {
      name: "pacman -Ql",
      syntax: "pacman -Ql PKG",
      description: "List all files installed by a package.",
      examples: [
        { code: "pacman -Ql openssh", note: "Inspect package contents and config paths." },
      ],
      bestScenario: "Auditing where a package places binaries and configuration files.",
      category: "Package Management",
    },
    {
      name: "pacman -Qdt",
      syntax: "pacman -Qdt",
      description:
        "List orphaned packages that were installed as dependencies but are no longer required.",
      examples: [{ code: "pacman -Qdt", note: "Review package orphans before cleanup." }],
      bestScenario: "Cleaning up stale dependencies on a long-lived Arch install.",
      category: "Package Management",
    },
    {
      name: "pacman -U",
      syntax: "sudo pacman -U FILE.pkg.tar.zst",
      description: "Install a local package file directly.",
      examples: [
        {
          code: "sudo pacman -U ./custom-agent-1.0-1-x86_64.pkg.tar.zst",
          note: "Install a locally built or downloaded package.",
        },
      ],
      bestScenario: "Deploying a package built with makepkg or fetched from another source.",
      category: "Package Management",
    },
    {
      name: "makepkg -si",
      syntax: "makepkg -si",
      description: "Build a package from a PKGBUILD and install it with pacman.",
      examples: [
        {
          code: "makepkg -si",
          note: "Compile and install from a PKGBUILD in the current directory.",
        },
      ],
      bestScenario: "Building Arch or AUR packages from source in a controlled way.",
      category: "Package Management",
    },
    {
      name: "usermod -aG wheel",
      syntax: "sudo usermod -aG wheel USER",
      description: "Add a user to the wheel group commonly used for sudo access on Arch.",
      examples: [
        {
          code: "sudo usermod -aG wheel alice",
          note: "Grant admin rights after configuring sudoers.",
        },
      ],
      bestScenario: "Provisioning administrative access on a fresh Arch system.",
      category: "User Management",
    },
    {
      name: "ip -br addr",
      syntax: "ip -br addr",
      description: "Show a brief summary of network interfaces and their addresses.",
      examples: [{ code: "ip -br addr", note: "Get a compact view of interface state on Arch." }],
      bestScenario: "Fast networking checks on a minimal rolling-release install.",
      category: "Networking",
    },
    {
      name: "nmap -sn",
      syntax: "nmap -sn TARGET",
      description: "Perform a host discovery scan without probing ports.",
      examples: [
        { code: "nmap -sn 192.168.1.0/24", note: "Find live hosts on the local network." },
      ],
      bestScenario: "Quickly mapping reachable hosts from an Arch workstation or lab box.",
      category: "Networking",
    },
    {
      name: "systemctl --failed",
      syntax: "systemctl --failed",
      description: "List systemd units currently in the failed state.",
      examples: [
        {
          code: "systemctl --failed",
          note: "See which services or mounts need attention after boot.",
        },
      ],
      bestScenario: "Checking for breakage immediately after a rolling Arch update.",
      category: "Services",
    },
    {
      name: "journalctl -b -p warning",
      syntax: "journalctl -b -p warning",
      description: "Show warning-and-higher journal messages from the current boot.",
      examples: [
        {
          code: "journalctl -b -p warning",
          note: "Review boot-time warnings after kernel or package changes.",
        },
      ],
      bestScenario: "Catching regressions introduced by a recent Arch system upgrade.",
      category: "Services",
    },
    {
      name: "iptables -L -n -v",
      syntax: "sudo iptables -L -n -v",
      description: "Inspect packet-filter rules with counters and numeric addresses.",
      examples: [
        {
          code: "sudo iptables -L -n -v",
          note: "Audit firewall rules on a hand-configured Arch host.",
        },
      ],
      bestScenario: "Reviewing low-level firewall state when using iptables directly on Arch.",
      category: "Security",
    },
    {
      name: "parted -l",
      syntax: "sudo parted -l",
      description: "List disks, partition tables, and sizes using GNU Parted.",
      examples: [
        { code: "sudo parted -l", note: "Inspect GPT/MBR layouts before storage changes." },
      ],
      bestScenario: "Examining disk partitioning before manual Arch storage work.",
      category: "Storage",
    },
    {
      name: "mkfs.ext4",
      syntax: "sudo mkfs.ext4 DEVICE",
      description: "Create an ext4 filesystem on a block device or partition.",
      examples: [
        {
          code: "sudo mkfs.ext4 /dev/sdb1",
          note: "Format a newly created partition for Linux use.",
        },
      ],
      bestScenario: "Preparing fresh storage during an Arch install or server rebuild.",
      category: "Storage",
    },
    {
      name: "mpstat -P ALL 1 3",
      syntax: "mpstat -P ALL 1 3",
      description: "Sample per-CPU utilization three times at one-second intervals.",
      examples: [
        {
          code: "mpstat -P ALL 1 3",
          note: "Check whether load is concentrated on a subset of cores.",
        },
      ],
      bestScenario: "Diagnosing uneven CPU scheduling or hotspots on Arch.",
      category: "Performance",
    },
    {
      name: "pgrep -af",
      syntax: "pgrep -af PATTERN",
      description: "Find running processes by pattern and print their full command lines.",
      examples: [{ code: "pgrep -af pipewire", note: "Confirm active multimedia processes." }],
      bestScenario: "Locating daemons quickly before debugging or killing them.",
      category: "Performance",
    },
    {
      name: "sysctl -a",
      syntax: "sysctl -a",
      description: "Dump all kernel parameters and current values.",
      examples: [
        {
          code: "sysctl -a | grep kernel.unprivileged",
          note: "Review hardening-related kernel settings.",
        },
      ],
      bestScenario: "Auditing runtime kernel tunables on Arch.",
      category: "Kernel",
    },
    {
      name: "lsusb -t",
      syntax: "lsusb -t",
      description: "Show USB devices in a tree with driver bindings and bus speed.",
      examples: [
        { code: "lsusb -t", note: "Verify which driver and speed a USB adapter is using." },
      ],
      bestScenario: "Troubleshooting USB Wi-Fi adapters or storage devices on Arch.",
      category: "Kernel",
    },
  ],
  kali: [
    {
      name: "apt-cache policy",
      syntax: "apt-cache policy [PKG]",
      description: "Show installed and candidate versions for a package from Kali repositories.",
      examples: [
        {
          code: "apt-cache policy nmap",
          note: "Verify whether the expected Kali package version is available.",
        },
      ],
      bestScenario: "Checking whether a newer tool build has landed in kali-rolling.",
      category: "Package Management",
    },
    {
      name: "apt-mark hold",
      syntax: "sudo apt-mark hold PKG...",
      description: "Pin selected packages to their current version until manually unheld.",
      examples: [
        {
          code: "sudo apt-mark hold metasploit-framework",
          note: "Delay upgrades that could disrupt an engagement workflow.",
        },
      ],
      bestScenario: "Stabilizing a toolchain mid-assessment on a Kali workstation.",
      category: "Package Management",
    },
    {
      name: "dpkg -S",
      syntax: "dpkg -S PATH",
      description: "Identify which installed package owns a specific file.",
      examples: [
        {
          code: "dpkg -S /usr/bin/nmap",
          note: "Confirm which package delivered a binary on Kali.",
        },
      ],
      bestScenario: "Tracing a security tool or config file back to its owning package.",
      category: "Package Management",
    },
    {
      name: "chage -l",
      syntax: "sudo chage -l USER",
      description: "Display password aging and expiration settings for an account.",
      examples: [
        {
          code: "sudo chage -l kali",
          note: "Check whether the primary local user has password expiry configured.",
        },
      ],
      bestScenario: "Reviewing account hygiene on a shared lab or jump-box system.",
      category: "User Management",
    },
    {
      name: "id",
      syntax: "id [USER]",
      description: "Show numeric UID, GID, and group memberships for a user.",
      examples: [
        { code: "id kali", note: "Verify group-based access before using packet capture tools." },
      ],
      bestScenario: "Confirming whether a user has the privileges needed for a security task.",
      category: "User Management",
    },
    {
      name: "last -F",
      syntax: "last -F [USER]",
      description: "Show login history with full session timestamps.",
      examples: [
        { code: "last -F kali", note: "Review when the primary analyst account was used." },
      ],
      bestScenario: "Auditing access to a Kali box shared across a team or class.",
      category: "User Management",
    },
    {
      name: "ip addr show",
      syntax: "ip addr show [DEV]",
      description: "Display interface addresses and state in detail.",
      examples: [
        {
          code: "ip addr show wlan0",
          note: "Check whether the wireless interface has the expected IP.",
        },
      ],
      bestScenario: "Validating interface state before scans, pivots, or wireless operations.",
      category: "Networking",
    },
    {
      name: "ss -tulpn",
      syntax: "sudo ss -tulpn",
      description: "List listening sockets with associated processes.",
      examples: [
        {
          code: "sudo ss -tulpn | grep :9050",
          note: "Confirm which process is listening on a proxy or tunnel port.",
        },
      ],
      bestScenario: "Reviewing exposed listeners before tunneling or redirecting traffic.",
      category: "Networking",
    },
    {
      name: "nmap -sn",
      syntax: "nmap -sn TARGET",
      description: "Perform host discovery without port scanning.",
      examples: [
        { code: "nmap -sn 10.10.10.0/24", note: "Identify live hosts before deeper enumeration." },
      ],
      bestScenario:
        "Building a fast list of reachable systems at the start of an authorized engagement.",
      category: "Networking",
    },
    {
      name: "traceroute -n",
      syntax: "traceroute -n HOST",
      description: "Trace the network path to a host without doing reverse DNS lookups.",
      examples: [
        {
          code: "traceroute -n 10.0.0.1",
          note: "Quickly map the path to a target router or gateway.",
        },
      ],
      bestScenario: "Diagnosing where traffic is being filtered or redirected during a pivot.",
      category: "Networking",
    },
    {
      name: "systemctl status ssh",
      syntax: "systemctl status ssh",
      description: "Show detailed status for the OpenSSH service.",
      examples: [
        { code: "systemctl status ssh", note: "Confirm whether remote shell access is available." },
      ],
      bestScenario: "Checking whether a Kali jump host is ready for inbound SSH access.",
      category: "Services",
    },
    {
      name: "journalctl -u NetworkManager",
      syntax: "sudo journalctl -u NetworkManager --since 'today'",
      description: "Review NetworkManager logs from the journal.",
      examples: [
        {
          code: "sudo journalctl -u NetworkManager --since '30 minutes ago'",
          note: "Inspect wireless reconnects or DHCP failures.",
        },
      ],
      bestScenario: "Troubleshooting unstable interface management on a mobile Kali system.",
      category: "Services",
    },
    {
      name: "fail2ban-client status",
      syntax: "sudo fail2ban-client status [JAIL]",
      description: "Inspect fail2ban status globally or for a specific jail.",
      examples: [
        { code: "sudo fail2ban-client status sshd", note: "See currently banned IPs for SSH." },
      ],
      bestScenario: "Reviewing brute-force protection on a Kali box exposed for remote access.",
      category: "Security",
    },
    {
      name: "iptables -L -n -v",
      syntax: "sudo iptables -L -n -v",
      description: "List firewall rules and counters using numeric addresses.",
      examples: [
        {
          code: "sudo iptables -L -n -v",
          note: "Audit packet filtering before routing traffic through the host.",
        },
      ],
      bestScenario:
        "Checking whether firewall rules are interfering with tunnels, listeners, or reverse shells.",
      category: "Security",
    },
    {
      name: "lsblk -f",
      syntax: "lsblk -f",
      description: "Show block devices with filesystem metadata.",
      examples: [{ code: "lsblk -f", note: "Identify removable media or mounted evidence disks." }],
      bestScenario: "Cataloging attached storage during forensics or lab work.",
      category: "Storage",
    },
    {
      name: "mount -o ro,loop",
      syntax: "sudo mount -o ro,loop IMAGE MOUNTPOINT",
      description: "Mount a disk image read-only via a loop device.",
      examples: [
        {
          code: "sudo mount -o ro,loop suspect.img /mnt/evidence",
          note: "Inspect a disk image without modifying it.",
        },
      ],
      bestScenario: "Safely examining forensic images or offline filesystems on Kali.",
      category: "Storage",
    },
    {
      name: "pgrep -af",
      syntax: "pgrep -af PATTERN",
      description: "Find processes matching a pattern and show full command lines.",
      examples: [
        { code: "pgrep -af sshuttle", note: "Verify which tunnel processes are still running." },
      ],
      bestScenario: "Locating scanning or pivoting processes during a busy engagement.",
      category: "Performance",
    },
    {
      name: "uname -r",
      syntax: "uname -r",
      description: "Print the running kernel release only.",
      examples: [
        { code: "uname -r", note: "Check whether Kali is running the expected kernel build." },
      ],
      bestScenario: "Verifying kernel-dependent exploit lab prerequisites or driver compatibility.",
      category: "Kernel",
    },
  ],
  nixos: [
    {
      name: "nix search nixpkgs",
      syntax: "nix search nixpkgs QUERY",
      description: "Search nixpkgs for packages using the modern Nix CLI.",
      examples: [
        {
          code: "nix search nixpkgs ripgrep",
          note: "Find the attribute name for a package before installing it.",
        },
      ],
      bestScenario:
        "Discovering the exact attribute path to use in a NixOS config or profile command.",
      category: "Package Management",
    },
    {
      name: "nix profile install",
      syntax: "nix profile install nixpkgs#PKG",
      description: "Install a package into the current user's profile with the new CLI.",
      examples: [
        {
          code: "nix profile install nixpkgs#htop",
          note: "Add htop to your user environment without editing system config.",
        },
      ],
      bestScenario:
        "Giving a user a tool immediately while keeping the system declarative setup separate.",
      category: "Package Management",
    },
    {
      name: "nix profile list",
      syntax: "nix profile list",
      description: "List packages currently installed in the active user profile.",
      examples: [
        {
          code: "nix profile list",
          note: "Audit what has been installed imperatively for a user.",
        },
      ],
      bestScenario: "Reviewing profile drift before moving packages into declarative NixOS config.",
      category: "Package Management",
    },
    {
      name: "nix-store --gc",
      syntax: "nix-store --gc",
      description: "Garbage-collect unreachable paths from the Nix store.",
      examples: [
        {
          code: "sudo nix-store --gc",
          note: "Reclaim store space after old generations are unused.",
        },
      ],
      bestScenario: "Recovering disk space on a NixOS host with many old builds.",
      category: "Package Management",
    },
    {
      name: "nix-collect-garbage -d",
      syntax: "sudo nix-collect-garbage -d",
      description: "Delete old generations and then run garbage collection.",
      examples: [
        {
          code: "sudo nix-collect-garbage -d",
          note: "Aggressively clean old generations and unused store paths.",
        },
      ],
      bestScenario: "Performing a deeper cleanup after repeated NixOS rebuilds.",
      category: "Package Management",
    },
    {
      name: "nixos-rebuild boot",
      syntax: "sudo nixos-rebuild boot",
      description:
        "Build the new system configuration and add it to the bootloader without switching immediately.",
      examples: [
        {
          code: "sudo nixos-rebuild boot",
          note: "Stage a configuration for the next reboot only.",
        },
      ],
      bestScenario:
        "Preparing a cautious rollout where you want the new config applied on the next reboot.",
      category: "Services",
    },
    {
      name: "nixos-option",
      syntax: "nixos-option OPTION",
      description: "Show the evaluated value of a NixOS module option.",
      examples: [
        {
          code: "nixos-option services.openssh.enable",
          note: "Verify whether the SSH service is enabled in the current config.",
        },
      ],
      bestScenario:
        "Checking how declarative configuration was resolved without reading all imported modules.",
      category: "Services",
    },
    {
      name: "id",
      syntax: "id [USER]",
      description: "Show numeric UID, GID, and group memberships for a user.",
      examples: [
        {
          code: "id alice",
          note: "Confirm whether a user belongs to wheel or network-related groups.",
        },
      ],
      bestScenario: "Auditing the effective identity of a NixOS user or service account.",
      category: "User Management",
    },
    {
      name: "ip -br addr",
      syntax: "ip -br addr",
      description: "Show a concise interface and address summary.",
      examples: [
        { code: "ip -br addr", note: "Get a fast overview of addressing on all interfaces." },
      ],
      bestScenario: "Quick networking inspection on a declaratively managed NixOS host.",
      category: "Networking",
    },
    {
      name: "ss -tulpn",
      syntax: "sudo ss -tulpn",
      description: "List listening sockets and the owning processes.",
      examples: [
        { code: "sudo ss -tulpn", note: "See which services are actually bound after a rebuild." },
      ],
      bestScenario: "Verifying that declaratively enabled services are listening where expected.",
      category: "Networking",
    },
    {
      name: "resolvectl status",
      syntax: "resolvectl status [LINK]",
      description: "Inspect DNS resolver state when systemd-resolved is in use.",
      examples: [
        { code: "resolvectl status", note: "Check active DNS servers and search domains." },
      ],
      bestScenario: "Diagnosing resolver configuration on NixOS systems using systemd-resolved.",
      category: "Networking",
    },
    {
      name: "systemctl list-units --failed",
      syntax: "systemctl list-units --failed",
      description: "List failed systemd units.",
      examples: [
        {
          code: "systemctl list-units --failed",
          note: "Identify services or mounts that broke after a rebuild.",
        },
      ],
      bestScenario: "Finding exactly what failed after applying a new NixOS configuration.",
      category: "Services",
    },
    {
      name: "journalctl -u nix-daemon",
      syntax: "sudo journalctl -u nix-daemon --since 'today'",
      description: "Review logs for the Nix daemon service.",
      examples: [
        {
          code: "sudo journalctl -u nix-daemon --since '1 hour ago'",
          note: "Inspect recent build or store access failures.",
        },
      ],
      bestScenario: "Debugging package builds or store permission issues on multi-user NixOS.",
      category: "Services",
    },
    {
      name: "lsblk -f",
      syntax: "lsblk -f",
      description: "Show block devices with filesystem details, labels, and UUIDs.",
      examples: [
        {
          code: "lsblk -f",
          note: "Review mounted filesystems before changing hardware-configuration.nix.",
        },
      ],
      bestScenario: "Mapping disks and UUIDs before updating declarative mount configuration.",
      category: "Storage",
    },
    {
      name: "fstrim -av",
      syntax: "sudo fstrim -av",
      description: "Trim all mounted filesystems that support discard.",
      examples: [
        { code: "sudo fstrim -av", note: "Run a manual trim across SSD-backed filesystems." },
      ],
      bestScenario: "Maintaining SSD health on laptops and servers running NixOS.",
      category: "Storage",
    },
    {
      name: "lscpu",
      syntax: "lscpu",
      description: "Display CPU architecture, topology, and virtualization capabilities.",
      examples: [
        {
          code: "lscpu",
          note: "Check core count and virtualization flags before tuning workloads.",
        },
      ],
      bestScenario: "Understanding hardware characteristics before optimizing a NixOS deployment.",
      category: "Performance",
    },
    {
      name: "sysctl -a",
      syntax: "sysctl -a",
      description: "Dump all current kernel parameters and values.",
      examples: [
        {
          code: "sysctl -a | grep vm.swappiness",
          note: "Audit runtime kernel tuning against declarative expectations.",
        },
      ],
      bestScenario: "Comparing live kernel settings with what a NixOS module intended to enforce.",
      category: "Kernel",
    },
    {
      name: "nix-store --verify --check-contents",
      syntax: "sudo nix-store --verify --check-contents",
      description:
        "Verify store path metadata and contents for corruption or unexpected modification.",
      examples: [
        {
          code: "sudo nix-store --verify --check-contents",
          note: "Validate store integrity after disk or power issues.",
        },
      ],
      bestScenario:
        "Checking whether a NixOS system's immutable store contents remain trustworthy.",
      category: "Kernel",
    },
  ],
};
