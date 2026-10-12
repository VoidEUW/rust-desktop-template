# Contributing

Whether you work alone or with others, with or without an AI agent, these rules mean nobody has to
guess what anyone else is doing.

## Where things live

| What | Where |
|---|---|
| What to do next, who is doing it, status | GitHub issues and the project board |
| What "done" means | The acceptance criteria in the issue |
| Why the structure looks like this | `docs/adr/` |
| How the parts fit | `ARCHITECTURE.md` |
| What the UI is built from and looks like | `docs/themes/` |
| Which languages the UI ships in | `docs/languages.md` |
| Building a theme or prototype outside the repo | `docs/briefs/` |

There is no status file and no hand-written changelog. To see where the project stands, read the
milestone. History follows Conventional Commits, so a changelog can be generated from it.

## Working on an issue

1. Pick an issue that is **Ready**. Ready means its acceptance criteria are filled in.
2. **Assign yourself before writing code.** The assignee is the claim. If someone else is
   assigned, pick another issue or ask in a comment.
3. One issue, one branch, one pull request. Branch names are `<type>/<number>-<short-name>`, with
   `feat`, `fix`, `chore`, `docs` or `refactor` as the type, e.g. `feat/42-language-picker`.
   In Claude Code, `/start-issue <number>` does steps 2 and 3 for you.
4. If the issue is unclear or too big, comment on it and add `status:blocked`. Do not guess, and do
   not widen the scope to fit what you found.
5. A change that affects structure needs an accepted ADR first. See below.
6. Do not edit files that another open pull request is changing.

## Ideas

A larger idea can be explored as a throwaway prototype first (see `docs/briefs/mvp-prototype.md`).
Its export is turned into issues with `/import-idea <file>`. After that it is planned and worked on
like any other issue. Prototypes aren't committed.

## Decisions

Architecture decision records in `docs/adr/` are the only design documents in this repository.

1. Open an issue with the **Architecture decision** template. State the question, not the answer.
2. Take it like any other issue. In Claude Code, `/solve-adr <number>` takes you through context,
   options, decision and consequences one step at a time. It writes the ADR and opens the pull request.
   Without it, follow [docs/adr/README.md](docs/adr/README.md).
3. The pull request adds the ADR and updates `ARCHITECTURE.md`. Once it is merged, the decision holds
   until a later ADR supersedes it.

## Pull requests

Squash-merge only, so history stays linear. The PR title is the commit message and follows
[Conventional Commits](https://www.conventionalcommits.org/): `feat(settings): add language picker`.
CI checks the title. The body says `Closes #<number>`. `main` is protected; nothing is pushed to it
directly. In Claude Code, `/open-pr` runs the checks and opens the pull request.

Before you ask for review:

- CI is green.
- UI code uses components from `docs/themes/system.md` and takes colours, fonts, radii and durations
  only from the theme tokens.
- User-visible strings go through `t()`.
