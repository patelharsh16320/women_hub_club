"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../../services/api";
import { toastMessage } from "../../../../utils/toastMessage";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAPI("/categories");
        // only top-level categories as possible parents
        const top = Array.isArray(data) ? data.filter((c) => !c.parent) : [];
        setParents(top);
      } catch (e) {
        setParents([]);
      }
    };
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchAPI("/categories", { method: "POST", body: JSON.stringify({ name, parent: parent || null }) });
      router.push("/admin/categories");
    } catch (err) {
      toastMessage.error("Create failed");
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
        <div className="mb-3">
          <label className="block text-sm">Parent Category (optional)</label>
          <select className="w-full border px-2 py-1" value={parent} onChange={(e)=>setParent(e.target.value)}>
            <option value="">-- None --</option>
            {parents.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit" className="btn btn-dark w-full" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
