<script>
	import { DropdownItem } from 'flowbite-svelte';
</script>
<DropdownItem {...$$restProps}>
	<div class="flex flex-row gap-2">
		<slot/>
	</div>
</DropdownItem>