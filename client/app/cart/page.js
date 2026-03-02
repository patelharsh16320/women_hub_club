'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
	const [cart, setCart] = useState([]);

	const updateCartStorage = (newCart) => {
		try {
			localStorage.setItem('cart', JSON.stringify(newCart));
			setCart(newCart);
			// notify other components
			try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: newCart } })); } catch (e) { }
		} catch (e) {
			console.error('Failed to update cart storage', e);
		}
	};

	useEffect(() => {
		try {
			const raw = localStorage.getItem('cart');
			setCart(raw ? JSON.parse(raw) : []);
		} catch {
			setCart([]);
		}

		const onCartUpdated = () => {
			try {
				const raw = localStorage.getItem('cart');
				setCart(raw ? JSON.parse(raw) : []);
			} catch { setCart([]); }
		};

		window.addEventListener('cartUpdated', onCartUpdated);
		window.addEventListener('storage', onCartUpdated);

		return () => {
			window.removeEventListener('cartUpdated', onCartUpdated);
			window.removeEventListener('storage', onCartUpdated);
		};
	}, []);

	const total = cart
		.reduce((s, item) => s + (item.price || 0) * (item.qty || 1), 0)
		.toFixed(2);

	return (
		<div className="cart-container">
			<h1 className="cart-title">Shopping Cart</h1>

			{cart.length === 0 ? (
				<div className="cart-empty">
					<p>Your cart is empty.</p>
					<Link href="/products" className="shop-btn">
						Continue Shopping
					</Link>
				</div>
			) : (
				<div className="cart-layout">

					{/* LEFT — ITEMS */}
					<div className="cart-items">
						{cart.map((item) => {
							const id = item._id || item.id;
							return (
								<div key={id} className="cart-item">

									<img src={item.image} alt={item.name} className="cart-image" />

									<div className="cart-info">
										<h3 className="text-dark">{item.name}</h3>				
										<div className="qty-wrapper">

											<button
												className="qty-btn"
												onClick={() => {
													const newCart = cart.map((c) =>
														(c._id === id || c.id === id)
															? { ...c, qty: Math.max(1, (c.qty || 1) - 1) }
															: c
													);
													updateCartStorage(newCart);
												}}
											>
												−
											</button>

											<span className="qty-value">{item.qty || 1}</span>

											<button
												className="qty-btn"
												onClick={() => {
													const newCart = cart.map((c) =>
														(c._id === id || c.id === id)
															? { ...c, qty: (c.qty || 1) + 1 }
															: c
													);
													updateCartStorage(newCart);
												}}
											>
												+
											</button>

											<button
												className="remove-btn"
												onClick={() => {
													const newCart = cart.filter(
														(c) => !(c._id === id || c.id === id)
													);
													updateCartStorage(newCart);
												}}
											>
												Remove
											</button>

										</div>
									</div>

									{/* <div className="cart-price">₹ {(item.price || 0).toFixed(2)  }</div> */}
									<div className="cart-price">₹ {((item.price || 0).toFixed(2))*(item.qty)  }</div>

								</div>
							);
						})}
					</div>

					{/* RIGHT — SUMMARY */}
					<div className="cart-summary">
						<h3>Order Summary</h3>

						<div className="summary-row">
							<span>Subtotal</span>
							<span>₹ {total}</span>
						</div>

						<div className="summary-row">
							<span>Shipping</span>
							<span>Free</span>
						</div>

						<hr />

						<div className="summary-total">
							<span>Total</span>
							<span>₹ {total}</span>
						</div>

						<Link href="/checkout" className="checkout-btn">
							Proceed to Checkout
						</Link>
					</div>

				</div>
			)}
		</div>
	);
}