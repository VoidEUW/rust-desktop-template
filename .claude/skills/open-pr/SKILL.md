---
name: open-pr
description: Run the CI checks locally, push the current branch and open a pull request with a Conventional Commit title that closes its issue.
disable-model-invocation: true
---

# Open a pull request for the current branch

1. **Branch.** `git branch --show-current` must match `<type>/<issue>-<short-name>`. On `main`, stop.
2. **Checks.** Run what CI runs. If anything fails, stop, show the failure and offer to fix it.
   ```sh
   (cd apps/desktop && npm run check && npm run build)
   cargo fmt --all --check
   cargo clippy --workspace --all-targets -- -D warnings
   cargo test --workspace
   cargo deny check      # if cargo-deny is installed; CI runs it either way
   ```
3. **Scope.** `git diff main...HEAD --stat`. Flag files that don't belong to the issue, and new
   literal colours, fonts, radii or durations in `apps/desktop/src` (see docs/themes/README.md). Also
   flag strings that bypass `t()` (see docs/languages.md) and structural changes that have no ADR.
   Ask before going on if any are found.
4. **Commit.** If there are uncommitted changes, ask whether to commit them.
5. **Title.** `<type>(<scope>): <summary>` per [Conventional Commits](https://www.conventionalcommits.org/).
   The type comes from the branch. The scope is the area touched, optional. The summary is imperative,
   lower case and has no full stop. Get it from `gh issue view <issue> --json title`. This title becomes
   the squash commit on `main`.
6. **Open.**
   ```sh
   git push -u origin HEAD
   gh pr create --title "<title>" --body-file <filled copy of .github/pull_request_template.md>
   ```
   The body starts with `Closes #<issue>`, has one or two sentences of what and why, and ticks the
   checklist items that hold.
7. Give the user the PR URL. Do not merge.
