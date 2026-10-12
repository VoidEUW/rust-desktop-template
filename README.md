<div align="center">

# Rust Desktop Template

A small starting point for cross-platform desktop apps with **Tauri 2**, **Svelte 5** and **Rust**.
It ships with conventions, CI and Claude Code skills already set up.

[![CI](https://github.com/VoidEUW/rust-desktop-template/actions/workflows/ci.yml/badge.svg)](https://github.com/VoidEUW/rust-desktop-template/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Tauri 2](https://img.shields.io/badge/Tauri-2-24C8DB?logo=tauri&logoColor=white)](https://v2.tauri.app/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)

</div>

## Features

- **Layered from the start.** Logic lives in a plain Rust crate. The Tauri crate is a thin shell around it, and the UI talks to Rust only through commands.
- **A component system for themes.** [`docs/themes/system.md`](docs/themes/system.md) defines tokens and 22 core components. Each theme fills it with values, as a Markdown spec for agents plus a rendered picture for people.
- **Translations built in.** Every string goes through `t()`. To add a language, add one JSON file.
- **Issues for planning, ADRs for decisions.** Feature, bug and ADR issue forms, plus a PR template.
- **CI included.** It runs `svelte-check`, the frontend build, `rustfmt`, `clippy` and tests. `cargo-deny` checks advisories and that every dependency's license is on the allow-list in `deny.toml`. PR titles are checked against Conventional Commits. Dependabot is configured.
- **Claude Code skills.** `/start-issue`, `/solve-adr`, `/open-pr`, `/apply-theme`, `/add-language` and `/import-idea` cover the workflow.
- **Briefs for outside tools.** Paste-in instructions for building a theme generator or a clickable MVP prototype. Each export comes back as a theme file or as issues.

## Getting started

### Prerequisites

- [Rust](https://rustup.rs/) stable (pinned by `rust-toolchain.toml`)
- [Node.js](https://nodejs.org/) 22 or newer
- Chrome or Chromium, only to render theme pictures
- The [Tauri system dependencies](https://v2.tauri.app/start/prerequisites/) for your OS

### Run

```sh
cd apps/desktop
npm ci
npm run tauri dev      # opens the app with hot reload
npm run tauri build    # release bundle in target/release/bundle/
```

### Check

```sh
(cd apps/desktop && npm run check)
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
cargo deny check       # advisories and licenses (cargo install --locked cargo-deny)
```

## Make it yours

Click **Use this template** on GitHub, then replace the placeholders:

| What | Where |
|---|---|
| Product name `App` | `apps/desktop/src-tauri/tauri.conf.json` (`productName`, window `title`), `apps/desktop/src/app.html`, `app.title` in `apps/desktop/src/lib/i18n/en.json` |
| Bundle identifier `com.example.app` | `apps/desktop/src-tauri/tauri.conf.json` |
| Crate and package names `app`, `app-core` | `apps/desktop/src-tauri/Cargo.toml`, `crates/core/Cargo.toml`, `Cargo.toml`, `apps/desktop/package.json` |
| Icons | `npm run tauri icon path/to/icon.png` in `apps/desktop` |
| Copyright holder | `NOTICE.md` |
| Allowed dependency licenses | `deny.toml` |
| Repository URL in the badges | This README |
| Theme | Copy `docs/themes/default.md` (or use the [theme generator brief](docs/briefs/theme-generator.md)), render it, run `/apply-theme <name>` |

Then rewrite this README for your app.

## Project structure

```
apps/desktop/            Svelte 5 frontend (SvelteKit, static SPA)
├── src/lib/i18n/        Translation files and t()
├── src/lib/theme/       Tokens generated from the active theme
└── src-tauri/           Tauri shell crate `app`
crates/core/             Application logic, no Tauri dependency
docs/
├── adr/                 Architecture decision records
├── briefs/              Instructions for building a theme generator or MVP prototype elsewhere
├── themes/              Component system, theme specs (.md) and pictures (.png)
└── languages.md         Supported UI languages
tools/theme-preview/     Renders a theme's picture from its .md
.claude/skills/          Claude Code workflow skills
.github/                 CI, issue forms, PR template, Dependabot
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for how the parts fit together.

## Workflow

GitHub issues are the only planning tool. Each piece of work follows the same path:

1. An issue with acceptance criteria. Use the **Feature**, **Bug** or **Architecture decision** form.
2. A branch `<type>/<issue>-<short-name>`. Run `/start-issue <n>` in Claude Code.
3. A pull request with a Conventional Commit title that closes the issue. Run `/open-pr`.
4. A squash-merge into a protected `main`.

To start from an idea rather than an issue, build a prototype with the
[MVP brief](docs/briefs/mvp-prototype.md) and run `/import-idea <file>`. The export becomes
ADR questions, component issues and feature issues.

Structural decisions start as an **Architecture decision** issue. `/solve-adr <n>` takes you through
it step by step, writes the record to [docs/adr/](docs/adr/) and opens the pull request.

Details are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Claude Code skills

| Command | What it does |
|---|---|
| `/start-issue <n>` | Checks the issue is ready, assigns you, creates the branch, summarises the acceptance criteria |
| `/solve-adr <n>` | Takes an ADR issue from question to decision with you, writes `docs/adr/NNNN-*.md` and opens the PR |
| `/open-pr` | Runs the CI checks locally, pushes and opens a PR that closes the issue |
| `/apply-theme [name]` | Applies a theme from `docs/themes/`, builds components against the system, removes hard-coded styles |
| `/add-language <code>` | Adds a translation file and lists it in `docs/languages.md` |
| `/import-idea <file>` | Turns an exported idea file into ADR, component and feature issues |

Agent instructions are in [CLAUDE.md](CLAUDE.md).

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md): structure and layering
- [docs/adr/](docs/adr/): decisions and why they were made
- [docs/themes/](docs/themes/): the component system, themes and the active theme
- [docs/briefs/](docs/briefs/): building a theme generator or an MVP prototype outside the repo
- [docs/languages.md](docs/languages.md): supported languages and translation rules
- [CONTRIBUTING.md](CONTRIBUTING.md): how work gets done

## License

Licensed under the [Apache License 2.0](LICENSE). See [NOTICE.md](NOTICE.md).
