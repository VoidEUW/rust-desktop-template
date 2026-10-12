---
name: solve-adr
description: Work through an architecture-decision issue with the user step by step, write the ADR into docs/adr/, and open a pull request that closes the issue.
argument-hint: <issue-number>
disable-model-invocation: true
---

# Solve ADR issue #$ARGUMENTS

The decision belongs to the user. Your job is to give them a clear question, honest options and a
record worth keeping. Go **one step at a time**: after each of steps 3–6, stop and wait for the user
to confirm or correct you before you go on.

## 1. Check the issue

`gh issue view $ARGUMENTS --json number,title,body,labels,assignees,state`

- It must be open and labelled `adr`. If not, stop and say so.
- If someone else is assigned, stop and say who.
- `gh issue edit $ARGUMENTS --add-assignee @me`

## 2. Branch and read

```sh
git switch main && git pull --ff-only
git switch -c docs/$ARGUMENTS-adr-<short-name>
```

Read `docs/adr/README.md`, every ADR in `docs/adr/`, and `ARCHITECTURE.md`. Read the code the
question touches. If an accepted ADR already answers the question, say so. The result is then
either a superseding ADR or closing the issue. Ask which.

## 3. Question and constraints

Restate in your own words what has to be decided and the constraints any answer must meet (from
the issue, existing ADRs and the code). Ask what is missing or wrong.

## 4. Options

Give 2–4 real options. For each: one paragraph, what it makes easier and harder, and what it
costs to reverse later. Include "do nothing / defer" if it is a real option. End with your
recommendation and the reason in one sentence. Do not pad weak options in just to have more.

## 5. Decision

The user picks. If they pick something you advised against, record their reason. Don't re-argue.

## 6. Consequences

List what becomes easier, what becomes harder, and the follow-up work. Offer to open follow-up issues
(`gh issue create`), and only open them once the user agrees.

## 7. Write it

- Number: highest `NNNN` in `docs/adr/` plus one, zero-padded to 4.
- Copy `docs/adr/template.md` to `docs/adr/NNNN-<kebab-title>.md` and fill it in from steps 3–6.
  Status `Accepted`, today's date, `Issue: #$ARGUMENTS`. Keep it to about a page.
- If it supersedes an ADR, set the old one's status to `Superseded by NNNN`. Change nothing else in it.
- Add a row to the index in `docs/adr/README.md`.
- Update or add the matching section in `ARCHITECTURE.md`: the current state in a few lines, plus a
  link to the new ADR. Replace any `TBD` it resolves.

Show the user the ADR and wait for approval before committing.

## 8. Pull request

```sh
git add docs/adr ARCHITECTURE.md
git commit -m "docs(adr): NNNN <title in lower case>"
git push -u origin HEAD
gh pr create --title "docs(adr): <title in lower case>" --body "Closes #$ARGUMENTS

Records ADR NNNN: <one-sentence decision>."
```

Give the user the PR URL. Do not merge it. It is squash-merged after review, like every pull request.
