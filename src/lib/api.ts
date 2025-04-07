const API_BASE: string = import.meta.env.VITE_API_BASE;

export const authenticate = (extra?: object | undefined) => {
		return {
			Authorization: localStorage.getItem("session-id"),
			...extra
		} as HeadersInit
}

export const makeApiCall = (path: string, fetchOptions?: RequestInit | undefined) => {
	return fetch(`${API_BASE}/${path}`, fetchOptions);
}

export const fetchObject = async <T>(path: string, fetchOptions?: RequestInit | undefined): Promise<T | null> => {
	const response = await makeApiCall(path, fetchOptions);
	if(response.status != 200) {
		console.log(response.body)
		return null;
	}
	return await response.json() as T;
}