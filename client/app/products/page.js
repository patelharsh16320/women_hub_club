import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4 text-light">
        All Products
      </h1>

      <div className="row g-4">
        {products?.map((product) => (
          <div
            key={product._id}
            className="col-12 col-sm-6 col-md-4 col-lg-4"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}