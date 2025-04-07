<script lang="ts">
	import { Dropdown } from 'flowbite-svelte';
	import { AddressBookOutline, UserAddOutline } from 'flowbite-svelte-icons';
	import IconedDropdownItem from '$lib/component/IconedDropdownItem.svelte';
</script>

<Dropdown>
	<IconedDropdownItem href="/login"><AddressBookOutline/>Log in</IconedDropdownItem>
	<IconedDropdownItem href="/register"><UserAddOutline class="flex-shrink-0"/>Sign in</IconedDropdownItem>
</Dropdown>