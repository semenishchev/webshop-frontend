<script lang="tsx">
	import '../app.css';
	import { Navbar, Search, NavBrand, DarkMode } from 'flowbite-svelte';
	import NavbarButton from '$lib/component/NavbarButton.svelte';
	import { CartOutline, UserCircleOutline } from 'flowbite-svelte-icons'
	import { onMount } from 'svelte';
	import { fetchUser, currentUser } from '$lib/user';
	// import { debounce } from 'lodash'; // optional for better UX

	let isMobile = $state(false);

	const handleResize = () => {
		isMobile = window.innerWidth < 768;
	};

	onMount(() => {
		fetchUser("me").then(user => {
			currentUser.set(user);
			console.log(user);
		}).catch(e => {
			console.error("Failed to set user: " + e);
		});
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	let { children } = $props();
</script>

<Navbar class="dark:bg-gray-900 dark:text-blue-100 border-b dark:border-gray-800 flex flex-col md:flex-row md:items-center gap-2 px-4 py-2">
	<div class="w-full flex justify-between items-center gap-4">
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Webshop</span>
		</NavBrand>

		{#if !isMobile}
			<div class="flex-1 flex justify-center">
				<Search class="search-bar w-full sm:w-[500px]" />
			</div>
		{/if}

		<div class="flex items-center gap-4">
			<DarkMode />

			<NavbarButton aria-label="Login">
				<UserCircleOutline class="w-5 h-5" />
			</NavbarButton>
			<NavbarButton aria-label="Cart">
				<CartOutline class="w-5 h-5" />
			</NavbarButton>
		</div>
	</div>

	{#if isMobile}
		<div class="w-full px-1">
			<Search class="search-bar mt-2" />
		</div>
	{/if}
</Navbar>

{@render children()}


