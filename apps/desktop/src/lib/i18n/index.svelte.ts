// Translations. Every user-visible string goes through `t()`. Locales are the JSON files in this
// folder, named by their BCP 47 code; `en` is the default and the fallback for missing keys.
// See docs/languages.md.
import en from './en.json';

export type MessageKey = keyof typeof en;
type Messages = Partial<Record<MessageKey, string>>;

export const defaultLocale = 'en';

const files = import.meta.glob<Messages>('./*.json', { eager: true, import: 'default' });
export const locales: Record<string, Messages> = Object.fromEntries(
	Object.entries(files).map(([path, messages]) => [path.slice(2, -'.json'.length), messages])
);

function match(wanted: readonly string[]): string {
	for (const tag of wanted) {
		if (tag in locales) return tag;
		const base = tag.split('-')[0];
		if (base in locales) return base;
	}
	return defaultLocale;
}

let current = $state(match(typeof navigator === 'undefined' ? [] : navigator.languages));

export function getLocale(): string {
	return current;
}

export function setLocale(code: string): void {
	current = match([code]);
	document.documentElement.lang = current;
}

/** Looks up `key` in the current locale. `{name}` placeholders are filled from `params`. */
export function t(key: MessageKey, params: Record<string, string | number> = {}): string {
	const text = locales[current]?.[key] ?? en[key];
	return text.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}
