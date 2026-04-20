"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createInvoice } from '@/services/invoiceService';
import { getUserById } from '@/services/userService';
import { createOrder } from '@/services/orderService';
import { getCartKey, clearUserCart } from '@/services/userCart';

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from '../components/StripeCheckoutForm';
import { toastMessage } from "../../utils/toastMessage";

export default function Checkout() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	// const [card, setCard] = useState('');
	const [sent, setSent] = useState(false);
	const [cart, setCart] = useState([]);
	const [coupon, setCoupon] = useState('');
	const [discount, setDiscount] = useState(0);
	const [couponMsg, setCouponMsg] = useState('');
	const [paymentType, setPaymentType] = useState('stripe'); // 'x`stripe' or 'cod'
	const router = useRouter();

			useEffect(() => {
				// Require login
				const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
				if (!user) {
					router.push('/account/login');
					return;
				}
				// Prefill user details from backend
				(async () => {
					try {
						const userData = await getUserById(user._id);
						setName(userData.name || '');
						setEmail(userData.email || '');
						setAddress(userData.address || '');
					} catch (e) {
						setName(user.name || '');
						setEmail(user.email || '');
					}
				})();
				// Use user-specific cart key
				const cartKey = getCartKey(user);
				try {
					const raw = localStorage.getItem(cartKey);
					setCart(raw ? JSON.parse(raw) : []);
				} catch {
					setCart([]);
				}
			}, [router]);

	const subtotal = Number(cart.reduce((s, item) => s + (Number(item.price) || 0) * (item.qty || 1), 0));
	const validDiscount = Number(discount) || 0;
	const total = Number((subtotal - validDiscount).toFixed(2));

	// Simple coupon logic (demo): code 'SAVE10' gives 10% off
	const handleApplyCoupon = (e) => {
		e.preventDefault();
		if (coupon.trim().toUpperCase() === 'SAVE10') {
			const disc = Math.round(subtotal * 0.10);
			setDiscount(disc);
			setCouponMsg('Coupon applied! 10% off');
		} else {
			setDiscount(0);
			setCouponMsg('Invalid coupon code');
		}
	};

	// Stripe publishable key (test mode)
	const stripePromise = loadStripe('pk_test_51Nw...your_test_key_here');


	// Handle Stripe payment (card)
	const handleStripePayment = async (stripePayment) => {
			if (!cart.length) {
				alert('Cart is empty');
				return;
			}
		const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
			if (!user) {
				alert('User not found');
				return;
			}
		const orderItems = cart.map(i => ({ product: i._id, qty: i.qty || 1 }));
				const totalPrice = subtotal - validDiscount;
				// Extra validation and logging
				if (isNaN(subtotal) || isNaN(totalPrice) || isNaN(validDiscount)) {
					console.error('Invalid subtotal, total, or discount:', { subtotal, totalPrice, validDiscount, cart });
					toastMessage.error('Checkout error: subtotal or total is invalid.');
					setSent(false);
					return;
				}
		try {
			setSent(true);
			// 1. Create order in backend
			const orderPayload = {
				user: user._id,
				orderItems,
				totalPrice,
				isPaid: stripePayment.paymentStatus === 'paid',
				paymentId: stripePayment.paymentId,
				paymentMethod: stripePayment.paymentMethod,
				coupon: coupon.trim(),
				discount
			};
			await createOrder(orderPayload);
			// 2. Optionally, create invoice as before
			const items = cart.map(i => ({ product: i._id, name: i.name, price: Number(i.price) || 0, qty: i.qty || 1 }));
			const shipping = 0;
			const invoicePayload = {
				customerName: name,
				customerEmail: email,
				items,
				subtotal: Number(subtotal),
				shipping,
				total: Number((subtotal - validDiscount).toFixed(2)),
				paymentMethod: stripePayment.paymentMethod,
				paymentStatus: stripePayment.paymentStatus,
				paymentId: stripePayment.paymentId,
				coupon: coupon.trim(),
				discount: validDiscount
			};
			const invoice = await createInvoice(invoicePayload);
			// 3. Clear user cart
			clearUserCart(user);
			// 4. Redirect to invoice detail
			router.push(`/invoices/${invoice._id}`);
		} catch (err) {
			console.error('Checkout create COD/order error:', err);
			alert(err?.message || 'Failed to place order');
			setSent(false);
		}
	};
	// Handle Cash on Delivery
	const handleCOD = async (e) => {
		e.preventDefault();
		if (!cart.length) {
			alert('Cart is empty');
			return;
		}
		const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
		if (!user) {
			alert('User not found');
			return;
		}
		const orderItems = cart.map(i => ({ product: i._id, qty: i.qty || 1 }));
				const totalPrice = subtotal - validDiscount;
				// Extra validation and logging
				if (isNaN(subtotal) || isNaN(totalPrice) || isNaN(validDiscount)) {
					console.error('Invalid subtotal, total, or discount:', { subtotal, totalPrice, validDiscount, cart });
					toastMessage.error('Checkout error: subtotal or total is invalid.');
					setSent(false);
					return;
				}
		if (window.confirm('Proceed to pay and place order?')) {
			try {
				setSent(true);
				// 1. Create order in backend
				const orderPayload = {
					user: user._id,
					orderItems,
					totalPrice,
					isPaid: false,
					paymentId: null,
					paymentMethod: 'cod',
					coupon: coupon.trim(),
					discount
				};
				await createOrder(orderPayload);
				// 2. Optionally, create invoice as before
				const items = cart.map(i => ({ product: i._id, name: i.name, price: Number(i.price) || 0, qty: i.qty || 1 }));
				const shipping = 0;
				const invoicePayload = {
					customerName: name,
					customerEmail: email,
					items,
					subtotal: Number(subtotal),
					shipping,
					total: Number(totalPrice),
					paymentMethod: 'cod',
					paymentStatus: 'pending',
					paymentId: null,
					coupon: coupon.trim(),
					discount: validDiscount
				};
				const invoice = await createInvoice(invoicePayload);
				clearUserCart(user._id);
				setSent(false);
				toastMessage.success('Order placed successfully!');
				router.replace(`/invoices/${invoice._id}`);
			} catch (err) {
				alert(err?.message || 'Failed to place order');
				setSent(false);
			}
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
						{/* Coupon Code */}
						<form className="mb-3" onSubmit={handleApplyCoupon} autoComplete="off">
							<label className="form-label">Coupon Code</label>
							<div className="d-flex gap-2">
								<input
									type="text"
									className="form-control"
									placeholder="Enter code (e.g. SAVE10)"
									value={coupon}
									onChange={e => setCoupon(e.target.value)}
								/>
								<button className="btn btn-outline-dark" type="submit">Apply</button>
							</div>
							{couponMsg && <div className="small mt-1 text-success">{couponMsg}</div>}
						</form>
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
						<div className="mb-3">
							<div className="form-check">
								<input
									className="form-check-input"
									type="radio"
									name="paymentType"
									id="payStripe"
									value="stripe"
									checked={paymentType === 'stripe'}
									onChange={() => setPaymentType('stripe')}
								/>
								<label className="form-check-label" htmlFor="payStripe">
									Pay with Card (Stripe)
								</label>
							</div>
							<div className="form-check">
								<input
									className="form-check-input"
									type="radio"
									name="paymentType"
									id="payCOD"
									value="cod"
									checked={paymentType === 'cod'}
									onChange={() => setPaymentType('cod')}
								/>
								<label className="form-check-label" htmlFor="payCOD">
									Cash on Delivery (COD)
								</label>
							</div>
						</div>
						{paymentType === 'stripe' && (
							<Elements stripe={stripePromise}>
								<StripeCheckoutForm onPaymentSuccess={handleStripePayment} disabled={!name || !email || !address} />
							</Elements>
						)}
						{paymentType === 'cod' && (
							<button className="btn btn-dark w-100 mt-2" onClick={handleCOD} disabled={!name || !email || !address || sent}>
								Place Order (COD)
							</button>
						)}
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