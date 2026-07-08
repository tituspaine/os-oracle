name: Content request
description: Request a new tool, playbook, walkthrough, distro, or error entry.
labels: [content]
body:
  - type: markdown
    attributes:
      value: |
        Use this form to request **new content** — a Kali tool entry, hacking playbook,
        walkthrough, Linux distro reference, or error message.

        Please read [`CONTRIBUTING.md`](../../CONTRIBUTING.md) and
        [`DISCLAIMER.md`](../../DISCLAIMER.md) before submitting.

  - type: dropdown
    id: type
    attributes:
      label: Content type
      options:
        - Kali / security tool
        - Hacking playbook
        - Walkthrough (lab)
        - Linux distro reference
        - Error message + fix
        - CLI command reference
        - Other
    validations:
      required: true

  - type: input
    id: name
    attributes:
      label: Tool / topic name
      placeholder: "e.g. gobuster, SQL injection via time-based blind, Arch Linux"
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Description
      description: What is it? Why is it useful for ethical hackers / pen testers?
    validations:
      required: true

  - type: input
    id: source
    attributes:
      label: Upstream source / documentation
      placeholder: "https://github.com/OJ/gobuster  or  man page  or  CVE-2024-XXXX"
    validations:
      required: true

  - type: textarea
    id: examples
    attributes:
      label: Example commands (if applicable)
      render: shell
      description: Real commands you'd run in a lab environment.

  - type: textarea
    id: legal
    attributes:
      label: Legal / ethical framing
      description: |
        Confirm the target environment is a lab, CTF, or authorised system.
        For playbooks: link the CVE/MITRE reference and note what it documents.
    validations:
      required: true

  - type: checkboxes
    id: checks
    attributes:
      label: Pre-submission checklist
      options:
        - label: This content documents publicly available information (link provided above).
          required: true
        - label: This content contains no exploit payloads, malware, or credential-harvesting code.
          required: true
        - label: Any referenced target is a lab environment (DVWA, WebGoat, HTB, PortSwigger, own VM).
          required: true

  - type: checkboxes
    id: coc
    attributes:
      label: Code of Conduct
      options:
        - label: I agree to follow this project's Code of Conduct.
          required: true
