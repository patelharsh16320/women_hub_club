import { getProductById } from "@/services/productService";
import ProductActionsClient from "@/components/ProductActionsClient";

function resolveImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const apiOrigin = (apiBase || "").replace(/\/api\/?$/i, "");
  if (imagePath.startsWith("/uploads")) return `${apiOrigin}${imagePath}`;
  if (imagePath.startsWith("uploads")) return `${apiOrigin}/${imagePath}`;
  return imagePath;
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let product = null;
  let error = null;
  try {
    product = await getProductById(id);
  } catch (e) {
    error = e.message || "Invalid product id";
  }
  const imgSrc = resolveImageUrl(product?.image || "");

  if (error || !product) {
    return (
      <div className="container py-5">
        <h2 className="text-center text-danger">Product not found</h2>
        {error && <p className="text-center text-muted">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row align-items-center">
            {/* Product Image */}
            <div className="col-md-6 mb-4 mb-md-0 text-center">
              <img
                src={imgSrc}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: "450px", objectFit: "cover" }}
              />
            </div>
            {/* Product Details */}
            <div className="col-md-6">
              <h1 className="fw-bold mb-3">
                {product.name}
              </h1>
              <p className="text-muted mb-4">
                {product.description}
              </p>
              <h3 className="fw-semibold text-dark mb-4">
                ₹ {product.price}
              </h3>

              {/* client product actions (Add to Cart) */}
              <ProductActionsClient product={{ _id: product._id, name: product.name, price: product.price, image: imgSrc }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}