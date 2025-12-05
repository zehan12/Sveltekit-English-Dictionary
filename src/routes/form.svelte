<script lang="ts">
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	// ShadCN UI Components
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	// Form State
	const word = writable<string>('');
	const isLoading = writable<boolean>(false);
	const errors = writable<{ word?: string }>({});

	// Predefined Words
	const predefinedWords = [
		'serendipity',
		'ephemeral',
		'luminous',
		'eloquent',
	];

	// Event Dispatcher
	const dispatch = createEventDispatcher();

	// Select predefined word
	const handlePredefinedClick = (selectedWord: string) => {
		word.set(selectedWord);
		toast.success(`Selected: ${selectedWord}`);
	};

	// Clear the input
	const clearInput = () => {
		word.set('');
		toast.info('Input cleared');
	};

	// Remove error after a delay
	const unMountError = (ms: number) => {
		setTimeout(() => {
			errors.set({ word: '' });
		}, ms);
	};

	// Handle Form Submission
	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		isLoading.set(true);

		let currentWord: string = '';
		word.subscribe((w) => (currentWord = w))();

		// Validation
		if (!currentWord.trim()) {
			errors.set({ word: 'Please enter a word.' });
			toast.error('Please enter a word');
			unMountError(1200);
			isLoading.set(false);
			return;
		}

		if (!/^[a-zA-Z\s-]+$/.test(currentWord)) {
			errors.set({ word: 'No special characters or numbers allowed.' });
			toast.error('Invalid input');
			unMountError(1200);
			isLoading.set(false);
			return;
		}

		// Dispatch event with word value
		dispatch('submit', { word: currentWord });
		toast.success('Submitted successfully');
		isLoading.set(false);
	};
</script>

<!-- Form UI -->
<form class="w-full space-y-3 sm:space-y-4" on:submit|preventDefault={handleSubmit}>
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class="block text-sm font-semibold text-gray-700 sm:text-base">Enter Word to Search</label>

	<!-- Predefined Words -->
	<div class="flex flex-wrap gap-2 sm:gap-3">
		{#each predefinedWords as predefinedWord}
			<Button
				on:click={() => handlePredefinedClick(predefinedWord)}
				variant="destructive"
				class="h-6 cursor-pointer rounded-lg bg-gray-200 px-2 py-0 text-xs text-gray-800 hover:bg-gray-300 sm:h-7 sm:px-3 sm:text-sm"
				type="button"
			>
				{predefinedWord}
			</Button>
		{/each}
		<Button
			on:click={clearInput}
			variant="destructive"
			class="h-6 cursor-pointer rounded-lg bg-red-600 px-2 py-0 text-xs text-white hover:bg-red-600/90 sm:h-7 sm:px-3 sm:text-sm"
			type="button"
		>
			clear
		</Button>
	</div>

	<!-- Input and Submit -->
	<div class="flex flex-col gap-2 sm:flex-row">
		<Input
			class="w-full rounded-lg border border-gray-300  p-2 focus-visible:ring-indigo-500"
			placeholder="e.g., ephemeral"
			bind:value={$word}
			aria-invalid={$errors?.word ? 'true' : 'false'}
		/>
		<Button
			type="submit"
			class="w-full bg-indigo-500 text-sm font-semibold hover:bg-indigo-600 sm:w-40 sm:text-base"
		>
			{#if $isLoading}
				Loading...
			{:else}
				Submit
			{/if}
		</Button>
	</div>

	<!-- Display Errors -->
	{#if $errors?.word}
		<p class="mt-1 text-xs text-red-500 sm:text-sm">{$errors.word}</p>
	{/if}
</form>
