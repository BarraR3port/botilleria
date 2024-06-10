import SearchProducts from "@/components/store/sale/SearchProducts";
import ProductList from "@/components/store/sale/ProductList";

export default function CartPage() {
	return (
		<main className="flex flex-col flex-1 gap-4 p-4 md:p-6">
			<SearchProducts />
			<ProductList />
		</main>
	);
}
