# Languages

The languages the app's interface ships in. Every user-visible string comes from a translation
file; nothing is hard-coded in a component.

## Supported

| Code | Language | Status | File |
|---|---|---|---|
| `en` | English | Default, complete | [`en.json`](../apps/desktop/src/lib/i18n/en.json) |

**Status** is one of: *Default, complete* (the source of every key), *Complete* (every key
translated), or *Partial* (missing keys fall back to English). Partial locales can ship.

## How it works

- Translation files live in `apps/desktop/src/lib/i18n/`, one JSON file per locale, named by its
  [BCP 47](https://www.rfc-editor.org/info/bcp47) code (`de.json`, `pt-BR.json`). Every file in that
  folder is picked up on its own; there is no list to register it in.
- `en.json` is the source of truth. A key that is not in `en.json` does not exist.
- On start the app uses the first of the system's preferred languages it has a file for (first the
  exact tag, then the base language: `de-AT` → `de`), otherwise `en`. Call `setLocale(code)` to change it.
- Components use `t('area.thing')`. Placeholders are written `{name}` and filled with
  `t('key', { name })`.

## Keys

- Flat, dotted, lower case: `<screen or component>.<thing>[.<part>]`, e.g. `home.name.label`.
- Name keys after what the text is for, not what it says. A key keeps its name when the wording
  changes.
- Remove a key from every file when it is no longer used.

## Adding a language

Run `/add-language <code>` in Claude Code, or by hand:

1. Copy `en.json` to `<code>.json` and translate the values. Keep the keys and placeholders.
2. Add a row to the table above.
3. Run `npm run check` in `apps/desktop`.
