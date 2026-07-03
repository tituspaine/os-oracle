import { heading, note, subheading } from '../ui/display';
import { paginate } from '../ui/pager';

export const RESOURCE_GROUPS = {
  Certifications: ['OSCP', 'CEH', 'GPEN', 'PNPT', 'GWAPT', 'eJPT', 'eCPPT', 'BSCP'],
  Platforms: ['TryHackMe', 'Hack The Box', 'PortSwigger Web Security Academy', 'PentesterLab', 'VulnHub', 'DVWA', 'OWASP WebGoat'],
  Frameworks: ['MITRE ATT&CK', 'OWASP Top 10', 'PTES', 'OSSTMM', 'NIST Cybersecurity Framework', 'CIS Controls'],
  'CVE / Vulnerability Databases': ['NVD', 'CVE Details', 'Vulners', 'ExploitDB', 'Packet Storm', 'OVAL'],
  'Bug Bounty Platforms': ['HackerOne', 'Bugcrowd', 'Intigriti', 'Synack', 'Cobalt'],
  'Legal / Ethics': ['Electronic Frontier Foundation (EFF)', 'Responsible disclosure guidelines', 'CFAA', 'Computer Misuse Act'],
} as const;

export async function resourcesCommand(): Promise<void> {
  const lines: string[] = [
    heading('Global security resources'),
    note('Reference material for training, methodology, vulnerability research, and legal awareness.'),
    '',
  ];

  for (const [group, items] of Object.entries(RESOURCE_GROUPS)) {
    lines.push(subheading(group));
    for (const item of items) {
      lines.push(`  • ${item}`);
    }
    lines.push('');
  }

  await paginate(lines);
}
