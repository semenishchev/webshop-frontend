import { writable } from 'svelte/store';
import { authenticate, fetchObject, makeApiCall } from '$lib/api';
import { invalidateAll } from '$app/navigation';
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
	if(id === "me" && !localStorage.getItem("session-id")) return null;
	const result = await fetchObject<User>(`user/${id}`, {
		headers: authenticate()
	});
	if(!result) {
		localStorage.removeItem("session-id");
	}
	return result;
}
type AuthResult = {
	session: string;
	expiresAt: number;
} | string;

export const login = async (email: string, password: string, toptCode?: string | undefined): Promise<AuthResult> => {
	const authentication = await makeApiCall("auth/login", {
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password,
			isBrowserSession: true, // VERY IMPORTANT for security,
			toptPassword: toptCode
		})
	});
	const status = authentication.status;
	if(status === 200) { // api returns 406 unacceptable when 2fa is needed
		return await authentication.json();
	} else if(status === 406) {
		return "2fa"
	} else if(status === 403) {
		return "invalid2fa"
	} else if(status === 401) {
		return "Invalid credentials"
	}

	return authentication.toString();
}

export const initiateRegistration = async (email: string, password: string) => {
	const registration = await makeApiCall("auth/register", {
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password
		})
	});
	const status = registration.status;
	if(status === 409) {
		throw new Error("User with such email already exists");
	}
	return registration.ok;
}

export const signOut = async () => {
	await makeApiCall("auth/logout");
	localStorage.removeItem("session-id");
	currentUser.set(null);
	await invalidateAll();
}

export const checkIfEmailConfirmed = async (email: string) => {
	const emailCheck = await makeApiCall(`auth/check-email?email=${email}`);
	return !emailCheck.ok; // it's a bit weird, but if email is in verification it will return 200, if email isn't in verification it will return 404
}

export const currentUser = writable<User | null | undefined>(undefined)
