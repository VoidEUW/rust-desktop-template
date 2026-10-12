---
name: add-language
description: Add a UI language to the desktop app. Creates the translation file and lists it in docs/languages.md.
argument-hint: <bcp47-code>
disable-model-invocation: true
---

# Add language `$ARGUMENTS`

Read `docs/languages.md` first. It defines the file layout, key rules and status values.

1. `$ARGUMENTS` must be a valid BCP 47 tag (`de`, `pt-BR`). If `apps/desktop/src/lib/i18n/$ARGUMENTS.json`
   already exists, fill in its missing keys instead of overwriting it.
2. Create `apps/desktop/src/lib/i18n/$ARGUMENTS.json` with exactly the keys of `en.json`, in the same
   order, values translated. Keep `{placeholders}` unchanged. Keep product names untranslated.
   Match the tone of the English text.
3. Add a row to the **Supported** table in `docs/languages.md`. Status is `Complete`, or `Partial` if
   any value is left in English.
4. `cd apps/desktop && npm run check`.
5. Tell the user which strings you were unsure about, so a native speaker can review them.
