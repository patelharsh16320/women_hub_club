"use client";

import AddToCartButton from "./AddToCartButton";

export default function ProductActionsClient({ product }) {
  return (
    <div>
      <AddToCartButton product={product} />
    </div>
  );
}
