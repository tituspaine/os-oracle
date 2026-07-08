name: Bug report
description: Something in the app, CLI, or docs is broken and reproducible.
labels: [bug]
body:
  - type: markdown
    attributes:
      value: |
        > **⚠️ Security issue?**  Please do **not** use this form.
        > Report privately via [Security Advisories](../../security/advisories/new) instead.

  - type: textarea
    id: what
    attributes:
      label: What happened?
      description: A clear, concise description of the bug.
    validations:
      required: true

  - type: textarea
    id: repro
    attributes:
      label: Steps to reproduce
      placeholder: |
        1. Run `os-oracle search nmap`
        2. See error …
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behaviour
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual behaviour / error output
      render: shell

  - type: input
    id: version
    attributes:
      label: OS Oracle version
      placeholder: "1.0.0 (run `os-oracle --version`)"

  - type: input
    id: environment
    attributes:
      label: OS + Node / Bun version
      placeholder: "Kali Linux 2024.1 / Node 20.11 / Bun 1.1"

  - type: checkboxes
    id: coc
    attributes:
      label: Code of Conduct
      options:
        - label: I agree to follow this project's Code of Conduct.
          required: true
