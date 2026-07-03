name: Security vulnerability report
description: |
  ⚠️  DO NOT use this form for security vulnerabilities.
  Use GitHub Security Advisories for private disclosure.
labels: []
body:
  - type: markdown
    attributes:
      value: |
        ## ⚠️ Please do not report security vulnerabilities here

        This public issue form is **not** the right place for security reports.

        To report a vulnerability privately:

        1. Go to **[Security Advisories](../../security/advisories/new)** in this repository.
        2. Or email the maintainer directly — see [`SECURITY.md`](../../SECURITY.md) for contact details.

        **Why private disclosure?**  Public issues can be seen by anyone before a fix is ready,
        potentially putting users at risk.

        If you have already confirmed this is **not** a security vulnerability and want to
        open a general bug report, please close this and use the **Bug report** template instead.

  - type: checkboxes
    id: confirm
    attributes:
      label: Confirm this is not a security vulnerability
      options:
        - label: |
            I confirm this issue does NOT involve a security vulnerability.
            I understand security issues must be reported privately.
          required: true
