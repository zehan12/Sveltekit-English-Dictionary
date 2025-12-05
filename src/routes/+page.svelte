<script lang="ts">
	import { writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
		CardFooter
	} from '$lib/components/ui/card';

	import Form from './form.svelte';
	import DeveloperApDocs from './developerApDocs.svelte';

	// API Data State
	const apiResult = writable<any>(null);
	const isLoading = writable(false);
	const error = writable<string | null>(null);

	const socialLinks = [
		{ name: 'GitHub', url: 'https://github.com/zehan12' },
		{ name: 'Portfolio', url: 'https://zehankhan.vercel.app/' },
		{ name: 'Medium', url: 'https://medium.com/@zehan9211' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/zehan-khan-6001a4144/' }
	];

	// Handle form submission
	const handleSubmit = async (event: CustomEvent<{ word: string }>) => {
		const word = event.detail.word;
		isLoading.set(true);
		error.set(null);

		try {
			toast.loading('Fetching data...');
			const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

			if (!response.ok) {
				error.set('Word not found.');
				toast.error('Word not found.');
				throw new Error('Word not found.');
			}

			const result = await response.json();
			apiResult.set(result);
			toast.success('Data fetched successfully.');
		} catch (err) {
			apiResult.set(null);
			error.set('An error occurred while fetching data.');
		} finally {
			isLoading.set(false);
		}
	};
</script>

<main class="main flex h-full items-center justify-center overflow-auto py-10">
	<Card
		class="h-full w-full max-w-[95%] overflow-auto  shadow-lg md:h-fit md:max-w-[80%] lg:max-w-[1000px] xl:max-w-[1200px]"
	>
		<CardHeader>
			<CardTitle class="text-center text-xl font-bold sm:text-2xl">📔 English Dictionary</CardTitle>
			<CardDescription class="text-center text-sm sm:text-base"
				>Explore the world of words together.</CardDescription
			>
		</CardHeader>

		<CardContent>
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<!-- Form Component -->
				<div>
					<Form on:submit={handleSubmit} />
					<div class="hidden sm:block">
						<DeveloperApDocs />
					</div>
				</div>

				<div class="h-fit overflow-auto rounded-2xl p-4 text-black sm:h-[69vh]">
					{#if !$apiResult && !$error && !$isLoading}
						<div class="mt-10 text-center text-black">
							<p class="text-sm">Start by typing a word to get its meaning and pronunciation.</p>
						</div>
					{/if}

					<!-- Loading State -->
					{#if $isLoading}
						<div class="animate-pulse text-blue-300">Fetching response...</div>
					{/if}

					<!-- Error State -->
					{#if $error}
						<div class="mt-4 rounded bg-red-100 p-3 text-red-700">
							<strong>Error:</strong>
							{$error}
						</div>
					{/if}

					{#if $apiResult}
						{#each $apiResult as entry}
							<h2 class="text-xl font-bold">{entry.word}</h2>
							<p class="mb-2 text-sm italic">Phonetic: {entry.phonetic}</p>

							{#each entry.phonetics as ph}
								{#if ph.audio}
									<audio class="mb-2" controls src={ph.audio}></audio>
								{/if}
							{/each}

							{#each entry.meanings as meaning}
								<div class="mb-4">
									<p class="text-lg font-semibold underline">{meaning.partOfSpeech}</p>
									<ul class="mt-2 list-disc space-y-1 pl-5">
										{#each meaning.definitions as def, i}
											<li>
												{def.definition}
												{#if def.example}
													<br /><span class="text-sm italic">e.g., "{def.example}"</span>
												{/if}
											</li>
										{/each}
									</ul>
								</div>
							{/each}

							<div class="mt-4 text-sm underline">
								<a href={entry.sourceUrls[0]} target="_blank" rel="noopener">Source</a>
							</div>
						{/each}
					{:else}
						<p class="text-sm text-white">Search for a word to see results.</p>
					{/if}
				</div>
			</div>
			<div class="block sm:hidden">
				<DeveloperApDocs />
			</div>
		</CardContent>

		<CardFooter class="flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
			<p>Powered by Open Dictionary API</p>

			<div class="flex flex-wrap justify-center gap-4">
				{#each socialLinks as link}
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-500 hover:underline"
					>
						{link.name}
					</a>
				{/each}
			</div>

			<div class="text-gray-600">
				Made with <span class="text-red-500">❤️</span> by
				<a
					href="https://github.com/zehankhaan"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 hover:underline"
				>
					Zehan Khan
				</a>
			</div>
		</CardFooter>
	</Card>
</main>

<style>
	@media (min-width: 1024px) {
		main {
			height: 100vh;
			overflow: hidden;
		}
	}
</style>
