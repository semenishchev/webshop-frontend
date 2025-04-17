<script>
	const props = $props();
</script>

<div class="max-w-md w-full mx-auto pt-4 px-4" {...props}>
	{@render props.children()}
</div>