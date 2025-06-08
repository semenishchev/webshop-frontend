<script lang="ts">
	import '../app.css';
	import {
		Navbar,
		NavBrand,
		DarkMode,
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterLink,
		Spinner
	} from 'flowbite-svelte';
	import NavbarButton from '$lib/component/NavbarButton.svelte';
	import { CartOutline, UserCircleOutline } from 'flowbite-svelte-icons'
	import { onMount } from 'svelte';
	import { fetchUser, currentUser, type User, fireUserEvent } from '$lib/user';
	import NavbarSearch from '$lib/component/NavbarSearch.svelte';
	import LoggedInDropdown from '$lib/component/LoggedInDropdown.svelte';
	import LoggedOutDropdown from '$lib/component/LoggedOutDropdown.svelte';
	import Cart from '$lib/component/Cart.svelte';

	let isMobile = $state(false);
	let isPageShort = $state(false); // used for footer docking
	let user = $state<User | null | undefined>(undefined);
	let cartHidden = $state(true);

	const handleResize = () => {
		isMobile = window.innerWidth < 760;
		isPageShort = (document.querySelector("body")?.scrollHeight ?? 0) >= window.innerHeight;
	};

	$effect(() => {
		handleResize();
	});

	onMount(() => {
		let interval: number | undefined = undefined;
		interval = setInterval(() => {
			fetchUser("me").then(_user => {
				currentUser.set(_user);
				user = _user;
				clearInterval(interval);
				if(!_user) {
					fireUserEvent(null);
					return;
				}
				fireUserEvent(_user);
			}).catch(e => {
				console.error("Failed to set user: " + e.message);
			});
		}, 5000);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	let { children } = $props();
</script>

<Navbar class="dark:bg-gray-900 dark:text-blue-100 border-b dark:border-gray-800 flex flex-col md:flex-row md:items-center gap-2 px-4 py-2">
	<div class="w-full flex gap-4 items-center justify-between">
		<NavBrand href="/" class="justify-start items-stretch">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Webshop</span>
		</NavBrand>

		{#if !isMobile}
			<NavbarSearch class="absolute left-1/2 -translate-x-1/2 items-center self-center justify-center"/>
		{/if}

		<div class="flex justify-end gap-4">
			<DarkMode />
			{#if user === undefined}
				<div class="text-center pt-1">
					<Spinner size="5"/>
				</div>
			{:else}
				<NavbarButton aria-label="Login">
					<UserCircleOutline class="w-5 h-5" />
				</NavbarButton>
				{#if user !== null}
					<LoggedInDropdown/>
				{:else}
					<LoggedOutDropdown/>
				{/if}
			{/if}

			<NavbarButton aria-label="Cart" onclick={() => cartHidden = false}>
				<CartOutline class="w-5 h-5" />
			</NavbarButton>
		</div>
	</div>

	{#if isMobile}
		<NavbarSearch/>
	{/if}
</Navbar>

<div class="container mx-auto overflow-y-auto">
	{@render children()}
</div>

<Cart id="cart" bind:hidden={cartHidden}/>

<style>
    .docked {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>

<div class="{isPageShort ? '' : 'docked'}">
	<Footer class="dark:bg-gray-900 dark:text-blue-100 border-b border-gray-800 gap-2 px-4 py-2 mt-4">
		<div class="sm:flex sm:items-center sm:justify-between">
			<FooterCopyright href="/" by="Oleksandr Semenishchev; " copyrightMessage="Licensed under MIT" />
			<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
				<FooterLink href="https://github.com/semenishchev/webshop-frontend">Source code</FooterLink>
				<FooterLink href="https://github.com/semenishchev/webshop-backend">I am NOT a frontend developer</FooterLink>
			</FooterLinkGroup>
		</div>
	</Footer>
</div>