export const ssr = false;

export function load({ params }) {
	return {
		origin: params.origin
	}
}