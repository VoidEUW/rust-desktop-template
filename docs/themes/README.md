# Themes

The look of the interface is split into two layers:

- **[system.md](system.md)** is the component system: the token names every theme must define,
  the looks and motion presets, and the catalogue of components (ids, parts, states, tokens, motion
  slots). It is the same for every theme. This is what agents implement against.
- **A theme** fills the system with values. It is a pair of files with the same name:

| File | For | Contents |
|---|---|---|
| `<name>.md` | Agents | Looks per component, the CSS token block, typography, icons, motion table |
| `<name>.png` | People | Palettes in dark and light, type, every component, motion and looks, rendered from the `.md` |

The Markdown is authoritative. The picture is generated from it.

## Active theme

**`default`** ([spec](default.md) · [picture](default.png))

The app takes every colour, font, radius and duration from the active theme. No component contains
a literal value for any of these.

## Where a theme lands in the code

| Theme part | Location |
|---|---|
| Token block (`css` code block) | `apps/desktop/src/lib/theme/tokens.css`, copied verbatim, never edited by hand |
| Font packages (Typography table, `Package` column) | `apps/desktop/package.json`, imported at the top of `apps/desktop/src/app.css`. `system` means no package |
| Looks (Looks table) | The look class on each component's root (`look-open`, `look-soft`, `look-float`) |
| Components (catalogue in system.md) | `apps/desktop/src/lib/components/`, `ui/sidebar-entry` → `SidebarEntry.svelte` |

## Theme file format

A theme file has these sections, in this order. Tools parse them, so keep the headings exact.

1. `# Theme: <Name>`, then a one-line `> description`.
2. A line starting with the schema (`Schema` followed by `theme/1` in backticks) that links the picture and system.md.
3. `## Looks`: a table `Component | Look` with one row for every component in system.md.
4. `## Tokens`: one `css` code block that defines every token in system.md. Shared tokens and motion
   slots go on `:root`, dark colours on `:root, [data-theme='dark']`, light colours on
   `[data-theme='light']`. Each motion slot carries its preset as a comment.
5. `## Typography`: a table `Role | Family | Package | Used for` (Display, Body, Interface, Mono),
   then sizes and line heights in prose.
6. `## Icons`: library, style, stroke and size.
7. `## Motion`: a table `Slot | Preset | Duration | Curve` with every slot in system.md, then
   delays (tooltip intent, toast duration) in prose.
8. Optional `## Notes`: anything a tool or person should know, such as an accepted contrast exception.

[default.md](default.md) is the reference.

## Adding or switching a theme

1. Create `<name>.md` by hand (copy `default.md`) or with a theme generator. See
   [docs/briefs/theme-generator.md](../briefs/theme-generator.md).
2. Render the picture: `node tools/theme-preview/render.mjs <name>`. It needs Chrome or Chromium and
   writes `<name>.png` next to the `.md`. Use `--html <file>` to open the preview in a browser instead.
3. Run `/apply-theme <name>` in Claude Code. It makes the theme active, regenerates `tokens.css`,
   swaps font packages and brings components in line.
4. Compare the running app with the picture in dark and light.

Changing the component system itself is described in [system.md](system.md#extending-the-system).
