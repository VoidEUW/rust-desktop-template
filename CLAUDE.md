# CLAUDE.md

Tauri 2 desktop app: a Svelte 5 frontend in `apps/desktop`, the Tauri shell crate in
`apps/desktop/src-tauri`, and logic crates in `crates/`. Read `ARCHITECTURE.md` before structural work
and `CONTRIBUTING.md` before git work.

## Commands

```sh
cd apps/desktop && npm ci           # once
npm run tauri dev                   # run the app (from apps/desktop)
npm run check && npm run build      # frontend type-check and build (from apps/desktop; build is needed before cargo clippy)
cargo fmt --all                     # from the repo root
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
cargo deny check                    # advisories, licenses, sources
node tools/theme-preview/render.mjs <theme>   # re-render docs/themes/<theme>.png after editing its .md
```

## Rules

- **Layering.** Logic goes in `crates/*`, which must not depend on Tauri. Tauri commands in
  `apps/desktop/src-tauri/src/lib.rs` only translate between the UI and those crates. The UI does
  no I/O except `invoke`.
- **UI.** Build components from the catalogue in `docs/themes/system.md` (ids, parts, states,
  tokens, motion slots) in `apps/desktop/src/lib/components/`, named after their id. The active theme
  (`docs/themes/README.md`) sets each component's look. Its `.png` shows the intended result. Never write
  a literal colour, font, radius or duration in `apps/desktop/src`. Use the tokens in
  `src/lib/theme/tokens.css`, which is generated, so don't edit it. Use `/apply-theme` for UI work.
- **Strings.** Every user-visible string is a key in `apps/desktop/src/lib/i18n/en.json`, used with
  `t()`. Follow the key rules in `docs/languages.md`.
- **Decisions.** Do not make a structural decision in code. If no ADR covers it, stop and suggest an
  `adr` issue. ADRs are the only design docs; don't create other planning or status files.
- **Git.** One issue, one branch `<type>/<issue>-<short-name>`. Conventional Commits. PRs are
  squash-merged, and the PR title is the commit. Never push to `main`. Never merge a PR yourself.
- **Rust.** Edition 2024. No `unsafe`. Clippy warnings fail CI. Use `Result` with typed errors in
  library crates; `expect` only at startup.

## Skills

`/start-issue <n>`, `/solve-adr <n>`, `/open-pr`, `/apply-theme [name]`, `/add-language <code>`,
`/import-idea <file>`.
They live in `.claude/skills/`.
