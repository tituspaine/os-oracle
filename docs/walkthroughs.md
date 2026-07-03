# Play-by-play walkthroughs

Walkthroughs are narrated, lab-only, step-by-step dry runs. They live in
`src/data/walkthroughs.ts` and follow the `Walkthrough` type.

## When to write one

- The playbook is popular enough that a first-timer needs hand-holding.
- The playbook has decision points where a wrong turn wastes hours.
- You have a **safe lab target** (DVWA, WebGoat, HTB retired, PortSwigger Web Security Academy,
  your own VM).

## Frame structure

Each `WalkthroughStep` should have:

- `title` — imperative, present-tense ("Enumerate the DBMS", not "Enumerating the DBMS").
- `narration` — 2–4 sentences of "what and why". This is where the teaching happens.
- `command` — the exact command you would type. Copy-pasteable.
- `expectedOutput` — a **realistic** trimmed sample of what the terminal will show.
  Redact anything sensitive. Do not paste real captured data from a real target.
- `observation` — what to notice in the output. The "read" of the situation.
- `branches` — at least one for the tricky steps. `when` describes the observation;
  `then` says what to do.
- `toolSlugs` — cross-link to Kali tool pages the reader may want to open.

## House rules

- **No live targets.** Walkthroughs assume a lab. If you find yourself writing
  "point this at `example.com`", stop and pick a lab equivalent.
- **No credentials.** Never include real usernames, real passwords, or real API keys — even
  if they are yours.
- **No 0-day.** Only documented, publicly-known techniques with CVEs or well-established
  research write-ups.
- **Realism over drama.** Prefer the boring, common output over the exciting rare one.
  Beginners spend most of their time looking at the boring output.
- **Detection + mitigation.** Every walkthrough must end with a `detectionSummary` and
  `mitigationSummary` so blue-teamers get value from it too.
