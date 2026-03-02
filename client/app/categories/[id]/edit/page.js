"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "../../../../services/api";

export default function EditCategoryPage() {
  const p = useParams();
  const id = p?.id;
  const router = useRouter();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Missing category id in route");
        return;
      }
      try {
        setLoading(true);
        console.log("Fetching category:", process.env.NEXT_PUBLIC_API_URL, `/categories/${id}`);
        const data = await fetchAPI(`/categories/${id}`);
        setCat(data);
      } catch (err) {
        console.error("Load category error:", err);
        setError(err?.message || "Failed to load category");
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchAPI(`/categories/${id}`, { method: "POST", body: JSON.stringify({ name: cat.name }) });
      router.push("/categories");
    } catch (err) {
      console.error("Update category error:", err);
      setError(err?.message || "Update failed");
    } finally { setLoading(false); }
  };

  if (loading && !cat) return <p>Loading...</p>;
  if (error) return (
    <div className="container py-5">
      <h2 className="text-center text-danger">Error</h2>
      <p className="text-center">{error}</p>
    </div>
  );

  if (!cat) return <p>Loading...</p>;

  return (
<div className="edit-category-page container py-5">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <form onSubmit={submit} className="edit-category-card">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={cat.name} onChange={(e) => setCat({ ...cat, name: e.target.value })} required />
        </div>
        <div>
          <button type="submit" className="btn btn-dark w-full" disabled={loading}>{loading ? "Updating..." : "Update"}</button>
        </div>
      </form>
    </div>
  );
}
