<script lang="ts">
	import { Button, FloatingLabelInput } from 'flowbite-svelte';
	import Centered from '$lib/component/Centered.svelte';
	import ValidatedInput from '$lib/component/ValidatedInput.svelte';
	import { isValidEmail } from '$lib/util';
</script>

<Centered>
	<form>
		<div class="mb-6">
			<ValidatedInput type="email" id="email" placeholder="test@example.com" validator={isValidEmail} label="E-Mail" style="outlined"/>
		</div>
		<div class="mb-6 bg-gray-900">
			<FloatingLabelInput color="base" style="outlined" id="password" name="password" type="password">Password</FloatingLabelInput>
		</div>

		<div class="mb-6">
			<Button type="submit" class="w-full">Login</Button>
		</div>
	</form>
</Centered>

