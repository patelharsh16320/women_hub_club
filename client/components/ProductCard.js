"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
function resolveImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;

  // Prefer NEXT_PUBLIC_API_URL (set in client/.env.local). Fallback to localhost.
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const apiOrigin = (apiBase || "").replace(/\/api\/?$/i, "");

  if (imagePath.startsWith("/uploads")) return `${apiOrigin}${imagePath}`;
  if (imagePath.startsWith("uploads")) return `${apiOrigin}/${imagePath}`;

  return imagePath;
}

export default function ProductCard({ product }) {
  const imgSrc = resolveImageUrl(product?.image || "");

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">

        {/* Product Image */}
        <img
          src={imgSrc}
          className="card-img-top"
          alt={product.name}
          style={{ height: "250px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>

          <p className="card-text text-muted small">
            {product.description}
          </p>

          <h6 className="fw-bold text-dark">
            ₹ {product.price}
          </h6>

          <p className="mb-1">
            ⭐ {product.rating} ({product.numReviews} reviews)
          </p>

          <span className="badge bg-light text-dark mb-3">
            {product.category}
          </span>

          {/* Button */}
          <div className="d-flex gap-2 mt-auto">
            <AddToCartButton product={{ _id: product._id, name: product.name, price: product.price, image: imgSrc }} redirectToCart={false} />
            <Link
              href={`/products/${product._id}`}
              className="btn btn-dark"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
