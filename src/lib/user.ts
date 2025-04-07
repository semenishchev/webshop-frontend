import { writable } from 'svelte/store';
import { authenticate, fetchObject, makeApiCall } from '$lib/api';
export type Profile = {
	fullName: string;
	phoneNumber: string;
}
export type User = {
	id: number;
	email: string;
	profile: Profile;
	cart: never; // todo: change to cart object
	roles: string[];
	isSuperuser: boolean;
}

export const fetchUser = async (id: string) => {
	return fetchObject<User>(`user/${id}`, {
			headers: authenticate()
	});
}
type AuthResult = {
	session: string;
	expiresAt: number;
} | string;

export const login = async (email: string, password: string): Promise<AuthResult> => {
	const authentication = await makeApiCall("auth/login", {
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password
		})
	});

	if(authentication.status === 200) { // api returns 406 unacceptable when 2fa is needed
		return await authentication.json();
	} else if(authentication.status === 406) {
		return "2fa"
	}

	return await authentication.text();
}

export const currentUser = writable<User | null | undefined>(undefined)
