<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, DarkMode, Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
	import NavbarButton from '$lib/component/NavbarButton.svelte';
	import { CartOutline, UserCircleOutline } from 'flowbite-svelte-icons'
	import { onMount } from 'svelte';
	import { fetchUser, currentUser, type User } from '$lib/user';
	import NavbarSearch from '$lib/component/NavbarSearch.svelte';
	import LoggedInDropdown from '$lib/component/LoggedInDropdown.svelte';
	import LoggedOutDropdown from '$lib/component/LoggedOutDropdown.svelte';

	let isMobile = $state(false);
	let isPageShort = $state(false); // used for footer docking
	let user = $state<User | null>(null);

	const handleResize = () => {
		isMobile = window.innerWidth < 760;
		isPageShort = document.documentElement.scrollHeight <= window.innerHeight;
	};

	onMount(() => {
		fetchUser("me").then(user => {
			currentUser.set(user);
			user = user;
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
			<NavbarSearch/>
		{/if}

		<div class="flex items-center gap-4">
			<DarkMode />

			<NavbarButton aria-label="Login">
				<UserCircleOutline class="w-5 h-5" />
				{#if user != null}
					<LoggedInDropdown/>
				{:else}
					<LoggedOutDropdown/>
				{/if}
			</NavbarButton>

			<NavbarButton aria-label="Cart">
				<CartOutline class="w-5 h-5" />
			</NavbarButton>
		</div>
	</div>

	{#if isMobile}
		<NavbarSearch/>
	{/if}
</Navbar>

<div class="container mx-auto">
	{@render children()}
</div>

<style>
    .docked {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>

<div class:docked={isPageShort}>
	<Footer class="dark:bg-gray-900 dark:text-blue-100 border-b dark:border-gray-800 gap-2 px-4 py-2">
		<div class="sm:flex sm:items-center sm:justify-between">
			<FooterCopyright href="/" by="Oleksandr Semenishchev; " copyrightMessage="Licensed under MIT" />
			<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
				<FooterLink href="https://github.com/semenishchev/webshop-frontend">Source code</FooterLink>
				<FooterLink href="https://github.com/semenishchev/webshop-backend">I am NOT a frontend developer</FooterLink>
			</FooterLinkGroup>
		</div>
	</Footer>
</div>