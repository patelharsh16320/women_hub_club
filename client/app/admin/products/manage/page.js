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
    <div className="admin-products container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Manage Products</h3>
          <p className="text-muted mb-0">
            Total Products : <strong>{products.length}</strong>
          </p>
        </div>

        <Link href="/admin/products/create" className="btn btn-dark px-4">
          + Create Product
        </Link>

      </div>

      {loading && <p>Loading products...</p>}

      {/* Product Table */}
      <div className="card border-0 shadow-sm">

        <div className="table-responsive">

          <table className="table align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th style={{width:"60px"}}>#</th>
                <th>Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Category</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((p, index) => {

                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                const apiOrigin = (apiBase || "").replace(/\/?api\/?$/i, "");

                let imgSrc = p.image || "";
                if (imgSrc.startsWith("/uploads")) imgSrc = `${apiOrigin}${imgSrc}`;
                if (imgSrc.startsWith("uploads")) imgSrc = `${apiOrigin}/${imgSrc}`;

                return (
                  <tr key={p._id}>

                    <td className="fw-semibold">{index + 1}</td>

                    <td className="fw-medium">{p.name}</td>

                    <td>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={p.name}
                          className="product-thumb"
                        />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </td>

                    <td className="fw-semibold">₹ {p.price}</td>

                    <td>
                      <span className="badge bg-dark">
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

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No products available
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}