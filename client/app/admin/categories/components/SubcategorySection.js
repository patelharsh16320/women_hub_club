import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../services/api";
import { toastMessage } from "../../../utils/toastMessage";

export default function SubcategorySection({ categoryId }) {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const loadSubcategories = async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const data = await fetchAPI(`/categories/${categoryId}/subcategories`);
      setSubcategories(Array.isArray(data) ? data : data.subcategories || []);
    } catch (err) {
      toastMessage.error(err.message || "Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubcategories();
    // eslint-disable-next-line
  }, [categoryId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toastMessage.error("Subcategory name required");
    try {
      await fetchAPI(`/categories/${categoryId}/subcategories`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });
      setName("");
      toastMessage.success("Subcategory created");
      loadSubcategories();
    } catch (err) {
      toastMessage.error(err.message || "Create failed");
    }
  };

  if (!categoryId) return <div>Select a category to manage subcategories.</div>;

  return (
    <div className="subcategory-section">
      <h5>Subcategories</h5>
      <form onSubmit={handleCreate} className="mb-3 d-flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New subcategory name"
          className="form-control"
        />
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-group">
          {subcategories.map(sub => (
            <li key={sub._id} className="list-group-item">
              {sub.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
