"use client";
import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/use-toast";
import { cn, getType, priceFormatter } from "@/lib/utils";
import BasicModal from "@/modals/basic-modal";
import { useAppStore } from "@/store/AppStore";
import axios from "axios";
import { Beer, ChevronRightIcon, CreditCardIcon, DollarSignIcon, Loader2, Minus, Plus, Utensils } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductList() {
	const {
		products,
		removeOneProduct,
		addOneProduct,
		productToDelete,
		confirmDelete,
		closeDeleteModal,
		session,
		getProductSales,
		clearProducts
	} = useAppStore();
	const [openFinishModal, setOpenFinishModal] = useState(false);
	const [loadingCashPayment, setLoadingCashPayment] = useState(false);
	const [loadingTransBankPayment, setLoadingTransBankPayment] = useState(false);

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

	const finishSaleWithCash = async () => {
		setLoadingCashPayment(true);
		const finalProducts = getProductSales();
		const total = finalProducts.reduce((acc, product) => acc + product.finalPrice, 0);
		const totalDiscount = finalProducts.reduce((acc, product) => acc + product.appliedDiscount, 0);
		const response = await axios
			.post(
				`${process.env.API_URL}/api/sales`,
				{
					total,
					products: finalProducts,
					totalDiscount,
					type: "CASH"
				},
				{
					headers: {
						Authorization: `Bearer ${session?.backendTokens?.accessToken.token}`
					}
				}
			)
			.catch(res => catchAxiosResponse(res))
			.then(res => handleAxiosResponse(res));
		if (response) {
			toast({
				title: "Venta completada",
				variant: "success",
				duration: 1500
			});
			clearProducts();
		}
		setLoadingCashPayment(false);
		setOpenFinishModal(false);
	};

	const finishSaleWithTransBank = async () => {
		setLoadingTransBankPayment(true);
		const finalProducts = getProductSales();
		const total = finalProducts.reduce((acc, product) => acc + product.finalPrice, 0);
		const totalDiscount = finalProducts.reduce((acc, product) => acc + product.appliedDiscount, 0);
		const response = await axios
			.post(
				`${process.env.API_URL}/api/sales`,
				{
					total,
					products: finalProducts,
					totalDiscount,
					type: "CREDIT"
				},
				{
					headers: {
						Authorization: `Bearer ${session?.backendTokens?.accessToken.token}`
					}
				}
			)
			.catch(res => catchAxiosResponse(res))
			.then(res => handleAxiosResponse(res));
		if (response) {
			toast({
				title: "Venta completada",
				variant: "success",
				duration: 1500
			});
			clearProducts();
		}
		setLoadingTransBankPayment(false);
		setOpenFinishModal(false);
	};

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
			<Modal
				title="Selecciona el Método de pago:"
				description={
					<div className="w-full max-w-md space-y-6">
						<div className="text-secondary">Método de pago para completar la compra.</div>
						<div className="grid gap-4">
							<Card className="flex items-center justify-between p-4" onClick={finishSaleWithCash}>
								<div className="flex items-center gap-4">
									<DollarSignIcon className="w-6 h-6" />
									<div>
										<h4 className="font-medium">Efectivo</h4>
										<p className="text-sm text-text-secondary">Procesar pago en efectivo.</p>
									</div>
								</div>
								{loadingCashPayment ? (
									<Loader2 className={"animate-spin w-5 h-5"} />
								) : (
									<ChevronRightIcon className="w-5 h-5 text-text-secondary" />
								)}
							</Card>
							<Card className="flex items-center justify-between p-4" onClick={finishSaleWithTransBank}>
								<div className="flex items-center gap-4">
									<CreditCardIcon className="w-6 h-6" />
									<div>
										<h4 className="font-medium">TransBank</h4>
										<p className="text-sm text-text-secondary">Procesar pago con TransBank</p>
									</div>
								</div>
								{loadingTransBankPayment ? (
									<Loader2 className={"animate-spin w-5 h-5"} />
								) : (
									<ChevronRightIcon className="w-5 h-5 text-text-secondary" />
								)}
							</Card>
						</div>
					</div>
				}
				open={openFinishModal}
				onClose={() => setOpenFinishModal(false)}
			/>
			<div className="flex flex-col gap-4 mt-4 ">
				<div className="h-full overflow-auto border rounded-md min-h-[250px]">
					<table className="w-full text-md">
						<thead>
							<tr className="border-b">
								<th className="px-4 py-2 text-left">Id</th>
								<th className="px-4 py-2 text-left">Producto</th>
								<th className="px-4 py-2 text-left">Precio Unitario</th>
								<th className="px-4 py-2 text-left ">Precio Original</th>
								<th className="px-4 py-2 text-left">Descuento Aplicado</th>
								<th className="px-4 py-2 text-left ">Precio Final</th>
								<th className="w-10 px-4 py-2 text-center">Cantidad</th>
							</tr>
						</thead>
						<tbody>
							{products.length === 0 && (
								<tr>
									<td colSpan={7} className="h-48 px-4 py-2 text-center text-text-secondary align-middle">
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
								const finalDiscountPrice = totalDiscount * product.quantity;

								const initialPrice = product.item.sellPrice * product.quantity;

								const finalPrice = productPrice * product.quantity;

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
											<AnimatedNumber
												value={product.item.sellPrice}
												format={priceFormatter.format}
											/>
										</td>
										<td className="px-4 py-2 text-left">
											<span className="text-secondary ">
												<AnimatedNumber value={initialPrice} format={priceFormatter.format} />
											</span>
										</td>
										<td
											className={cn(
												"px-4 py-2 text-left text-destructive",
												product.item?.discount?.name === undefined && "text-black"
											)}
										>
											{finalDiscountPrice ? (
												<AnimatedNumber
													value={finalDiscountPrice}
													format={priceFormatter.format}
												/>
											) : (
												"Sin Descuento"
											)}
										</td>
										<td className="px-4 py-2 text-left">
											<span className="text-green-500 ">
												<AnimatedNumber value={finalPrice} format={priceFormatter.format} />
											</span>
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

												<AnimatedNumber value={product.quantity} />

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
								<span className="text-red-400">
									<AnimatedNumber value={totalDiscountPrice} format={priceFormatter.format} />
								</span>
							</span>
							<span>
								Total:{" "}
								<span className="text-green-500">
									<AnimatedNumber value={totalFinalPrice} format={priceFormatter.format} />
								</span>
							</span>
						</div>
					)}
					<Button
						onClick={() => {
							setOpenFinishModal(true);
						}}
						disabled={products.length === 0}
					>
						Completar compra
					</Button>
				</div>
			</div>
		</>
	);
}
