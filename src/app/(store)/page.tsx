import ProductList from "@/components/store/sale/ProductList";
import SearchProducts from "@/components/store/sale/SearchProducts";

export default function MainPage() {
	return (
		<main className="flex flex-col flex-1 gap-4 p-4 md:p-6">
			<SearchProducts />
			<ProductList />
		</main>
	);
}
