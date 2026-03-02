"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product, redirectToCart = true }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    try {
      setAdding(true);
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];

      const id = product._id || product.id;
      const existing = cart.find((i) => i._id === id || i.id === id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({
          _id: id,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image || product.img || "",
          qty: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // notify other components (Header, Cart page) that cart changed
      try {
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart } }));
      } catch (e) {}

      if (redirectToCart) {
        router.push("/cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <button className="btn btn-dark btn-lg" onClick={handleAdd} disabled={adding}>
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
