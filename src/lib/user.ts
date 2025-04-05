import { writable } from 'svelte/store';
import { fetchObject } from '$lib/api'
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
	return fetchObject<User>(`user/${id}`, undefined, undefined);
}

export const currentUser = writable<User | null | undefined>(undefined)
