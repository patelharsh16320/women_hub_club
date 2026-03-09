"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "../../../../services/api";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI("/products");
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetchAPI(`/products/${id}`, { method: "DELETE" });
      setProducts((s) => s.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
 <div className="container py-5">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2 className="fw-bold">Manage Products</h2>

    <Link href="/products/create" className="btn btn-dark">
      Create Product
    </Link>
  </div>

  {loading && <p>Loading...</p>}

  <div className="card shadow-sm">
    <div className="card-body">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Category</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            // resolve image URL (server stores /uploads/filename)
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const apiOrigin = (apiBase || "").replace(/\/?api\/?$/i, "");
            let imgSrc = p.image || "";
            if (imgSrc.startsWith("/uploads")) imgSrc = `${apiOrigin}${imgSrc}`;
            if (imgSrc.startsWith("uploads")) imgSrc = `${apiOrigin}/${imgSrc}`;

            return (
            <tr key={p._id}>
              <td className="fw-medium">{p.name}</td>
              <td className="fw-medium">
                {imgSrc ? <img src={imgSrc} width={100} className="img-fluid" alt={p.name} /> : <span className="text-muted">No image</span>}
              </td>
              <td>₹ {p.price}</td>
              <td>
                <span className="badge bg-secondary">
                  {p.category}
                </span>
              </td>

              <td className="text-center">
                <Link
                  href={`/admin/products/${p._id}/edit`}
                  className="btn btn-sm btn-outline-dark me-2"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}
