<script lang="ts">
	// bg-orange-400 bg-orange-300 // this exists so tailwind generates these colors when scanning source files

	import { Popover, Alert, List, Li } from 'flowbite-svelte';
	import { CheckOutline, CloseOutline, InfoCircleSolid } from 'flowbite-svelte-icons';
	import Centered from '$lib/component/Centered.svelte';
	import ValidatedInput from '$lib/component/ValidatedInput.svelte';
	import { isValidEmail, checkPassword, passwordChecks } from '$lib/util';
	import type { ValidationResult, ErrorAlert } from '$lib/util';
	import LoadableButton from '$lib/component/LoadableButton.svelte';
	import { currentUser } from '$lib/user';
	import { get } from 'svelte/store';
	import { redirect } from '@sveltejs/kit';
	const colorsToAmount = ["red", "orange", "yellow", "green"]
	if(get(currentUser)) {
		redirect(301, "/profile/me");
	}
	const getColorOfAmountPassed = (amount: number): string => {
		return colorsToAmount[amount - 1] ?? "green";
	}

	let currentError = $state<ErrorAlert | null>(null);
	let currentErrorRequirements: string[] = $derived(currentError === null ? [] : currentError.detailedMessage.split("\n"));
	let passwordValidation = $state<ValidationResult | null>(null);
	let barColor = $derived(getColorOfAmountPassed(passwordValidation?.passedAmount ?? 0))
	let passwordInput: string = ""; // copied from password validation, that's why not state
	let passwordValidationInput = $state(""); // copied from password validation, that's why not state
	let emailInput = $state("");

	const validatePassword = (password: string): boolean | undefined => {
		if(password.length === 0) {
			passwordValidation = null;
			return undefined;
		}
		const result = checkPassword(password);
		passwordValidation = result;
		passwordInput = password;
		return result.passedAmount === result.checks.length;
	}

	const validateConfirmPassword = (confirmation: string): boolean | undefined => {
		if(passwordInput.length === 0 || confirmation.length === 0) return undefined;
		return passwordInput === confirmation;
	}

	const resetValidationAfterSuccess = () => {
		if(!passwordValidation) return;
		if(passwordValidation.passedAmount !== passwordValidation.checks.length) return;
		passwordValidation = null;
	}

	const submit = async () => {
		if(emailInput.length === 0) {
			currentError = {
				title: "E-Mail is not specified",
				detailedMessage: "Please specify e-mail"
			};
			return false;
		}
		if(!isValidEmail(emailInput)) {
			currentError = {
				title: "E-Mail is invalid",
				detailedMessage: "Please check your e-mail for errors"
			};
			return false;
		}
		const validation = checkPassword(passwordInput);
		if((validation?.passedAmount ?? 0) != passwordChecks.length) {
			currentError = {
				title: "Password doesn't meet the requirements",
				detailedMessage: validation?.describeFailures()
			};
			return false;
		}

		if(passwordValidationInput === "") {
			currentError = {
				title: "No password confirmation",
				detailedMessage: "Please confirm your password"
			}
			return false;
		}
		if(passwordValidationInput !== passwordInput) {
			currentError = {
				title: "Passwords don't match",
				detailedMessage: "Confirm passwords match"
			}
		}
		currentError = null;
		try {
			await
		} catch (e) {
			console.error(e);
		}
		return true;
	}
</script>

<Centered>
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Sign in</div>
	<form>
		<div class="mb-6">
			<ValidatedInput type="email" id="email" validator={isValidEmail} bind:input={emailInput} label="E-Mail" style="outlined"/>
		</div>
		<div class="mb-6 dark:bg-gray-900">
			<ValidatedInput color="base" style="outlined" id="password" name="password" type="password" label="Password" validator={validatePassword} realtimeValidation/>
		</div>
		{#if passwordValidation != null}
			<Popover class="text-sm z-[99999]" triggeredBy="#password" open={true} placement="bottom" onfocusout={resetValidationAfterSuccess}>
				<div class="grid grid-cols-4 gap-2">
					{#if passwordValidation.passedAmount}
						{#each {length: passwordValidation.passedAmount} as _}
							<div class="h-1 bg-{barColor}-400 dark:bg-{barColor}-500" ></div>
						{/each}
						{#each {length: passwordValidation.checks.length - passwordValidation.passedAmount} as _}
							<div class="h-1 bg-gray-300 dark:bg-gray-400" ></div>
						{/each}
					{:else}
						{#each {length: passwordValidation.checks.length} as _}
							<div class="h-1 bg-gray-300 dark:bg-gray-400" ></div>
						{/each}
					{/if}
				</div>
				<p class="py-2">It’s better to have:</p>
				<ul>
					{#each passwordValidation.checks as check}
						<li class="flex items-center mb-1">
							{#if check.passed}
								<CheckOutline class="me-2 w-4 h-4 text-green-400 dark:text-green-500" />
							{:else}
								<CloseOutline class="me-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
							{/if}
							{check.check.label}
						</li>
					{/each}
				</ul>
			</Popover>
		{/if}
		<div class="mb-6 dark:bg-gray-900">
			<ValidatedInput bind:input={passwordValidationInput} failureMessage="Passwords don't match" color="base" style="outlined" id="confirmation" name="confirmation" type="password" label="Confirm password" validator={validateConfirmPassword}/>
		</div>
		{#if currentError != null}
			<Alert color="red" class="bg-red-100 dark:bg-gray-900 mb-6">
				<div class="flex items-center gap-3">
					<InfoCircleSolid class="w-5 h-5" />
					<span class="text-lg font-medium">{currentError.title}</span>
				</div>
				{#if currentErrorRequirements.length > 1}
					<p class="font-medium">Ensure that these requirements are met:</p>
					<List class="mt-1.5 ms-4">
						{#each currentErrorRequirements as requirement}
							<Li>{requirement}</Li>
						{/each}
					</List>
				{:else}
					{currentError.detailedMessage}
				{/if}
			</Alert>
		{/if}
		<div>
			<LoadableButton type="button" class="w-full" action={submit}>Sign in</LoadableButton>
		</div>
	</form>
</Centered>