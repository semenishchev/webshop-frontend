<script>

import Centered from '$lib/component/Centered.svelte';
import { InfoCircleSolid } from 'flowbite-svelte-icons';
import { Alert } from 'flowbite-svelte';
import { isValidEmail } from '$lib/util.js';
import ValidatedInput from '$lib/component/ValidatedInput.svelte';
import LoadableButton from '$lib/component/LoadableButton.svelte';
let currentError = $state("");
let emailInput = $state("");
const resetPassword = async () => {
	return true;
};
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
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Reset password</div>
	<form>
		<div class="mb-6">
			<ValidatedInput bind:input={emailInput} type="email" id="email" validator={isValidEmail} label="E-Mail" style="outlined"/>
		</div>
		{#if currentError !== ""}
			<div class="mb-6">
				<Alert color="red" class="bg-red-100 dark:bg-gray-900 mb-6">
					<div class="flex items-center gap-3">
						<InfoCircleSolid class="w-5 h-5" />
						<span class="text-lg font-medium">{currentError}</span>
					</div>
				</Alert>
			</div>
		{/if}
		<div class="mb-6">
			<LoadableButton type="submit" class="w-full" action={resetPassword}>Reset password</LoadableButton>
		</div>
		<a href="/login" class="mb-6 text-blue-500 underline">
			I remembered it!
		</a>
	</form>
</Centered>