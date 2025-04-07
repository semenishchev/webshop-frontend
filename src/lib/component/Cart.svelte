<script lang="ts">
	import { Drawer, Button, CloseButton, TextPlaceholder, ImagePlaceholder, Skeleton } from 'flowbite-svelte';
	import { CartSolid } from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import { onMount } from 'svelte';
	import CartPlaceholder from '$lib/component/CartPlaceholder.svelte';

	let { id, hidden = $bindable(true) } = $props();

	let cartItems = $state([])

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	};
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.code !== "Escape") return;
		hidden = true;
	};
	onMount(() => {
		window.addEventListener("keydown", handleKeydown)
		return () => window.removeEventListener("keydown", handleKeydown);
	});
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hidden} id={id} placement="right" width="w-100">
	<div class="flex items-center">
		<h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
			<CartSolid class="w-5 h-5 me-2.5" />Cart
		</h5>
		<CloseButton onclick={() => (hidden = true)} class="mb-4 dark:text-white" />
	</div>
	<div class="flex-col gap-y-3">
		<CartPlaceholder/>
		<CartPlaceholder/>
		<CartPlaceholder/>
		<div class="grid grid-cols-1 gap-4 mt-4">
			<Button color="primary" href="/" class="w-full gap-4" disabled>
				<div class="font-medium">Checkout</div>
			</Button>
			<Button color="gray" onclick={() => (hidden = true)} class="w-full">
				<span class="font-medium">Continue Shopping</span>
			</Button>
		</div>
	</div>
</Drawer>