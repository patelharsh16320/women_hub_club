"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../../services/api";

export default function EditCategoryPage({ params }) {
  const id = params.id;
  const router = useRouter();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAPI(`/categories/${id}`);
        setCat(data);
      } catch (err) {
        alert("Failed to load category");
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
      alert("Update failed");
    } finally { setLoading(false); }
  };

  if (!cat) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
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
