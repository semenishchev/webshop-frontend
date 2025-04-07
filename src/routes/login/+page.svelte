<script lang="ts">
	import { Button, FloatingLabelInput } from 'flowbite-svelte';
	import Centered from '$lib/component/Centered.svelte';
	import ValidatedInput from '$lib/component/ValidatedInput.svelte';
	import { isValidEmail } from '$lib/util';

	const submit = (event: Event) => {
		event.preventDefault();
	}
</script>

<Centered>
	<div class="text-4xl lg:text-6xl leading-none font-extrabold text-gray-900 dark:text-white max-w-2xl mb-4">Login</div>
	<form>
		<div class="mb-6">
			<ValidatedInput type="email" id="email" validator={isValidEmail} label="E-Mail" style="outlined"/>
		</div>
		<div class="mb-6 dark:bg-gray-900">
			<FloatingLabelInput color="base" style="outlined" id="password" name="password" type="password">Password</FloatingLabelInput>
		</div>

		<div class="mb-6">
			<Button type="submit" class="w-full" onclick={submit}>Login</Button>
		</div>
	</form>
</Centered>