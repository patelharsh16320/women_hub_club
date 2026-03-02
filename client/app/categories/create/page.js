"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchAPI("/categories", { method: "POST", body: JSON.stringify({ name }) });
      router.push("/categories");
    } catch (err) {
      alert("Create failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="create-category-page container py-5">
      <h2 className="text-2xl font-bold mb-4">Create Category</h2>
      <form onSubmit={submit} className="create-category-card">
        <div className="mb-3">
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <button type="submit" className="btn btn-dark w-full" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
