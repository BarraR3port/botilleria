import { handleAxiosResponse } from "@/api/utils";
import type { Product } from "@/objects/panel";
import axios from "axios";
import type { StateCreator } from "zustand";
import type { SessionSlice } from "./SessionSlice";
import type { SettingsSlice } from "./SettingsSlice";

export type LogType = "INFO" | "ERROR" | "WARN" | "DEBUG";

export interface OutputLog {
	type: LogType;
	message: string;
}

interface ProductItem {
	item: Product;
	quantity: number;
}

export interface ProductSale extends ProductItem {
	finalPrice: number;
	originalPrice: number;
	appliedDiscount: number;
}

export type ProductSlice = {
	products: ProductItem[];
	productToDelete: Product | null;
	closeDeleteModal: () => void;
	addProduct: (product: Product, quantity: number) => void;
	addOneProduct: (product: Product) => void;
	removeOneProduct: (product: Product, confirmDelete?: boolean) => void;
	confirmDelete: () => void;
	checkProductAvailability: (product: ProductItem) => Promise<boolean>;
	getProductSales: () => ProductSale[];
};

export const createProductSlice: StateCreator<SessionSlice & SettingsSlice & ProductSlice, [], [], ProductSlice> = (
	set,
	get
) => ({
	products: [],
	productToDelete: null,
	addProduct: (product: Product, quantity: number) => {
		const { products } = get();
		const productIndex = products.findIndex(p => p.item.id === product.id);
		if (productIndex === -1) {
			set({
				products: [...products, { item: product, quantity }]
			});
		} else {
			const newProducts = [...products];
			newProducts[productIndex].quantity += quantity;
			newProducts[productIndex].item = product;
			set({
				products: newProducts
			});
		}
	},
	addOneProduct: (product: Product) => {
		const { products } = get();
		const productIndex = products.findIndex(p => p.item.id === product.id);
		if (productIndex === -1) return;
		const newProducts = [...products];
		newProducts[productIndex].quantity += 1;
		newProducts[productIndex].item = product;
		set({
			products: newProducts
		});
	},
	removeOneProduct: (product: Product, confirmDelete?: boolean) => {
		const { products } = get();
		const productIndex = products.findIndex(p => p.item.id === product.id);
		if (productIndex === -1) return;
		const newProducts = [...products];
		if (newProducts[productIndex].quantity === 1 && !confirmDelete) {
			set({
				productToDelete: product
			});
		} else {
			newProducts[productIndex].item = product;
			newProducts[productIndex].quantity -= 1;
			set({
				products: newProducts
			});
		}
	},
	confirmDelete: () => {
		const { products, productToDelete } = get();
		if (!productToDelete) return;
		const productIndex = products.findIndex(p => p.item.id === productToDelete.id);
		if (productIndex === -1) return;
		const newProducts = [...products];
		newProducts.splice(productIndex, 1);
		set({
			products: newProducts,
			productToDelete: null
		});
	},
	checkProductAvailability: async (product: ProductItem) => {
		const { session } = get();
		if (!session) return false;
		const response = await axios
			.post(
				`${process.env.API_URL}/api/products/${product.item.id}`,
				{
					quantity: product.quantity
				},
				{
					headers: {
						Authorization: `Bearer ${session.backendTokens.accessToken}`
					}
				}
			)
			.catch(() => false)
			.then(res => handleAxiosResponse<Product>(res));

		if (!response) return false;
		return response.stock >= product.quantity;
	},
	closeDeleteModal: () => {
		const { productToDelete } = get();
		if (!productToDelete) return;
		set({
			productToDelete: null
		});
	},
	getProductSales: () => {
		const { products } = get();
		return products.map(product => {
			const discount = product.item?.discount?.value ?? 0;
			const totalDiscount =
				product.item.discount?.type === "PERCENTAGE" ? (product.item.sellPrice * discount) / 100 : discount;
			const productPrice = product.item.sellPrice - totalDiscount;

			const appliedDiscount = totalDiscount * product.quantity;

			const originalPrice = product.item.sellPrice * product.quantity;

			const finalPrice = productPrice * product.quantity;

			return {
				...product,
				finalPrice,
				originalPrice,
				appliedDiscount
			};
		});
	}
});
