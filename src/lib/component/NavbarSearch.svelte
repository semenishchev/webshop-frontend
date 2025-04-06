<script lang="ts">
	import { Listgroup, ListgroupItem, Search } from 'flowbite-svelte';
	import pkg from "lodash";
	const {debounce} = pkg;

	let query = $state("");
	let suggestions: string[] = $state([]);

	const fetchSuggestions = debounce(async () => {
		if (!query.trim()) {
			suggestions = [];
			return;
		}
		// simulate search
		suggestions = ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'].filter(s =>
			s.toLowerCase().includes(query.toLowerCase())
		);
	}, 200);

	const unfocus = () => {
		suggestions = [];
	}
</script>

<div class="flex-1 flex justify-center" onfocusout={unfocus}>
	<div class="relative w-full sm:w-[500px]">
		<Search class="search-bar bg-gray-800 w-full sm:w-[500px]" bind:value={query} on:input={fetchSuggestions}/>
		{#if suggestions.length}
			<div class="absolute z-50 w-full mt-1 rounded-t-none border-t-0 rounded-b-lg">
				<Listgroup>
					{#each suggestions as item}
						<ListgroupItem href="#" class="cursor-pointer text-white hover:bg-gray-400">
							{item}
						</ListgroupItem>
					{/each}
				</Listgroup>
			</div>
		{/if}
	</div>
</div>