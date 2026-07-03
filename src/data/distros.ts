import type { Distro, Command, KnownError } from "./types";
import { CORE_COMMANDS, CORE_ERRORS } from "./common-commands";

// Package-manager and distro-specific commands merged with CORE_COMMANDS per distro.

const APT: Command[] = [
  { name: "apt update", syntax: "sudo apt update", description: "Refresh package index from configured repositories.", examples: [{ code: "sudo apt update", note: "Run before install/upgrade." }], bestScenario: "Always run before installing or upgrading packages.", category: "Package Manager" },
  { name: "apt upgrade", syntax: "sudo apt upgrade [-y]", description: "Upgrade installed packages to newer versions.", examples: [{ code: "sudo apt upgrade -y", note: "Non-interactive upgrade." }], bestScenario: "Routine patching.", category: "Package Manager" },
  { name: "apt full-upgrade", syntax: "sudo apt full-upgrade", description: "Upgrade with dependency changes (removes/installs as needed).", examples: [{ code: "sudo apt full-upgrade", note: "Handles distro upgrades better." }], bestScenario: "Major version bumps where dependencies shift.", category: "Package Manager" },
  { name: "apt install", syntax: "sudo apt install PKG...", description: "Install one or more packages.", examples: [{ code: "sudo apt install nginx", note: "Install nginx." }], bestScenario: "Install new software from repos.", category: "Package Manager" },
  { name: "apt remove", syntax: "sudo apt remove PKG", description: "Remove a package (keeps config).", examples: [{ code: "sudo apt remove nginx", note: "Leaves /etc/nginx." }], bestScenario: "Uninstall while preserving config.", category: "Package Manager" },
  { name: "apt purge", syntax: "sudo apt purge PKG", description: "Remove a package and its config files.", examples: [{ code: "sudo apt purge nginx", note: "Full removal." }], bestScenario: "Clean removal before reinstalling.", category: "Package Manager" },
  { name: "apt autoremove", syntax: "sudo apt autoremove", description: "Remove packages installed as dependencies but no longer needed.", examples: [{ code: "sudo apt autoremove", note: "Free space." }], bestScenario: "Clean up after removing packages.", category: "Package Manager" },
  { name: "apt search", syntax: "apt search TERM", description: "Search available packages by name/description.", examples: [{ code: "apt search fuzzy finder", note: "Find packages." }], bestScenario: "Discover packages by keyword.", category: "Package Manager" },
  { name: "apt show", syntax: "apt show PKG", description: "Show detailed info about a package.", examples: [{ code: "apt show curl", note: "Version, deps, size." }], bestScenario: "Inspect package metadata.", category: "Package Manager" },
  { name: "apt list --installed", syntax: "apt list --installed", description: "List installed packages.", examples: [{ code: "apt list --installed | grep nginx", note: "See if installed." }], bestScenario: "Audit what is installed.", category: "Package Manager" },
  { name: "dpkg -i", syntax: "sudo dpkg -i FILE.deb", description: "Install a local .deb package.", examples: [{ code: "sudo dpkg -i pkg.deb && sudo apt -f install", note: "Install and resolve deps." }], bestScenario: "Install a downloaded .deb.", category: "Package Manager" },
  { name: "dpkg -l", syntax: "dpkg -l [PATTERN]", description: "List installed packages via dpkg.", examples: [{ code: "dpkg -l | grep ^ii", note: "Only installed." }], bestScenario: "Lower-level install audit.", category: "Package Manager" },
  { name: "add-apt-repository", syntax: "sudo add-apt-repository ppa:...", description: "Add an APT repository or PPA.", examples: [{ code: "sudo add-apt-repository ppa:deadsnakes/ppa", note: "Add PPA for newer Pythons." }], bestScenario: "Enable third-party repos.", category: "Package Manager" },
];

const DNF: Command[] = [
  { name: "dnf install", syntax: "sudo dnf install PKG", description: "Install packages.", examples: [{ code: "sudo dnf install httpd", note: "Install apache." }], bestScenario: "Add packages on RHEL/Fedora family.", category: "Package Manager" },
  { name: "dnf remove", syntax: "sudo dnf remove PKG", description: "Remove packages.", examples: [{ code: "sudo dnf remove httpd", note: "Uninstall." }], bestScenario: "Remove packages cleanly.", category: "Package Manager" },
  { name: "dnf upgrade", syntax: "sudo dnf upgrade", description: "Upgrade all packages.", examples: [{ code: "sudo dnf upgrade -y", note: "Patch." }], bestScenario: "Routine updates.", category: "Package Manager" },
  { name: "dnf search", syntax: "dnf search TERM", description: "Search available packages.", examples: [{ code: "dnf search neovim", note: "Find package." }], bestScenario: "Discover packages.", category: "Package Manager" },
  { name: "dnf info", syntax: "dnf info PKG", description: "Show package metadata.", examples: [{ code: "dnf info httpd", note: "Version, repo, size." }], bestScenario: "Inspect metadata.", category: "Package Manager" },
  { name: "dnf list installed", syntax: "dnf list installed", description: "List installed packages.", examples: [{ code: "dnf list installed | grep nginx", note: "Check install." }], bestScenario: "Audit installed packages.", category: "Package Manager" },
  { name: "dnf group install", syntax: "sudo dnf group install NAME", description: "Install a package group.", examples: [{ code: "sudo dnf group install 'Development Tools'", note: "Compiler toolchain." }], bestScenario: "Set up common role in one shot.", category: "Package Manager" },
  { name: "dnf history", syntax: "dnf history", description: "Show transaction history.", examples: [{ code: "sudo dnf history undo 42", note: "Undo transaction 42." }], bestScenario: "Roll back an update.", category: "Package Manager" },
  { name: "rpm -qa", syntax: "rpm -qa [PATTERN]", description: "Query all installed RPMs.", examples: [{ code: "rpm -qa | grep kernel", note: "List kernels." }], bestScenario: "Lower-level package audit.", category: "Package Manager" },
  { name: "rpm -ivh", syntax: "sudo rpm -ivh FILE.rpm", description: "Install an RPM file.", examples: [{ code: "sudo rpm -ivh pkg.rpm", note: "Verbose install with progress." }], bestScenario: "Install a local RPM.", category: "Package Manager" },
];

const PACMAN: Command[] = [
  { name: "pacman -Syu", syntax: "sudo pacman -Syu", description: "Sync repos and upgrade the whole system.", examples: [{ code: "sudo pacman -Syu", note: "Rolling update." }], bestScenario: "Keep an Arch system current.", category: "Package Manager" },
  { name: "pacman -S", syntax: "sudo pacman -S PKG", description: "Install packages from repos.", examples: [{ code: "sudo pacman -S neovim", note: "Install." }], bestScenario: "Install software.", category: "Package Manager" },
  { name: "pacman -R", syntax: "sudo pacman -R PKG", description: "Remove packages.", examples: [{ code: "sudo pacman -Rns nginx", note: "Remove with deps and config." }], bestScenario: "Cleanly remove software.", category: "Package Manager" },
  { name: "pacman -Ss", syntax: "pacman -Ss TERM", description: "Search sync databases.", examples: [{ code: "pacman -Ss ripgrep", note: "Search." }], bestScenario: "Discover packages.", category: "Package Manager" },
  { name: "pacman -Qi", syntax: "pacman -Qi PKG", description: "Query installed package info.", examples: [{ code: "pacman -Qi glibc", note: "Version and deps." }], bestScenario: "Inspect installed package.", category: "Package Manager" },
  { name: "pacman -Qs", syntax: "pacman -Qs TERM", description: "Search installed packages.", examples: [{ code: "pacman -Qs python", note: "Find installed Python packages." }], bestScenario: "Local search.", category: "Package Manager" },
  { name: "pacman -Sc", syntax: "sudo pacman -Sc", description: "Clean the package cache.", examples: [{ code: "sudo pacman -Sc", note: "Remove old packages." }], bestScenario: "Reclaim disk.", category: "Package Manager" },
  { name: "yay -S", syntax: "yay -S PKG", description: "Install from repos or the AUR (helper).", examples: [{ code: "yay -S google-chrome", note: "AUR install." }], bestScenario: "Convenient AUR access when yay is installed.", category: "Package Manager" },
];

const ZYPPER: Command[] = [
  { name: "zypper refresh", syntax: "sudo zypper refresh", description: "Refresh repositories.", examples: [{ code: "sudo zypper refresh", note: "Update indexes." }], bestScenario: "Before install/update.", category: "Package Manager" },
  { name: "zypper install", syntax: "sudo zypper install PKG", description: "Install packages.", examples: [{ code: "sudo zypper in vim", note: "Install vim." }], bestScenario: "Add software.", category: "Package Manager" },
  { name: "zypper remove", syntax: "sudo zypper remove PKG", description: "Remove packages.", examples: [{ code: "sudo zypper rm vim", note: "Uninstall." }], bestScenario: "Remove software.", category: "Package Manager" },
  { name: "zypper update", syntax: "sudo zypper update", description: "Update installed packages.", examples: [{ code: "sudo zypper up -y", note: "Patch." }], bestScenario: "Routine updates on Leap.", category: "Package Manager" },
  { name: "zypper dup", syntax: "sudo zypper dup", description: "Distribution upgrade (Tumbleweed).", examples: [{ code: "sudo zypper dup", note: "Rolling upgrade." }], bestScenario: "Tumbleweed rolling releases.", category: "Package Manager" },
  { name: "zypper search", syntax: "zypper search TERM", description: "Search packages.", examples: [{ code: "zypper se nginx", note: "Find nginx." }], bestScenario: "Discover packages.", category: "Package Manager" },
  { name: "zypper info", syntax: "zypper info PKG", description: "Show package details.", examples: [{ code: "zypper info nginx", note: "Details." }], bestScenario: "Inspect package.", category: "Package Manager" },
];

const APK: Command[] = [
  { name: "apk update", syntax: "sudo apk update", description: "Update package index.", examples: [{ code: "sudo apk update", note: "Refresh." }], bestScenario: "Before install.", category: "Package Manager" },
  { name: "apk add", syntax: "sudo apk add PKG", description: "Install packages.", examples: [{ code: "sudo apk add curl bash", note: "Install multiple." }], bestScenario: "Add software (also inside Docker images).", category: "Package Manager" },
  { name: "apk del", syntax: "sudo apk del PKG", description: "Remove packages.", examples: [{ code: "sudo apk del curl", note: "Uninstall." }], bestScenario: "Remove software.", category: "Package Manager" },
  { name: "apk upgrade", syntax: "sudo apk upgrade", description: "Upgrade all packages.", examples: [{ code: "sudo apk upgrade", note: "Patch." }], bestScenario: "Routine updates.", category: "Package Manager" },
  { name: "apk search", syntax: "apk search TERM", description: "Search packages.", examples: [{ code: "apk search openssl", note: "Find package." }], bestScenario: "Discover packages.", category: "Package Manager" },
  { name: "apk info", syntax: "apk info PKG", description: "Show package info.", examples: [{ code: "apk info -a musl", note: "Full details." }], bestScenario: "Inspect package.", category: "Package Manager" },
  { name: "rc-service", syntax: "rc-service NAME start|stop|restart", description: "OpenRC service control.", examples: [{ code: "sudo rc-service nginx start", note: "Start nginx." }], bestScenario: "Alpine uses OpenRC, not systemd.", category: "System" },
  { name: "rc-update", syntax: "rc-update add NAME LEVEL", description: "Enable service at boot.", examples: [{ code: "sudo rc-update add nginx default", note: "Enable at boot." }], bestScenario: "Persist service enablement.", category: "System" },
];

const EMERGE: Command[] = [
  { name: "emerge --sync", syntax: "sudo emerge --sync", description: "Sync the Portage tree.", examples: [{ code: "sudo emerge --sync", note: "Update ebuilds." }], bestScenario: "Before installs/upgrades.", category: "Package Manager" },
  { name: "emerge PKG", syntax: "sudo emerge PKG", description: "Install (compile) a package.", examples: [{ code: "sudo emerge app-editors/vim", note: "Build vim." }], bestScenario: "Install software from source.", category: "Package Manager" },
  { name: "emerge -uDN @world", syntax: "sudo emerge -uDN @world", description: "Update world set, following new use flags.", examples: [{ code: "sudo emerge -uDN @world", note: "Standard upgrade." }], bestScenario: "Routine Gentoo upgrades.", category: "Package Manager" },
  { name: "emerge --depclean", syntax: "sudo emerge --depclean", description: "Remove orphaned packages.", examples: [{ code: "sudo emerge --depclean -p", note: "Preview first." }], bestScenario: "Reclaim space after removals.", category: "Package Manager" },
  { name: "eselect", syntax: "sudo eselect MODULE ACTION", description: "Manage Gentoo alternatives (java, python, kernel).", examples: [{ code: "sudo eselect python list", note: "List available Pythons." }], bestScenario: "Switch active alternative.", category: "System" },
];

const SLACKPKG: Command[] = [
  { name: "slackpkg update", syntax: "sudo slackpkg update", description: "Update package lists.", examples: [{ code: "sudo slackpkg update", note: "Refresh." }], bestScenario: "Before install/upgrade.", category: "Package Manager" },
  { name: "slackpkg install", syntax: "sudo slackpkg install PKG", description: "Install packages.", examples: [{ code: "sudo slackpkg install vim", note: "Install." }], bestScenario: "Add packages.", category: "Package Manager" },
  { name: "slackpkg upgrade-all", syntax: "sudo slackpkg upgrade-all", description: "Upgrade the whole system.", examples: [{ code: "sudo slackpkg upgrade-all", note: "System upgrade." }], bestScenario: "Full system update.", category: "Package Manager" },
  { name: "installpkg", syntax: "sudo installpkg FILE.tgz", description: "Install a Slackware package tarball.", examples: [{ code: "sudo installpkg pkg.tgz", note: "Install local package." }], bestScenario: "Install a downloaded Slackware package.", category: "Package Manager" },
];

const NIX: Command[] = [
  { name: "nixos-rebuild switch", syntax: "sudo nixos-rebuild switch", description: "Build the configuration and activate it.", examples: [{ code: "sudo nixos-rebuild switch", note: "Apply /etc/nixos/configuration.nix." }], bestScenario: "Apply system config changes.", category: "System" },
  { name: "nixos-rebuild test", syntax: "sudo nixos-rebuild test", description: "Build and activate without adding to boot menu.", examples: [{ code: "sudo nixos-rebuild test", note: "Trial run." }], bestScenario: "Test changes without persistence.", category: "System" },
  { name: "nix-channel --update", syntax: "sudo nix-channel --update", description: "Update Nix channels.", examples: [{ code: "sudo nix-channel --update", note: "Fetch new nixpkgs." }], bestScenario: "Before an upgrade.", category: "Package Manager" },
  { name: "nix-env -iA", syntax: "nix-env -iA nixpkgs.PKG", description: "Install a user profile package.", examples: [{ code: "nix-env -iA nixpkgs.ripgrep", note: "Install ripgrep." }], bestScenario: "Per-user installs.", category: "Package Manager" },
  { name: "nix-shell", syntax: "nix-shell -p PKG...", description: "Ephemeral shell with packages available.", examples: [{ code: "nix-shell -p nodejs cowsay", note: "Temporary env." }], bestScenario: "Try software without installing.", category: "Package Manager" },
  { name: "nix flake", syntax: "nix flake COMMAND", description: "Work with flakes (modern Nix).", examples: [{ code: "nix flake update", note: "Update flake inputs." }], bestScenario: "Reproducible flake-based projects.", category: "Package Manager" },
];

// ---------------- distros ----------------

const distro = (
  slug: string,
  name: string,
  family: Distro["family"],
  developer: string,
  firstReleased: string,
  summary: string,
  bestUseCases: string[],
  whenToUse: string[],
  whenNotToUse: string[],
  packageManager: string,
  extraCommands: Command[],
  extraErrors: KnownError[],
  init = "systemd",
  defaultShell = "bash",
): Distro => ({
  slug, name, family, developer, firstReleased, summary,
  bestUseCases, whenToUse, whenNotToUse, packageManager, defaultShell, init,
  commands: [...extraCommands, ...CORE_COMMANDS],
  errors: [...extraErrors, ...CORE_ERRORS],
});

export const DISTROS: Distro[] = [
  distro("ubuntu", "Ubuntu", "debian", "Canonical", "2004-10-20",
    "The most widely deployed Linux distribution, based on Debian, with a six-month release cadence and 5-year LTS releases.",
    ["Cloud servers", "Developer laptops", "CI runners", "Containers", "Home servers"],
    ["You want broad hardware/software support with strong community docs.", "You need long-term support on servers (Ubuntu LTS)."],
    ["You need a fully free distro with no proprietary blobs (see Debian or Trisquel).", "You want a minimal container base image (use Alpine)."],
    "apt", APT, [
      { message: "E: Could not get lock /var/lib/dpkg/lock-frontend", cause: "Another apt/unattended-upgrades process is running.", fix: "Wait for it, or find and stop it: sudo lsof /var/lib/dpkg/lock-frontend then kill the PID." },
      { message: "The following packages have unmet dependencies", cause: "A package requires a version not currently available or held.", fix: "Try sudo apt --fix-broken install, or sudo apt install <pkg>=<version>." },
    ]),
  distro("debian", "Debian", "debian", "Debian Project", "1993-09-15",
    "The universal operating system. Deeply stable, community-run, and the ancestor of Ubuntu, Kali, and many others.",
    ["Servers requiring rock-solid stability", "Long-lived embedded systems", "Reproducible workstation setups"],
    ["You prioritize stability over the newest versions.", "You want a fully community-governed distro."],
    ["You need bleeding-edge packages (use Arch or Fedora).", "You want a beginner-friendly desktop out of the box (use Ubuntu or Mint)."],
    "apt", APT, [
      { message: "E: Unable to locate package", cause: "Repositories missing the section or not refreshed.", fix: "Enable contrib/non-free in /etc/apt/sources.list, then sudo apt update." },
    ]),
  distro("fedora", "Fedora", "rhel", "Red Hat / Fedora Project", "2003-11-06",
    "Community-driven, leading-edge distro sponsored by Red Hat. Fedora is where new tech (Wayland, PipeWire, systemd) ships first.",
    ["Developer workstations", "Testing upcoming RHEL features"],
    ["You want modern kernel and toolchains with SELinux enabled by default."],
    ["You want long-term support without upgrades (use RHEL/Rocky/Alma)."],
    "dnf", DNF, [
      { message: "Error: Transaction test error: file conflicts", cause: "Two packages provide the same file, or a package's old version wasn't cleaned.", fix: "Run sudo dnf clean all and sudo dnf upgrade; if persistent, use rpm -e --nodeps carefully or dnf reinstall." },
    ]),
  distro("rhel", "Red Hat Enterprise Linux (RHEL)", "rhel", "Red Hat (IBM)", "2000-02-22",
    "Commercial enterprise Linux with paid support and a 10-year lifecycle. Certified for enterprise hardware and ISV software.",
    ["Regulated enterprise servers", "SAP, Oracle, and enterprise Java workloads", "Long-lived production environments"],
    ["You require vendor-backed support and certifications (FIPS, Common Criteria)."],
    ["You want free-of-charge enterprise use at scale (use Rocky/Alma)."],
    "dnf", DNF, [
      { message: "This system is not registered with an entitlement server", cause: "Subscription-manager has no active subscription attached.", fix: "Run sudo subscription-manager register --username=... then sudo subscription-manager attach --auto." },
    ]),
  distro("rocky", "Rocky Linux", "rhel", "Rocky Enterprise Software Foundation", "2021-06-21",
    "Community-driven, 1:1 binary-compatible rebuild of RHEL. Created after CentOS Linux was discontinued.",
    ["Free enterprise servers", "CentOS Linux migrations"],
    ["You want RHEL behavior without a subscription."],
    ["You need paid vendor support (use RHEL)."],
    "dnf", DNF, []),
  distro("alma", "AlmaLinux", "rhel", "AlmaLinux OS Foundation", "2021-03-30",
    "Community-driven RHEL rebuild, ABI-compatible with RHEL.",
    ["Free enterprise servers", "CentOS Linux migrations"],
    ["You want a RHEL-compatible OS with an independent foundation."],
    ["You require enterprise vendor support (use RHEL)."],
    "dnf", DNF, []),
  distro("centos-stream", "CentOS Stream", "rhel", "Red Hat", "2019-09-24",
    "Rolling preview of the next RHEL minor release. Upstream of RHEL, downstream of Fedora.",
    ["Developing against upcoming RHEL", "Contributing fixes upstream"],
    ["You want to see and shape what will land in RHEL next."],
    ["You need a stable, unchanging server target (use RHEL/Rocky/Alma)."],
    "dnf", DNF, []),
  distro("arch", "Arch Linux", "arch", "Arch Linux Team", "2002-03-11",
    "Lightweight, rolling-release distro built around simplicity, user-centricity, and the Arch Wiki.",
    ["Enthusiast desktops", "Bleeding-edge development", "Custom minimal installs"],
    ["You want the newest packages with a curated but minimal base."],
    ["You want a hands-off system that upgrades without reading changelogs."],
    "pacman", PACMAN, [
      { message: "error: failed to commit transaction (invalid or corrupted package)", cause: "Bad mirror, incomplete download, or expired keyring.", fix: "sudo pacman -Sy archlinux-keyring, then retry; try a different mirror in /etc/pacman.d/mirrorlist." },
      { message: "error: could not lock database: File exists", cause: "Stale /var/lib/pacman/db.lck from a killed pacman.", fix: "Confirm no pacman is running, then sudo rm /var/lib/pacman/db.lck." },
    ]),
  distro("manjaro", "Manjaro", "arch", "Manjaro Team", "2011-07-10",
    "User-friendly Arch derivative with its own repositories that hold packages back briefly for stability testing.",
    ["Desktop users wanting Arch benefits with less breakage", "Enthusiasts who prefer a graphical installer"],
    ["You want Arch's rolling model with a smoother onboarding."],
    ["You want the absolute latest packages (use vanilla Arch)."],
    "pacman", PACMAN, []),
  distro("opensuse-leap", "openSUSE Leap", "suse", "SUSE / openSUSE Project", "2015-11-04",
    "Stable, point-release distro sharing its core with SUSE Linux Enterprise.",
    ["Servers and workstations wanting SLE-like stability for free"],
    ["You want a polished, YaST-managed system with enterprise underpinnings."],
    ["You want rolling-release freshness (use Tumbleweed)."],
    "zypper", ZYPPER, []),
  distro("opensuse-tumbleweed", "openSUSE Tumbleweed", "suse", "openSUSE Project", "2014-01-01",
    "Tested, rolling-release distro with automated openQA testing.",
    ["Desktops and developer workstations wanting fresh, tested packages"],
    ["You want rolling releases with strong QA."],
    ["You need a fixed release for long-term servers (use Leap)."],
    "zypper", ZYPPER, []),
  distro("alpine", "Alpine Linux", "alpine", "Alpine Linux development team", "2005-08-10",
    "Security-oriented, ultra-lightweight distro built on musl libc and BusyBox. Dominant base for Docker images.",
    ["Container base images", "Embedded systems", "Small VMs"],
    ["You want tiny images and fast boot with a small attack surface."],
    ["You need glibc-only binaries (many Node native modules, some proprietary software)."],
    "apk", APK, [
      { message: "musl: dlopen failure / not glibc compatible", cause: "Binary was built against glibc but Alpine uses musl.", fix: "Rebuild against musl, use a glibc-compat shim, or switch base image to debian-slim." },
    ], "openrc", "ash"),
  distro("gentoo", "Gentoo", "gentoo", "Gentoo Foundation", "2002-03-31",
    "Source-based, highly customizable meta-distribution using Portage.",
    ["Highly customized workstations/servers", "Educational deep dives into Linux"],
    ["You want to tune every package with USE flags and CFLAGS."],
    ["You need fast installs and don't want to compile (use binary distros)."],
    "emerge (Portage)", EMERGE, [
      { message: "!!! Multiple package instances within a single package slot", cause: "Blockers or conflicting slotted packages.", fix: "Run emerge --backtrack=30 -uDN @world, or unmerge the conflicting slot." },
    ], "OpenRC (default) or systemd"),
  distro("slackware", "Slackware", "slackware", "Patrick Volkerding", "1993-07-17",
    "The oldest actively maintained Linux distribution. Minimal, Unix-like, no automatic dependency resolution.",
    ["Traditional Unix administration", "Systems where you want no surprises"],
    ["You value simplicity and hands-on system administration."],
    ["You want automatic dependency resolution (use apt/dnf/pacman)."],
    "slackpkg / installpkg", SLACKPKG, [], "SysV-style init"),
  distro("nixos", "NixOS", "nixos", "NixOS Foundation", "2003-01-01",
    "Purely functional Linux distribution where the system, packages, and configuration are declared in Nix and reproducibly built.",
    ["Reproducible dev environments", "Immutable servers", "Complex multi-version setups"],
    ["You want atomic upgrades, rollbacks, and declarative configuration."],
    ["You want a familiar FHS/apt experience with mutable /usr."],
    "Nix", NIX, [
      { message: "error: attribute 'X' missing", cause: "Package name changed or channel/flake input is stale.", fix: "Update channels/inputs (nix-channel --update or nix flake update), and check search.nixos.org for the current attribute path." },
    ]),
  distro("kali", "Kali Linux", "kali", "Offensive Security", "2013-03-13",
    "Debian-derived distribution focused on penetration testing, digital forensics, and security research. Ships hundreds of pre-installed offensive-security tools.",
    ["Authorized penetration testing", "Red team operations", "Security training and CTFs", "Wireless auditing"],
    ["You are performing authorized security work and want tools preinstalled and updated."],
    ["You want a general-purpose daily-driver desktop OS (use Ubuntu/Fedora)."],
    "apt (with kali repos)",
    [
      ...APT,
      { name: "kali-tweaks", syntax: "sudo kali-tweaks", description: "Menu-driven configuration for Kali (metapackages, shell, virt tweaks, hardening).", examples: [{ code: "sudo kali-tweaks", note: "Interactive TUI." }], bestScenario: "Post-install tuning and metapackage selection.", category: "Kali" },
      { name: "sudo apt install kali-linux-large", syntax: "sudo apt install kali-linux-large", description: "Install the large Kali metapackage (broad tool coverage).", examples: [{ code: "sudo apt install kali-linux-large", note: "Adds hundreds of tools." }], bestScenario: "When you want most Kali tools available offline.", category: "Kali" },
      { name: "sudo apt install kali-linux-everything", syntax: "sudo apt install kali-linux-everything", description: "Install every Kali tool metapackage.", examples: [{ code: "sudo apt install kali-linux-everything", note: "Multi-GB." }], bestScenario: "Fully loaded lab or offline engagement kit.", category: "Kali" },
      { name: "msfdb init", syntax: "sudo msfdb init", description: "Initialize the Metasploit PostgreSQL database.", examples: [{ code: "sudo msfdb init", note: "One-time setup." }], bestScenario: "Before first use of Metasploit workspaces.", category: "Kali" },
    ],
    [
      { message: "N: Repository ... does not have a Release file", cause: "Wrong sources.list or an outdated key.", fix: "Restore /etc/apt/sources.list to the official kali-rolling line and refresh keys: sudo apt install --reinstall kali-archive-keyring." },
      { message: "airmon-ng: unable to start monitor mode", cause: "Wireless driver does not support monitor mode, or interface is blocked by NetworkManager / rfkill.", fix: "rfkill unblock all; sudo airmon-ng check kill; ensure your adapter supports monitor mode." },
    ]),
];

export const distroBySlug = (slug: string) => DISTROS.find((d) => d.slug === slug);
