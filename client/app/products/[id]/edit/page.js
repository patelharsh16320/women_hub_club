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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
        // set preview to resolved image url for current product
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
          const apiOrigin = (apiBase || "").replace(/\/?api\/?$/i, "");
          const img = p?.image || "";
          if (img.startsWith("/uploads") || img.startsWith("uploads")) {
            setPreviewUrl(img.startsWith("/") ? `${apiOrigin}${img}` : `${apiOrigin}/${img}`);
          } else {
            setPreviewUrl(img);
          }
        } catch (e) {}
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
      if (selectedFile) {
        const fd = new FormData();
        fd.append("name", product.name);
        fd.append("description", product.description || "");
        fd.append("price", product.price);
        fd.append("category", product.category || "");
        fd.append("countInStock", product.countInStock || 0);
        fd.append("image", selectedFile);

        await fetchAPI(`/products/${id}`, {
          method: "POST",
          body: fd,
        });
      } else {
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
      }
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
      <div className="edit-product-page container py-5">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-card">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Image</label>
          <input type="file" accept="image/*" className="w-full" onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            setSelectedFile(file || null);
            if (file) {
              setPreviewUrl(URL.createObjectURL(file));
            }
          }} />

          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="preview" className="img-fluid" style={{ maxHeight: 200 }} />
            </div>
          )}
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
