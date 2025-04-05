const API_BASE: string = import.meta.env.VITE_API_BASE;

export const fetchObject = async <T>(path: string): Promise<T | null> => {
	const response = await fetch(`${API_BASE}/${path}`);
	if(response.status != 200) {
		console.log(response.body)
		return null;
	}
	return await response.json() as T;
}