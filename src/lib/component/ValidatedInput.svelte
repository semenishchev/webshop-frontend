<script lang="ts">
	import { FloatingLabelInput, Helper } from 'flowbite-svelte';

	type ValidatorFunc = (text: string) => boolean | undefined;
	type InputColor = "base" | "green" | "red";

	let {
		id,
		label,
		placeholder = "",
		validator,
		type = "text",
		style = "filled",
		realtimeValidation = false,
		successMessage = "",
		failureMessage = "",
		input = $bindable<string>()
	} = $props();

	let isValid = $state<boolean | undefined>(undefined);
	let color = $state<InputColor>("base")

	const reset = () => {
		color = "base";
	}

	const validate = () => {
		isValid = (validator as ValidatorFunc)(input);
		if(isValid === undefined) {
			color = "base";
			return;
		}
		color = isValid ? "green" : "red";
	}
</script>

<div class="dark:bg-gray-900">
{#if realtimeValidation}
	<FloatingLabelInput color={color} style={style} id={id} name={id} type={type} placeholder={placeholder} bind:value={input} oninput={validate}>
		{label}
	</FloatingLabelInput>
{:else}
	<FloatingLabelInput color={color} style={style} id={id} name={id} type={type} placeholder={placeholder} bind:value={input} onfocusout={validate} oninput={reset}>
		{label}
	</FloatingLabelInput>
{/if}
</div>

<!-- YES === true LMFAO bc javascript is the best language -->
{#if isValid === true && successMessage.length !== 0 }
	<Helper class="mt-2" color="green">{successMessage}</Helper>
{:else if isValid === false && successMessage.length !== 0 }
	<Helper class="mt-2" color="red">{failureMessage}</Helper>
{/if}


