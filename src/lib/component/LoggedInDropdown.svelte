<script lang="ts">
	import { Alert, Button, Dropdown, DropdownDivider, Modal } from 'flowbite-svelte';
	import { ArrowLeftToBracketOutline, ProfileCardOutline, ReceiptOutline, UserSettingsOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';

	import { currentUser, signOut, type User } from '$lib/user.js';
	import { get } from 'svelte/store';
	import IconedDropdownItem from '$lib/component/IconedDropdownItem.svelte';
	import LoadableButton from '$lib/component/LoadableButton.svelte';
	import { extractMessage } from '$lib/util';
	const user = get(currentUser) as User; // not null at this point
	let signoutRequestOpen = $state(false);
	let currentError = $state("");
	const signoutAction = async () => {
		try {
			await signOut();
			window.location.href = '/'
			signoutRequestOpen = false;
		} catch (e) {
			console.error(e);
			currentError = extractMessage(e) ?? "Unknown error";
			return false;
		}
		return true;
	}
</script>

<Dropdown>
	<div slot="header" class="px-4 py-2">
		{#if user.profile?.fullName}
			<span class="block text-sm text-gray-900 dark:text-white">{user.profile.fullName}</span>
		{/if}
		<span class="block truncate text-sm font-medium">{user.email}</span>
	</div>
	<IconedDropdownItem href="/orders/me"><ReceiptOutline/>My orders</IconedDropdownItem>
	<IconedDropdownItem href="/profile/me"><ProfileCardOutline/>My profile</IconedDropdownItem>
	<DropdownDivider/>
	{#if (user.roles?.length ?? 0) || user.isSuperuser}
		<IconedDropdownItem><UserSettingsOutline/>Administration</IconedDropdownItem>
		<DropdownDivider/>
	{/if}
	<IconedDropdownItem onclick={() => signoutRequestOpen = true}>
		<ArrowLeftToBracketOutline class="text-red-500"/>
		<span class="text-red-500">Sign out</span>
	</IconedDropdownItem>
	<Modal bind:open={signoutRequestOpen} size="xs" autoclose class="dark:bg-gray-800">
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to log out?</h3>
			<p class="mb-5 text-sm font-normal">If you log out you will need to log in again</p>
			{#if currentError !== ""}
				<Alert color="red" class="bg-red-100 dark:bg-gray-900 mb-6">
					<div class="flex items-center gap-3">
						<ExclamationCircleOutline class="w-5 h-5" />
						<span class="text-lg font-medium">{currentError}</span>
					</div>
				</Alert>
			{/if}
			<LoadableButton color="red" class="me-2" action={signoutAction}>Yes, I'm sure</LoadableButton>
			<Button color="alternative">No, cancel</Button>
		</div>
	</Modal>
</Dropdown>