<script lang="ts">
	import { Listgroup, ListgroupItem, Search } from 'flowbite-svelte';
	import pkg from "lodash";
	import { autocomplete } from '$lib/shop';
	const {debounce} = pkg;

	let query = $state("");
	let searchedBefore = $state(false);
	let nothing = $state(false)
	let suggestions: string[] = $state([]);
	const props = $props()
	const fetchSuggestions = debounce(async () => {
		if (!query.trim()) {
			suggestions = [];
			searchedBefore = false;
			return;
		}
		suggestions = await autocomplete(query);
		if(suggestions.length === 0) {
			nothing = true;
		}
	}, 200);
	const onInput = () => {
		searchedBefore = true;
		nothing = false;
		fetchSuggestions()
	}

	const unfocus = () => {
		searchedBefore = false;
		suggestions = [];
	}
</script>

<div class="w-full sm:w-[500px]" onfocusout={unfocus} {...props}>
	<Search class="search-bar dark:bg-gray-800 w-full sm:w-[500px]" bind:value={query} on:input={onInput}/>
	{#if nothing}
		<div class="absolute z-50 w-full mt-1 rounded-t-none border-t-0 rounded-b-lg">
			<Listgroup>
				<ListgroupItem href="#" class="cursor-pointer dark:text-white dark:bg-gray-800">
					Nothing could be found by this search
				</ListgroupItem>
			</Listgroup>
		</div>
	{:else if searchedBefore}
		<div class="absolute z-50 w-full mt-1 rounded-t-none border-t-0 rounded-b-lg">
			<Listgroup>
				{#if suggestions.length}
					{#each suggestions as item}
						<ListgroupItem href="#" class="cursor-pointer dark:text-white dark:hover:bg-gray-400">
							{item}
						</ListgroupItem>
					{/each}
				{:else}
					<ListgroupItem href="#" class="cursor-pointer dark:text-white dark:hover:bg-gray-400">
						<div class="h-2 mb-1 mt-1 bg-gray-200 dark:bg-gray-700 w-full"></div>
					</ListgroupItem>
					<ListgroupItem href="#" class="cursor-pointer dark:text-white dark:hover:bg-gray-400">
						<div class="h-2 mb-1 mt-1 bg-gray-200 dark:bg-gray-700 w-full"></div>
					</ListgroupItem>
					<ListgroupItem href="#" class="cursor-pointer dark:text-white dark:hover:bg-gray-400">
						<div class="h-2 mb-1 mt-1 bg-gray-200 dark:bg-gray-700 w-full"></div>
					</ListgroupItem>
				{/if}
			</Listgroup>
		</div>
	{/if}
</div>