# Brief: theme generator

Build me a **theme generator**: a single-page web app in which I design a theme for my desktop
app and export it as one Markdown file in an exact format.

## Attach

- `docs/themes/system.md`: the component system. It defines every token, look, motion preset,
  slot and component the theme must cover. Treat it as fixed.
- `docs/themes/default.md`: the reference theme. Its format is the export format, and its values are the starting point.
- `docs/themes/default.png`: what the result should look like.
- `tools/theme-preview/preview.html`: the preview page used in the repository. Reuse it.

## What to build

A single-file app (React or plain HTML/JS), two panes: controls on the left, live preview on the right.

**Controls**, grouped like the token tables in system.md:

- **Palette**: every colour token for dark and light, each with a picker and hex input.
  Derived tokens are computed (see below) but can be overridden.
- **Type**: family for display, body, interface and mono. Offer system stacks plus a searchable list of
  [Fontsource](https://fontsource.org/) variable fonts (package `@fontsource-variable/<id>`). Also
  interface size, body size and display weight.
- **Shape**: `--radius-sm`, `--radius`, `--radius-lg`, border width, focus width, density unit `--space`.
- **Icons**: stroke and size.
- **Motion**: a global speed multiplier; the three curves; per slot a preset (only the allowed ones
  from system.md), duration and curve.
- **Looks**: `open | soft | float` per component id.
- **Start from**: the default theme, or import an existing theme `.md` by parsing its token block and
  tables. Also offer "randomise palette" that keeps contrast rules.

**Preview**: render `preview.html` in an `iframe` via `srcdoc`, replacing `/*THEME-TOKENS*/` with the
current token CSS and `<!--THEME-DATA-->` with
`<script>window.THEME = { name, description, schema: 'theme/1', looks, motion, typography, icons }</script>`
(shapes as in `tools/theme-preview/render.mjs`'s `parseTheme`). Load chosen Fontsource fonts from a
CDN inside the iframe. Re-render on every change, debounced.

**Checks**, always visible: the contrast rules from system.md for both modes, each with its ratio
and a pass/fail mark. Also every token defined, and every component and slot covered.

## Derived tokens (defaults)

| Token | Dark | Light |
|---|---|---|
| `--hover` | `--text` at 6% | `--text` at 5% |
| `--accent-soft` | `--accent` at 16% | `--accent` at 12% |
| `--success-soft`, `--warning-soft`, `--danger-soft` | role at 15% | role at 12% (danger 10%) |
| `--on-accent`, `--on-danger` | whichever of `--ground` or `#ffffff` contrasts more | same |
| `--scrim` | black at 55% | `--text` at 30% |
| `--shadow` | `0 12px 32px` black at 45% | `0 12px 32px` `--text` at 12% |
| `--shadow-sm` | `0 2px 8px` black at 30% | `0 2px 8px` `--text` at 8% |
| `--skeleton-highlight` | `--surface-raised` mixed 8% toward `--text` | same |

Write rgba values out in full in the export (no `color-mix`), so the CSS works everywhere.

## Export

A **Download `<name>.md`** button, plus **Copy**. The file must follow the theme file format in
`docs/themes/README.md` exactly: the same headings, order and table columns as `default.md`, every
token, component and slot present, and the motion preset as a comment after each `--motion-*` line.
The name is a lower-case kebab-case slug. Don't export a picture. The repository renders it from the
`.md`, so the two always match.

## Rules

- Never add, rename or drop tokens, components, looks, presets or slots. Those come from system.md only.
- Block export while a contrast check fails, unless I explicitly override it. Then add the failures to
  the end of the file as a `## Notes` section.
