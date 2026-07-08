name: Feature request
description: Propose a new feature or enhancement for OS Oracle.
labels: [enhancement]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for helping improve **OS Oracle**!
        Before opening, please search existing issues to avoid duplicates.

  - type: textarea
    id: problem
    attributes:
      label: Problem statement
      description: What problem does this feature solve? Who is affected?
      placeholder: "As a pen tester, I need … because …"
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: Describe the feature in detail. Include mockups or examples if useful.
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
      description: What other approaches did you think about?

  - type: dropdown
    id: area
    attributes:
      label: Area
      options:
        - CLI
        - Web interface
        - Data / content
        - Search
        - Documentation
        - CI / tooling
        - Other
    validations:
      required: true

  - type: checkboxes
    id: coc
    attributes:
      label: Code of Conduct
      options:
        - label: I agree to follow this project's Code of Conduct.
          required: true
