import React, { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "../../../services/categoryService";
import { toastMessage } from "../../../utils/toastMessage";


  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      toastMessage.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toastMessage.error("Category name required");
    try {
      await createCategory(name, parent || null);
      setName("");
      setParent("");
      toastMessage.success("Category created");
      loadCategories();
    } catch (err) {
      toastMessage.error(err.message || "Create failed");
    }
  };

  // Helper to build tree
  const buildTree = (cats, parentId = null) => {
    return cats.filter(c => (c.parent ? c.parent._id : null) === parentId).map(c => ({
      ...c,
      children: buildTree(cats, c._id)
    }));
  };

  const renderTree = (nodes, level = 0) => {
    return nodes.map(node => (
      <li key={node._id} className="list-group-item d-flex justify-content-between align-items-center" style={{paddingLeft: 16 + level * 16}}>
        <span onClick={() => onSelectCategory && onSelectCategory(node)} style={{cursor:'pointer'}}>{node.name}</span>
        {node.children && node.children.length > 0 && (
          <ul className="list-group w-100 mt-2">
            {renderTree(node.children, level + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="category-section">
      <h4>Categories</h4>
      <form onSubmit={handleCreate} className="mb-3 d-flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New category name"
          className="form-control"
        />
        <select value={parent} onChange={e => setParent(e.target.value)} className="form-select" style={{maxWidth:200}}>
          <option value="">No Parent (Top Level)</option>
          {categories.filter(c => !c.parent).map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-group">
          {renderTree(buildTree(categories))}
        </ul>
      )}
    </div>
  );
}
