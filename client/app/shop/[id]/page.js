'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById } from '../../../services/api';

export default function ProductDetail() {
	const params = useParams();
	const id = params?.id;
	const router = useRouter();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		fetchProductById(id)
			.then(p => setProduct(p))
			.catch(err => setError(err.message))
			.finally(() => setLoading(false));
	}, [id]);

	const addToCart = () => {
		const raw = localStorage.getItem('cart');
		const cart = raw ? JSON.parse(raw) : [];
		const existing = cart.find(i => i._id === product._id);
		if (existing) existing.qty = (existing.qty || 1) + 1;
		else cart.push({ ...product, qty: 1 });
		localStorage.setItem('cart', JSON.stringify(cart));
		router.push('/cart');
	};

	if (loading) return <p className="p-6">Loading...</p>;
	if (error) return <p className="p-6 text-red-600">{error}</p>;
	if (!product) return <p className="p-6">Product not found</p>;

	return (
		<section className="max-w-4xl mx-auto p-6">
			<div className="grid md:grid-cols-2 gap-6">
				<img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded" />
				<div>
					<h1 className="text-2xl font-bold mb-2">{product.name}</h1>
					<p className="text-gray-700 mb-4">{product.description}</p>
					<p className="text-xl font-bold text-green-600 mb-2">${product.price}</p>
					<p className="mb-4">Stock: {product.countInStock}</p>
					<button onClick={addToCart} className="bg-purple-600 text-white px-4 py-2 rounded">Add to cart</button>
				</div>
			</div>
		</section>
	);
}
