export type DistroFamily =
  | "debian"
  | "rhel"
  | "arch"
  | "suse"
  | "alpine"
  | "gentoo"
  | "slackware"
  | "nixos"
  | "kali";

export type CommandExample = { code: string; note: string };

export type Command = {
  name: string;
  syntax: string;
  description: string;
  examples: CommandExample[];
  bestScenario: string;
  category: string;
};

export type KnownError = {
  message: string;
  cause: string;
  fix: string;
};

export type Distro = {
  slug: string;
  name: string;
  family: DistroFamily;
  developer: string;
  firstReleased: string;
  summary: string;
  bestUseCases: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  packageManager: string;
  defaultShell: string;
  init: string;
  commands: Command[];
  errors: KnownError[];
};

export type KaliCategory =
  | "Information Gathering"
  | "Vulnerability Analysis"
  | "Web Application Analysis"
  | "Database Assessment"
  | "Password Attacks"
  | "Wireless Attacks"
  | "Reverse Engineering"
  | "Exploitation Tools"
  | "Sniffing & Spoofing"
  | "Post Exploitation"
  | "Forensics"
  | "Reporting Tools"
  | "Social Engineering Tools";

export type KaliTool = {
  slug: string;
  name: string;
  category: KaliCategory;
  package: string;
  homepage: string;
  summary: string;
  depth: "deep" | "shallow";
  invocation: string;
  commands?: Command[];
  errors?: KnownError[];
};
