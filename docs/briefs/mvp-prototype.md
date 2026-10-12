# Brief: MVP prototype

Help me turn an app idea into a **clickable prototype**. Then export it as one Markdown file that
my repository turns into GitHub issues. The prototype is for finding out what the app should be;
it will not be shipped. Speed and clarity matter more than code quality.

## Attach

- `docs/themes/system.md`: the component system. Build every screen from its catalogue.
- The active theme's `.md` and `.png` from `docs/themes/` (see `docs/themes/README.md`). Use its token
  block verbatim.
- `ARCHITECTURE.md`: what is already fixed. Don't design against it.
- Optional: `docs/adr/README.md` (decisions already made), `docs/languages.md` (string rules).

## How we work

1. **Interview me first.** Ask about the users, the problem, the one thing the app must do well, and
   what is out of scope. Ask at most five questions at a time. Then summarise the idea in five lines
   and wait for my OK.
2. **List the screens and flows** before building: screen names, what each is for, how you get from one
   to the next. Wait for my OK.
3. **Build the prototype** as a single-file web app (HTML/JS, React or Svelte), desktop-sized
   (960×640 and up). Navigation works and data is fake. There is no backend, storage or network.
4. **Iterate** on my feedback. Keep a running list of features, open questions and new components as we go.
5. **Export** when I ask (see below).

## Building rules

- Paste the theme's token block into a `<style>` and take every colour, font, radius and duration from
  it. Support `[data-theme='light']` with a toggle.
- Every element maps to a component id in system.md. Put it on the root as
  `data-component="ui/button"` and give it the look class from the theme's Looks table
  (`look-open|soft|float`).
- If something needs a component that isn't in the catalogue, build it, mark it
  `data-component="new/<kebab-name>"`, and add it to the "New components" list. Don't restyle existing
  components to fake a new one.
- Write visible text in English as `t('area.thing')` keys with a dictionary at the top of the file.
  Key rules are in `docs/languages.md`.
- Anything that needs a real decision (storage, sync, accounts, platform features, a library) is not
  decided in the prototype. Fake it and add it to "Decisions to make".

## Export

One file, `<slug>.idea.md`, with exactly these sections and headings. Leave a section empty rather than dropping it.

````markdown
# Idea: <Name>

> <One-paragraph pitch: who it is for, what it does, why it matters.>

## Users and problem

<Who uses it, what they struggle with today, what success looks like.>

## Screens

### <Screen name>

<What it is for, in one or two sentences.>

- Components: `ui/sidebar`, `ui/sidebar-entry`, `ui/card`, `new/<name>`
- Reached from: <screen or action>
- Leads to: <screens or actions>

## Features

### <Imperative title, e.g. "Add a project from a folder">

**Problem:** <what the user can't do today>

**Proposal:** <what happens instead, which screens are involved>

**Acceptance criteria:**

- [ ] <observable check>
- [ ] <observable check>

**Strings:** `area.key`, `area.key`

## Decisions to make

### <Question, e.g. "How are projects stored on disk?">

**Question:** <what needs deciding, one or two sentences>

**Context and constraints:** <why it comes up, what any answer must satisfy>

**Options known so far:** <list, or "none yet">

## New components

### `new/<kebab-name>`

**Purpose:** <one sentence>

**Parts and states:** <list>

**Tokens:** <existing tokens from system.md only>

**Motion:** <an existing slot, or a proposed new slot with its allowed presets>

## Strings

```json
{ "area.key": "English text" }
```

## Out of scope

- <thing we decided not to do, and why>
````

Rules for the export:

- Each **feature** is one issue's worth of work. Split anything that would take more than a few days.
  Order the features so that the first ones make a usable app on their own.
- Acceptance criteria are checks someone else can verify, not tasks.
- Each **decision** states the question, not the answer, even if we leaned one way. Put the leaning
  under "Options known so far".
- Offer the prototype file as a second download, so I can keep it next to the export.
