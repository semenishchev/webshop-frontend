<script lang="ts">
	import { Drawer, Button, CloseButton, TextPlaceholder, ImagePlaceholder, Skeleton } from 'flowbite-svelte';
	import { CartSolid } from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import { onMount } from 'svelte';
	import CartPlaceholder from '$lib/component/CartPlaceholder.svelte';
	import { Cart, deinitLocalCart, initLocalCart, localCart } from '$lib/shop';
	import { currentUser, saveUserCart } from '$lib/user';
	import { get } from 'svelte/store';

	let { id, hidden = $bindable(true) } = $props();
	let cart = $state<Cart | null>(null);
	const user = get(currentUser);
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
		window.addEventListener("keydown", handleKeydown);
		initLocalCart();
		let currentCart: Cart | null = null;
		const existingLocalCart = get(localCart);
		if(existingLocalCart && user) {
			currentCart = user.cart;
			if(currentCart) {
				for (let entry of existingLocalCart.products.entries()) {
					currentCart.products.set(entry[0], entry[1]);
				}
			} else {
				currentCart = existingLocalCart;
			}
			deinitLocalCart();
			user.cart = currentCart;
		} else if(existingLocalCart) {
			currentCart = existingLocalCart;
		} else if(user) {
			currentCart = user.cart;
		}
		cart = currentCart ?? new Cart(new Map());
		if(user) {
			user.cart = cart;
			if(user.cart.products.size !== cart.products.size) {
				saveUserCart().catch(e => {
					console.error("Failed to save cart", e);
				});
			}
		}
		return () => window.removeEventListener("keydown", handleKeydown);
	});
</script>

<Drawer transitionType="fly" {transitionParams} hidden={hidden} id={id} placement="right" width="w-100">
	<div class="flex items-center">
		<h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
			<CartSolid class="w-5 h-5 me-2.5" />Cart
		</h5>
		<CloseButton onclick={() => (hidden = true)} class="mb-4 dark:text-white" />
	</div>
	<div class="flex-col gap-y-3">
		{#if cart && cart.mappedProducts}
			{#each cart.mappedProducts.entries() as product}
				<div class="flex mb-4 items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
					<div class="flex-shrink-0">
						<p>{product[0].name}</p>
					</div>
					<div class="flex-1 min-w-0">
						<div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2 w-full"></div>
						<div class="flex items-center space-x-3 mt-2">
							<div class="h-8 w-8 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
							<div class="h-8 w-20 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
							<div class="h-8 w-8 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<CartPlaceholder/>
			<CartPlaceholder/>
			<CartPlaceholder/>
		{/if}
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