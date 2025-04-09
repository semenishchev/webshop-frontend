export const ssr = false;

export function load({ params }) {
	return {
		email: params.confirmation
	};
}