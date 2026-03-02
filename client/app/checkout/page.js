"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createInvoice } from '@/services/invoiceService';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from '../components/StripeCheckoutForm';

export default function Checkout() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	// const [card, setCard] = useState('');
	const [sent, setSent] = useState(false);
	const [cart, setCart] = useState([]);
	const router = useRouter();

	useEffect(() => {
		try {
			const raw = localStorage.getItem('cart');
			setCart(raw ? JSON.parse(raw) : []);
		} catch {
			setCart([]);
		}
	}, []);

	const total = cart
		.reduce((s, item) => s + (item.price || 0) * (item.qty || 1), 0)
		.toFixed(2);

	// Stripe publishable key (test mode)
	const stripePromise = loadStripe('pk_test_51Nw...your_test_key_here');

	// Only submit invoice after Stripe payment success
	const handleStripePayment = async (stripePayment) => {
		if (!cart.length) return alert('Cart is empty');

		const items = cart.map(i => ({ product: i._id, name: i.name, price: Number(i.price) || 0, qty: i.qty || 1 }));
		const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
		const shipping = 0;
		const total = subtotal + shipping;

		try {
			setSent(true);
			const payload = {
				customerName: name,
				customerEmail: email,
				items,
				subtotal,
				shipping,
				total,
				paymentMethod: stripePayment.paymentMethod,
				paymentStatus: stripePayment.paymentStatus,
				paymentId: stripePayment.paymentId
			};

			const invoice = await createInvoice(payload);

			// clear cart and notify
			localStorage.removeItem('cart');
			try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } })); } catch (e) {}

			// redirect to invoice detail
			router.push(`/invoices/${invoice._id}`);
		} catch (err) {
			console.error('Checkout create invoice error:', err);
			alert(err?.message || 'Failed to place order');
			setSent(false);
		}
	};

	return (
		<div className="checkout-container">
			<h1 className="checkout-title">Checkout</h1>
			{sent ? (
				<p className="order-success">
					Order placed successfully! Redirecting...
				</p>
			) : (
				<div className="checkout-layout">
					{/* LEFT — FORM */}
					<div className="checkout-form">
						<h3>Shipping Details</h3>
						<div className="form-group">
							<label>Full Name</label>
							<input
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label>Email</label>
							<input
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label>Shipping Address</label>
							<input
								value={address}
								onChange={e => setAddress(e.target.value)}
								required
							/>
						</div>
						<h3 className="mt-4">Payment</h3>
						<Elements stripe={stripePromise}>
							<StripeCheckoutForm onPaymentSuccess={handleStripePayment} disabled={!name || !email || !address} />
						</Elements>
					</div>
					{/* RIGHT — ORDER SUMMARY */}
					<div className="checkout-summary">
						<h3>Order Summary</h3>
						{cart.map((item) => (
							<div key={item._id} className="summary-item">
								<span>{item.name} × {item.qty || 1}</span>
								<span>₹ {(item.price * (item.qty || 1)).toFixed(2)}</span>
							</div>
						))}
						<hr />
						<div className="summary-total">
							<span>Total</span>
							<span>₹ {total}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}