"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "../../../services/api";

export default function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI("/categories");
      setCats(data || []);
    } catch (err) {
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await fetchAPI(`/categories/${id}`, { method: "DELETE" });
      setCats((s) => s.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-categories">

      {/* Dark Header */}
      <div className="admin-header">
        <h4 className="mb-0">Categories</h4>
      </div>

      <div className="container py-4">

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h3 className="fw-bold mb-1">Manage Categories</h3>
            <p className="text-muted mb-0">
              Total Categories : <strong>{cats.length}</strong>
            </p>
          </div>

          <Link
            href="/admin/categories/create"
            className="btn btn-dark px-4"
          >
            + Create Category
          </Link>

        </div>

        {loading && <p>Loading categories...</p>}

        {/* Table Card */}
        <div className="card shadow-sm border-0">

          <div className="table-responsive">

            <table className="table align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th style={{width:"80px"}}>#</th>
                  <th>Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>

                {cats.map((c, index) => (
                  <tr key={c._id}>

                    <td className="fw-semibold">
                      {index + 1}
                    </td>

                    <td className="fw-medium">
                      {c.name}
                    </td>

                    <td className="text-center">

                      <Link
                        href={`/admin/categories/${c._id}/edit`}
                        className="btn btn-sm btn-outline-dark me-2"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

                {!loading && cats.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      No categories found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}