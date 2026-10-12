# 0001. Record architecture decisions

- Status: Accepted
- Date: 2026-10-12
- Issue: none (part of the template)

## Context

Structural choices get made all the time: which crate owns what, how data is stored, how the UI
talks to Rust. When the reason for a choice is not written down, the next person (or agent) either
reverses it by accident or doesn't dare to touch it. At the same time, design documents that try to
describe everything go stale quickly, and a second planning system next to the issue tracker
splits attention.

## Options

### Wiki or design docs

Free-form and easy to start, but nothing ties a page to the code that implements it, and nobody
notices when it goes stale.

### Decisions only in issues and PR threads

Nothing extra to maintain, but the reasoning gets buried in discussion and is hard to find later.

### ADRs in the repository, started from issues

Short, numbered, immutable records next to the code, reviewed like code. Issues stay the single
place for planning; an ADR issue is just a question waiting for a record.

## Decision

We keep ADRs in `docs/adr/`. Every ADR starts as an issue with the `adr` label and is merged
through a squash-merged pull request that closes that issue. `ARCHITECTURE.md` summarises the
current state and links to the ADRs behind it. No other design documents are written.

## Consequences

- Any structural change needs an accepted ADR first, so a quick change can need a short ADR.
- `/solve-adr <issue>` in Claude Code guides the steps, so writing one is cheap.
- Superseded ADRs stay in place, so the history of a decision stays readable.
