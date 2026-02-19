"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">

        {/* Product Image */}
        <img
          src={product.image}
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
          <Link
            href={`/products/${product._id}`}
            className="btn btn-dark mt-auto"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}
