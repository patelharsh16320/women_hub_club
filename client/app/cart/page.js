'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
	const [cart, setCart] = useState([]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem('cart');
			setCart(raw ? JSON.parse(raw) : []);
		} catch {
			setCart([]);
		}
	}, []);

	const total = cart.reduce((s, item) => s + (item.price || 0) * (item.qty || 1), 0).toFixed(2);

	return (
		<section className="max-w-5xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Your Cart</h1>
			{cart.length === 0 ? (
				<div>
					<p className="mb-4">Your cart is empty.</p>
					<Link href="/shop" className="text-purple-600 underline">Go to Shop</Link>
				</div>
			) : (
				<div className="space-y-4">
					{cart.map((item) => (
						<div key={item._id} className="flex items-center gap-4 border p-4 rounded">
							<img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
							<div className="flex-1">
								<h3 className="font-bold">{item.name}</h3>
								<p className="text-gray-600">Qty: {item.qty || 1}</p>
							</div>
							<div className="text-right">
								<p className="font-bold">${(item.price || 0).toFixed(2)}</p>
							</div>
						</div>
					))}
					<div className="text-right">
						<p className="text-lg font-bold">Total: ${total}</p>
						<Link href="/checkout" className="inline-block mt-2 bg-purple-600 text-white px-4 py-2 rounded">Proceed to Checkout</Link>
					</div>
				</div>
			)}
		</section>
	);
}
