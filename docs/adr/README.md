# Architecture decision records

ADRs are the only design documents written in this repository. Plans, features and bugs live in
GitHub issues. An ADR records one structural decision: the question, the options, what was chosen
and what follows from it.

## How an ADR comes to be

1. Someone opens an issue with the **Architecture decision** template. It gets the `adr` label and
   states the question, not the answer.
2. Whoever takes it runs `/solve-adr <issue>` in Claude Code, or follows the same steps by hand:
   branch `docs/<issue>-adr-<short-name>`, work through context, options and consequences, and copy
   [template.md](template.md) to the next free number.
3. The pull request adds the ADR, adds a row to the index below, and updates the matching section
   of [ARCHITECTURE.md](../../ARCHITECTURE.md). Its body says `Closes #<issue>`, and it is
   squash-merged like every other pull request.

## Rules

- Files are named `NNNN-kebab-case-title.md`, numbered in order, never renumbered.
- Status is `Proposed`, `Accepted`, or `Superseded by NNNN`. It is `Accepted` once the PR is merged.
- An accepted ADR is not rewritten. To change a decision, write a new ADR that supersedes it, and
  set the old one's status to `Superseded by NNNN`.
- Keep it short. If an ADR needs more than a page, it is probably more than one decision.

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
