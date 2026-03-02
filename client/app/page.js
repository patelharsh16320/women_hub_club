import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import "./style.css";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="home-page">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Women Hub</h1>

          <p className="hero-subtitle">
            Discover premium products designed for modern women
          </p>

          <p className="hero-desc">
            Explore our curated collection of high-quality products.
          </p>

          <Link className="checkout-btn" href="/products">
            Shop Now
          </Link>
    
        </div>
      </section>

      {/* Products */}
      <section className="products-section container">
        <h2 className="section-title">Featured Products</h2>

        <div className="product-grid">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}