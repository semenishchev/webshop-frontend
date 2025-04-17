import { fetchObject } from '$lib/api';
import { get, writable } from 'svelte/store';

export class Cart {
	public products: Map<string, number>;
	public mappedProducts: Map<Product, number> | null = null;

	public constructor(products: Map<string, number>) {
		this.products = products;
	}

	async fetchAsFullList(): Promise<Map<Product, number>> {
		const mappedProducts = this.mappedProducts;
		if(mappedProducts !== null && mappedProducts.size === this.products.size) return mappedProducts;

		const newMappedProducts = new Map<Product, number>();
		const toRemove: string[] = [];
		for (const entry of this.products.entries()) {
			const productId = entry[0];
			const product = await fetchProduct(productId);
			if(!product) {
				toRemove.push(productId)
				continue;
			}
			newMappedProducts.set(product, entry[1]);
		}
		if(toRemove.length !== 0) {
			for (const id of toRemove) {
				this.products.delete(id);
			}
		}
		this.mappedProducts = newMappedProducts;
		return newMappedProducts;
	}
}

export type Product = {
	name: string;
	rating: number;
	category: string;
	price: number;
	descriptionShort: string;
	timesBought: number;
	stock: number;
}

export const fetchProduct = async (id: string) => {
	const result = await fetchObject<Product>(`products/get?id=${id}`);
	if(result === undefined) {
		return null;
	}
	return result;
}

export const localCart = writable<Cart | null>(null);

export const initLocalCart = () => {
	const cartData = localStorage.getItem("cart-data");
	if(!cartData) return;
	localCart.set(new Cart(JSON.parse(cartData)))
}

export const saveLocalCart = () => {
	const cart = get(localCart);
	if(!cart) return;
	localStorage.setItem("cart-data", JSON.stringify(cart.products));
}

export const deinitLocalCart = () => {
	localStorage.removeItem("cart-data");
}