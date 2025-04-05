<script lang="ts">
	import { FloatingLabelInput, Helper } from 'flowbite-svelte';

	type ValidatorFunc = (text: string) => boolean | undefined;
	type InputColor = "base" | "green" | "red";

	const props = $props();

	let {
		id,
		label,
		placeholder,
		validator,
		type = "text",
		style = "filled"
	} = props;

	const successMessage = props.successMessage;
	const failureMessage = props.failureMessage;

	let input = $state("")
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

<div class="bg-gray-900">
<FloatingLabelInput color={color} style={style} id={id} name={id} type={type} placeholder={placeholder} bind:value={input} onfocusout={validate} oninput={reset}>
	{label}
</FloatingLabelInput>
</div>

<!-- YES === true LMFAO bc javascript is the best language -->
{#if isValid === true && successMessage !== undefined }
	<Helper class="mt-2" color="green">{successMessage}</Helper>
{:else if isValid === false && failureMessage !== undefined }
	<Helper class="mt-2" color="red">{failureMessage}</Helper>
{/if}


