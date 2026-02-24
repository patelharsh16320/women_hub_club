"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../../services/api";

export default function EditProductPage({ params }) {
  const id = params.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const p = await fetchAPI(`/products/${id}`);
        setProduct(p);
      } catch (err) {
        alert("Failed to load product");
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
      alert("Update failed");
    } finally { setLoading(false); }
  };

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
