'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Checkout() {
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [card, setCard] = useState('');
	const [sent, setSent] = useState(false);
	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();
		// demo: clear cart and show confirmation
		localStorage.removeItem('cart');
		setSent(true);
		setTimeout(() => router.push('/'), 1500);
	};

	return (
		<section className="max-w-3xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Checkout</h1>
			{sent ? <p className="text-green-600">Order placed (demo). Redirecting...</p> : (
				<form onSubmit={handleSubmit} className="space-y-4">
					<input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
					<input placeholder="Shipping address" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border rounded" required />
					<input placeholder="Card number" value={card} onChange={e => setCard(e.target.value)} className="w-full p-2 border rounded" required />
					<button className="bg-purple-600 text-white px-4 py-2 rounded">Place Order</button>
				</form>
			)}
		</section>
	);
}
