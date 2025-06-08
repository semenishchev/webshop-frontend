<script lang="ts">

import Centered from '$lib/component/Centered.svelte';
import { Spinner } from 'flowbite-svelte';
import { currentUser, type User } from '$lib/user.js';
import { onMount } from 'svelte';
import { get } from 'svelte/store';

let user: User | undefined = $state(undefined);
let noAccess = $state(false);
const checkUser = (_user: User | null) => {
	if(_user === null) {
		noAccess = true;
	} else {
		user = _user;
		if(!_user.superuser) {
			noAccess = true;
			return
		}
	}
}
onMount(() => {
	const existing = get(currentUser);
	if(existing) {
		checkUser(existing);
		return;
	}
	if(existing === undefined) {
		window.addEventListener("userAvailable", (e) => {
			checkUser(e.detail.user);
		});
		user = existing;
	} else {
		noAccess = true;
	}
})
let { children } = $props();
</script>

<Centered>
	{#if user === undefined}
		<div>
			<Spinner size="10"></Spinner>
		</div>
	{:else if noAccess}
		<p class="text-3xl">You have no access to view this page</p>
	{:else}
		{@render children()}
	{/if}
</Centered>