import { getProductById } from "@/services/productService";

export default async function ProductDetailPage({ params }) {

  // ✅ Next.js 15 FIX
  const { id } = await params;

  console.log("Fetching product with ID:", id);

  const product = await getProductById(id);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-2 gap-10">

        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          <p className="text-2xl font-semibold">
            ₹ {product.price}
          </p>
        </div>

      </div>
    </div>
  );
}
