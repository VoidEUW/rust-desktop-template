# Briefs

Briefs are self-contained instructions for building a throwaway tool **outside** this repository,
for example in a Claude chat with artifacts, in another AI tool, or by hand. Each brief fixes the
export format, so whatever you build feeds straight back into the repo.

| Brief | You build | It exports | Bring it back |
|---|---|---|---|
| [theme-generator.md](theme-generator.md) | An interactive theme editor with a live preview | `<name>.md` in the theme format | Save to `docs/themes/`, run `node tools/theme-preview/render.mjs <name>`, then `/apply-theme <name>` |
| [mvp-prototype.md](mvp-prototype.md) | A clickable prototype of an app idea, built from the component system | `<slug>.idea.md`: screens, features, open decisions, new components, strings | `/import-idea <file>` turns it into issues |

## How to use one

1. Open a new chat in [Claude](https://claude.ai) (or the tool of your choice).
2. Paste the whole brief as the first message.
3. Attach the files listed under **Attach** in the brief.
4. Iterate until you like it, then ask for the export.

Exports aren't committed as they are. Themes become theme files; ideas become issues, and the
issues are the plan.
