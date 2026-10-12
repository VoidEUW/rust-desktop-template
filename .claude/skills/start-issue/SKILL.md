---
name: start-issue
description: Claim a GitHub issue and create its branch. Use when the user wants to start working on an issue by number.
argument-hint: <issue-number>
disable-model-invocation: true
---

# Start issue #$ARGUMENTS

Follow CONTRIBUTING.md. Stop and report to the user at any failed check; do not work around it.

1. **Read it.** `gh issue view $ARGUMENTS --json number,title,body,labels,assignees,state`.
   - Closed → stop.
   - Assigned to someone other than `gh api user -q .login` → stop and say who has it.
   - No acceptance criteria in the body → stop. Suggest what they could be and offer to comment them on the issue.
   - Label `adr` → stop and tell the user to run `/solve-adr $ARGUMENTS` instead.
2. **Claim it.** `gh issue edit $ARGUMENTS --add-assignee @me`.
3. **Branch.** The type comes from the labels: `bug` → `fix`, `docs` → `docs`, `chore` → `chore`,
   `refactor` → `refactor`, otherwise `feat`. The short name is 2–4 kebab-case words from the title.
   ```sh
   git switch main && git pull --ff-only
   git switch -c <type>/$ARGUMENTS-<short-name>
   ```
   If the working tree is dirty, ask before switching.
4. **Orient.** Read the parts of ARCHITECTURE.md and docs/adr/ the issue touches. For UI work, read
   docs/themes/system.md and the active theme (docs/themes/README.md). For new strings, read docs/languages.md.
5. **Report.** Give the branch name, the acceptance criteria as a checklist, and a plan of at most 5 steps.
   If the issue needs a structural decision that no ADR covers, say so and suggest opening an `adr` issue
   rather than deciding it in code. Wait for the go-ahead before writing code.

When the work is done, `/open-pr` opens the pull request.
