const API_BASE: string = import.meta.env.VITE_API_BASE;

export const fetchObject = async <T>(path: string, fetchOptions: object | undefined, extraHeaders: object | undefined): Promise<T | null> => {
	const response = await fetch(`${API_BASE}/${path}`, {
		headers: {
			"Authorization": localStorage.getItem("session") ?? "none", // first part of the session is in the local storage, second one is in the cookie
			...extraHeaders
		},
		...fetchOptions
	});
	if(response.status != 200) {
		console.log(response.body)
		return null;
	}
	return await response.json() as T;
}