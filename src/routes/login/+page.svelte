<script lang="ts">
	import { Alert, FloatingLabelInput } from 'flowbite-svelte';
	import Centered from '$lib/component/Centered.svelte';
	import ValidatedInput from '$lib/component/ValidatedInput.svelte';
	import { extractMessage, isValidEmail } from '$lib/util';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import LoadableButton from '$lib/component/LoadableButton.svelte';
	import { currentUser, login } from '$lib/user';
	import { goto, invalidateAll } from '$app/navigation';

	import { isNaN } from 'lodash';
	import { get } from 'svelte/store';
	const { data } = $props();
	const origin = data.origin;

	if(get(currentUser) !== null) {
		goto("/profile/me");
	}

	let emailInput = $state("");
	let passwordInput = $state("");
	let currentError = $state("");
	let toptCode = $state("");
	let needs2Fa = $state(false);

	const submit = async () => {
		if(!isValidEmail(emailInput)) {
			currentError = "Email is invalid";
			return false;
		}
		try {
			const result = toptCode === ""
				? await login(emailInput, passwordInput)
				: await login(emailInput, passwordInput, toptCode);
			if (typeof result === "object") {
				localStorage.setItem("session-id", result.session)
				await invalidateAll();
				window.location.href = '/'
			} else if(result === "2fa") {
				needs2Fa = true;
			} else if(result === "invalid2fa") {
				currentError = "Invalid 2fa code";
			}
			else {
					currentError = result ?? "Unknown error";
					return false;
			}
		} catch (e) {
			console.error(e);
			currentError = extractMessage(e) ?? "Unknown error"
			return false;
		}
		return true;
	}

	let confirmButton: LoadableButton | null = $state(null);

	const validateToptCode = () => {
		const flag = toptCode.length === 6 && !isNaN(toptCode);
		if(flag) {
			confirmButton?.doAction();
		}
		return flag;
	}
</script>

<Centered>
{#if currentError !== ""}
	<Alert color="red" class="bg-red-100 dark:bg-gray-900 mb-6">
		<div class="flex items-center gap-3">
			<InfoCircleSolid class="w-5 h-5" />
			<span class="text-lg font-medium">{currentError}</span>
		</div>
	</Alert>
{/if}
{#if needs2Fa}
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Enter 2FA code</div>
	<div class="mb-6">
		<ValidatedInput maxLength={6} bind:input={toptCode} style="outlined" type="text" validator={validateToptCode} class="w-full text-center no-spinner" label="2 Factor code" realtimeValidation/>
	</div>

	<div class="mb-6">
		<LoadableButton bind:this={confirmButton} type="submit" class="w-full" action={submit}>Confirm</LoadableButton>
	</div>
{:else}
	{#if origin}
		<Alert color="green" class="bg-green-100 dark:bg-gray-900 mb-6">
			<div class="flex items-center gap-3">
				<InfoCircleSolid class="w-5 h-5" />
				<span class="text-lg font-medium">You have verified your email. You may log in now</span>
			</div>
		</Alert>
	{/if}
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Login</div>
	<form>
		<div class="mb-6">
			<ValidatedInput bind:input={emailInput} type="email" id="email" validator={isValidEmail} label="E-Mail" style="outlined"/>
		</div>
		<div class="mb-6 dark:bg-gray-900">
			<FloatingLabelInput bind:value={passwordInput} color="base" style="outlined" id="password" name="password" type="password">Password</FloatingLabelInput>
		</div>
		<div class="mb-6">
			<LoadableButton type="submit" class="w-full" action={submit}>Login</LoadableButton>
		</div>
		<a href="/login/reset-password" class="mb-6 text-blue-500 underline">
			Forgot password?
		</a>
	</form>
{/if}
</Centered>