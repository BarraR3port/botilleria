import type { User } from "@auth/core/types";

export interface Brand {
	id: number;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	products?: Product[];
}

export type DiscountType = "PERCENTAGE" | "AMOUNT";

export interface Discount {
	id: number;
	name: string;
	description: string;
	type: DiscountType;
	value: number;
	active: boolean;
	createdAt: string;
	updatedAt: string;
	products?: Product[];
}

export type ProductType = "FOOD" | "DRINK" | "OTHER";

export interface Product {
	id: number;
	name: string;
	description: string;
	sellPrice: number;
	costPrice: number;
	stock: number;
	weightOrVolume: number;
	barcode: string;
	type: ProductType;
	available: boolean;
	createdAt: string;
	updatedAt: string;
	user?: User;
	userId: string;
	brandId: number;
	brand?: Brand;
	discount?: Discount;
	discountId?: number;
	orders?: Order[];
}

export interface Order {
	id: number;
	total: number;
	createdAt: string;
	updatedAt: string;
	products: Product[];
}
