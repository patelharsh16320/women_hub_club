import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        All Products
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </>
  );
}
