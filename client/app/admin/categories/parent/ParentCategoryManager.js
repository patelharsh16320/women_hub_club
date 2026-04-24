import React, { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoryService";
import { toastMessage } from "@/utils/toastMessage";

export default function ParentCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const load = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories((Array.isArray(data) ? data : data.categories || []).filter(
      (cat) => !cat.parent || cat.parent.length === 0 || (cat.parent.length === 1 && cat.parent[0]?.name === "General")
    ));
    setSelected([]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return toastMessage.error("Name required");
    // Check for duplicate (case-insensitive)
    const duplicate = categories.some(cat => cat.name.trim().toLowerCase() === trimmedName.toLowerCase());
    if (duplicate) return toastMessage.error("Duplicate category name not allowed");
    await createCategory(trimmedName, []);
    setName("");
    toastMessage.success("Created");
    load();
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const trimmedEditName = editName.trim();
    if (!trimmedEditName) return toastMessage.error("Name required");
    // Check for duplicate (case-insensitive, exclude self)
    const duplicate = categories.some(cat => cat._id !== editId && cat.name.trim().toLowerCase() === trimmedEditName.toLowerCase());
    if (duplicate) return toastMessage.error("Duplicate category name not allowed");
    await updateCategory(editId, trimmedEditName, []);
    setEditId(null);
    setEditName("");
    toastMessage.success("Updated");
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this parent category?")) return;
    await deleteCategory(id);
    toastMessage.success("Deleted");
    load();
  };

  const handleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return toastMessage.error("Select categories to delete");
    if (!window.confirm(`Delete ${selected.length} selected categories?`)) return;
    for (const id of selected) {
      await deleteCategory(id);
    }
    toastMessage.success("Deleted selected categories");
    load();
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-3 d-flex gap-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New parent category" className="form-control" />
        <button className="btn btn-primary">Add</button>
      </form>
      {selected.length > 0 && (
        <button className="btn btn-danger mb-2" onClick={handleBulkDelete} type="button">
          Delete Selected ({selected.length})
        </button>
      )}
      {loading ? <p>Loading...</p> : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th style={{width:40}}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={paginatedCategories.length > 0 && paginatedCategories.every(cat => selected.includes(cat._id))}
                    onChange={e => {
                      if (e.target.checked) {
                        // Add all visible categories to selected
                        setSelected(prev => Array.from(new Set([...prev, ...paginatedCategories.map(cat => cat._id)])));
                      } else {
                        // Remove all visible categories from selected
                        setSelected(prev => prev.filter(id => !paginatedCategories.some(cat => cat._id === id)));
                      }
                    }}
                  />
                </th>
                <th style={{width:60}}>No</th>
                <th>Name</th>
                <th style={{width:180}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((cat, idx) => (
                <tr key={cat._id}>
                  <td>
                    <input type="checkbox" checked={selected.includes(cat._id)} onChange={() => handleSelect(cat._id)} className="form-check-input" />
                  </td>
                  <td>{startIndex + idx + 1}</td>
                  <td>
                    {editId === cat._id ? (
                      <form onSubmit={handleUpdate} className="d-flex gap-2">
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="form-control" />
                        <button className="btn btn-success btn-sm">Save</button>
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditId(null)}>Cancel</button>
                      </form>
                    ) : (
                      <span>{cat.name}</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleEdit(cat)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
              <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                Showing <strong>{startIndex + 1}</strong>–<strong>{Math.min(startIndex + ITEMS_PER_PAGE, categories.length)}</strong> of <strong>{categories.length}</strong> categories
              </p>
              <ul className="pagination pagination-sm mb-0">
                {/* Prev */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    &laquo;
                  </button>
                </li>
                {/* Page Numbers */}
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <li key={`ellipsis-${i}`} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                  )
                )}
                {/* Next */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
