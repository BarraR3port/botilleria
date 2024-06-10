"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getType, priceFormatter } from "@/lib/utils";
import BasicModal from "@/modals/basic-modal";
import { useAppStore } from "@/store/AppStore";
import { Beer, Minus, Plus, Utensils } from "lucide-react";
import { useMemo } from "react";

export default function ProductList() {
	const { products, removeOneProduct, addOneProduct, productToDelete, confirmDelete, closeDeleteModal } =
		useAppStore();

	const totalFinalPrice = useMemo(() => {
		return products.reduce((acc, product) => {
			const discount = product.item?.discount?.value ?? 0;
			const totalDiscount =
				product.item.discount?.type === "PERCENTAGE" ? (product.item.sellPrice * discount) / 100 : discount;
			const productPrice = product.item.sellPrice - totalDiscount;
			return acc + productPrice * product.quantity;
		}, 0);
	}, [products]);

	const totalDiscountPrice = useMemo(() => {
		return products.reduce((acc, product) => {
			const discount = product.item?.discount?.value ?? 0;
			const totalDiscount =
				product.item.discount?.type === "PERCENTAGE" ? (product.item.sellPrice * discount) / 100 : discount;
			return acc + totalDiscount * product.quantity;
		}, 0);
	}, [products]);

	return (
		<>
			<BasicModal
				title="¿Estás seguro de eliminar este producto?"
				description="Esta acción no se puede deshacer"
				open={productToDelete !== null}
				onClose={closeDeleteModal}
				loading={false}
				onConfirm={confirmDelete}
				type="cancelAndConfirm"
			/>
			<div className="flex flex-col gap-4 mt-4 ">
				<div className="h-full overflow-auto border rounded-md min-h-[250px]">
					<table className="w-full text-md">
						<thead>
							<tr className="border-b">
								<th className="px-4 py-2 text-left">Id</th>
								<th className="px-4 py-2 text-left">Producto</th>
								<th className="px-4 py-2 text-left">Precio de Venta</th>
								<th className="px-4 py-2 text-left">Descuento Aplicado</th>
								<th className="px-4 py-2 text-left ">Precio final</th>
								<th className="w-10 px-4 py-2 text-center">Cantidad</th>
							</tr>
						</thead>
						<tbody>
							{products.length === 0 && (
								<tr>
									<td colSpan={5} className="px-4 py-2 text-center">
										Agrega productos a la lista
									</td>
								</tr>
							)}
							{products.map(product => {
								const discount = product.item?.discount?.value ?? 0;
								const totalDiscount =
									product.item.discount?.type === "PERCENTAGE"
										? (product.item.sellPrice * discount) / 100
										: discount;
								const productPrice = product.item.sellPrice - totalDiscount;
								const formattedDiscountPrice = priceFormatter.format(totalDiscount * product.quantity);

								const productPriceFormatted = priceFormatter.format(productPrice * product.quantity);

								const productTypeFormatted = getType(product.item.type, product.item.weightOrVolume);

								return (
									<tr key={product.item.id} className="border-b">
										<td className="px-4 ">{product.item.id}</td>
										<td className="px-4 py-2 ">
											<div className="flex items-center">
												{product.item.type === "DRINK" ? (
													<Beer className="w-5 h-5 mr-2" />
												) : (
													<Utensils className="w-5 h-5 mr-2" />
												)}
												{product.item.name} {product.item.brand?.name} {productTypeFormatted}
											</div>
										</td>
										<td className="px-4 py-2 text-left ">
											{priceFormatter.format(product.item.sellPrice)}
										</td>
										<td
											className={cn(
												"px-4 py-2 text-left text-red-400",
												product.item?.discount?.name === undefined && "text-white"
											)}
										>
											{formattedDiscountPrice ?? "Sin Descuento"}
										</td>
										<td className="px-4 py-2 text-left">
											<span className="text-green-500 ">{productPriceFormatted}</span>
										</td>
										<td className="w-10 px-4 py-2 text-right">
											<div className="flex items-center gap-2 text-sm">
												<Button
													size="icon"
													variant="ghost"
													className="rounded-full"
													onClick={() => {
														removeOneProduct(product.item);
													}}
												>
													<Minus className="w-4 h-4" />
												</Button>
												<Input
													type="number"
													className="w-16 text-center h-9"
													disabled
													value={product.quantity}
												/>
												<Button
													size="icon"
													variant="ghost"
													className="rounded-full"
													onClick={() => {
														addOneProduct(product.item);
													}}
												>
													<Plus className="w-4 h-4" />
												</Button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div className="items-end w-full space-y-4 text-right">
					{totalFinalPrice > 0 && (
						<div>
							<span className="m-4">
								Descuentos Totales:{" "}
								<span className="text-red-400">{priceFormatter.format(totalDiscountPrice)}</span>
							</span>
							<span>
								Total: <span className="text-green-500">{priceFormatter.format(totalFinalPrice)}</span>
							</span>
						</div>
					)}
					<div>
						<Button className="">Completar compra</Button>
					</div>
				</div>
			</div>
		</>
	);
}
