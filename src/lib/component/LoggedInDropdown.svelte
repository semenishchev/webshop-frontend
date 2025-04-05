<script lang="ts">
	import { Dropdown, DropdownDivider } from 'flowbite-svelte';
	import { ArrowLeftToBracketOutline, ProfileCardOutline, ReceiptOutline, UserSettingsOutline } from 'flowbite-svelte-icons';

	import { currentUser, type User } from '$lib/user.js';
	import { get } from 'svelte/store';
	import IconedDropdownItem from '$lib/component/IconedDropdownItem.svelte';
	const user = get(currentUser) as User; // not null at this point
</script>

<Dropdown>
	<IconedDropdownItem><ReceiptOutline/>My orders</IconedDropdownItem>
	<IconedDropdownItem><ProfileCardOutline/>My profile</IconedDropdownItem>
	<DropdownDivider/>
	{#if user.roles.length || user.isSuperuser}
		<IconedDropdownItem><UserSettingsOutline/>Administration</IconedDropdownItem>
		<DropdownDivider/>
	{/if}
	<IconedDropdownItem class="text-red-500">
		<ArrowLeftToBracketOutline/>
		Sign out
	</IconedDropdownItem>
</Dropdown>