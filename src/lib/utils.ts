import type { ProductType } from "@/objects/panel";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export const priceFormatter = new Intl.NumberFormat("es-CL", {
	style: "currency",
	currency: "CLP"
});

export const getType = (type: ProductType, value: number) => {
	switch (type) {
		case "DRINK": {
			if (value >= 1000) {
				return `${(value / 1000).toFixed(1)}L`;
			}
			return `${value}ml`;
		}
		case "FOOD": {
			if (value >= 1000) {
				return `${(value / 1000).toFixed(1)}Kg`;
			}
			return `${value}g`;
		}
	}
};
