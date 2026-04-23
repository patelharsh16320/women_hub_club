"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
function resolveImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const apiOrigin = (apiBase || "").replace(/\/api\/?$/i, "");

  if (imagePath.startsWith("/uploads")) return `${apiOrigin}${imagePath}`;
  if (imagePath.startsWith("uploads")) return `${apiOrigin}/${imagePath}`;

  return imagePath;
}

export default function ProductCard({ product }) {
  const imgSrc = resolveImageUrl(product?.image || "");

  const hasDiscount =
    product.sellPrice !== undefined &&
    product.sellPrice !== null &&
    product.sellPrice !== "" &&
    Number(product.sellPrice) < Number(product.price);

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">

        <Link href={`/products/${product._id}`}>
          <img
            src={imgSrc}
            className="card-img-top"
            alt={product.name}
            style={{ height: "250px", objectFit: "cover" }}
          />
        </Link>
        <div className="card-body d-flex flex-column bg-light">
          <Link href={`/products/${product._id}`}>
            <h5 className="card-title text-dark">{product.name}</h5>
          </Link>
          <h6 className="fw-bold text-dark">
            {hasDiscount ? (
              <>
                <span style={{ textDecoration: "line-through", color: "#888", marginRight: 8 }}>
                  ₹ {product.price}
                </span>
                <span style={{ color: "#d32f2f" }}>
                  ₹ {product.sellPrice}
                </span>
              </>
            ) : (
              <>₹ {product.price}</>
            )}
          </h6>

          <p className="mb-1 text-dark">
            ⭐ {product.rating} ({product.numReviews} reviews)
          </p>

          <span className="badge bg-light text-dark mb-3">
            {typeof product.category === "object" && product.category !== null ? (
              <>
                {product.category.name}
                {Array.isArray(product.category.parent) && product.category.parent.length > 0 && (
                  <>
                    {" (Parent"}
                    {product.category.parent.length > 1 ? "s" : ""}
                    {": "}
                    {product.category.parent.map(
                      (parent, idx) => parent && parent.name ? parent.name : ""
                    ).filter(Boolean).join(", ")}
                    {")"}
                  </>
                )}
              </>
            ) : (
              product.category
            )}
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
