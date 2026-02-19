import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="container py-5">

      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">
          Welcome to Women Hub
        </h1>
        <p className="text-muted">
          Discover premium products designed for women
        </p>
      </div>

      {/* Products */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {products?.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

    </div>
  );
}
