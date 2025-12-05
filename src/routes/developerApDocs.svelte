<script>
	import { sampleResponse } from '$lib/data';
	import { toast } from 'svelte-sonner';

	// API details
	let apiEndpoint = 'https://english-dictionary-vert.vercel.app/api/v1/words/{word}';

	// Modal state
	let showResponseModal = false;

	// Format JSON as a single line for display
	const formatJsonInline = (/** @type {unknown} */ obj) => {
		return JSON.stringify(obj).replace(/"/g, '"');
	};

	// Format JSON with proper indentation for the modal
	const formatJsonPretty = (/** @type {unknown} */ obj) => {
		return JSON.stringify(obj, null, 2)
			.replace(/"([^"]+)":/g, '"$1":')
			.replace(/"/g, '"');
	};

	// Copy endpoint to clipboard
	const copyEndpoint = () => {
		navigator.clipboard
			.writeText(apiEndpoint)
			.then(() => {
				toast.success('Endpoint copied to clipboard!');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	};

	// Toggle response modal
	const toggleResponseModal = () => {
		showResponseModal = !showResponseModal;
	};
</script>

<div class="api-docs">
	<div class="container">
		<h1>Developer API</h1>

		<p class="description">
			Use the API to programmatically retrieve definitions and details for English words:
		</p>

		<div class="code-block endpoint">
			<code>GET {apiEndpoint}</code>
			<button class="copy-btn" on:click={copyEndpoint} title="Copy to clipboard">
				<!-- Fixed SVG for copy button -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
				</svg>
			</button>
		</div>

		<p class="section-title">Returns JSON:</p>

		<div class="code-block response">
			<code>{formatJsonInline(sampleResponse).substring(0,50)+"..."}</code>
			<button class="zoom-btn" on:click={toggleResponseModal} title="Expand JSON">
				<!-- Fixed SVG for zoom button -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="expand-icon"
				>
					<path d="M15 3h6v6"></path>
					<path d="M10 14L21 3"></path>
					<path d="M9 21H3v-6"></path>
					<path d="M3 3l6 6"></path>
				</svg>
			</button>
		</div>

		<p class="note">
			Returns a detailed JSON response containing word definitions, phonetics, synonyms, and more.
			If the word is not found, the API will return a 404 error.
		</p>
	</div>
</div>

<!-- Sample Response Modal -->
{#if showResponseModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" on:click={() => (showResponseModal = false)}>
		<div class="modal-content" on:click|stopPropagation>
			<button class="close-btn" on:click={() => (showResponseModal = false)}>×</button>
			<h3>Sample Response</h3>
			<div class="scroll-container">
				<pre>{formatJsonPretty(sampleResponse)}</pre>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Base Styles */
	.api-docs {
		background-color: #6366f1;
		color: #ffffff;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		padding: 0.5rem 1rem;
		margin-top: 2rem;
		border-radius: 20px;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}

	h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-top: 0.3em;
		margin-bottom: 0.5rem;
		color: #fff; /* Pink color from the image */
	}

	.description,
	.section-title,
	.note {
		font-size: 0.8rem;
		line-height: 1;
		margin-bottom: 1rem;
	}

	.code-block {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
		overflow-x: auto;
		position: relative;
	}

	.endpoint code {
		color: #ffffff;
		font-family: 'Courier New', monospace;
		font-size: 0.8rem;
	}

	.response code {
		color: #ffffff;
		font-family: 'Courier New', monospace;
		font-size: 0.8rem;
		white-space: nowrap; /* Keep on one line */
	}

	.note {
		font-size: 0.7rem;
		opacity: 0.9;
	}

	/* Button styles */
	.copy-btn,
	.zoom-btn {
		position: absolute;
		top: 0.5rem;
		background: transparent;
		border: none;
		color: #ffffff;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.2s;
		padding: 0.25rem;
	}

	.copy-btn:hover,
	.zoom-btn:hover {
		opacity: 1;
	}

	.copy-btn {
		right: 0.5rem;
	}

	.zoom-btn {
		right: 0.5rem;
	}

	/* Fix SVG rendering */
	.expand-icon {
		display: inline-block;
		vertical-align: middle;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background-color: #6366f1;
		border-radius: 0.5rem;
		padding: 1.5rem;
		width: 90%;
		max-width: 800px;
		max-height: 90vh; /* Ensure modal fits within viewport */
		overflow: hidden; /* Prevent modal itself from scrolling */
		position: relative;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.close-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: transparent;
		border: none;
		color: #ffffff;
		font-size: 1.5rem;
		cursor: pointer;
		line-height: 1;
	}

	.modal-content h3 {
		margin-top: 0;
		color: #fffafb;
	}

	.scroll-container {
		height: calc(90vh - 100px); /* Adjust height dynamically */
		overflow-y: auto; /* Enable vertical scrolling */
		padding-right: 1rem; /* Add padding for scrollbar */
	}

	.modal-content pre {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
		padding: 1rem;
		color: #ffffff;
		font-family: 'Courier New', monospace;
		white-space: pre-wrap;
		margin: 0;
	}

	/* Responsive Styles */
	@media (max-width: 768px) {
		.api-docs {
			padding: 1.5rem 0.75rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		.description,
		.section-title,
		.note {
			font-size: 0.7rem;
		}

		.endpoint code,
		.response code {
			font-size: 0.7rem;
		}

		.modal-content {
			width: 95%;
			padding: 1rem;
		}

		.scroll-container {
			height: calc(90vh - 80px); /* Adjust for smaller screens */
		}
	}
</style>
