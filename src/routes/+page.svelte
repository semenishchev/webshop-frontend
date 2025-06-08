<script lang="ts">
	import { onMount } from 'svelte';
	import { type Category, fetchCategories, fetchedCategories } from '$lib/shop';
	import { get } from 'svelte/store';

	let categories = $state<Category[]>([]);
	onMount(async () => {
		categories = get(fetchedCategories);
		if(categories.length == 0) {
			categories = await fetchCategories();
		}
	});
</script>

<h1 class="text-3xl">Webshop</h1>
<h2 class="text-2xl">Choose category</h2>
{#each categories as category}
	<a href=`/view?category={category.id}` class="href">{category.name}</a>
{/each}
