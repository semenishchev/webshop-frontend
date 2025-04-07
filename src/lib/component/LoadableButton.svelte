<script lang="ts">
	import { Button, Spinner } from 'flowbite-svelte';
	const props = $props();
	const { children, action } = props;
	let loading = $state(false);
	const doAction = async (event: Event) => {
		event.preventDefault();
		if(loading) return; // failsafe
		console.log("Action")
		loading = true;
		try {
			loading = await action(); // if action returns true, keep loading and do something
		} catch (e) {
			console.error(e);
			loading = false;
		}
	}
</script>

<Button {...props} onclick={doAction} disabled={loading}>
	<div hidden={!loading}>
		<Spinner class="me-3" size="4" color="white"/>
	</div>
	<span>
		{@render children() }
	</span>
</Button>