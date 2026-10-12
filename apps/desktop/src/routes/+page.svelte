<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import { t } from '$lib/i18n/index.svelte';

	let name = $state('');
	let greeting = $state('');

	async function greet(event: SubmitEvent) {
		event.preventDefault();
		try {
			greeting = await invoke<string>('greet', { name });
		} catch {
			greeting = t('home.error');
		}
	}
</script>

<main>
	<h1>{t('app.title')}</h1>
	<p class="tagline">{t('home.tagline')}</p>

	<form onsubmit={greet}>
		<label for="name">{t('home.name.label')}</label>
		<div class="row">
			<input id="name" bind:value={name} placeholder={t('home.name.placeholder')} />
			<button type="submit">{t('home.greet')}</button>
		</div>
	</form>

	{#if greeting}
		<p class="greeting" aria-live="polite">{greeting}</p>
	{/if}
</main>

<style>
	main {
		max-width: 68ch;
		margin: 0 auto;
		padding: calc(var(--space) * 20) calc(var(--space) * 6);
	}

	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: var(--display-weight);
		font-size: 3rem;
	}

	.tagline {
		margin: calc(var(--space) * 2) 0 calc(var(--space) * 10);
		color: var(--text-muted);
		font-family: var(--font-body);
		font-size: var(--body-size);
	}

	label {
		display: block;
		margin-bottom: calc(var(--space) * 2);
		color: var(--text-muted);
	}

	.row {
		display: flex;
		gap: calc(var(--space) * 2);
	}

	input,
	button {
		height: calc(var(--space) * 9);
		padding: 0 calc(var(--space) * 3);
		border: var(--border-width) solid var(--line);
		border-radius: var(--radius-sm);
		font: inherit;
		color: var(--text);
	}

	input {
		flex: 1;
		background: transparent;
		transition: border-color var(--motion-field-focus);
	}

	input:focus {
		border-color: var(--focus);
	}

	button {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
		cursor: pointer;
		transition:
			transform var(--motion-button-hover),
			box-shadow var(--motion-button-hover);
	}

	button:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	button:active {
		transform: translateY(1px);
	}

	.greeting {
		margin-top: calc(var(--space) * 6);
		font-family: var(--font-body);
		font-size: var(--body-size);
	}
</style>
