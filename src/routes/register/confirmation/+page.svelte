<script lang="ts">
import Centered from '$lib/component/Centered.svelte';
import { onMount } from 'svelte';
import { checkIfEmailConfirmed } from '$lib/user';
let { data } = $props();
let interval: number | null = null;
const email = data.email;
let verified = $state(false);
onMount(() => {
	interval = setInterval(async () => {

		if(await checkIfEmailConfirmed(email!)) {
			clearInterval(interval!)
			verified = true
		}
	}, 5000);
	return () => {
		clearInterval(interval!);
	}
})
</script>
<Centered>
{#if verified}
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Email verified</div>
	<p>
		You may <a href="/login" class="text-blue-500 underline">log in</a> now
	</p>
{:else}
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Email confirmation</div>
	<p>
		Please confirm your email {data.email}
	</p>
{/if}
</Centered>