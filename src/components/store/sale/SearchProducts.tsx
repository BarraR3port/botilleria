"use client";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { getType, priceFormatter } from "@/lib/utils";
import type { Product, ProductType } from "@/objects/panel";
import { useAppStore } from "@/store/AppStore";
import axios from "axios";
import { debounce } from "lodash";
import { Beer, Search, Utensils } from "lucide-react";
import { useState } from "react";

export default function SearchProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const { getSession, addProduct } = useAppStore();

	const findNewProducts = debounce(async (query: string) => {
		const session = getSession();
		if (!query || !session) {
			setProducts([]);
			return;
		}
		const response = await axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?searchAnyKind=${query}`, {
				headers: {
					Authorization: `Bearer ${session.backendTokens.accessToken}`
				}
			})
			.catch(err => catchAxiosResponse(err))
			.then(res => handleAxiosResponse<Product[]>(res));
		if (!response) return;

		setProducts(response);
	}, 500);

	return (
		<div className="relative flex flex-col gap-2">
			<div>
				<h1 className="text-2xl font-semibold">Buscar productos</h1>
				<p className="text-sm text-gray-500">Busca un producto por nombre o marca</p>
			</div>

			<div className="relative">
				<div className="flex items-center p-2 border rounded-lg shadow-md">
					<Search className="w-5 h-5 mr-2 " />
					<input
						type="text"
						placeholder="Escribe el nombre o código de un producto..."
						className="w-full outline-none"
						onChange={e => findNewProducts(e.target.value)}
						onClick={event => {
							event.preventDefault();
							event.stopPropagation();
							if ("value" in event.target) {
								if (typeof event.target?.value === "string") {
									findNewProducts(event.target?.value);
								}
							}
						}}
					/>
				</div>

				{products.length > 0 && (
					<div className="absolute z-10 w-full overflow-y-auto border max-h-60 bg-background">
						<ul>
							{products.map(product => {
								const productTypeFormatted = getType(product.type, product.weightOrVolume);
								return (
									<li
										key={product.id}
										className="flex items-center p-2 rounded-md cursor-pointer bg-background hover:bg-foreground/10"
										onClick={() => {
											addProduct(product, 1);
											setProducts([]);
										}}
									>
										{product.type === "DRINK" ? (
											<Beer className="w-5 h-5 mr-2" />
										) : (
											<Utensils className="w-5 h-5 mr-2" />
										)}
										{product.name} {product.brand?.name} {productTypeFormatted}
										<span className="ml-1 text-green-500">
											{priceFormatter.format(product.sellPrice)}
										</span>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
