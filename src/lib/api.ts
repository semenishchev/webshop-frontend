const API_BASE: string = import.meta.env.VITE_API_BASE;

export const authenticate = (extra?: object | undefined) => {
		return {
			Authorization: localStorage.getItem("session-id"),
			...extra
		} as HeadersInit
}

export const makeApiCall = (path: string, fetchOptions?: RequestInit | undefined) => {
	return fetch(`${API_BASE}/${path}`, {
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		...fetchOptions
	});
}

export const fetchObject = async <T>(path: string, fetchOptions?: RequestInit | undefined): Promise<T | null | undefined> => {
	const response = await makeApiCall(path, fetchOptions);
	if(response.ok) {
		return await response.json() as T;
	}
	if(response.status >= 500) {
		return undefined;
	}
	return null;
}