<script>
import Centered from '$lib/component/Centered.svelte';
import { onMount } from 'svelte';
let { data } = $props();
</script>

<Centered>
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Email confirmation</div>
	<p>
		Please confirm your email {data.email}
	</p>
</Centered>