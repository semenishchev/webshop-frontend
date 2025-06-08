<script lang="ts">
	import { get } from 'svelte/store';
	import { currentUser, fetchUser, type User } from '$lib/user.js';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { extractMessage } from '$lib/util';
	import { Alert, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Centered from '$lib/component/Centered.svelte';

	let { data } = $props();
	const requestedUserId = data.userId;
	let user: User | null | undefined = $state(requestedUserId === "me" ? get(currentUser) : null);
	let currentError = $state("");
	onMount(() => {
		if(user === null) {
			fetchUser(requestedUserId)
				.then(_user => {
					if(!_user) {
						currentError = "Failed to fetch user with id: " + requestedUserId;
						return;
					}
					user = _user;
				})
				.catch(e => currentError = extractMessage(e) ?? "Unknown error")
		}
	});
</script>
<Centered class="items-center pt-4">
	{#if currentError !== ""}
		<Alert color="red" class="bg-red-100 dark:bg-gray-900 mb-6">
			<div class="flex items-center gap-3">
				<InfoCircleSolid class="w-5 h-5" />
				<span class="text-lg font-medium">{currentError}</span>
			</div>
		</Alert>
	{:else if user}
		<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Welcome back, {user.profile.fullName}</div>
	{:else}
		<div class="absolute top1/2 left-1/2">
			<Spinner size="10"/>
		</div>

<!--		<div class="h-3 w-full bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>-->
	{/if}
</Centered>
