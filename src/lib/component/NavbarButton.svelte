<script>
	const props = $props();
	const { children } = props;
</script>

<button {...props} class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-hidden rounded-lg text-sm p-2.5">
	{@render children()}
</button>