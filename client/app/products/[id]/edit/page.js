"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "../../../../services/api";

export default function EditProductPage() {
  const p = useParams();
  const id = p?.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Missing product id in route");
        return;
      }
      try {
        setLoading(true);
        // log the full URL we're requesting for easier debugging
        console.log("Fetching product:", process.env.NEXT_PUBLIC_API_URL, `/products/${id}`);

        const p = await fetchAPI(`/products/${id}`);
        if (!p) {
          throw new Error("Product not found");
        }
        setProduct(p);
      } catch (err) {
        console.error("Load product error:", err);
        setError(err?.message || String(err));
        // keep the generic alert for immediate user feedback too
        alert("Failed to load product: " + (err?.message || "Unknown error"));
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // server expects POST for update in routes
      await fetchAPI(`/products/${id}`, {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          countInStock: product.countInStock,
        }),
      });
      router.push("/products/manage");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed: " + (err?.message || "Unknown error"));
    } finally { setLoading(false); }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div className="container py-5">
      <h2 className="text-center text-danger">Error loading product</h2>
      <p className="text-center">{error}</p>
    </div>
  );
  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea className="w-full border px-2 py-1" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">Price</label>
          <input type="number" className="w-full border px-2 py-1" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Category</label>
          <input className="w-full border px-2 py-1" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">Stock</label>
          <input type="number" className="w-full border px-2 py-1" value={product.countInStock} onChange={(e) => setProduct({ ...product, countInStock: e.target.value })} />
        </div>
        <div>
          <button type="submit" className="btn btn-dark w-full" disabled={loading}>{loading ? "Updating..." : "Update Product"}</button>
        </div>
      </form>
    </div>
  );
}
