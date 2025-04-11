export const ssr = false;

export function load({ url }) {
	const email = url.searchParams.get('email');
	if(email == null) {
		return new Response('Invalid request', { status: 400 });
	}
	return {
		email: email
	};
}