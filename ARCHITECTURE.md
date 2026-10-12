# Architecture

How the parts of the app fit together. The reasons behind each choice are in [docs/adr/](docs/adr/).
A section is added or changed only by an accepted ADR, and it links to that ADR. A section that says TBD
is not decided yet; open an `adr` issue for it.

## Fixed decisions

- The desktop app is [Tauri 2](https://v2.tauri.app/) with a [Svelte 5](https://svelte.dev/) frontend
  (SvelteKit, static SPA).
- Application logic lives in Rust crates under `crates/` that do not depend on Tauri. The Tauri crate is
  a thin shell that exposes them as commands.
- The UI reaches Rust only through Tauri commands (`invoke`). It does no I/O of its own.
- The UI takes every colour, font, radius and duration from the active theme
  ([docs/themes/](docs/themes/)) and every string from the translation files ([docs/languages.md](docs/languages.md)).

The process itself is recorded in [ADR 0001](docs/adr/0001-record-architecture-decisions.md).

## Crate map and layering

```
apps/desktop (Svelte)  ──invoke──▶  apps/desktop/src-tauri (crate `app`)  ──▶  crates/core (`app-core`)
```

| Crate | Path | Depends on | Purpose |
|---|---|---|---|
| `app-core` | `crates/core` | nothing in the workspace | Application logic and domain types |
| `app` | `apps/desktop/src-tauri` | `app-core`, `tauri` | Window, commands, wiring |

Dependencies only point to the right. New crates go under `crates/` and must not depend on `app`.

## Data and storage

TBD.

## Error handling

TBD.

## Testing

Logic is unit-tested in its crate (`cargo test --workspace`). The frontend is type-checked with
`svelte-check`. Anything beyond that is TBD.
