<script lang="ts">
	import { Button, Dropdown, DropdownDivider, Modal } from 'flowbite-svelte';
	import { ArrowLeftToBracketOutline, ProfileCardOutline, ReceiptOutline, UserSettingsOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';

	import { currentUser, signOut, type User } from '$lib/user.js';
	import { get } from 'svelte/store';
	import IconedDropdownItem from '$lib/component/IconedDropdownItem.svelte';
	import LoadableButton from '$lib/component/LoadableButton.svelte';
	import { extractMessage } from '$lib/util';
	import { goto, invalidateAll } from '$app/navigation';
	const user = get(currentUser) as User; // not null at this point
	let signoutRequestOpen = $state(false);
	let currentError = $state("");
	const signoutAction = async () => {
		try {
			await signOut();
			signoutRequestOpen = false;
			await invalidateAll();
			window.location.href = '/'
		} catch (e) {
			console.error(e);
			currentError = extractMessage(e) ?? "Unknown error";
		}
		return false;
	}
</script>

<Dropdown>
	<IconedDropdownItem href="/orders/me"><ReceiptOutline/>My orders</IconedDropdownItem>
	<IconedDropdownItem href="/profile/me"><ProfileCardOutline/>My profile</IconedDropdownItem>
	<DropdownDivider/>
	{#if (user.roles?.length ?? 0) || user.isSuperuser}
		<IconedDropdownItem><UserSettingsOutline/>Administration</IconedDropdownItem>
		<DropdownDivider/>
	{/if}
	<IconedDropdownItem onclick={() => signoutRequestOpen = true}> <!-- todo: sign out with modal -->
		<ArrowLeftToBracketOutline class="text-red-500"/>
		<span class="text-red-500">Sign out</span>
	</IconedDropdownItem>
	<Modal bind:open={signoutRequestOpen} size="xs" autoclose class="dark:bg-gray-800">
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to log out?</h3>
			<p class="mb-5 text-sm font-normal">If you log out you will need to log in again</p>
			<LoadableButton color="red" class="me-2" action={signoutAction}>Yes, I'm sure</LoadableButton>
			<Button color="alternative">No, cancel</Button>
		</div>
	</Modal>
</Dropdown>