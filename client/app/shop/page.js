import ProductList from '../../components/ProductCard';

export default function Shop() {
	return (
		<section>
			<div className="max-w-7xl mx-auto p-6">
				<h1 className="text-2xl font-bold mb-4">Shop Products</h1>
			</div>
			<ProductList />
		</section>
	);
}
