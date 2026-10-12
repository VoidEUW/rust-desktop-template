# Component system · `theme/1`

The contract between themes and the UI. This file names every token a theme must define and every
component the UI may build, with its parts, states, tokens and motion slots. A theme
(`<name>.md`) supplies the values and picks a look for each component. It never adds tokens or
components.

To grow the system, see [Extending](#extending-the-system). To replace it, see [Replacing](#replacing-the-system).

## Rules that hold for every theme

- **Tokens only.** Components take every colour, font, radius, border width, shadow and duration
  from the tokens below. No literals.
- **Each colour says one thing.** `--accent` is the primary action, the selection and "on".
  `--focus` is the focus ring. `--success`, `--warning` and `--danger` mean what they say. If you
  can't say what a colour means, it doesn't belong there.
- **Focus** is a `--focus-width` outline in `--focus` with a 2px offset on every interactive
  element. Never remove it.
- **Dark is the default.** Dark values sit on `:root` so nothing flashes light before scripts run.
  Light values sit on `[data-theme='light']`.
- **Derived tokens** (`--hover`, `-soft` tints, `--on-*`, `--scrim`, shadows) are part of the theme.
  Use them; don't mix your own.
- **Motion** goes through one slot per moving part (`--motion-<slot>`: duration and curve).
  `prefers-reduced-motion: reduce` removes all transitions and animations, and everything stays usable.
- **Icons** come from one outline family on a 24-unit grid, drawn in `currentColor` at `--icon-size`
  with `--icon-stroke`.
- **Looks change structure, never colour.**

## Tokens

### Colour (one value per mode)

| Token | Role |
|---|---|
| `--ground` | App background |
| `--surface` | Panels, cards, menus, dialogs |
| `--surface-raised` | Fills inside a surface: inputs, hovered rows, the selected tab |
| `--line` | Borders and hairlines |
| `--text` | Primary text |
| `--text-muted` | Secondary text, labels |
| `--text-faint` | Placeholders, hints, disabled text |
| `--accent` | Primary action, selection, on state |
| `--focus` | Focus ring, live/in-progress state |
| `--success` · `--warning` · `--danger` | Status |

### Derived colour (one value per mode)

| Token | Role |
|---|---|
| `--hover` | Hover tint laid over any fill |
| `--accent-soft` · `--success-soft` · `--warning-soft` · `--danger-soft` | Tinted backgrounds for pills, rows, notices |
| `--on-accent` · `--on-danger` | Text and icons on a filled accent or danger background |
| `--scrim` | Behind dialogs |
| `--shadow` · `--shadow-sm` | Floating surfaces, hover lift |
| `--skeleton-highlight` | The moving band in skeletons |

### Type, shape, icons, motion (shared by both modes)

| Token | Role |
|---|---|
| `--font-display` · `--font-body` · `--font-ui` · `--font-mono` | Headings · long text · controls and labels · code and keys |
| `--ui-size` · `--body-size` · `--display-weight` | Control text size · long text size · heading weight |
| `--radius-sm` · `--radius` · `--radius-lg` · `--radius-pill` | Controls and rows · cards and menus · dialogs and floating panels · pills |
| `--border-width` · `--focus-width` | Hairlines · focus outline |
| `--space` | Density unit. Paddings, gaps and control heights are multiples of it |
| `--icon-size` · `--icon-stroke` | Icon box · stroke width on the 24-unit grid |
| `--ease` · `--ease-emphasized` · `--ease-spring` | Standard, emphasized and spring curves |
| `--motion-<slot>` | Duration and curve for one slot, e.g. `--motion-button-hover: 120ms var(--ease)` (the slot name with `.` written as `-`) |

### Contrast

Measured against `--ground` and `--surface` in both modes:

- `--text`, `--text-muted`: at least 4.5:1.
- `--text-faint`: at least 3:1.
- Every `--on-*` on its colour: at least 4.5:1.
- `--accent`, `--focus`, `--danger` as text or icons: at least 3:1.

## Looks

Each theme picks one look per component. A look is a structural treatment:

| Look | Fill | Border | Corners | Feel |
|---|---|---|---|---|
| `open` | None | `--line` hairline, or none for text-like parts | `--radius-sm` | Flat, sits on the ground |
| `soft` | `--surface-raised` (controls) or `--surface` (panels) | None | `--radius` | Filled, quiet |
| `float` | `--surface` | None, with `--shadow` | `--radius-lg`, inset from the edges | Lifted off the ground |

Implement a look as a class on the component root (`look-open`, `look-soft`, `look-float`) that sets
local variables (`--look-bg`, `--look-border`, `--look-radius`, `--look-shadow`), which the component
reads. Switching a theme then only changes the class.

## Motion presets

A slot's preset says *what* moves. Its token says *how long* and *on which curve*.

| Preset | Behaviour |
|---|---|
| `none` | Instant |
| `fade` | Opacity 0 → 1 |
| `rise` | Opacity plus translateY(8px) → 0 |
| `scale` | Opacity plus scale(.95) → 1 from the trigger's corner |
| `zoom` | Opacity plus scale(.9) → 1 from the centre |
| `slide` | The indicator or thumb moves to its new place (transform) |
| `width` | Width animates; labels fade in the first 60% |
| `height-fade` | `grid-template-rows: 0fr ↔ 1fr` plus opacity; the chevron rotates |
| `tint` | Background → `--hover` |
| `bar` | A 2px `--accent` bar on the leading edge |
| `fill` | Background → `--accent-soft`, text → `--text` |
| `lift` | translateY(-1px) plus `--shadow-sm` |
| `sink` | translateY(1px) while pressed |
| `ring` | Border → `--focus` plus a 3px `--accent-soft` ring |
| `underline` | A 2px `--focus` line inside the bottom edge |
| `border` | Border → `--focus` |
| `spin` | Continuous rotation |
| `shimmer` | A soft highlight sweeps across the track |
| `sweep` | A `--skeleton-highlight` band sweeps across |
| `pulse` | Opacity 100% ↔ 45% |

### Slots

| Slot | Component | Allowed presets |
|---|---|---|
| `sidebar.collapse` | Sidebar | `width`, `none` |
| `group.disclose` | Sidebar group | `height-fade`, `none` |
| `entry.hover` | Sidebar entry | `tint`, `none` |
| `entry.active` | Sidebar entry | `bar`, `fill` |
| `tabs.move` | Tabs | `slide`, `fade`, `none` |
| `button.hover` | Button, close button, chips | `lift`, `tint`, `none` |
| `button.press` | Button, close button, chips | `sink`, `none` |
| `menu.enter` | Menu, select | `scale`, `fade`, `none` |
| `field.focus` | Text field, select | `border`, `underline`, `ring` |
| `search.focus` | Search | `border`, `ring`, `none` |
| `switch.toggle` | Toggles | `slide`, `none` |
| `collapse.disclose` | Collapsible | `height-fade`, `none` |
| `tooltip.enter` | Tooltip | `fade`, `none` |
| `spinner.loop` | Spinner | `spin` |
| `bar.indeterminate` | Progress bar | `shimmer`, `pulse` |
| `skeleton.sweep` | Skeleton | `sweep`, `pulse` |
| `toast.enter` | Toast | `rise`, `fade` |
| `modal.enter` | Dialog | `zoom`, `rise`, `fade` |
| `page.enter` | State page, route changes | `fade`, `rise`, `none` |

## Components

Each component exists once and is reused wherever it appears. Files go in
`apps/desktop/src/lib/components/`, named after the id in PascalCase (`ui/sidebar-entry` → `SidebarEntry.svelte`).

### Structure

#### Sidebar · `ui/sidebar`

The app's navigation column: head, scrolling body, optional foot.

- Parts and states: head (mark, title, collapse button), body (search, groups), foot (one entry); resizable edge; collapsed to an icon rail
- Tokens: `--surface`, `--line`, `--text`, `--text-muted`
- Motion: `sidebar.collapse`

#### Sidebar group · `ui/sidebar-group`

An uppercase label that groups entries and toggles them.

- Parts and states: label; count (optional); add action (optional); open / closed
- Tokens: `--text-faint`, `--line`
- Motion: `group.disclose`

#### Sidebar entry · `ui/sidebar-entry`

One navigation row. The same component is used for any list of selectable rows.

- Parts and states: icon (optional); label; meta (optional); trailing action (optional); default, hover, active, disabled
- Tokens: `--text-muted`, `--text`, `--hover`, `--accent`, `--accent-soft`
- Motion: `entry.hover`, `entry.active`

#### Top bar · `ui/topbar`

The strip above the content: the title on the left, a toolbar on the right.

- Parts and states: title; toolbar (icon buttons, selects, separators)
- Tokens: `--ground`, `--line`, `--text`
- Motion: none

#### Tabs · `ui/tabs`

Two to five mutually exclusive views or options, with a moving indicator. It doubles as a segmented control.

- Parts and states: segments with optional icons; selected; disabled; small size
- Tokens: `--surface-raised`, `--line`, `--text`, `--text-muted`
- Motion: `tabs.move`

### Actions

#### Button · `ui/button`

One shape, several meanings.

- Parts and states: variants `neutral`, `primary` (`--accent`, the one action a screen leads with), `danger`, `ghost`; sizes `sm`, `md`, `lg`; leading icon; icon-only; disabled; loading (spinner instead of the icon)
- Tokens: `--surface-raised`, `--line`, `--accent`, `--on-accent`, `--danger`, `--on-danger`, `--text-faint`
- Motion: `button.hover`, `button.press`

#### Close button · `ui/close-button`

A round × for dialogs, panels, chips and toasts.

- Parts and states: sizes `sm`, `md`
- Tokens: `--text-muted`, `--hover`
- Motion: `button.hover`, `button.press`

#### Menu · `ui/menu`

The one popover used by every dropdown, context menu and select.

- Parts and states: items with icon, label, shortcut; checked item; headings; separators; danger items; submenus
- Tokens: `--surface`, `--line`, `--shadow`, `--hover`, `--accent`, `--danger`
- Motion: `menu.enter`

### Inputs

#### Text field · `ui/text-field`

Label, input, help text. Also covers the multi-line textarea.

- Parts and states: label; placeholder; help; error (help replaced by the reason in `--danger`); disabled; multi-line with optional counter
- Tokens: `--surface-raised`, `--line`, `--focus`, `--danger`, `--text-faint`
- Motion: `field.focus`

#### Search · `ui/search`

A leading icon, an input, and a shortcut hint that becomes a clear button once there is text.

- Parts and states: placeholder; shortcut hint (`ui/chips` kbd); clear button; compact (expands on focus)
- Tokens: `--surface-raised`, `--line`, `--text-faint`, `--focus`
- Motion: `search.focus`

#### Select · `ui/select`

A trigger that opens `ui/menu` with the choices.

- Parts and states: leading icon (optional); value; placeholder; open; disabled
- Tokens: `--surface-raised`, `--line`, `--text`
- Motion: `field.focus`, `menu.enter`

#### Toggles · `ui/toggles`

Checkbox, switch and radio. All of them use `--accent` when on.

- Parts and states: checkbox (on, off, indeterminate); switch; radio group; with description; disabled
- Tokens: `--accent`, `--on-accent`, `--surface-raised`, `--line`, `--text-faint`
- Motion: `switch.toggle`

### Content

#### Card · `ui/card`

A bounded block of content: a title, a body and optional actions.

- Parts and states: header (icon, title, meta); body; footer actions; interactive (hover, selected)
- Tokens: `--surface`, `--line`, `--radius`
- Motion: `button.hover` when interactive

#### Collapsible · `ui/collapsible`

A box with a header that shows and hides its content. Used for advanced settings and detail rows.

- Parts and states: title; subtitle; open / closed
- Tokens: `--surface`, `--line`, `--text-faint`
- Motion: `collapse.disclose`

#### Chips · `ui/chips`

Small marks: chips (toggle on and off), pills (status), keys (`kbd`) and avatars.

- Parts and states: chip on/off; pill `neutral`, `accent`, `success`, `warning`, `danger`; kbd; avatar (initials or picture)
- Tokens: `--hover`, `--accent-soft`, `--success-soft`, `--warning-soft`, `--danger-soft`, `--radius-pill`
- Motion: `button.hover`, `button.press` (chips only)

### Feedback and overlays

#### Tooltip · `ui/tooltip`

A short label for icon-only controls, shown after a hover-intent delay.

- Parts and states: above, below, left, right; with shortcut
- Tokens: `--text` (as background), `--ground` (as text)
- Motion: `tooltip.enter`

#### Spinner · `ui/spinner`

For anything still in progress. It is always `--focus`, because that colour marks live state.

- Parts and states: sizes 14 / 20 / 28; with label
- Tokens: `--focus`, `--line`
- Motion: `spinner.loop`

#### Progress bar · `ui/progress-bar`

Determinate when there is a number, indeterminate otherwise.

- Parts and states: value; indeterminate; with label
- Tokens: `--focus`, `--surface-raised`
- Motion: `bar.indeterminate`

#### Skeleton · `ui/skeleton`

The shape of content that is on its way. It stays up for at least 500ms so content doesn't flash in.

- Parts and states: text line; block; circle
- Tokens: `--surface-raised`, `--skeleton-highlight`
- Motion: `skeleton.sweep`

#### Toast · `ui/toast`

A one-line notice that leaves on its own after a few seconds.

- Parts and states: info; success; error; with action; position bottom-right (default) or top-centre
- Tokens: `--surface`, `--line`, `--shadow`, `--success`, `--danger`
- Motion: `toast.enter`

#### Dialog · `ui/dialog`

Confirmations and settings, shown over a scrim.

- Parts and states: title; description; body; footer actions (primary last); danger confirmation; settings layout (Sidebar on the left, pane on the right)
- Tokens: `--surface`, `--line`, `--scrim`, `--shadow`
- Motion: `modal.enter`, `page.enter` (switching settings panes)

#### State page · `ui/state-page`

Fills a view when there is nothing to show yet, or when loading failed. It says what happened and the one thing to do next.

- Parts and states: kinds `empty`, `error`, `offline`, `not-found`; icon; title; description; primary and secondary action; technical details (collapsible)
- Tokens: `--ground`, `--text-muted`, `--danger`
- Motion: `page.enter`

## Extending the system

Adding a component or a motion slot is a normal feature. It doesn't need an ADR.

1. Add the component under the right group above, in the same format: id `ui/<kebab-name>`, one
   sentence of purpose, parts and states, tokens (existing ones only), motion slots.
2. A new slot goes in the Slots table with its allowed presets.
3. Add the component to the Looks table of **every** theme in this folder, and add the new slot to
   its motion table and token block. Use `soft` and the closest existing slot's timing if unsure.
4. Re-render each theme picture (`node tools/theme-preview/render.mjs <name>`). The preview only
   shows components it knows. Add a specimen to `tools/theme-preview/preview.html` if the new one
   should be visible.

A new **token** changes what every theme must provide, so it is a schema change. See below.

## Replacing the system

Renaming or removing tokens, or swapping the component set wholesale (for example for a different
product domain), is a structural change: open an `adr` issue first. The accepted ADR then:

1. Bumps the schema (`theme/2`) in this file's title.
2. Rewrites this file.
3. Migrates every theme in this folder (or removes it).
4. Updates `tools/theme-preview/preview.html` and `apps/desktop/src/lib/components/`.
