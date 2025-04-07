<script>
	import { DropdownItem } from 'flowbite-svelte';
</script>
<DropdownItem {...$$restProps} class="flex gap-2 items-center">
<!--	<div >-->
<!--		<slot/>-->
<!--	</div>-->
	<slot/>
</DropdownItem>