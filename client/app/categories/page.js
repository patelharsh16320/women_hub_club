"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "../../services/api";

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
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

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
    <div className="max-w-4xl mx-auto py-8 container">
      <div className="categories-header my-5">
        <h1 className="text-white">Categories</h1>
      </div>

      <div className="categories-card">
        <table className="categories-table">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2 text-center">
                  <Link
                    href={`/categories/${c._id}/edit`}
                    className="btn btn-sm btn-outline-dark me-2"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
