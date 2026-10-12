---
name: import-idea
description: Turn an exported idea file (<slug>.idea.md from docs/briefs/mvp-prototype.md) into GitHub issues - features, ADR questions and new components.
argument-hint: <path-to-idea.md>
disable-model-invocation: true
---

# Import idea `$ARGUMENTS`

Issues are the plan, so this skill creates issues and commits nothing. The format of the file is
defined under "Export" in `docs/briefs/mvp-prototype.md`.

## 1. Read and check

Read `$ARGUMENTS`. It must have the sections `# Idea:`, `## Screens`, `## Features`,
`## Decisions to make`, `## New components`, `## Strings`, `## Out of scope`. Report what's missing.

Then check it against the repo:

- Every `ui/*` id under Screens exists in `docs/themes/system.md`. Unknown ids are new components that
  were not listed. Add them to the list below.
- Every feature has acceptance criteria. Flag the ones that read like tasks rather than checks.
- Every string key used by a feature is in the Strings block. Flag keys that break the rules in
  `docs/languages.md`.
- Skip decisions an accepted ADR in `docs/adr/` already answers, and say which ADR covers each.
- `gh issue list --state open --limit 200 --json number,title` to spot likely duplicates.

## 2. Propose

Show a table of the issues you would create, in this order:

| # | Kind | Title | Label |
|---|---|---|---|
| 1 | ADR | `ADR: <question>` | `adr` |
| 2 | Component | `Add <new/name → ui/name> component` | `feature` |
| 3 | Feature | `<feature title>` | `feature` |

Decisions come first so that features can link to them. Ask whether to also create a milestone
named after the idea. Wait for the user to confirm, edit or drop rows.

## 3. Create

Make sure the labels exist (`gh label list`). Ask before creating missing ones with `gh label create`.

Write bodies in the same layout the issue forms produce, so they read like any other issue:

- **ADR** (`gh issue create --label adr --title "ADR: <question>"`): `### Question`,
  `### Context and constraints`, `### Options known so far`, `### Acceptance criteria` with
  `- [ ] ADR merged in docs/adr/` and `- [ ] The matching section of ARCHITECTURE.md is updated`.
- **Component** (`--label feature`): `### Problem` (which screens need it), `### Proposal` (id as
  `ui/<name>`, purpose, parts and states, tokens, motion; adds an entry to `docs/themes/system.md` and
  a Looks row to every theme), `### Acceptance criteria` (catalogue entry added, every theme has a look
  for it, component built per `/apply-theme` rules, previews re-rendered).
- **Feature** (`--label feature`): `### Problem`, `### Proposal`, `### Acceptance criteria` as written,
  `### Notes` with the screens involved, the string keys and English texts it needs, and
  `Depends on #<n>` for each ADR or component issue it needs.

Add `--milestone "<name>"` if one was created. Create them one at a time, in the table's order, so
the dependency numbers are known.

## 4. Report

List the created issues with their URLs. Point out the ADR issues to resolve first with
`/solve-adr <n>`, and the first feature that can be started with `/start-issue <n>`. Remind the user
that **Out of scope** was not turned into issues.
