export function load({ url }) {
	return {
		origin: url.searchParams.get('origin')
	};
}