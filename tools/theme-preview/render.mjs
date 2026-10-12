#!/usr/bin/env node
// Renders docs/themes/<name>.png from docs/themes/<name>.md.
//
//   node tools/theme-preview/render.mjs <name>               write the PNG
//   node tools/theme-preview/render.mjs <name> --html <file> write the HTML only, to open in a browser
//
// Needs Node 22+ and a Chrome or Chromium install (set CHROME_PATH if it isn't found).
// No npm dependencies: it drives Chrome over the DevTools protocol.

import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const WIDTH = 1440;
const SCALE = 2;

const [name, flag, htmlOut] = process.argv.slice(2);
if (!name) fail('usage: render.mjs <theme-name> [--html <file>]');

const mdPath = join(repo, 'docs/themes', `${name}.md`);
if (!existsSync(mdPath)) fail(`no theme at ${mdPath}`);
const theme = parseTheme(readFileSync(mdPath, 'utf8'));

const html = readFileSync(join(here, 'preview.html'), 'utf8')
	.replace('/*THEME-TOKENS*/', theme.css)
	.replace('<!--THEME-FONTS-->', fontLinks(theme.typography))
	.replace('<!--THEME-DATA-->', `<script>window.THEME = ${JSON.stringify(theme)};</script>`);

if (flag === '--html') {
	writeFileSync(resolve(htmlOut ?? `${name}.html`), html);
	process.exit(0);
}

const work = mkdtempSync(join(tmpdir(), 'theme-preview-'));
const page = join(work, 'index.html');
writeFileSync(page, html);
try {
	const png = await screenshot(pathToFileURL(page).href, work);
	const out = join(repo, 'docs/themes', `${name}.png`);
	writeFileSync(out, png);
	console.log(`wrote ${out}`);
} finally {
	rmSync(work, { recursive: true, force: true, maxRetries: 5 });
}

// ---- theme file ----

function parseTheme(md) {
	const css = md.match(/```css\n([\s\S]*?)```/)?.[1];
	if (!css) fail('the theme has no ```css token block');
	const looks = Object.fromEntries(table(md, 'Looks').map(([id, look]) => [id, look]));
	const motion = table(md, 'Motion').map(([slot, preset, duration, curve]) => ({ slot, preset, duration, curve }));
	const typography = table(md, 'Typography').map(([role, family, pkg]) => ({ role, family, pkg }));
	const icons = section(md, 'Icons')
		.match(/Stroke ([\d.]+).*?(\d+px)/s)
		?.slice(1)
		.join(' · ');
	return {
		name: md.match(/^# Theme: (.+)$/m)?.[1]?.trim() ?? name,
		description: md.match(/^> (.+)$/m)?.[1]?.trim() ?? '',
		schema: md.match(/Schema `([^`]+)`/)?.[1] ?? 'theme/1',
		css,
		looks,
		motion,
		typography,
		icons: icons ? `outline · ${icons}` : 'outline',
	};
}

function section(md, title) {
	const start = md.indexOf(`\n## ${title}\n`);
	if (start < 0) return '';
	const rest = md.slice(start + title.length + 5);
	const end = rest.search(/\n## /);
	return end < 0 ? rest : rest.slice(0, end);
}

function table(md, title) {
	return section(md, title)
		.split('\n')
		.filter((l) => l.startsWith('|'))
		.slice(2) // header and separator
		.map((l) =>
			l
				.slice(1, -1)
				.split('|')
				.map((c) => c.trim().replace(/`/g, '')),
		);
}

function fontLinks(typography) {
	const pkgs = [...new Set(typography.map((t) => t.pkg).filter((p) => p && p !== 'system'))];
	return pkgs
		.map((pkg) => {
			const css = join(repo, 'apps/desktop/node_modules', pkg, 'index.css');
			if (existsSync(css)) return `<link rel="stylesheet" href="${pathToFileURL(css).href}" />`;
			console.warn(`font package ${pkg} is not installed in apps/desktop; the picture uses the fallback font`);
			return '';
		})
		.join('\n');
}

// ---- Chrome ----

function findChrome() {
	if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
	const candidates = {
		darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium'],
		win32: [
			`${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
			`${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
		],
	}[process.platform] ?? [];
	for (const path of candidates) if (existsSync(path)) return path;
	for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
		try {
			return execFileSync('which', [bin], { encoding: 'utf8' }).trim();
		} catch {}
	}
	fail('Chrome or Chromium not found. Set CHROME_PATH.');
}

async function screenshot(url, profile) {
	const chrome = spawn(
		findChrome(),
		['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank'],
		{ stdio: 'ignore' },
	);
	try {
		const portFile = join(profile, 'DevToolsActivePort');
		for (let n = 0; !existsSync(portFile); n++) {
			if (n > 100) fail('Chrome did not start');
			await sleep(100);
		}
		const port = readFileSync(portFile, 'utf8').split('\n')[0];
		const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
		const cdp = await connect(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);

		await cdp('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 1000, deviceScaleFactor: SCALE, mobile: false });
		await cdp('Page.enable');
		const loaded = cdp.once('Page.loadEventFired');
		await cdp('Page.navigate', { url });
		await loaded;
		const { result } = await cdp('Runtime.evaluate', {
			expression: 'document.fonts.ready.then(() => document.documentElement.scrollHeight)',
			awaitPromise: true,
			returnByValue: true,
		});
		const { data } = await cdp('Page.captureScreenshot', {
			format: 'png',
			captureBeyondViewport: true,
			clip: { x: 0, y: 0, width: WIDTH, height: result.value, scale: 1 },
		});
		cdp.close();
		return Buffer.from(data, 'base64');
	} finally {
		const exited = new Promise((r) => chrome.once('exit', r));
		chrome.kill();
		await exited;
	}
}

function connect(wsUrl) {
	return new Promise((resolveConn, reject) => {
		const ws = new WebSocket(wsUrl);
		let id = 0;
		const pending = new Map();
		const waiters = new Map();
		ws.onerror = reject;
		ws.onmessage = ({ data }) => {
			const msg = JSON.parse(data);
			if (msg.id && pending.has(msg.id)) {
				const { ok, err } = pending.get(msg.id);
				pending.delete(msg.id);
				msg.error ? err(new Error(msg.error.message)) : ok(msg.result);
			} else if (msg.method && waiters.has(msg.method)) {
				waiters.get(msg.method)(msg.params);
				waiters.delete(msg.method);
			}
		};
		ws.onopen = () => {
			const send = (method, params = {}) =>
				new Promise((ok, err) => {
					pending.set(++id, { ok, err });
					ws.send(JSON.stringify({ id, method, params }));
				});
			send.once = (method) => new Promise((ok) => waiters.set(method, ok));
			send.close = () => ws.close();
			resolveConn(send);
		};
	});
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function fail(message) {
	console.error(message);
	process.exit(1);
}
